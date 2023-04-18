<div class='wrapper py-2'>
    <div class='has-tooltip mining-flavor game-btn text-med text-center'>
        Hover for Possible Drops
        <span class='px-2 mx-4 tooltip tooltip-text shadow-lg p-1
        border-white border-double border bg-[#222529] ml-16
          pointer-events-none'>
          {#each Object.entries($miningDropTable) as drop}
            <div class='drop-table-disp grid grid-cols-8'>
                <div class='col-span-4 {ref.colors[drop[0]] || text-white}'>
                    {drop[0]}
                </div>
                <div class='col-span-4 text-left'>
                    {fp(drop[1][0])}
                </div>
            </div>
          {/each}
        </span>
    </div>
    <div class='mine-bar-wrapper pt-4 pb-2'>
        <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div class="bg-red-300 h-2.5 rounded-full" 
            style="width: {($progressPerTick / $progressThreshold) > 5 ? '100%' : mineBarWidth}"></div>
        </div>
    </div>
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
import { wallet, miningDropTable } from '../../data/player';
import { progress, progressThreshold, progressPerTick, miningUpgrades } from '../../data/mining';
import MiningUpgradeButton from '../buttons/MiningUpgradeButton.svelte';
import ref from '../../calcs/ref'

$: mineBarWidth = `${$progress / $progressThreshold['gems'] * 100}%`;

const f = (n: number, pl = 0) => {
        if (n < 1e9) return n.toFixed(pl).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        else return n.toExponential(3).toString().replace('+', '');
    }   

const fp = (n: unknown, pl = 3, subOne = false) => {
    if (subOne) n -= 1;
    if (n < 1e9) return n.toFixed(pl).toLocaleString() + "%";
    else return (n*100).toExponential(pl).toString().replace('+', '') + "%";
}
</script>