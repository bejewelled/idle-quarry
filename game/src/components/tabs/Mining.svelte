<div class='wrapper py-2'>
    {#key clockr}
    <div class='has-tooltip mining-flavor game-btn text-med text-center'>
        Hover for Possible Drops
        <span class='px-2 mx-4 tooltip tooltip-text shadow-lg p-1
        border-white border-double border bg-[#222529] ml-16
          pointer-events-none'>
          <!-- Drop Table Display -->
          
          {#each Object.entries($miningDropTable).sort((a,b) => b[1][0] - a[1][0]) as drop}
            {#if $visibleTier >= ref.dropTiers[drop[0]]}
            <div class='drop-table-disp grid grid-cols-9'>
                <div class='col-span-1 text-left {ref.dropTierColors[ref.dropTiers[drop[0]]] ||'text-white'}'>
                [{romanNumerals[Math.max(0,ref.dropTiers[drop[0]]-1)]}]
                </div>
                <div class='col-span-3 text-left pl-[8px] {ref.colors[drop[0]] || 'text-white'}'>
                    {ref.displayNames[drop[0]] || drop[0]}
                </div>
                <div class='col-span-3 text-left pl-1'>
                    {fp(Math.min(1,drop[1][0]), 
                    drop[1][0] < 1e-3 ? 
                    drop[1][0] < 1e-4 ?
                    drop[1][0] < 1e-5 ? 6 : 5 : 4 : 3)}
                </div>
                <div class='col-span-2 text-right pl-1'>
                   [ {f(drop[1][1], 0)} - {f(drop[1][2], 0)} ]
                </div>
            </div>
            {/if}
          {/each}
          
        </span>
    </div>
    {/key}
    <!-- progress bar (gems) -->
    <div class='text-[#989898] text-small pt-4'>gem progress [ 
        <strong>
            {$progressAverage['gems'] > $progressThreshold['gems'] ? "~" : ""}
            {$gemGainFlavorText > 1 ? f($gemGainFlavorText,0) : 1}</strong>
         x {f($progressAverage['gems']*(1000/$settings['UPDATE_SPEED'])/$progressThreshold['gems'], 2) } times / sec ]
    </div>
    <div class='mine-bar-wrapper pb-2'>
        <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div class="bg-red-300 h-2.5 rounded-full" 
            style="width: {$antiFlickerFlags['gems'] ? '100%' : mineBarWidth}"></div>
        </div>
    </div>
    <div class='grid grid-cols-12 align-middle'>
        <!-- progress bar (key1) -->
        {#if $miningUpgradeLevels[3] > 0}
            <div class='col-span-9'>
                <div class='mine-bar-wrapper align-middle'>
                    <div class="w-full my-1 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div class="bg-emerald-400 h-2.5 rounded-full" 
                        style="width: {$antiFlickerFlags['key1'] ? '100%' : key1BarWidth}"></div>
                    </div>
                </div>
            </div>
            <div class='col-span-3 pl-1 text-left align-text-middle'>
                <div class='text-[#989898] text-small'>[*] <strong>{$keyGainFlavorText['key1'] > 1 ? f($keyGainFlavorText['key1'],0) : '???'}</strong>
                    x {f($progressAverage['key1']*(1000/$settings['UPDATE_SPEED'])/$progressThreshold['key1'], 3)} / sec

                </div>
            </div>
        {/if}
        <!-- progress bar (key2) -->
        {#if $miningUpgradeLevels[4] > 0}
            <div class='col-span-9'>
                <div class='mine-bar-wrapper align-middle'>
                    <div class="w-full my-1 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div class="bg-blue-400 h-2.5 rounded-full" 
                        style="width: {$antiFlickerFlags['key2'] ? '100%' : key2BarWidth}"></div>
                    </div>
                </div>
            </div>
            <div class='col-span-3 pl-1 text-left align-text-middle'>
                <div class='text-[#989898] text-small'>[*] <strong>{$keyGainFlavorText['key2'] > 1 ? f($keyGainFlavorText['key2'],0) : '???'}</strong>
                    x {f($progressAverage['key2']*(1000/$settings['UPDATE_SPEED'])/$progressThreshold['key2'], 3)} / sec

                </div>
            </div>
        {/if}
    </div>
    <div class='mine-upgrade-wrapper grid grid-cols-2'>
        {#each upgradeOrder as i}
            <div class='col-span-1 mine-upgrade-button-wrapper'>
                <MiningUpgradeButton index={i}/>
            </div>
        {/each}
    </div>
</div>


<script lang='ts'>
 //@ts-nocheck
import { onMount } from 'svelte';
import {progress, wallet, miningDropTable, miningUpgradeLevels, 
    settings, visibleTier, progressThisTick, progressAverage} from '../../data/player';
import {progressThreshold, progressPerTick, miningUpgrades, antiFlickerFlags,
gemGainFlavorText, gemProgressFlavorText } from '../../data/mining';
import {keyGainFlavorText} from '../../data/keys';
import MiningUpgradeButton from '../buttons/MiningUpgradeButton.svelte';
import ref from '../../calcs/ref'

$: mineBarWidth = `${$progress['gems'] / $progressThreshold['gems'] * 100}%`;
$: key1BarWidth = `${$progress['key1'] / $progressThreshold['key1'] * 100}%`;
$: key2BarWidth = `${$progress['key2'] / $progressThreshold['key2'] * 100}%`;
$: mDropTable = Object.entries($miningDropTable)

$: upgradeOrder = $miningUpgrades.map((_,i) => i).sort((a,b) => miningSort([a,$miningUpgrades[a]], [b,$miningUpgrades[b]]))
// for triggering #key
let clockr = false;

onMount(() => {
    console.log(upgradeOrder)
    const clock = setInterval(() => {
        clockr = !clockr;
    }, 517)
    const updateDropTable = setInterval(() => {
        mDropTable = Object.entries($miningDropTable).sort((a,b) => b[1][0] - a[1][0]);
    }, 5000)
})

const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']

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

const miningSort = (a,b) => {
    const ca = ref.miningUpgradeSortOrder[(a[1]['name'] || 'default').toLowerCase()] || ref.miningUpgradeSortOrder['default']
    const cb = ref.miningUpgradeSortOrder[(b[1]['name'] || 'default').toLowerCase()] || ref.miningUpgradeSortOrder['default']
    return ca - cb;
}

</script>