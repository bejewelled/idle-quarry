<div class='wrapper py-2'>
<div class='beacon-power-display text-center text-large game-text'>
    You have <span class='text-cyan-300 font-bold'>{f($resources['beaconPower'] || 0)}</span> beacon power. 

</div> 
<div class='beacon-power-tooltip text-center tooltip-text'>
    +{f(200 * $beaconLevels.reduce((s, c) => s * (c > 10000 ? Math.log10(c) - 3 : 1) , 1)
    * $beaconUpgrades[0]['formula']($beaconUpgradeLevels[0]), 0)} 
    / sec - multiplied for each beacon path above level 10,000
</div>
<div class='py-2'></div>
<div class='beacon-assign-grid grid grid-cols-12'>
        <div class='p-1 col-span-2'>
            <input id='max' class="content-center w-20  bg-gray-700 text-white" placeholder='1' bind:value={$beaconSpendAmt}>
        </div>
        {#if $automationItemsUnlocked['beacon tools']}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class='game-btn m-1 text-med col-span-3' on:click={() => splitBeacons()}>
            Split Beacons Evenly
        </div>
        {#if $automationItemsUnlocked['beacon tools ii']}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class='game-btn m-1 text-med col-span-3' on:click={() => smartSplitBeacons()}>
            Smart Split Beacons
        </div>
        {:else}
        <div class='col-span-3'></div>
        {/if}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class='game-btn m-1 text-med col-span-3' on:click={() => recallBeacons()}>
            Recall Beacons
        </div>
        <div class='col-span-1'></div>

        {:else}
        <div class='col-span-12'></div>
        {/if}
    {#key $beaconLevels}
    {#each $beaconLevels as b, i}
    {#if $mineLevel['level'] >= $beaconMiningLevelReqs[i]}
    {#if i < 10}
        <div class='col-span-1'>
            <BeaconToggleButton index={i} />
        </div>
        <div class='col-span-1 my-1 text-left pl-1 game-text'>
                {f($beaconActivations[i],0)}
        </div>
        <div class = 'col-span-2 grid grid-rows-2'>
            <div class='row-span-1 text-center game-text text-small'>
                {f($beaconLevels[i],0)} / {fExp($beaconMaxLevels[i],
                $beaconMaxLevels[i] > 1e6 ? 1 : 0)}
            </div>
            <div class='row-span-1 text-center game-text text-small'>
                +{fp(Math.max(beaconDispBonus[i], 1), 3, true)}
            </div>
        </div>
        {#if ($automationItemsUnlocked['beacon tools ii'])}
            <div class='col-span-1 py-1 items-center px-1'>
                <div class='input-wrapper mr-3'>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div on:click={() => changeSmartSplits(i)} 
                    class='game-text text-small border-2 py-1 text-center border-white  
                    {$beaconSmartSplits[i] ? 'bg-green-800' : ''} select-none cursor-pointer'>Smart</div>
                </div>
            </div>
        {:else}
        <div class='col-span-1'></div>
        {/if}
        <div class='col-span-7 grid grid-rows-2'>
            <div class='row-span-1 grid grid-cols-5 tooltip-text'>
                <div class='col-span-3 {getTextColor(i)} text-left'>
                    {$beaconNameText[i]}
                </div>
                <div class = 'col-span-2 text-right'>
                    [ {fp($beaconProgress[i] / $beaconNextReqs[i], 
                    $beaconProgress[i] / $beaconNextReqs[i] < 0.0001 ? 4 : 2)} ]
                </div>
            </div>
            <div class='mine-bar-wrapper align-middle'>
                <div class="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                    <div class="{getBgColor(i)} h-1.5 rounded-full" 
                    style="width: {$antiFlickerFlags['beacons']
                    ? '100' : pbarWidths[i]}%"></div>
                </div>
            </div>
        </div>
    {/if}
    {:else if i < 10}
        <div class='col-span-12 py-3 text-center text-large {getTextColor(i)}'>
            Unlock at mining level {$beaconMiningLevelReqs[i]}</div>
    {/if}
    {/each}
    {/key}
    <div class='py-2'></div>
    {#each $beaconUpgrades as b,i}
    <div class='pt-1'></div>
        <BeaconPowerUpgradeButton index={i} />
    {/each}
    <div class='col-span-12 pb-15'>i</div>
    <div>s</div>
</div>
</div>


<script lang='ts'>
 //@ts-nocheck
import { onMount, onDestroy } from 'svelte';
import {progress, wallet, miningDropTable, miningUpgradeLevels, 
    settings, visibleTier, progressThisTick, progressAverage,
    beaconActivations, beaconLevels, beaconProgress, resources, 
    mineLevel, antiFlickerFlags, automationItemsUnlocked,
    beaconSmartSplits, beaconUpgradeLevels} from '../../data/player';
import {progressThreshold, progressPerTick, miningUpgrades,
gemGainFlavorText, gemProgressFlavorText } from '../../data/mining';
import {keyGainFlavorText} from '../../data/keys';
import {beaconPower, beaconBonuses, beaconSpendAmt,
    beaconFormulas, beaconNums, beaconNextReqs,
beaconUpgrades, beaconNameText, beaconPowerFlavorText,
beaconMaxLevels, beaconMiningLevelReqs} from '../../data/beacons';
import MiningUpgradeButton from '../buttons/MiningUpgradeButton.svelte';
import ref from '../../calcs/ref'
import formula from '../../calcs/formula';
import BeaconToggleButton from '../buttons/BeaconToggleButton.svelte';
import BeaconPowerUpgradeButton from '../buttons/BeaconPowerUpgradeButton.svelte';

$: pbarWidths = Array(30).fill(0);
$: beaconDispBonus = $beaconBonuses
let beaconDispBonus = $beaconBonuses;


onMount(() => {
    beaconDispBonus = $beaconBonuses;
    const pbarUpdater = setInterval(() => {
        for (let i = 0; i < 30; i++) {
            pbarWidths[i] = Math.min(100, ($beaconProgress[i] / $beaconNextReqs[i]) * 100)
        }
        pbarWidths = pbarWidths;
    }, $settings['UPDATE_SPEED'])
})

onDestroy(() => {
});

function splitBeacons() {
    let done = false, i = 0;
    // find number of splits to make
    while (!done && i < 10) {
        if ($mineLevel['level'] < $beaconMiningLevelReqs[i]) done = true;
        i++;
    }
    if (i == 10) i = 11;
    if (i == 1) {
        $beaconActivations[0] += $wallet['beacons'];
        $wallet['beacons'] = 0;
        return;
    }
    // find total number of beacons
    for (let j in $beaconActivations) {
        $wallet['beacons'] += $beaconActivations[j];
        $beaconActivations[j] = 0;
    }
    let totalUsed = 0;
    const totalBeacons = $wallet['beacons']
    for (let j = 0; j < i-1; j++) {
        $beaconActivations[j] = Math.floor(totalBeacons / (i-1));
        totalUsed += $beaconActivations[j];
    }
    $wallet['beacons'] -= totalUsed
    if (totalUsed < formula.sumArray($beaconActivations)) 
        $wallet['beacons'] += Math.floor(formula.sumArray($beaconActivations) - totalUsed);

}

function smartSplitBeacons() {
    if (formula.sumArray($beaconSmartSplits) == 0) return;
    let done = false, n = 0, i = 0;
    // find number of splits to make
    while (!done && i < 10) {
        if ($mineLevel['level'] < $beaconMiningLevelReqs[i]) done = true;
        if ($beaconSmartSplits[i]) n++;
        i++;
    }
    if (n == 10) n = 11;
    if (n == 0) n = 1;
    // find total number of beacons
    for (let j in $beaconActivations) {
            $wallet['beacons'] += $beaconActivations[j];
            $beaconActivations[j] = 0;
    }
    let totalUsed = 0;
    const totalBeacons = $wallet['beacons']
    for (let j = 0; j < i-1; j++) {
        if ($beaconSmartSplits[j]) {
            $beaconActivations[j] = Math.floor(totalBeacons / n);
            totalUsed += $beaconActivations[j];
        }
    }
    $wallet['beacons'] -= totalUsed
    if (totalUsed < formula.sumArray($beaconActivations)) 
        $wallet['beacons'] += Math.floor(formula.sumArray($beaconActivations) - totalUsed);
    
     console.log($beaconSmartSplits)

}

function changeSmartSplits(i) {
    $beaconSmartSplits[i] = !$beaconSmartSplits[i];
}

function recallBeacons() {
    for (let i in $beaconActivations) {
        $wallet['beacons'] += $beaconActivations[i];
        $beaconActivations[i] = 0;
    }
}

const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']

const f = (n: number, pl = 0) => {
        if (n < 1e9) return n.toFixed((n < 1e3 ? pl : 0)).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        else return n.toExponential(3).toString().replace('+', '');
    }   

const fp = (n: unknown, pl = 3, subOne = false) => {
    if (subOne) n -= 1;
    if (n < 1e9) return (n*100).toFixed((n*100 < 1e3 ? pl : 0)).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "%";
    else return (n*100).toExponential(pl).toString().replace('+', '') + "%";
}

const fpf = (n: unknown, subOne = false) => {
    if (subOne) n -= 1;
    if (n < 1e9) return (n*100).toFixed(3).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "%";
    else return (n*100).toExponential(3).toString().replace('+', '') + "%";
}

const fExp = (n, pl = 3) => {
    return n.toExponential(pl).toString().replace('+', '');
}

function getBgColor(i) {
    if (i < 3) return 'bg-emerald-400';
    else if (i < 6) return 'bg-yellow-400';
    else if (i < 8) return 'bg-orange-400';
    else return 'bg-red-400';
}

function getTextColor(i) {
    if (i < 3) return 'text-emerald-400';
    else if (i < 6) return 'text-yellow-400';
    else if (i < 8) return 'text-orange-400';
    else return 'text-red-400';
}

</script>