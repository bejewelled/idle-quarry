<div class='key-amount-wrapper items-center'>
    <div class='grid grid-cols-10'>
        <div class='col-span-10 pt-3 pb-2 tooltip-text text-center'>
            Total Keys Opened: {f(formula.sumArray($keysOpened))}
            [ 
                {#each $keysOpened as k, i}
                    <span class='{ref.colors['key'+((i+1).toString())]}'>
                        {" " + f(k,0)} </span> {#if i+1 < $keysOpened.length}+{/if} 
                {/each}
         ]
        </div>
        {#each [1,2,3,4,5] as i,j}
            <div class='col-span-1 py-1 {ref.colors['key' + i]}'>
                {($wallet['key'+i] && $wallet['key'+i] >= 1) 
                || $visibleTier >= i ? ref.keyMainNames[i]: '?????'}
            </div>
                <div class='col-span-1 text-med py-1 text-left {ref.colors['key' + i]}'>
                    {f(Math.floor($wallet['key' + i] || 0))}
                </div>
                <div class='has-tooltip tooltip-text 
                    game-btn py-2 items-center text-center 
                    border-solid m-1 col-span-1 select-none'>
                    [drops]
                    {#key $keysOpened}
                        <span class='px-2 mx-4 tooltip tooltip-text shadow-lg p-1
                        border-white border-double border bg-[#222529] ml-8
                        pointer-events-none'>
                        <!-- Drop Table Display -->
                        {#each Object.entries(dropTable[i-1]) as drop}
                            {#if drop[0] != 'tier' && $keyItemsUnlocked['key'+i].has(drop[0])}
                            <div class='drop-table-disp grid grid-cols-10'>
                                <div class='col-span-3 text-left pl-[8px] {ref.colors[drop[0]] || 'text-white'}'>
                                    {ref.displayNames[drop[0]] || drop[0]}
                                </div>
                                <div class='col-span-3 text-left pl-1
                                {drop[1][0] >= 1 ? 'text-red-400': 
                                drop[1][4] > 0 && drop[1][0] >= drop[1][4]
                                 ? 'text-amber-200':''}'>
                                    {fp(drop[1][0],
                                    drop[1][0] < 1e-5 ? 5: 3)}
                                </div>
                                <div class='col-span-3 text-right pl-1'>
                                [ {f(drop[1][1], 0)} - {f(drop[1][2], 0)} ]
                                </div>
                            </div>
                            {/if}
                        {/each}
                            {#if $keyItemsUnlocked['key'+i].size < 
                            Object.entries(get(eval('key'+i+'DropTable'))).length - 1}
                            <div class='drop-table-disp grid grid-cols-10'>
                                <div class='col-span-2 text-left pl-[8px] text-white'>
                                    ???
                                </div>
                                <div class='col-span-7 text-center pl-1'>
                                    There are <span class='text-white font-bold'>
                                        {Object.entries(dropTable[i-1]).length
                                        - $keyItemsUnlocked['key'+i].size - 1} </span>
                                    more items that can drop from this key. 
                                </div>
                            </div>
                            {/if}
                        </span>
                    {/key}
                </div>

                <!-- key open buttons -->
                {#if $wallet['slurry'] > 0 || $wallet['gold'] > 3}
                <div class='col-span-1 text-left align-middle'>
                    <!-- <label class='input-wrapper mr-3'> -->
                        <input type='checkbox' id='slurry-check-{j+1}'
                        on:click={() => {
                            if ($slurryToggles[j+1] === undefined) $slurryToggles[j+1] = true;
                        }}
                        bind:checked={$slurryToggles['key'+(j+1).toString()]} class='hidden checkbox w-6 h-6'/>
                        <!-- svelte-ignore a11y-click-events-have-key-events -->
                        <label for='slurry-check-{j+1}'>
                            <div class='{$slurryToggles['key'+(j+1).toString()] ? 'game-btn-toggleon' : 'game-btn'}
                         col-span-1
                        py-2 items-center text-center border-solid game-text text-small
                        select-none mt-1'>
                        Slurry {i}</div>
                    </label>
                    <!-- </label> -->
                </div>
                {/if}
                <div class='{$wallet['slurry'] > 0 || $wallet['gold'] > 3
                ? 'col-span-2' : 'col-span-3'} py-1 text-left {ref.colors['key' + i]}'>
                    <KeyOpenButton rarity={i} amt='single'/>
                </div>
                <div class='col-span-1 py-1 text-left {ref.colors['key' + i]}'>
                    <KeyOpenButton rarity={i} amt=10 />
                </div>
                <div class='col-span-1 py-1 text-left {ref.colors['key' + i]}'>
                    <KeyOpenButton rarity={i} amt=25 />
                </div>
                <div class='col-span-1 py-1 text-left {ref.colors['key' + i]}'>
                    <KeyOpenButton rarity={i} amt=50 />
                </div>
                <div class='col-span-1 py-1 text-left {ref.colors['key' + i]}'>
                    <KeyOpenButton rarity={i} amt='max' />
                </div>
        {/each}
    </div>
    <div class='reward-disp-wrapper items-center'>

        {#if Object.keys($keyRewardText).length > 0}
        <div class='grid grid-cols-8'>
            <div class='col-span-8 game-text text-center pt-1'>
                You received the following rewards:       
            </div>
        
            {#each Object.entries($keyRewardText) as r}
                {#if Number(r[1]) >= 0.99997}
                <div class='col-span-3'></div>
                <div class='col-span-1 text-med text-left pt-1 {ref.colors[r[0]] || 'text-white'}'>
                    {ref.displayNames[r[0]] ? ref.displayNames[r[0]] : r[0]}: 
                </div>
                <div class='col-span-1 text-med pt-1 text-left {ref.colors[r[0]] || 'text-white'}'>
                    {f(Number(r[1]),0)}
                </div>
                <div class='col-span-3'></div>
                {/if}
            {/each}
        </div> 

    {/if}
    </div>
    <div class='pt-6'>
        <div class='wrapper'>
            {#if $permaWallet['gold'] > 1e4 || $wallet['slurry'] > 0}
            <KeySlurryConvertButton />
            {:else}
            <div class='game-btn-noafford text-center py-2'>Unlock a new feature at 10,000 gold</div>
            {/if}
        </div>
    </div>

    <div class='grid grid-cols-12 pt-2'>
        {#each $keyUpgrades as k, i}
        <div class='col-span-3 pb-1'>
            <SlurryUpgradeButton index={i}/>
        </div>
        {/each}
    </div>

    <div class='py-2'></div>

    {#if $wallet['slurry'] > 1}
    <div class='row-span-1 grid grid-cols-12'>
        <div class='col-span-2'>
            <div class='grid grid-rows-2 text-left  text-amber-500'>
                <div class='row-span-1'>Crafting Mastery {$craftMasteryLevel}</div>
                <div class='row-span-1 text-xs'>x{f(formula.calcCraftMasterySpeedBonus($craftMasteryLevel), 2)} global speed bonus</div>
            </div>
        </div>

        <div class='col-span-10 mine-bar-wrapper align-bottom'>
            <div class="has-tooltip w-full my-1 bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                <span class='px-2 mx-4 max-w-[300px] tooltip tooltip-text shadow-lg p-1
                border-white border-double border bg-[#222529] ml-16
                pointer-events-none grid grid-cols-1'>
                <span class='col-span-1 text-center text-amber-500 pb-1'>
                    [{f($craftMasteryProgress)} / {f($craftMasteryNextReq)} crafts]
                </span>
            </span>
                <div class="bg-amber-500 h-3 rounded-full" 
                style="width:{craftMasteryWidth}"></div>
            </div>
        </div>
    </div>

    <div class='grid grid-cols-12 pt-2'>
        {#each $keyCrafts as k, i}
        {#if $keyCrafts[i]['unlockAt']()}
        <div class='col-span-12'>
            <SlurryCraftButton index={i}/>
        </div>
        {/if}
        {/each}
    </div>
    {/if}

    <div class='pb-16 pt-8 tooltip-text text-center w-full italic'>
        {$permaWallet['gold'] > 1e4 ? 'Click the "Slurry X" buttons to enable slurry conversion for each key tier.' : ''} <br/>     
    </div>


</div>

<script lang='ts'>
	import { keyCraftAmount, slurryToggles, permaWallet } from './../../data/player.ts';
	import { onDestroy } from 'svelte';
    //@ts-nocheck
import { onMount } from 'svelte';
import {get} from 'svelte/store';
import { wallet, visibleTier, keyItemsUnlocked, keysOpened, 
    craftMasteryLevel, craftMasteryNextReq, craftMasteryProgress } from '../../data/player';
import { progressThreshold, progressPerTick, miningUpgrades } from '../../data/mining';
import { miningUpgradeLevels } from '../../data/player';
import { keyRewardText, key1DropTable, key2DropTable, key3DropTable,
     key4DropTable, key5DropTable, keyUpgrades, keyCrafts} from '../../data/keys'
import ref from '../../calcs/ref';
import KeyOpenButton  from '../buttons/KeyOpenButton.svelte';
import KeySlurryConvertButton from '../buttons/KeySlurryConvertButton.svelte';
import SlurryUpgradeButton from '../buttons/UpgradeButtons/SlurryUpgradeButton.svelte';
import SlurryCraftButton from '../buttons/SlurryCraftButton.svelte';
import formula from '../../calcs/formula';

$: craftMasteryWidth = `${($craftMasteryProgress / $craftMasteryNextReq) * 100}%`;

$: dropTable = [
   $key1DropTable,
   $key2DropTable,
   $key3DropTable,
   $key4DropTable,
   $key5DropTable
];

let updateInterval;

onMount(() => {
    console.log(dropTable)
    key1DropTable.updateTable();
    key2DropTable.updateTable();
    key3DropTable.updateTable();
    key4DropTable.updateTable();
    key5DropTable.updateTable();

})

onDestroy(() => {
    key1DropTable.updateTable();
    key2DropTable.updateTable();
    key3DropTable.updateTable();
    key4DropTable.updateTable();
    key5DropTable.updateTable();
})

const f = (n: number, pl = 0) => {
        n = Number(n)
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