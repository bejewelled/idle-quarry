<div class='wrapper py-2'>
    <div class='has-tooltip mining-flavor game-btn text-med text-center'>
        Hover for Possible Drops
        <span class='px-2 mx-4 tooltip tooltip-text shadow-lg p-1
        border-white border-double border bg-[#222529] ml-16
          pointer-events-none'>
          <!-- Drop Table Display -->
          {#each Object.entries($miningDropTable) as drop}
            {#if ref.dropTiers[drop[0]] >= $visibleTier}
            <div class='drop-table-disp grid grid-cols-10'>
                <div class='col-span-1 text-left {ref.dropTierColors[ref.dropTiers[drop[0]]] ||'text-white'}'>
                [ {romanNumerals[Math.max(0,ref.dropTiers[drop[0]]-1)]} ]
                </div>
                <div class='col-span-3 text-left pl-[8px] {ref.colors[drop[0]] || 'text-white'}'>
                    {ref.displayNames[drop[0]] || drop[0]}
                </div>
                <div class='col-span-3 text-left pl-1'>
                    {fpf(drop[1][0])}
                </div>
                <div class='col-span-3 text-right pl-1'>
                   [ {f(drop[1][1], 0)} - {f(drop[1][2], 0)} ]
                </div>
            </div>
            {/if}
          {/each}
        </span>
    </div>
    <!-- progress bar (gems) -->
    <div class='text-[#989898] text-small pt-4'>gem progress [ 
        <strong>{$gemGainFlavorText > 1 ? f($gemGainFlavorText,3) : 1}</strong>
         x {f($progressThisSecond['gems']*(1000/$settings['UPDATE_SPEED'])/$progressThreshold['gems'], 2) } times / sec ]</div>
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
            <div class='text-[#989898] text-small'>[*] +<strong>{$keyGainFlavorText[0] > 1 ? f($keyGainFlavorText[0],3) : 1}</strong>
                x {f($progressThisSecond['key1']*(1000/$settings['UPDATE_SPEED'])/$progressThreshold['key1'], 3)} / sec

            </div>
        </div>
        {/if}
    </div>
    <div class='mine-upgrade-wrapper grid grid-cols-2'>
        {#each Object.entries($miningUpgrades) as upgrade,i}
            <div class='py-1 col-span-1 mine-upgrade-button-wrapper'>
                <MiningUpgradeButton index={i}/>
            </div>
        {/each}
    </div>
</div>


<script lang='ts'>
 //@ts-nocheck
import { onMount } from 'svelte';
import {progress, wallet, miningDropTable, miningUpgradeLevels, 
    settings, visibleTier, progressThisSecond} from '../../data/player';
import {progressThreshold, progressPerTick, miningUpgrades, antiFlickerFlags,
gemGainFlavorText, gemProgressFlavorText } from '../../data/mining';
import {keyGainFlavorText} from '../../data/keys';
import MiningUpgradeButton from '../buttons/MiningUpgradeButton.svelte';
import ref from '../../calcs/ref'

$: mineBarWidth = `${$progress['gems'] / $progressThreshold['gems'] * 100}%`;
$: key1BarWidth = `${$progress['key1'] / $progressThreshold['key1'] * 100}%`;

onMount(() => {
    setInterval(() => {
    }, 500)
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

</script>