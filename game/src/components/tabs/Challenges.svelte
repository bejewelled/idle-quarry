<div class='wrapper py-2'>
<div class='beacon-power-display text-center text-large game-text py-1'>
    You have <span class='text-fuchsia-500 font-bold'>{f($resources['challengePoints'] || 0)}</span> challenge points
</div>
<div class='beacon-power-display text-center text-small game-text pb-1'>
    Multiplying global game speed by 1.000x
</div>

<div class='py-2'>
</div>

<div class='grid grid-cols-12'>
    {#each $challengeNames as c,i}
        <div class='col-span-3 game-text text-large text-left'>{c}</div>
        <div class='col-span-5 tooltip-text text-xs'>{$challengeDescriptions[i]}</div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class='col-span-4 ml-2 align-middle mt-1 text-center 
        {$challengeActive == i ? 'game-btn-toggleon' : 'game-btn'}'
        on:click={() => toggleChallenge(i)}>
            {#if $challengeActive == i}
                Exit
            {/if}
        </div>
    {/each}
</div>
</div>


<script lang='ts'>
 //@ts-nocheck
import { onMount } from 'svelte';
import {progress, wallet, miningDropTable, miningUpgradeLevels, 
    settings, visibleTier, progressThisTick, progressAverage,
    beaconActivations, beaconLevels, beaconProgress, resources, 
    mineLevel, antiFlickerFlags} from '../../data/player';
import {progressThreshold, progressPerTick, miningUpgrades,
gemGainFlavorText, gemProgressFlavorText } from '../../data/mining';
import {keyGainFlavorText} from '../../data/keys';
import {beaconPower, beaconBonuses, beaconSpendAmt,
    beaconFormulas, beaconNums, beaconNextReqs,
beaconUpgrades, beaconNameText, beaconPowerFlavorText,
beaconMaxLevels, beaconMiningLevelReqs} from '../../data/beacons';
import {challengeNames, challengeDescriptions, challengeGoals, challengeActive, currChallengeInfo}
from '../../data/challenges';
import MiningUpgradeButton from '../buttons/MiningUpgradeButton.svelte';
import ref from '../../calcs/ref'
import BeaconToggleButton from '../buttons/BeaconToggleButton.svelte';
import BeaconPowerUpgradeButton from '../buttons/BeaconPowerUpgradeButton.svelte';

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
        $challengeActive = 0;
    } else {
        $challengeActive = i;
    }
}

</script>