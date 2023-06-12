<!-- <title>Into the Quarry</title> -->
{#if loadingFinished}
<Adders />
{/if}
<div class='wrapper'>

    <div class='main-page grid grid-cols-12'>

        <div class='px-2 res-display col-span-3'>
            <div class='res-display-space py-2'></div>
            <div class='res-display-wrap grid grid-cols-12'>
            
            {#if $challengeActive !== 0}
            <div class='col-span-12 text-amber-500 
            text-left text-small pb-1'>Challenge {$challengeActive} 
            [ {f($wallet['challengePoints'], 0)} / {f($challengeGoals[$challengeActive-1])}
            ]</div>
            <div class='col-span-12'>
                <div class='mine-bar-wrapper pb-2'>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div class="bg-amber-500 h-2.5 rounded-full" 
                        style="width: {Math.min(100,challengeBarWidth)}%">
                    </div>
                    </div>
                </div>
            </div>

            {/if}


            {#each [1,2,3,4] as i}
                {#each Object.entries($wallet) as res}
                    {#if $wallet[res[0]] && $wallet[res[0]] >= 1 && !res[0].includes('key') && !ref.walletExclude[res[0]]
                    && (ref.dropTiers[res[0]] || ref.dropTiers['default']) == i}   
                        <div class='{ref.colors[res[0]]} res-name col-span-7'>{ref.displayNames[res[0]] || res[0]}</div>
                        <div class='game-text res-amount col-span-5'>{f(Math.floor(res[1]),0)}</div>
                    {/if}
                {/each}
                <div class='res-break py-2 col-span-12'></div>
            {/each}
            <!-- keys -->
            {#each Object.entries($wallet) as res}
                {#if ($wallet[res[0]] || $unlockedRes.has(res[0])) && res[0].includes('key') }   
                    <div class='{ref.colors[res[0]]} res-name col-span-7'>{ref.displayNames[res[0]] || res[0]}</div>
                    <div class='game-text res-amount col-span-5'>{f(Math.floor(res[1]),0)}</div>
                {/if}
            {/each}
            <!-- mining level bar -->
            <div class='col-span-12 has-tooltip'>
                <div class='text-[#989898] text-small pt-4 pb-1'>Mining Level 
                    <span class='font-bold text-cyan-400'>{$mineLevel['level']}</span>
                </div>
                <span class='px-2 mx-4 tooltip tooltip-text shadow-lg p-1
                border-white border-double border bg-[#222529] ml-16
                  pointer-events-none max-w-[300px] text-center weight-bold'>
                    <div class='grid grid-cols-3'>
                        <div class='col-span-3 text-center text-cyan-500'>
                            [ {f($mineLevel['xp'],0)} / {f($mineLevel['xpNextReq'], 0)} ]
                        </div>
                        <div class='col-span-3 text-center'>
                            Each mine operation gives 1 xp.
                        </div>
                        <div class='col-span-3 text-center'>
                            Each button hit gives 1 - 3 xp.
                        </div>
                    </div>
                </span>
            </div>

            <div class='col-span-12'>
                <div class='mine-bar-wrapper pb-2'>
                    <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div class="bg-cyan-500 h-2.5 rounded-full" 
                        style="width: {mineLevelBarWidth}%"></div>
                    </div>
                </div>
            </div>

                <div class='alog-break pt-4 col-span-12'></div>
                <div class='alog-title game-text col-span-9 '>Activity Log</div>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class='alog-minimize col-span-3 game-btn text-center game-text'
                on:click= {() => toggleAlog()}>{alogShow ? "-" : "+"}</div>
                <div class='col-span-12 py-1'></div>
                {#if alogShow}
                <div class="alog-cont col-span-12 h-64 relative bg-gray-700 border-4 border-gray-600">
                    <div class="scrollable-area absolute inset-0 overflow-y-auto">   
                            {#each $activityLog.slice().reverse() as a}
                            <div class='alog-text text-small {a[1]} col-span-12 pt-1 pl-1'>{a[0]}</div>
                            {/each}
                        
                    </div>
                </div>
                {/if}
             </div>
        </div>

        <!-- main display -->
        <div class='px-2 py-2 main-panel col-span-8 flexbox'>
            <div class='py-1 control-buttons resize-none'>
                <button class='py-1 text-small save-btn control-btn {saveConfirm ? 'bg-green-400' : ''}' on:click={() => save()}>Save</button>
                <button class='py-1 text-small save-btn control-btn' on:click={() => load(true)}>Import</button>
                <button class='py-1 text-small save-btn control-btn {exportConfirm ? 'bg-green-400' : ''}' on:click={() => save(true)}>Export</button>
                <button class='py-1 px-1 text-small save-btn control-btn' on:click={() => cycleBuyAmount()}>Buy x{buyAmount}</button>  
                <button class='py-1 px-1 text-small save-btn has-tooltip {$settings['maxBuy'] ? 'game-btn-toggleon' : 'control-btn'}' on:click={() => toggleMaxBuy()}>Buy Max
                    <span class='px-2 mx-4 tooltip tooltip-text shadow-lg p-1
                    border-white border-double border bg-[#222529] ml-16
                      pointer-events-none max-w-[300px] text-center weight-bold'>Buy Max only works on Mining and Enchant upgrades.</span>
                </button>   
                <button class='py-1 px-1 text-small save-btn control-btn' on:click={() => changeTab('help')}>Help!</button>   
                <button class='py-1 px-1 text-small save-btn control-btn' on:click={() => changeTab('settings')}>Settings</button>   
                <button class='py-1 text-small border-2 border-red-600 text-red-600 hover:bg-red-950' on:click={() => reset()}>Reset</button>
                <button class='text-xs text-gray-600'>v0.0.3A-17</button>  
            </div>
            <div class='row-span-1 tab-buttons'>
                {#key tabsUnlocked}
                {#each ref.tabs as t}
                    <button class='px-1 py-1 text-small 
                    {!tabUnlockCriteria[t] ? 'control-btn-nounlock' : 
                    (tabUnlockCriteria[t]() ? 
                    (t === tab ? 'control-btn-selected' : 'control-btn') : 'control-btn-nounlock')}' 
                    on:click={() => changeTab(t)}>{t}</button>
                {/each}
                {/key}
            </div>
            <div class='row-span-10 main-panel-display'>
                {#if tab === 'mining' && (tabUnlockCriteria['mining']())}
                    <Mining />
                {:else if tab === 'keys'  && (tabUnlockCriteria['mining']())}
                    <Keys />
                {:else if tab === 'beacons' && (tabUnlockCriteria['beacons']())}
                    <Beacons />
                {:else if tab === 'relocate' && (tabUnlockCriteria['relocate']())}
                    <Relocate />
                {:else if tab === 'enchants' && (tabUnlockCriteria['enchants']())}
                    <Enchants />
                {:else if tab === 'button' && (tabUnlockCriteria['button']())}
                    <Button />

                {:else if tab === 'automation' && (tabUnlockCriteria['automation']())}
                    <Automation />
                {:else if tab === 'challenges' && (tabUnlockCriteria['challenges']())}
                    <Challenges />
                {:else if tab === 'artifacts' && (tabUnlockCriteria['artifacts']())}
                    <Artifacts />
                {:else if tab === 'help'}
                    <Help />
                {:else if tab === 'settings'}
                    <Settings />
                {/if}

                {#if (tabUnlockCriteria[tab] && !tabUnlockCriteria[tab]()) ||
                    !(tabUnlockCriteria[tab])}
        
                <div class='game-text'>{ref.tabNotUnlockedText[tab] || ''}</div>
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
    resources, beaconActivations, flags, enchantUpgradeLevels, activityLog,
    mineLevel, buttonNumClicks, buttonStats, buttonUpgradeLevels, 
    keyUpgradeLevels, keyCraftAmount, keyCraftMastery, 
    keyCraftTimes, startOfGame, antiFlickerFlags, 
    automationItemsUnlocked, saveVersion, miningUpgradeLevelsBought,
    miningUpgradeLevelsFree, activityLogShow, challengeActive,
    challengesCompleted, challengeProgress, beaconSmartSplits,
    challenge3Multi} from '../data/player.js'
import {key1DropTable, key2DropTable, key3DropTable, 
key4DropTable, key5DropTable, keyUpgrades, keyCrafts} from '../data/keys.js'
import {beaconNextReqs, beaconSpendAmt, beaconNums, baseBeaconNextReqs} from '../data/beacons.ts'
import {enchantUpgrades, enchantThreshold} from '../data/fame.ts'
import {buttonUpgrades} from '../data/button.ts'
import {challengeGoals, challengeMultipliers} from '../data/challenges.ts'
import Beacons from '../components/tabs/Beacons.svelte';
import Adders from '../components/adders/Adders.svelte';
import Mining from '../components/tabs/Mining.svelte';
import Keys from '../components/tabs/Keys.svelte';
import Relocate from '../components/tabs/Relocate.svelte';
import Enchants from '../components/tabs/Enchants.svelte';
import Automation from '../components/tabs/Automation.svelte';
import Button from '../components/tabs/Button.svelte';
import Help from '../components/tabs/Help.svelte';
import Settings from '../components/tabs/Settings.svelte';
import Challenges from '../components/tabs/Challenges.svelte';
import Artifacts from '../components/tabs/Artifacts.svelte';
import MiningUpgradeButton from '../components/buttons/MiningUpgradeButton.svelte';
import ref from '../calcs/ref.ts'

import { onMount } from 'svelte'
    import formula from '../calcs/formula.js';

let tab = 'mining'
let AUTOSAVE = true;
let AUTOSAVE_INTERVAL = 30000;
let saveConfirm, exportConfirm;
let buyAmount = 1;
let loadingFinished = false;
let alogShow = true;
const GAME_SPEED = 1 //only for balancing, doesn't actually change the game speed
$: mineLevelBarWidth = $mineLevel['xp'] / $mineLevel['xpNextReq'] * 100;
$: challengeBarWidth = $wallet['challengePoints'] / $challengeGoals[$challengeActive-1] * 100;
let ct;

const toggleAlog = () => {
    alogShow = !alogShow;
    //$settings['alogShow'] = alogShow;
}

const changeTab = (t: string) => {
    tab = t;
    $settings['activeTab'] = t;
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

const toggleMaxBuy = () => {
    if (!$settings['maxBuy']) $settings['maxBuy'] = false;
    $settings['maxBuy'] = !$settings['maxBuy'];
}
/**
 * number formatting
 */
const f = (n, pl = 3) => {
    if (n < 1e9) return n.toFixed((n < 1e3 ? pl : 0)).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    else return n.toExponential(3).toString().replace('+', '');
}

// TAB_UNLOCK
const tabUnlockCriteria = {
        mining: () => true,
        keys: () => true,
        beacons: () => (($wallet['beacons']) || formula.sumArray($beaconActivations)>0),
        sigils: () => ($wallet['sigils'] && $wallet['sigils'] > 0.02),
        relocate: () => (formula.sumArray($keysOpened) > 200 || $wallet['fame']),
        enchants: () => ($wallet['fame'] && $wallet['fame'] >= 100) 
                        || formula.sumArray($enchantUpgradeLevels) > 0,
        automation: () => ($wallet['fame'] && $wallet['fame'] >= 0.997)
                        || formula.sumArray($enchantUpgradeLevels) > 0
                        || $miningUpgradeLevels[10] > 0 || $miningUpgradeLevels[11] > 0,
        button: () => $mineLevel['level'] >= 8,
        default: () => false,
        help: () => true,
        settings: () => true,
        challenges: () => $automationItemsUnlocked['game on'],
        artifacts: () => ($wallet['artifacts'] && $wallet['artifacts'] >= 1),
    }
const tabsUnlocked = {
    mining: true,
    keys: true,
    beacons: false,
    sigils: false,
    relocate: false,
    default: false,
}


const save = async (isExport = false) => {
    localStorage.setItem('wallet', JSON.stringify($wallet));
    localStorage.setItem('miningUpgradeLevels', JSON.stringify($miningUpgradeLevels));
    localStorage.setItem('miningUpgradeLevelsBought', JSON.stringify($miningUpgradeLevelsBought));
    localStorage.setItem('miningUpgradeLevelsFree', JSON.stringify($miningUpgradeLevelsFree));
    localStorage.setItem('unlockedRes', JSON.stringify([...$unlockedRes]));
    let keyItems = {}
    for (let key of Object.keys($keyItemsUnlocked)) {
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
    // this is not in the player class
    // however, it is saved to prevent mismatches in beacon path levels on load
    localStorage.setItem('beaconNextReqs', JSON.stringify($beaconNextReqs));
    localStorage.setItem('flags', JSON.stringify($flags));
    localStorage.setItem('enchantUpgradeLevels', JSON.stringify($enchantUpgradeLevels));
    localStorage.setItem('beaconSpendAmt', JSON.stringify($beaconSpendAmt));
    localStorage.setItem('mineLevel', JSON.stringify($mineLevel));
    localStorage.setItem('buttonNumClicks', JSON.stringify($buttonNumClicks));
    localStorage.setItem('buttonUpgradeLevels', JSON.stringify($buttonUpgradeLevels));
    localStorage.setItem('buttonStats', JSON.stringify($buttonStats));
    localStorage.setItem('keyUpgradeLevels', JSON.stringify($keyUpgradeLevels));
    localStorage.setItem('keyCraftTimes', JSON.stringify($keyCraftTimes));
    localStorage.setItem('keyCraftAmount', JSON.stringify($keyCraftAmount));
    localStorage.setItem('keyCraftMastery', JSON.stringify($keyCraftMastery));
    localStorage.setItem('startOfGame', JSON.stringify($startOfGame));
    localStorage.setItem('settings', JSON.stringify($settings));
    localStorage.setItem('antiFlickerFlags', JSON.stringify($antiFlickerFlags));
    localStorage.setItem('saveVersion', JSON.stringify($saveVersion));
    localStorage.setItem('automationItemsUnlocked', JSON.stringify($automationItemsUnlocked))
    localStorage.setItem('activityLogShow', JSON.stringify($activityLogShow));
    localStorage.setItem('challengeActive', JSON.stringify($challengeActive));
    localStorage.setItem('challengesCompleted', JSON.stringify($challengesCompleted));
    localStorage.setItem('beaconSmartSplits', JSON.stringify($beaconSmartSplits));
    localStorage.setItem('challenge3Multi', JSON.stringify($challenge3Multi));

    saveConfirm = true;
    if (isExport) {
        const keys = Object.keys(localStorage);
        const save = {}

        keys.forEach((key) => {
            save[key] = localStorage.getItem(key);
        });
        const saveFile = btoa(JSON.stringify(save));
        await parent.navigator.clipboard.writeText(saveFile);
        alert('Copied save to clipboard.')
        exportConfirm = true;
    }

    setTimeout(() => {
        saveConfirm = false;
        exportConfirm = false;
    }, 1000);


}

const reset = () => {
    if (confirm("Are you sure? This is a HARD RESET!!!!")) {
        if (confirm("Are you SURE sure?")) {
        localStorage.clear();
        location.reload();
        }
    }
}

const load = async (isImport = false) => {
    if (isImport) {
        const saveFile = prompt("Paste your save here.");
        if (saveFile) {
            try {
                const save = JSON.parse(atob(saveFile))
                const keys = Object.keys(save);
                keys.forEach((key) => {
                    localStorage.setItem(key, save[key]);
                });
                location.reload();
            }  catch (e) {
                alert("Save file invalid, using local save instead. Contact the developer on Discord if this is a mistake.")
            }
        } else {
            alert("Safe file empty, using local save instead.")
        }
    }
    if (localStorage === null) return;
    if (localStorage.getItem('wallet')) {
        wallet.set((JSON.parse(localStorage.getItem('wallet'))));
        for (let k of Object.keys($wallet)) {
            if (isNaN($wallet[k])) $wallet[k] = 0;
        }
    }
    if (localStorage.getItem('miningUpgradeLevels')) {
        miningUpgradeLevels.set((JSON.parse(localStorage.getItem('miningUpgradeLevels'))));
    }
    if ($miningUpgradeLevels.length < 100) {
        $miningUpgradeLevels = [...$miningUpgradeLevels, ...Array(100-$miningUpgradeLevels.length).fill(0)];
    }
    if (localStorage.getItem('miningUpgradeLevelsBought')) {
        miningUpgradeLevelsBought.set((JSON.parse(localStorage.getItem('miningUpgradeLevelsBought'))));
    }
    if (localStorage.getItem('miningUpgradeLevelsFree')) {
        miningUpgradeLevelsFree.set((JSON.parse(localStorage.getItem('miningUpgradeLevelsFree'))));
    }
    if (localStorage.getItem('progress'))
        unlockedRes.set(JSON.parse(localStorage.getItem('progress')))
    if (localStorage.getItem('keysOpened'))
        keysOpened.set(JSON.parse(localStorage.getItem('keysOpened')))
        if ($keysOpened.length > 5) $keysOpened = $keysOpened.slice(0,5);
    if (localStorage.getItem('keyItemsUnlocked')) {
        const loadedValues = JSON.parse(localStorage.getItem('keyItemsUnlocked'));
        const keyItems = {};
        for (let key in loadedValues) {
            keyItems[key] = new Set(loadedValues[key]);
        }
        keyItemsUnlocked.set(keyItems);
    }
    if (localStorage.getItem('beaconSpendAmt')) {
        beaconSpendAmt.set(JSON.parse(localStorage.getItem('beaconSpendAmt')));
    }
    $unlockedRes = new Set();
    //re-init unlocked resources
    for (let [k,v] of Object.entries($wallet)) {
            if (v > 0 && !$unlockedRes.has(k)) $unlockedRes.add(k);
    }

    // increase mining drop tier if needed
    if ($miningUpgradeLevels[6] > 0) $visibleTier = 2;
    if ($miningUpgradeLevels[9] > 0) $visibleTier = 3;
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
    if (localStorage.getItem('beaconNextReqs')) {
        beaconNextReqs.set(JSON.parse(localStorage.getItem('beaconNextReqs')));
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
    if (localStorage.getItem('flags')) {
        flags.set(JSON.parse(localStorage.getItem('flags')));
    }
    if (localStorage.getItem('enchantUpgradeLevels')) {
        enchantUpgradeLevels.set(JSON.parse(localStorage.getItem('enchantUpgradeLevels')));
    }
    if (localStorage.getItem('mineLevel')) {
        mineLevel.set(JSON.parse(localStorage.getItem('mineLevel')));
    }
    if (localStorage.getItem('buttonNumClicks')) {
        buttonNumClicks.set(JSON.parse(localStorage.getItem('buttonNumClicks')));
    }
    if (localStorage.getItem('buttonUpgradeLevels')) {
        buttonUpgradeLevels.set(JSON.parse(localStorage.getItem('buttonUpgradeLevels')));
    }
    if (localStorage.getItem('buttonStats')) {
        buttonStats.set(JSON.parse(localStorage.getItem('buttonStats')));
    }
    if (localStorage.getItem('keyUpgradeLevels')) {
        keyUpgradeLevels.set(JSON.parse(localStorage.getItem('keyUpgradeLevels')));
    }
    if (localStorage.getItem('keyCraftTimes')) {
        keyCraftTimes.set(JSON.parse(localStorage.getItem('keyCraftTimes')));
    }
    if (localStorage.getItem('keyCraftAmount')) {
        keyCraftAmount.set(JSON.parse(localStorage.getItem('keyCraftAmount')));
    }
    if (localStorage.getItem('keyCraftMastery')) {
        keyCraftMastery.set(JSON.parse(localStorage.getItem('keyCraftMastery')));
    }
    if (localStorage.getItem('startOfGame')) {
        startOfGame.set(JSON.parse(localStorage.getItem('startOfGame')));
    }
    if (localStorage.getItem('settings')) {
        settings.set(JSON.parse(localStorage.getItem('settings')));
    }
    if (localStorage.getItem('antiFlickerFlags')) {
        antiFlickerFlags.set(JSON.parse(localStorage.getItem('antiFlickerFlags')));
    }
    if (localStorage.getItem('saveVersion')) {
        saveVersion.set(JSON.parse(localStorage.getItem('saveVersion')));
    }
    if (localStorage.getItem('automationItemsUnlocked')) {
        automationItemsUnlocked.set(JSON.parse(localStorage.getItem('automationItemsUnlocked')));
    }
    if ($automationItemsUnlocked['spellcaster']) {
        $enchantThreshold['t1'] = 90;
    }
    if ($automationItemsUnlocked['spellcaster ii']) {
        $enchantThreshold['t1'] = 81;
    }

    if (localStorage.getItem('activityLogShow')) {
        activityLogShow.set(JSON.parse(localStorage.getItem('activityLogShow')));
    }
    if (localStorage.getItem('challengeActive')) {
        challengeActive.set(JSON.parse(localStorage.getItem('challengeActive')));
    }
    if (localStorage.getItem('challengesCompleted')) {
        challengesCompleted.set(JSON.parse(localStorage.getItem('challengesCompleted')));
    }
    if (localStorage.getItem('beaconSmartSplits')) {
        beaconSmartSplits.set(JSON.parse(localStorage.getItem('beaconSmartSplits')));
    }
    if (localStorage.getItem('challenge3Multi')) {
        challenge3Multi.set(JSON.parse(localStorage.getItem('challenge3Multi')));
    }

    // updates older save files to new format
    await versionUpdater();

   miningDropTable.updateTable();

    if ($resources['beaconPower'] < 0) $resources['beaconPower'] = 0;

    console.log($key1DropTable);
   
    key1DropTable.updateTable();
    key2DropTable.updateTable();
    key3DropTable.updateTable();
    key4DropTable.updateTable();
    key5DropTable.updateTable();

    challengeGoals.updateChallengeReqs();

    loadingFinished = true;
    console.log($activityLogShow);
    return true;
}

function versionUpdater() {
    console.log($saveVersion)
    const ver = $saveVersion;
    const LATEST_VER = 19;
    if (ver <= 0) {
        // fix "mysterious potion" error
        $keyUpgradeLevels[0] = 0;
        key1DropTable.updateTable();
        key2DropTable.updateTable();
        key3DropTable.updateTable();

        // fix NaN slurry error
        if (isNaN($wallet['slurry'])) $wallet['slurry'] = 0;
    }
    if (ver <= 1) {
        if ($miningUpgradeLevels[6] > 1) $miningUpgradeLevels[6] = 1; // fix lootmaster multibuy
        for (let b in $beaconActivations) {
            if (isNaN($beaconActivations[b])) $beaconActivations[b] = 0;
        }
    }
    if (ver <= 2) {
        $keyCraftTimes['energizedCrystal'] = [-1,-1]
    }
    if (ver <= 3) {
        $miningUpgradeLevelsBought = Array(200).fill(0);
        $miningUpgradeLevelsFree = Array(200).fill(0);
    }
    if (ver <= 4) {
        $keyCraftMastery['energizedCrystal'] = [1,0,3]
        localStorage.clear('miningUpgradeLevelsBought')
        localStorage.clear('miningUpgradeLevelsFree')
    }
    if (ver <= 9) {
        $buttonUpgradeLevels = Array(200).fill(0)
        for (let x in $buttonUpgradeLevels) {
            if ($buttonUpgrades[x]) {
                if ($buttonUpgradeLevels[x] > $buttonUpgrades[x]['maxLevel'])
                    $buttonUpgradeLevels[x] = $buttonUpgrades[x]['maxLevel'];
                if (!$buttonUpgradeLevels[x]) $buttonUpgradeLevels[x] = 0;
            }
        }
    }
    if (ver <= 10) {
        if ($wallet['crystals'] > 1e25) $wallet['crystals'] = 1e6;
    }
    if (ver < 13) {
    $keyCraftAmount['energizedCrystal'] = 0
    $keyCraftMastery = {
        energizedCrystal: [1,0,3],
        key3: [1, 0, 10],
        key4: [1, 0, 10],
        key5: [1, 0, 10],
        beacons: [1 ,0, 10],
        } 
    } 
    if (ver < 14) {
        for (let i = 2; i < $enchantUpgrades.length; i++) {
            $activityLogShow[$enchantUpgrades[i]['name'].toLowerCase()] = true;
        }
        $activityLogShow['crafting'] = true;
        $activityLogShow['mythical'] = true;
    }
    if (ver < 16) {
        $miningUpgradeLevels[6] = 0;
            $miningUpgradeLevelsBought[6] = 0;
            $miningUpgradeLevels[9] = 0;
            $miningUpgradeLevelsBought[9] = 0;
            $visibleTier = 1; 

            if ($miningUpgradeLevels[6] > 0) $visibleTier = 2;
            if ($miningUpgradeLevels[9] > 0) $visibleTier = 3;
    }
    if (ver < 17) {
        for (let i in $keysOpened) {
        if ($keysOpened[i] == Infinity || isNaN($keysOpened[i])) $keysOpened[i] = 0;
    }

    // REMOVE THIS TO TEST AND DEBUG
    if (isNaN($wallet['key1']) || $wallet['key1'] == Infinity) $wallet['key1'] = 0;
    if (isNaN($wallet['key2']) || $wallet['key2'] == Infinity) $wallet['key2'] = 0;
    if (isNaN($wallet['key3']) || $wallet['key3'] ==Infinity) $wallet['key3'] = 0;
    if (isNaN($wallet['key4']) || $wallet['key4'] == Infinity) $wallet['key4'] = 0;
    if (isNaN($wallet['key5']) || $wallet['key5'] == Infinity) $wallet['key5'] = 0;

    for (let i = 0; i < 200; i++) {
        if (!$miningUpgradeLevelsBought[i]) $miningUpgradeLevelsBought[i] = 0;
        if (!$miningUpgradeLevels[i]) $miningUpgradeLevels[i] = 0;
        }
    }



    $saveVersion = LATEST_VER;

    save();
}


const tabHelpText = {
    mining: "Each time the red progress bar fills up, gain gems and have a chance for additional drops. Use your currencies on upgrades to your mining rig.",
    keys: "Use your found keys here! You unlock more information on drops after receiving at least one of the respective item from the respective key.",
    beacons: "Allocate beacons into paths, leveling them up over time and gaining bonuses. Each color requires drastically more power than the previous one, so you'll need to work up to the later paths. \n You gain beacon power based on your beacon levels.",
    enchants: "Mine size and Mine quality affect many things, not just enchants! Make sure to check tooltips. \n When the enchant bar of each respective color fills, there's a chance for all enchants of the same color as the bar to fire (chance shown on tooltips), giving a very powerful bonus. Upgrade your enchants to increase the proc chance.",
    relocate: "Reset to gain fame. Fame can be spent on powerful mining upgrades and enchants. It's recommended for your first relocation to gain at least 25 fame, which should take about 1-2 hours. HINT: Are you stuck? Each fame multiplier is color-coded based on the resource it deals with. If you are struggling to increase fame gains, you may be able to increase a specific multiplier by checking the tab where that resource is generated/used.",
    button: "You'll have to figure this one out yourself."
}

async function loadFunc() {
    await load();
    setTimeout(() => {
        miningDropTable.updateTable();
    },250)
}

onMount(() => {
    loadFunc();
    setInterval(() => {
        if (AUTOSAVE) {
            save();
        }
    }, AUTOSAVE_INTERVAL);
    setInterval(() => {
        ct = Date.now();
    }, 1000)

    // use for visual refreshing or testing, not for any game-related logic
    setInterval(() => {
        for (let tab of ref.tabs) {
            tabsUnlocked[tab] = (!tabUnlockCriteria[tab] ? false : tabUnlockCriteria[tab]());
        }
        if ($flags['relocateNavBack']) {
            tab = 'mining';
            $flags['relocateNavBack'] = false;
        }
    }, 1163); // prime number to avoid sync with other intervals
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
    :global(.game-btn-toggleon) {
        border: 1px solid #d9d9d9;
        color: #d9d9d9;
        background-color: #226323;
        cursor: pointer;
    }  
    :global(.game-btn-toggleoff) {
        border: 1px solid #d9d9d9;
        color: #d9d9d9;
        background-color: #b23939;
        cursor: pointer;
    }  
    :global(.game-btn) {
        border: 1px solid #d9d9d9;
        color: #d9d9d9;
        text-align: center;
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
    :global(.game-btn-nocolor) {
        border: 1px solid;
        cursor: pointer;
    }
    :global(.game-btn-encht1) {
        border: 1px solid #c4b5fd;
        color: #c4b5fd;
        cursor: pointer;
    }
    :global(.game-btn-encht1-noafford) {
        border: 1px solid #625b7e;
        color: #625b7e;
        cursor: pointer;
    }
    :global(.game-btn-fame) {
        border: 1px solid #fb923c;
        color: #fb923c;
        cursor: pointer;
    }
    :global(.game-btn-fame:hover) {
        background-color: #483626;
        cursor: pointer;
    }
    :global(.game-btn-fame-noafford) {
        border: 1px solid #6c3f00;
        color: #6c3f00;
        cursor: pointer;
    }
    :global(.game-btn-crystal) {
        border: 1px solid #a5b4fc;
        color: #a5b4fc;
        cursor: pointer;
    }
    :global(.game-btn-crystal:hover) {
        color: #a5b4fc;
        background-color: #333851;
        cursor: pointer;
    }
    :global(.game-btn-crystal-noafford) {
        border: 1px solid #3c4262;
        color: #3c4262;
        cursor: pointer;
    }

    :global(.game-btn-sigil) {
        border: 1px solid #c026d3;
        color: #c026d3;
        cursor: pointer;
    }
    :global(.game-btn-sigil:hover) {
        background-color: #d8b4fe;
        cursor: pointer;
    }
    :global(.game-btn-sigil-noafford) {
        border: 1px solid #5a044e;
        color: #5a044e;
        cursor: pointer;
    }





    :global(.game-btn-automation-maxed) {
        border: 1px solid #ececec;
        background-color: #ececec;
        color: #2f2f2f;
        cursor: pointer;
    }
    :global(.control-btn) {
        border: 1px solid #969696;
        color: #969696;
        cursor: pointer;
    }
    :global(.control-btn:hover) {
        border: 1px solid #ffffff;
        background-color: #474646;
        color: #ffffff;
    }
    :global(.control-btn-selected) {
        border: 1px solid #eeeeee;
        color: #eeeeee;
        cursor: pointer;
    }
    :global(.control-btn-nounlock) {
        border: 1px solid #555555;
        color: #555555;
        cursor: pointer;
    }
    :global(.tooltip) {
      @apply invisible absolute;
      display: none;
    }
    :global(.has-tooltip:hover .tooltip) {
      @apply visible z-50;
      display: block;
    }  
</style>
