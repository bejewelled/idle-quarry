<Adders />
<div class='wrapper'>

    <div class='main-page grid grid-cols-12'>

        <div class='px-2 res-display col-span-3'>
            <div class='res-display-space py-2'></div>
            <div class='res-display-wrap grid grid-cols-12'>
                {#each Object.entries($wallet) as res}
                    {#if $wallet[res[0]] && !res[0].includes('key')}   
                        <div class='{ref.colors[res[0]]} res-name col-span-7'>{ref.displayNames[res[0]] || res[0]}</div>
                        <div class='game-text res-amount col-span-5'>{f(res[1],0)}</div>
                    {/if}
                {/each}
                <div class='res-break py-2 col-span-12'></div>
                {#each Object.entries($wallet) as res}
                    {#if ($wallet[res[0]] || $unlockedRes.has(res[0])) && res[0].includes('key')}   
                        <div class='{ref.colors[res[0]]} res-name col-span-7'>{ref.displayNames[res[0]] || res[0]}</div>
                        <div class='game-text res-amount col-span-5'>{f(res[1],0)}</div>
                    {/if}
                {/each}
             </div>
        </div>

        <div class='px-2 py-2 main-panel col-span-7 grid grid-rows-12'>
            <div class='py-1 row-span-2 control-buttons'>
                <button class='py-1 text-small save-btn control-btn' on:click={() => save()}>Save</button>
                <button class='py-1 text-small save-btn control-btn' on:click={() => reset()}>Reset</button>
                <button class='py-1 px-1 text-small save-btn control-btn' on:click={() => cycleBuyAmount()}>Buy x{buyAmount}</button>               
                <div class='tooltip-text-xs saved-confirm'>{saveConfirm ? 'Saved!' : ''}</div>
            </div>
            <div class='py-1 row-span-2 tab-buttons'>
                {#each ref.tabs as tab}
                    <button class='p-1 text-small control-btn' on:click={() => changeTab(tab)}>{tab}</button>
                {/each}
            </div>
            <div class='row-span-10 main-panel-display'>
                {#if tab === 'mining' && (tabUnlockCriteria['mining'])}
                    <Mining />
                {:else if tab === 'keys'  && (tabUnlockCriteria['mining'])}
                    <Keys />
                {:else if tab === 'beacons' && (tabUnlockCriteria['beacons'])}
                    <Beacons />
                {:else if tab === 'sigils' && (tabUnlockCriteria['sigils'])}
                {/if}

                {#if tab !== 'mining' && tab !== 'keys' && (tab !== 'beacons' || !tabUnlockCriteria['beacons']) && (tab !== 'sigils' || !tabUnlockCriteria['sigils'])}
                <div class='game-text'>{ref.tabNotUnlockedText[tab]}</div>
                {/if}

            </div>
        </div>

    </div>
</div>

<script lang="ts">
// @ts-nocheck

import Decimal from 'break_infinity.js'
import {wallet, miningUpgradeLevels, miningDropTable, unlockedRes, 
    progress, keysOpened, keyItemsUnlocked, settings, baseMiningDropTable,
    visibleTier, beaconProgress, beaconLevels, beaconUpgradeLevels,
    resources, beaconActivations} from '../data/player.js'
import Beacons from '../components/tabs/Beacons.svelte';
import Adders from '../components/adders/Adders.svelte';
import Mining from '../components/tabs/Mining.svelte';
import Keys from '../components/tabs/Keys.svelte';
import MiningUpgradeButton from '../components/buttons/MiningUpgradeButton.svelte';
import ref from '../calcs/ref.ts'

import { onMount } from 'svelte'

let tab = 'mining'
let AUTOSAVE = false;
let AUTOSAVE_INTERVAL = 30000;
let saveConfirm;
let buyAmount = 1;

const changeTab = (t: string) => {
    tab = t;
    console.log(tab);
}

const d = (i: string | number) => {
    return new Decimal(i); 
}

const cycleBuyAmount = () => {
    if (buyAmount === 1) buyAmount = 10;
    else if (buyAmount === 10) buyAmount = 100;
    else if (buyAmount === 100) buyAmount = 1;

    $settings['buyAmount'] = buyAmount;
}
/**
 * number formatting
 */
const f = (n, pl = 3) => {
    if (n < 1e9) return n.toFixed((n < 1e3 ? pl : 0)).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    else return n.toExponential(3).toString().replace('+', '');
}

const tabUnlockCriteria = {
        mining: () => true,
        keys: () => true,
        beacons: () => ($wallet['beacons'] && $wallet['beacons'] > 0),
        sigils: () => ($wallet['sigils'] && $wallet['sigils'] > 0),

    }

const save = () => {
    console.log('s')
    localStorage.setItem('wallet', JSON.stringify($wallet));
    localStorage.setItem('miningUpgradeLevels', JSON.stringify($miningUpgradeLevels));
    localStorage.setItem('unlockedRes', JSON.stringify([...$unlockedRes]));
    let keyItems = {}
    for (let key of Object.keys($keyItemsUnlocked)) {
        console.log(key);
        keyItems[key] = Array.from($keyItemsUnlocked[key] || []);
    }
    localStorage.setItem('keyItemsUnlocked', JSON.stringify(keyItems));
    localStorage.setItem('keysOpened', JSON.stringify($keysOpened));
    localStorage.setItem('progress', JSON.stringify($progress));
    localStorage.setItem('dropTier', JSON.stringify($visibleTier));
    localStorage.setItem('settings', JSON.stringify($settings));
    localStorage.setItem('beaconProgress', JSON.stringify($beaconProgress));
    localStorage.setItem('beaconLevels', JSON.stringify($beaconLevels));
    localStorage.setItem('beaconUpgradeLevels', JSON.stringify($beaconUpgradeLevels));
    localStorage.setItem('resources', JSON.stringify($resources));
    localStorage.setItem('beaconActivations', JSON.stringify($beaconActivations));
    saveConfirm = true;
    setTimeout(() => {
        saveConfirm = false;
    }, 1000);
}

const reset = () => {
    localStorage.clear();
    location.reload();
}

const load = () => {
    if (localStorage === null) return;
    if (localStorage.getItem('wallet')) {
        wallet.set((JSON.parse(localStorage.getItem('wallet'))));
    }
    if (localStorage.getItem('miningUpgradeLevels')) {
        miningUpgradeLevels.set((JSON.parse(localStorage.getItem('miningUpgradeLevels'))));
    }
    if (localStorage.getItem('progress'))
        unlockedRes.set(JSON.parse(localStorage.getItem('progress')))
    if (localStorage.getItem('keysOpened'))
        keysOpened.set(JSON.parse(localStorage.getItem('keysOpened')))
    if (localStorage.getItem('keyItemsUnlocked')) {
        const loadedValues = JSON.parse(localStorage.getItem('keyItemsUnlocked'));
        const keyItems = {};
        for (let key in loadedValues) {
            keyItems[key] = new Set(loadedValues[key]);
        }
        keyItemsUnlocked.set(keyItems);
    }
    $unlockedRes = new Set();
    //re-init unlocked resources
    for (let [k,v] of Object.entries($wallet)) {
            if (v > 0 && !$unlockedRes.has(k)) $unlockedRes.add(k);
    }

    // increase mining drop tier if needed
    if ($miningUpgradeLevels[6] > 0) $visibleTier++;
    if (localStorage.getItem('settings')) {
        settings.set(JSON.parse(localStorage.getItem('settings')));
        buyAmount = $settings['buyAmount'];
    }
    if (localStorage.getItem('beaconProgress')) {
        beaconProgress.set(JSON.parse(localStorage.getItem('beaconProgress')));
    }
    if (localStorage.getItem('beaconLevels')) {
        beaconLevels.set(JSON.parse(localStorage.getItem('beaconLevels')));
    }
    if (localStorage.getItem('beaconUpgradeLevels')) {
        beaconUpgradeLevels.set(JSON.parse(localStorage.getItem('beaconUpgradeLevels')));
    }
    if (localStorage.getItem('resources')) {
        resources.set(JSON.parse(localStorage.getItem('resources')));
    }
    if (localStorage.getItem('beaconActivations')) {
        beaconActivations.set(JSON.parse(localStorage.getItem('beaconActivations')));
    }
    delete $wallet['beaconPower'];
}

onMount(() => {
    load();
    miningDropTable.updateTable();
    console.log($baseMiningDropTable);
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
