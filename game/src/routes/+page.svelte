<Adders />
<div class='wrapper'>

    <div class='main-page grid grid-cols-12'>

        <div class='px-2 res-display col-span-3'>
            <div class='res-display-space py-2'></div>
            <div class='res-display-wrap grid grid-cols-12'>
                {#each Object.entries($wallet) as res}
                    {#if res[1] !== undefined}   
                        <div class='{ref.colors[res[0]]} res-name col-span-5'>{ref.displayNames[res[0]] || res[0]}</div>
                        <div class='game-text res-amount col-span-7'>{f(res[1],0)}</div>
                    {/if}
                {/each}
             </div>
        </div>

        <div class='px-2 py-2 main-panel col-span-7 grid grid-rows-12'>
            <div class='py-1 row-span-2 control-buttons'>
                <button class='py-1 text-small save-btn control-btn' on:click={() => save()}>Save</button>
                <button class='py-1 text-small save-btn control-btn' on:click={() => reset()}>Reset</button>
            </div>
            <div class='py-1 row-span-2 tab-buttons'>
                {#each ['mining', 'keys'] as tab}
                    <button class='p-1 text-small control-btn' on:click={() => changeTab(tab)}>{tab}</button>
                {/each}
            </div>
            <div class='row-span-10 main-panel-display'>
                {#if tab === 'mining'}
                    <Mining />
                {:else if tab === 'keys'}
                    <Keys />
                {/if}

            </div>
        </div>

    </div>
</div>

<script lang="ts">
// @ts-nocheck

import Decimal from 'break_infinity.js'
import {wallet, miningUpgradeLevels, miningDropTable} from '../data/player.js'
import Adders from '../components/adders/Adders.svelte';
import Mining from '../components/tabs/Mining.svelte';
import Keys from '../components/tabs/Keys.svelte';
import MiningUpgradeButton from '../components/buttons/MiningUpgradeButton.svelte';
import ref from '../calcs/ref.ts'

import { onMount } from 'svelte'

let tab = 'mining'
let AUTOSAVE = false;
let AUTOSAVE_INTERVAL = 30000;

const changeTab = (t: string) => {
    tab = t;
    console.log(tab);
}

const d = (i: string | number) => {
    return new Decimal(i); 
}
/**
 * number formatting
 */
const f = (n, pl = 3) => {
    if (n < 1e9) return n.toFixed(pl).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    else return n.toExponential(3).toString().replace('+', '');
}

const save = () => {
    localStorage.setItem('wallet', JSON.stringify($wallet));
    localStorage.setItem('miningUpgradeLevels', JSON.stringify($miningUpgradeLevels));
}

const reset = () => {
    localStorage.clear();
    location.reload();
}

const load = () => {
    if (localStorage.getItem('wallet')) {
        wallet.set((JSON.parse(localStorage.getItem('wallet'))));
    }
    if (localStorage.getItem('miningUpgradeLevels')) {
        miningUpgradeLevels.set((JSON.parse(localStorage.getItem('miningUpgradeLevels'))));
    }
}

onMount(() => {
    load();
    miningDropTable.updateTable();
    setInterval(() => {
        if (AUTOSAVE) {
            save();
        }
    }, AUTOSAVE_INTERVAL);
})

</script>

<style>
    :global(body) {
        font-family: 'Monaco', sans-serif;
    }
    :global(body) {
        background-color: #1a1a1a;
    }
    :global(text) {
        color: #fff;
    }
    :global(.game-text) {
        color: #ffffff;
        font-size: 15px;
    }
    :global(.tooltip-text) {
        color: #cccccc;
        font-size: 12px;
    }
    :global(.tooltip-text-xs) {
        color: #cccccc;
        font-size: 10px;
    }
    :global(.text-white) {
        color: #ffffff;
    }
    :global(.text-xs) {
        font-size: 10px;
    }
    :global(.text-small) {
        font-size: 12px;
    }
    :global(.text-med) {
        font-size: 14px;
    }
    :global(.text-large) {
        font-size: 16px;
    }  
    :global(.game-btn) {
        border: 1px solid #d9d9d9;
        color: #d9d9d9;
        cursor: pointer;
    }
    :global(.game-btn:hover) {
        border: 1px solid #ffffff;
        color: #ffffff;
        background-color: #3a3a3a;
    }
    :global(.game-btn-noafford) {
        border: 1px solid #888888;
        color: #888888;
        cursor: pointer;
    }
    :global(.control-btn) {
        border: 1px solid #858585;
        color: #858585;
        cursor: pointer;
    }
    :global(.control-btn:hover) {
        border: 1px solid #ffffff;
        color: #ffffff;
    }
    :global(.tooltip) {
      @apply invisible absolute;
    }
    :global(.has-tooltip:hover .tooltip) {
      @apply visible z-50;
    }
</style>
