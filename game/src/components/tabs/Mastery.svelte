<div class='wrapper py-2'>

<div class='py-2'>
</div>

<div class='grid grid-cols-12'>
    <div class='col-span-12 text-white'>Mastery - Do nothing, get trophies (STILL WIP STAY TUNED)</div>
    <div class='col-span-12 text-white text-small'>Progress to Next Trophy - 
        <span class='text-orange-400'>{f($wallet['mastery'] || 0)} / {f($masteryNextReq)}</span> 
       <span class='tooltip-text'>[ <span class='font-bold text-white'>{calcTimeUntilNextTrophy()}</span> until next trophy ]
    </span> 
    </div>
    <div class='col-span-12 text-white text-small'>Your total trophies this ascension
        <span class='text-orange-400'>({f($wallet['totalTrophies'] || 0)})</span>
    {$wallet['totalTrophies'] == 1 ? 'is' : 'are'} producing <span class='{ref.colors['mist']}'>{f(formula.calcmistGainFromMastery(), 2)} mist per second.</span></div>

<div class='col-span-12'>
    <div class='mine-bar-wrapper align-middle'>
        <div class="w-full my-1 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 has-tooltip">
            <div class="bg-orange-400 h-2.5 rounded-full has-tooltip" 
            style="width: {nextTrophyBarWidth}">

        </div>
        </div>
    </div>
</div>
<div class='col-span-12 pb-3'></div>
<button class='col-span-4 text-small
{$settings['masteryUseLogScale'] ? 'game-btn-toggleon'
: 'game-btn'}' on:click={() => {toggleMasteryUseLogScale()}}>Use log scale for progress bars</button>
<div class='col-span-12 pb-2'></div>
    {#each Object.entries($masteryItemLevels) as m}
        {#if $wallet[m[0]]}
            <div class='col-span-1'>
                <span class='{ref.colors[m[0]]}'>{m[0]}</span>
            </div>
            <div class='col-span-1
            '>
                <span class='{ref.colors[m[0]]}'>🌟{f(m[1])}</span>
            </div>
            <div class='col-span-2 text-left pr-2 text-med'>
                <span class='text-orange-400'>[ x{f(formula.calcMasteryGainMulti($masteryItemLevels[m[0]]), 2)} progress]</span>
            </div>
            <div class='col-span-6 grid grid-rows-2 mt-1 mx-5'>
                <div class='bar-wrapper align-middle'>
                    <div class="w-full my-1 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 has-tooltip">
                        <div class="bg-{ref.colors[m[0]].substring(5)} h-2.5 rounded-full has-tooltip" 
                        style="width: {masteryBarWidth()[m[0]] || '0%'}">
            
                    </div>
                    </div>
                </div>            
            </div>
            <div class='col-span-2 pl-3 text-small tooltip-text mt-1 text-left'>
                <span class='tooltip-text'>target: {f($masteryItemReqs[m[0]])}</span>
            </div>
        {/if}
    {/each}
</div>
</div>

<div class='pb-16 pt-8 tooltip-text text-center w-full italic'>
    Mastery levels are never reset. <br/>
    Each Mastery Level increases the speed at which you gain trophies. <br/>
    For some reason, certain colors refuse to render in the progress bars, ONLY on this particular tab. (???)
    I don't get it. Anyway, some bars will be blank until I figure it out.
</div>


<script lang='ts'>
	import { masteryItemLevels} from './../../data/player.ts';
	import { masteryNextReq, masteryItemReqs } from '../../data/mastery.js';
 //@ts-nocheck
 import { onMount, onDestroy } from 'svelte';
import {progress, wallet, miningDropTable, miningUpgradeLevels, 
    settings, visibleTier, progressThisTick, progressAverage,
    beaconActivations, beaconLevels, beaconProgress, resources,
     keysOpened, unlockedRes, beaconUpgradeLevels, flags, 
     enchantUpgradeLevels, enchantProgress, automationItemsUnlocked,
    mineLevel, buttonUpgradeLevels, stats, keyCraftAmount,
miningUpgradeLevelsBought, miningUpgradeLevelsFree,
challengeActive, challengesCompleted, miningUpgradeLevelsBoughtTemp,
miningUpgradeLevelsFreeTemp, miningUpgradeLevelsTemp} from '../../data/player.js';
import {buttonUpgrades} from '../../data/button.js';
import {progressThreshold, progressPerTick, miningUpgrades,
gemGainFlavorText, gemProgressFlavorText } from '../../data/mining.js';
import {keyGainFlavorText} from '../../data/keys.js';
import {beaconPower, beaconBonuses,
    beaconFormulas, beaconNums, beaconNextReqs, beaconSpendAmt ,
beaconUpgrades, beaconNameText, baseBeaconNextReqs} from '../../data/beacons.js';
import {enchantUpgrades, enchantThreshold} from '../../data/fame.js';
import ref from '../../calcs/ref.js'
import formula from '../../calcs/formula.js';

//@ts-nocheck

$: nextTrophyBarWidth = `${Math.min(1,$wallet['mastery'] / $masteryNextReq) * 100}%`;

$: masteryBarWidth = () => {
    const w = {}
    for (let i of Object.keys($masteryItemLevels)) {
        if ($settings['masteryUseLogScale'])
        w[i] = (100 * (Math.log10($wallet[i]) || 0) / Math.log10($masteryItemReqs[i])) + "%"
        else w[i] = (100 * ($wallet[i] || 0) / $masteryItemReqs[i]) + "%"
    }
    return w;
}

onMount(() => {
    // @ts-ignore
    console.log($masteryNextReq)
});


// this assumes 50 ticks per second
$: calcTimeUntilNextTrophy = () => {
    const diff = $masteryNextReq - ($wallet['mastery'] || 0);
    const seconds = (diff / (50 * formula.calcMasteryGainPerTick()));
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    let text = ''
    if (seconds == Infinity) return 'inf';
    if (days > 1) text += f(Math.floor(days)) + 'd ';
    if (hours > 1) text += f(Math.floor(hours % 24)) + 'h ';
    if (minutes > 1) text += f(Math.floor(minutes % 60)) + 'm ';
    if (seconds > 1) text += f(Math.floor(seconds % 60)) + 's ';
    return text;
}

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
function toggleMasteryUseLogScale() {

    $settings['masteryUseLogScale'] = !($settings['masteryUseLogScale'] || false);
}
</script>

<style>
.bg-yellow-500 {
    --tw-bg-opacity: 1;
    background-color: rgb(234 179 8 / var(--tw-bg-opacity))
}

.bg-neutral-400 {
    --tw-bg-opacity: 1;
    background-color: rgb(163 163 163 / var(--tw-bg-opacity))
}

.bg-teal-400 {
    --tw-bg-opacity: 1;
    background-color: rgb(45 212 191 / var(--tw-bg-opacity))
}
.bg-slate-200 {
    --tw-bg-opacity: 1;
    background-color: rgb(226 232 240 / var(--tw-bg-opacity))
}
</style>