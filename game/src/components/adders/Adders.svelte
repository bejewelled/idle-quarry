
<script>
// @ts-nocheck

// invisible component handling addition math


import Decimal from 'break_infinity.js'
import {progressThreshold, progressPerTick, miningUpgrades, antiFlickerFlags, 
    gemGainFlavorText, gemProgressFlavorText, gemProgressFlavorNextUpdate} from '../../data/mining' 
import {keyGainFlavorText, keyProgressFlavorText, keyProgressFlavorNextUpdate} from '../../data/keys'
import {progress, miningUpgradeLevels, wallet, miningDropTable, 
    unlockedRes, settings, progressThisSecond} from '../../data/player'

import { onMount } from 'svelte'

const d = (i) => {
    return new Decimal(i);
}
const f = (n, pl = 0) => {
        if (n < 1e9) return n.toFixed(pl).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        else return n.toExponential(3).toString().replace('+', '');
    }   

const fp = (n, pl = 3, subOne = false) => {
    if (subOne) n -= 1;
    if (n < 1e9) return (n*100).toFixed(pl).toLocaleString() + "%";
    else return (n*100).toExponential(pl).toString().replace('+', '') + "%";
}
    
const fl = (i) => Math.floor(i);
const ce = (i) => Math.ceil(i);
const ro = (i) => Math.round(i);
const log = (i) => Math.log(i);


let gameSpeed = 1;
const calcGameSpeed = () => {
    return 1;
}

const UPDATE_SPEED = $settings['UPDATE_SPEED']; // ms per tick
let last, dt;
onMount(() => {
    last = Date.now();
    let dt;
    const mainLoop = setInterval(() => {
        dt = (Date.now() - last) / UPDATE_SPEED;
        addProgress(dt);
        last = Date.now();
    }, UPDATE_SPEED)
    // slowLoop updates at random intervals, do NOT add time-dependent items here!
    const slowLoop = setInterval(() => {
        for (let [k,v] of Object.entries($wallet)) {
            if (v > 0 && !$unlockedRes.has(k)) $unlockedRes.add(k);
        }
        
    },773 + Math.random()*227)
    const progressUpdater = setInterval(() => {
        updateProgressThisSecond(dt);
    }, 1031) // set intervals to prime numbers to avoid sync
})

const PROGRESS_BASE = 1;

function updateProgressThisSecond(delta) {

    const progGems = PROGRESS_BASE * delta * $miningUpgrades[0]['formula']($miningUpgradeLevels[0]);
    $progressThisSecond['gems'] = progGems;
    const progKey1 = ($miningUpgradeLevels[3] > 0 ?
    PROGRESS_BASE * delta * $miningUpgrades[3]['formula']($miningUpgradeLevels[3]) : 0);
    $progressThisSecond['key1'] = progKey1;
}

let progressGain = 0;
function addProgress(delta) {
    const gemAt = $progressThreshold['gems'];
    const keyAt = [
    $progressThreshold['key1'], 
    $progressThreshold['key2'], 
    $progressThreshold['key3'],
    $progressThreshold['key4'],
    $progressThreshold['key5']
    ];

    for (let [k,v] of Object.entries($progressThisSecond)) {
        $progress[k] += v;
    }
    if ($progress['gems'] >= gemAt) {
        addGems(Math.floor($progress['gems'] / gemAt));
        dropRoll(Math.floor($progress['gems'] / gemAt));
        $progress['gems'] %= gemAt;
    }
    // add keys
    if ($progress['key1'] >= keyAt[0]) {
        const KEY1_BASE = 10;
        const key1Gain = KEY1_BASE * $miningUpgrades[4]['formula']($miningUpgradeLevels[4]);
        $wallet['key1'] = ($wallet['key1'] || 0) + key1Gain * Math.floor($progress['key1'] / keyAt[0]);
        $progress['key1'] %= keyAt[0];
        $keyGainFlavorText['key1'] = key1Gain;
    }
}

/** 
 * @param n - number of times to add gems
 */
function addGems(n) {
    const GEM_BASE = 100;
    const gemGain = n*(GEM_BASE + $miningUpgrades[1]['formula']($miningUpgradeLevels[1]));
    $gemGainFlavorText = gemGain;
    $wallet['gems'] += gemGain;
}

function dropRoll(n) {
    let rewards = {}
    for (let [item, vals] of Object.entries($miningDropTable)) {
        if (n > (1 / vals[0])) {
            const stdev= Math.sqrt(n*vals[0]*(1-vals[0]));
            const val = Array.from({length: Math.floor(Math.sqrt(amt))}, 
            () => Math.floor(vals[1] + Math.random()*(vals[2]-vals[1])));
            const c = (Math.random()*2.83)+0.01;
            const numWins = vals[0]*amt +
            Math.max(((Math.random() > 0.5 ? 1 : -1) * Math.pow(c/(c-5), 6)),0);

            // monte carlo value selector
            const rewardVal = (val[Math.floor(Math.random()*val.length)] + 
            val[Math.floor(Math.random()*val.length)] + 
            val[Math.floor(Math.random()*val.length)]) / 3

            console.log(val);
            rewards[item] = (rewards[item] || 0) + numWins*rewardVal;
        } else if ((Math.random() / n) < vals[0]) {
            const valGain = vals[1] + Math.random()*(vals[2]-vals[1]);
            
            rewards[item] = (rewards[item] || 0) + valGain;
        }
    }

    for (let [item, val] of Object.entries(rewards)) {
        $wallet[item] = ($wallet[item] || 0) + val;
    }
}
</script>