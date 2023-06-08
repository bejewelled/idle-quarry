<div class='key-amount-wrapper items-center'>
    <div class='grid grid-cols-10'>
        <div class='col-span-10 pt-3 pb-2 tooltip-text text-center'>
            Total Keys Opened: {formula.sumArray($keysOpened),0}
            [ 
                {#each $keysOpened as k, i}
                    <span class='{ref.colors['key'+((i+1).toString())]}'>
                        {" " + f(k,0)} </span> {#if i+1 < $keysOpened.length}+{/if} 
                {/each}
         ]
        </div>
        {#each [1,2,3,4,5] as i}
            <div class='col-span-1 py-1 {ref.colors['key' + i]}'>
                {$wallet['key'+i] >= 1 || $visibleTier >= i ? ref.keyMainNames[i]: '?????'}
            </div>
                <div class='col-span-1 py-1 text-left {ref.colors['key' + i]}'>
                    {f(Math.floor($wallet['key' + i]))}
                </div>
                <div class='has-tooltip tooltip-text 
                    game-btn py-2 items-center text-center 
                    border-solid m-1 ml-1 mr-1 col-span-1 select-none'>
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
                                {(drop[0].includes('key') && drop[1][0] >= 0.333) 
                                 || (drop[0].includes('key'+i) && drop[1][0] >= 1/drop[1][2])
                                 ? 'text-yellow-400':''}'>
                                    {fp(drop[1][0],
                                    drop[1][0] < 1e-3 ? 5: 3)}
                                </div>
                                <div class='col-span-3 text-right pl-1'>
                                [ {f(drop[1][1], 0)} - {f(drop[1][2], 0)} ]
                                </div>
                            </div>
                            {/if}
                            {/each}
                            {#if $keyItemsUnlocked['key'+i].size < 
                            Object.entries(get(eval('key'+i+'DropTable'))).length}
                            <div class='drop-table-disp grid grid-cols-10'>
                                <div class='col-span-2 text-left pl-[8px] text-white'>
                                    ???
                                </div>
                                <div class='col-span-7 text-center pl-1'>
                                    There are <span class='text-white font-bold'>
                                        {Object.entries(dropTable[i-1]).length
                                        - $keyItemsUnlocked['key'+i].size} </span>
                                    more items that can drop from this key. 
                                </div>
                            </div>
                            {/if}
                        </span>
                    {/key}
                </div>

                <!-- key open buttons -->
                <div class='col-span-3 py-1 text-left {ref.colors['key' + i]}'>
                    <KeyOpenButton rarity={i} amt=1/>
                </div>
                <div class='col-span-1 py-1 text-left {ref.colors['key' + i]}'>
                    <KeyOpenButton rarity={i} amt=25 />
                </div>
                <div class='col-span-1 py-1 text-left {ref.colors['key' + i]}'>
                    <KeyOpenButton rarity={i} amt=500 />
                </div>
                <div class='col-span-1 py-1 text-left {ref.colors['key' + i]}'>
                    <KeyOpenButton rarity={i} amt=10000 />
                </div>
                <div class='col-span-1 py-1 text-left {ref.colors['key' + i]}'>
                    <KeyOpenButton rarity={i} amt='max' />
                </div>
        {/each}
    </div>
    <div class='reward-disp-wrapper items-center'>
        
        <div class='grid grid-cols-8'>
            <div class='col-span-8 game-text text-left'>
                You received the following rewards:
            </div>
        {#if Object.keys($keyRewardText).length > 0}
            {#each Object.entries($keyRewardText) as r}
                {#if Number(r[1]) >= 0.99997}
                <div class='col-span-3'></div>
                <div class='col-span-1 text-left py-1 {ref.colors[r[0]] || 'text-white'}'>
                    {ref.displayNames[r[0]] ? ref.displayNames[r[0]] : r[0]}: 
                </div>
                <div class='col-span-1 py-1 text-left {ref.colors[r[0]] || 'text-white'}'>
                    {f(Number(r[1]),0)}
                </div>
                <div class='col-span-3'></div>
                {/if}
            {/each}
        
        {:else}
            <div class='col-span-8 game-text text-center'>
                Nothing :(
            </div>        
        
        {/if}
    </div> 

    </div>
    <div class='pt-6'>
        <div class='wrapper'>
            {#if $wallet['gold'] > 1e6 || $wallet['slurry'] > 0}
            <KeySlurryConvertButton />
            {:else}
            <div class='game-btn-noafford text-center py-2'>Unlock a new feature at 1,000,000 gold</div>
            {/if}
        </div>
    </div>

    <div class='grid grid-cols-12 pt-2'>
        {#each $keyUpgrades as k, i}
        <div class='col-span-3'>
            <SlurryUpgradeButton index={i}/>
        </div>
        {/each}
    </div>

    <div class='py-3'></div>

    {#if $wallet['slurry'] > 1}
    <div class='grid grid-cols-12 pt-2'>
        {#each $keyCrafts as k, i}
        <div class='col-span-12'>
            <SlurryCraftButton index={i}/>
        </div>
        {/each}
    </div>
    {/if}


</div>

<script lang='ts'>
    //@ts-nocheck
import { onMount } from 'svelte';
import {get} from 'svelte/store';
import { wallet, visibleTier, keyItemsUnlocked, keysOpened } from '../../data/player';
import { progressThreshold, progressPerTick, miningUpgrades } from '../../data/mining';
import { miningUpgradeLevels } from '../../data/player';
import { keyRewardText, key1DropTable, key2DropTable, key3DropTable,
     key4DropTable, key5DropTable, keyUpgrades, keyCrafts} from '../../data/keys'
import ref from '../../calcs/ref';
import KeyOpenButton  from '../buttons/KeyOpenButton.svelte';
import KeySlurryConvertButton from '../buttons/KeySlurryConvertButton.svelte';
import SlurryUpgradeButton from '../buttons/SlurryUpgradeButton.svelte';
import SlurryCraftButton from '../buttons/SlurryCraftButton.svelte';
import formula from '../../calcs/formula';


$: dropTable = [
   $key1DropTable,
   $key2DropTable,
   $key3DropTable,
   $key4DropTable,
   $key5DropTable
];

onMount(() => {
    console.log(dropTable)
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