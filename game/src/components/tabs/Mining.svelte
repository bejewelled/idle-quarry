<div class='wrapper py-2'>
    {#key clockr}
    <div class='has-tooltip mining-flavor game-btn text-med text-center items-right'>
        Hover for Possible Drops
        <span class='px-2 tooltip tooltip-text shadow-lg p-1
        border-white border-double border bg-[#222529] ml-20
          pointer-events-none'>
          <!-- Drop Table Display -->
          
          {#each Object.entries($miningDropTable).sort((a,b) => b[1][0] - a[1][0]) as drop}
            {#if $visibleTier >= drop[1][4]}
            <div class='drop-table-disp grid grid-cols-9'>
                <div class='col-span-1 text-left {ref.dropTierColors[ref.dropTiers[drop[0]]] ||'text-white'}'>
                [{romanNumerals[Math.max(0,ref.dropTiers[drop[0]]-1)]}]
                </div>
                <div class='col-span-3 text-left pl-[8px] {ref.colors[drop[0]] || 'text-white'}'>
                    {drop[0] in $permaWallet ? (ref.displayNames[drop[0]] || drop[0]) : '???'}
                </div>
                <div class='col-span-3 
                {drop[1][0] >= drop[1][3] ? 'text-amber-200' : ''}
                text-left pl-1'>
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
          
          <div class='pt-1 tooltip-text-xs italic'>Yellow values are softcapped, red values are hardcapped.</div>
        </span>
    </div>
    {/key}

    <!-- reg / dust upgrade selector -->
    {#if $wallet['dust']}
        <div class='pt-2 grid grid-cols-6'>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class='mx-1 p-1 col-span-3 game-btn text-med' on:click={() => changeUpgradeType('regular')}>
                Mining Upgrades
            </div>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class='mx-1 p-1 col-span-3 game-btn text-med' on:click={() => changeUpgradeType('dust')}>
                Dust Upgrades
            </div>
        </div>
    {/if}

    <!-- upgrade sorting -->
    {#key $upgradeSorting}
    {#if upgradeTab === 'regular'}
        <div class='pt-2 grid grid-cols-8'>
            {#key mountCheck}
            {#each Object.entries($upgradeSorting) as u}
                {#if u[1] !== undefined && u[1]['unlockAt']()}
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div class='m-1 text-center 
                    {$upgradeSorting[u[0]]['on'] ? 'control-btn-toggleon' : 'control-btn'}
                    col-span-1 tooltip-text select-none' 
                    on:click={() => changeUpgradeSorting(u[0])}>
                        {u[0]}
                    </div>
                {/if}
            {/each}  
            {/key}        
        </div>
    {/if}
    {/key}


    <!-- progress bar (gems) -->
    <div class='text-[#989898] text-small pt-4'>gem progress [ 
        <strong>
            {$progressAverage['gems'] > $progressThreshold['gems'] ? "~" : ""}
            {$gemGainFlavorText > 1 ? f($gemGainFlavorText,0) : 1}</strong>
          <span class='{$progressAverage['gems']*(1000/$settings['UPDATE_SPEED'])/$progressThreshold['gems'] > (25*ascFormula.getVal('fire')) ? 'text-amber-200' : ''}'>
        x {f($progressAverage['gems']*(1000/$settings['UPDATE_SPEED'])/$progressThreshold['gems'], 2) } times / sec ]
            </span>
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
                        style="width: {$antiFlickerFlags['keyfinder'] ? '100%' : key1BarWidth}"></div>
                    </div>
                </div>
            </div>
            <div class='col-span-3 pl-1 text-left align-text-middle'>
                <div class='text-[#989898] text-small'>[*] <strong>{$keyGainFlavorText['key1'] > 1 ? f($keyGainFlavorText['key1'],0) : '???'}</strong>
                    <span class='{$progressAverage['key1']*(1000/$settings['UPDATE_SPEED'])/$progressThreshold['key1'] > 25*ascFormula.getVal('fire') ? 'text-amber-200' : ''}'>
                        x {f($progressAverage['key1']*(1000/$settings['UPDATE_SPEED'])/$progressThreshold['key1'], 3)} / sec
                    </span>

                </div>
            </div>
        {/if}
        <!-- progress bar (key2) -->
        {#if $miningUpgradeLevels[4] > 0}
            <div class='col-span-9'>
                <div class='mine-bar-wrapper align-middle'>
                    <div class="w-full my-1 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div class="bg-blue-400 h-2.5 rounded-full" 
                        style="width: {$antiFlickerFlags['keyfinder'] ? '100%' : key2BarWidth}"></div>
                    </div>
                </div>
            </div>
            <div class='col-span-3 pl-1 text-left align-text-middle'>
                <div class='text-[#989898] text-small'>[**] <strong>{$keyGainFlavorText['key2'] > 1 ? f($keyGainFlavorText['key2'],0) : '???'}</strong>
                    <span class='{$progressAverage['key2']*(1000/$settings['UPDATE_SPEED'])/$progressThreshold['key2'] > 10*ascFormula.getVal('fire') ? 'text-amber-200' : ''}'>
                        x {f($progressAverage['key2']*(1000/$settings['UPDATE_SPEED'])/$progressThreshold['key2'], 3)} / sec
                    </span>
                </div>
            </div>
        {/if}
        <!-- key finder 3 -->
        {#if $miningUpgradeLevels[18] > 0}
            <div class='col-span-9'>
                <div class='mine-bar-wrapper align-middle'>
                    <div class="w-full my-1 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div class="bg-pink-400 h-2.5 rounded-full" 
                        style="width: {$antiFlickerFlags['keyfinder'] ? '100%' : key3BarWidth}"></div>
                    </div>
                </div>
            </div>
            <div class='col-span-3 pl-1 text-left align-text-middle'>
                <div class='text-[#989898] text-small'>[***] <strong>{$keyGainFlavorText['key3'] > 1 ? f($keyGainFlavorText['key3'],0) : '???'}</strong>
                    <span class='{$progressAverage['key3']*(1000/$settings['UPDATE_SPEED'])/$progressThreshold['key3'] > 1*ascFormula.getVal('fire') ? 'text-amber-200' : ''}'>
                        x {f($progressAverage['key3']*(1000/$settings['UPDATE_SPEED'])/$progressThreshold['key3'], 3)} / sec
                    </span>
                </div>
            </div>
        {/if}
    </div>
    {#key $upgradeSorting }
    <div class='mine-upgrade-wrapper flex flex-wrap'>
        {#each upgradeOrder as i}
            {#if ((upgradeTab == 'regular' && !$miningUpgrades[i]['isDust'])
            || (upgradeTab == 'dust' && $miningUpgrades[i]['isDust']))
            && upgradeSortShow(i)}
                <div class='w-1/2 mine-upgrade-button-wrapper'>
                    <MiningUpgradeButton index={i}/>
                </div>
            {:else}
            {/if}
        {/each}
    </div>
    <div class='col-span-2 pb-12'></div>
    <div class='col-span-2 pb-12'></div>
    <div class='col-span-2 pb-12'></div>
    <div class='col-span-2 pb-12'></div>
    <div class='col-span-12 pb-16'></div>
    <div class='col-span-12 pb-16'></div>
    <div></div>
    {/key}
</div>


<script lang='ts'>
	import { ascFormula } from './../../data/ascension.ts';
 //@ts-nocheck
import { onMount } from 'svelte';
import {progress, wallet, permaWallet, miningDropTable, miningUpgradeLevels, 
    settings, visibleTier, progressThisTick, antiFlickerFlags,
    progressAverage} from '../../data/player';
import {progressThreshold, progressPerTick, miningUpgrades, 
gemGainFlavorText, gemProgressFlavorText, upgradeSorting } from '../../data/mining';
import {keyGainFlavorText} from '../../data/keys';
import MiningUpgradeButton from '../buttons/MiningUpgradeButton.svelte';
import ref from '../../calcs/ref'

$: mineBarWidth = `${Math.min(1,$progress['gems'] / $progressThreshold['gems']) * 100}%`;
$: key1BarWidth = `${Math.min(1,$progress['key1'] / $progressThreshold['key1']) * 100}%`;
$: key2BarWidth = `${Math.min(1,$progress['key2'] / $progressThreshold['key2']) * 100}%`;
$: key3BarWidth = `${Math.min(1,$progress['key3'] / $progressThreshold['key3']) * 100}%`;
$: mDropTable = Object.entries($miningDropTable)
$: upgradeOrder = renderedUpgrades.map((_,i) => i).sort((a,b) => miningSort([a,renderedUpgrades[a]], [b,renderedUpgrades[b]]))
// for triggering #key
let clockr = false;
let renderedUpgrades = $miningUpgrades;
let upgradeTab = 'regular';
let mountCheck = false;

onMount(() => {
    mountCheck = !mountCheck
    const clock = setInterval(() => {
        clockr = !clockr;
    }, 517)
    const updateDropTable = setInterval(() => {
        mDropTable = Object.entries($miningDropTable).sort((a,b) => b[1][0] - a[1][0]);
    }, 5000)
})

function changeUpgradeType(type) {
    upgradeTab = type;
}

function changeUpgradeSorting(type) {
    if ($upgradeSorting[type] !== undefined) 
        $upgradeSorting[type]['on'] = !$upgradeSorting[type]['on'];
        if ($settings['exclusiveSort']) {
            for (let o of Object.keys($upgradeSorting)) {
                if ($upgradeSorting[o] !== undefined && o !== type) 
                    $upgradeSorting[o]['on'] = false;
            }
        }
}

const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']

const f = (n: number, pl = 0) => {
        if (isNaN(n)) return "???"
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

const setRenderedUpgrades = () => {
    renderedUpgrades = $miningUpgrades.filter((_,i) => upgradeSortShow(i));
}


const upgradeSortShow = (i) => {
    if ($upgradeSorting['all']['on']) return true;
    for (let sort of ($miningUpgrades[i]['sortType'])) {
        if ($upgradeSorting[sort]['on']) {
            return true;
        }
    }
    return false;
}

</script>