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
                <div class='col-span-2 text-left {ref.dropTierColors[ref.dropTiers[drop[0]]] ||'text-white'}'>
                [ {'*'.repeat(ref.dropTiers[drop[0]])} ]
                </div>
                <div class='col-span-4 text-left {ref.colors[drop[0]] || 'text-white'}'>
                    {ref.displayNames[drop[0]] || drop[0]}
                </div>
                <div class='col-span-4 text-right'>
                    {fpf(drop[1][0])}
                </div>
            </div>
            {/if}
          {/each}
        </span>
    </div>
    <!-- progress bar (gems) -->
    <div class='text-[#989898] text-small pt-4'>gem progress [ 
        {$gemGainFlavorText > 1 ? f($gemGainFlavorText,3) : 1} 
         x {f($gemProgressFlavorText*(1000/$settings['UPDATE_SPEED'])/$progressThreshold['gems'], 3) } times / sec ]</div>
    <div class='mine-bar-wrapper pb-2'>
        <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div class="bg-red-300 h-2.5 rounded-full" 
            style="width: {$antiFlickerFlags['gems'] ? '100%' : mineBarWidth}"></div>
        </div>
    </div>
    <!-- progress bar (key1) -->
    {#if $miningUpgradeLevels[3] > 0}
    <div class='text-[#989898] text-small'>[*] key progress - +{$keyGainFlavorText['key1'] ? f($keyGainFlavorText['key1'],0) : '[updated on key gain]'}</div>
    <div class='mine-bar-wrapper pb-2'>
        <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div class="bg-emerald-400 h-2.5 rounded-full" 
            style="width: {$antiFlickerFlags['key1'] ? '100%' : key1BarWidth}"></div>
        </div>
    </div>
    {/if}
    <div class='py-1 mine-upgrade-wrapper grid grid-cols-2'>
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
import {progress, wallet, miningDropTable, miningUpgradeLevels, settings, visibleTier} from '../../data/player';
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

const f = (n: number, pl = 0) => {
        if (n < 1e9) return n.toFixed(pl).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        else return n.toExponential(3).toString().replace('+', '');
    }   

const fp = (n: unknown, pl = 3, subOne = false) => {
    if (subOne) n -= 1;
    if (n < 1e9) return (n*100).toFixed(pl).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "%";
    else return (n*100).toExponential(pl).toString().replace('+', '') + "%";
}

const fpf = (n: unknown, subOne = false) => {
    if (subOne) n -= 1;
    if (n < 1e9) return (n*100).toFixed(3).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "%";
    else return (n*100).toExponential(3).toString().replace('+', '') + "%";
}

</script>