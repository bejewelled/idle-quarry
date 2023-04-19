
<script>
// @ts-nocheck

// invisible component handling addition math


import Decimal from 'break_infinity.js'
import {progressThreshold, progressPerTick, miningUpgrades, antiFlickerFlags, 
    gemGainFlavorText, gemProgressFlavorText, gemProgressFlavorNextUpdate} from '../../data/mining' 
import {keyGainFlavorText} from '../../data/keys'
import {progress, miningUpgradeLevels, wallet, miningDropTable, unlockedRes, settings} from '../../data/player'

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
    const mainLoop = setInterval(() => {
        const dt = (Date.now() - last) / UPDATE_SPEED;
        addProgress(dt);
        last = Date.now();
    }, UPDATE_SPEED)
    // slowLoop updates at random intervals, do NOT add time-dependent items here!
    const slowLoop = setInterval(() => {
        for (let [k,v] of Object.entries($wallet)) {
            if (v > 0 && !$unlockedRes.has(k)) $unlockedRes.add(k);
        }
    },773 + Math.random()*227)
})

let progressGain = 0;
function addProgress(delta) {
    const gemAt = $progressThreshold['gems'];
    const key1At = $progressThreshold['key1'];
    const PROGRESS_BASE = 1 * delta;
    if (true) {
        const progGems = Math.round((PROGRESS_BASE * $miningUpgrades[0]['formula']($miningUpgradeLevels[0]))*1000) / 1000;
        $progress['gems'] += progGems;
        if (progGems > gemAt*0.2) $antiFlickerFlags['gems'] = true;
        else $antiFlickerFlags['gems'] = false;
        if (Date.now() >= $gemProgressFlavorNextUpdate) {
            $gemProgressFlavorText = progGems;
            $gemProgressFlavorNextUpdate = Date.now() + (1003+Math.random() * 8);
        }
    }
    if ($miningUpgradeLevels[3] > 0) {
        let progKey1 = PROGRESS_BASE *
        $miningUpgrades[3]['formula']($miningUpgradeLevels[3]);
        $progress['key1'] += progKey1;
        if (progKey1 > key1At*0.1) $antiFlickerFlags['key1'] = true;
        else $antiFlickerFlags['key1'] = false;       
    }
    if ($progress['gems'] >= gemAt) {
        addGems(Math.floor($progress['gems'] / gemAt));
        dropRoll(Math.floor($progress['gems'] / gemAt));
        $progress['gems'] %= gemAt;
    }
    // add keys
    if ($progress['key1'] >= key1At) {
        const KEY1_BASE = 10;
        const key1Gain = KEY1_BASE * $miningUpgrades[4]['formula']($miningUpgradeLevels[4]);
        $wallet['key1'] = ($wallet['key1'] || 0) + key1Gain * Math.floor($progress['key1'] / key1At);
        $progress['key1'] %= key1At;
        $keyGainFlavorText['key1'] = key1Gain;
    }
}

/** 
 * @param n - number of times to add gems
 */
function addGems(n) {
    const GEM_BASE = 1;
    const gemGain = n*(GEM_BASE + $miningUpgrades[1]['formula']($miningUpgradeLevels[1]));
    $gemGainFlavorText = gemGain;
    $wallet['gems'] += gemGain;
}

function dropRoll(n) {
    for (let [item, val] of Object.entries($miningDropTable)) {
        if ((Math.random() / n) < val[0]) {
            console.log(val[1])
            
            $wallet[item] = ($wallet[item] || 0) + val[1];
        }
    }
}
</script>