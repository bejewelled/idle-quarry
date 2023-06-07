<div class='wrapper py-2'>
<div class='beacon-power-display text-center text-large game-text py-1'>
    You have <span class='text-fuchsia-500 font-bold'>{f($resources['challengePoints'] || 0)}</span> challenge points
</div>
<div class='beacon-power-display text-center text-small game-text pb-1'>
    Multiplying global game speed by 1.000x
</div>
<div class='game-text text-center py-1'>THIS TAB IS NOT IMPLEMENTED YET</div>

<div class='py-2'>
</div>

<div class='grid grid-cols-12'>
    {#key $challengeActive}
    {#each $challengeNames as c,i}
        <div class='col-span-3 game-text text-large text-left'>{c}</div>
        <div class='col-span-5 align-middle tooltip-text text-xs'>{$challengeDescriptions[i]}</div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class='col-span-2 tooltip-text text-xs'>
            {#each Object.entries($challengeGoals[i]) as g}
            <div class='grid grid-cols-2'>
                <div class='text-center 
                {ref.colors[g[0]] || ref.colors['default']}
                col-span-1'>{[g[0]]}</div>
                <div class='text-left col-span-1'>{f(g[1])}</div>
            </div>
            {/each}
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class='col-span-2 ml-2 align-middle mt-1 text-center 
        {$challengeActive == i+1 ? 'game-btn-toggleon' : 'game-btn'}'
        on:click={() => toggleChallenge(i+1)}>
            {#if $challengeActive == i+1}
                Exit
            {:else}
                Start
            {/if}
        </div>
        <div class='col-span-12 py-1'></div>
    {/each}
    {/key}

</div>
</div>


<script lang='ts'>
 //@ts-nocheck
 import { onMount, onDestroy } from 'svelte';
import {progress, wallet, miningDropTable, miningUpgradeLevels, 
    settings, visibleTier, progressThisTick, progressAverage,
    beaconActivations, beaconLevels, beaconProgress, resources,
     keysOpened, unlockedRes, beaconUpgradeLevels, flags, 
     enchantUpgradeLevels, enchantProgress, automationItemsUnlocked,
    mineLevel, buttonUpgradeLevels, stats, keyCraftAmount,
miningUpgradeLevelsBought, miningUpgradeLevelsFree,
challengeActive} from '../../data/player';
import {challengeNames, challengeDescriptions, challengeGoals} from '../../data/challenges';
import {buttonUpgrades} from '../../data/button';
import {progressThreshold, progressPerTick, miningUpgrades,
gemGainFlavorText, gemProgressFlavorText } from '../../data/mining';
import {keyGainFlavorText} from '../../data/keys';
import {beaconPower, beaconBonuses,
    beaconFormulas, beaconNums, beaconNextReqs, beaconSpendAmt ,
beaconUpgrades, beaconNameText, baseBeaconNextReqs} from '../../data/beacons';
import {enchantUpgrades, enchantThreshold} from '../../data/fame';
import MiningUpgradeButton from '../buttons/MiningUpgradeButton.svelte';
import ref from '../../calcs/ref'
import formula from '../../calcs/formula';

const f = (n: number, pl = 0) => {
        if (n < 1e9) return n.toFixed((n < 1e3 ? pl : 0)).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        else return n.toExponential(3).toString().replace('+', '');
    }   

const fp = (n: unknown, pl = 3, subOne = false) => {
    if (subOne) n -= 1;
    if (n < 1e9) return (n*100).toFixed((n < 1e3 ? pl : 0)).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "%";
    else return (n*100).toExponential(pl).toString().replace('+', '') + "%";
}

const fpf = (n: unknown, subOne = false) => {
    if (subOne) n -= 1;
    if (n < 1e9) return (n*100).toFixed(3).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "%";
    else return (n*100).toExponential(3).toString().replace('+', '') + "%";
}

function toggleChallenge(i) {
    if ($challengeActive == i) {
        if (confirm("Are you sure? Challenge progress will be lost.")) {
            $challengeActive = 0;
            $wallet['challengePoints'] = 0;
        }
    } else {
        $challengeActive = i;
    }
}

</script>