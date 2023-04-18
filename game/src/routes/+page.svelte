<ConcurrentAdders />
<div class='wrapper'>

    <div class='main-page grid grid-cols-12'>

        <div class='px-2 res-display col-span-3'>
            <div class='res-display-space py-2'></div>
            <div class='res-display-wrap grid grid-cols-12'>
                {#each Object.entries($wallet) as res}
                    {#if res[1] !== undefined}
                        <div class='game-text {ref.colors[res[0]] || ref.colors['default']} res-name col-span-4'>{res[0]}</div>
                        <div class='game-text res-amount col-span-8'>{f(res[1],0)}</div>
                    {/if}
                {/each}
             </div>
        </div>

        <div class='px-2 py-2 main-panel col-span-7 grid grid-rows-12'>
            <div class='row-span-2 control-buttons'>
            </div>
            <div class='row-span-2 tab-buttons'>
                {#each ['mining', 'upgrades'] as tab}
                    <button class='text-small control-btn' on:click={() => changeTab(tab)}>{tab}</button>
                {/each}
            </div>
            <div class='row-span-10 main-panel-display'>
                {#if tab === 'mining'}
                    <Mining />
                {:else if tab === 'upgrades'}
                    <Upgrades />
                    <div class='game-text'> sasds</div>
                {/if}

            </div>
        </div>

    </div>
</div>

<script lang="ts">
// @ts-nocheck

import Decimal from 'break_infinity.js'
import {wallet} from '../data/player.js'
import ConcurrentAdders from '../components/adders/ConcurrentAdders.svelte';
import Mining from '../components/tabs/Mining.svelte';
import Upgrades from '../components/tabs/Upgrades.svelte';
import MiningUpgradeButton from '../components/buttons/MiningUpgradeButton.svelte';
import ref from '../calcs/ref.ts'

import { onMount } from 'svelte'

let tab = 'mining'

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
    if (n < 1e9) return n.toFixed(pl).toLocaleString();
    else return n.toExponential(pl).toString().replace('+', '');
}

// colors of various resources
const colors = {
    default: '#ffffff',

}


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
        border: 1px solid #c9c9c9;
        color: #c9c9c9;
        cursor: pointer;
    }
    :global(.game-btn:hover) {
        border: 1px solid #ffffff;
        color: #ffffff;
    }
    :global(.game-btn-noafford) {
        border: 1px solid #999999;
        color: #999999;
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
