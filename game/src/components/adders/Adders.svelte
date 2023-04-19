
<script>
// @ts-nocheck

// invisible component handling addition math


import Decimal from 'break_infinity.js'
import {progressThreshold, progressPerTick, miningUpgrades, antiFlickerFlags} from '../../data/mining' 
import {progress, miningUpgradeLevels, wallet, miningDropTable, unlockedRes} from '../../data/player'

import { onMount } from 'svelte'

const d = (i) => {
    return new Decimal(i);
}

const fl = (i) => Math.floor(i);
const ce = (i) => Math.ceil(i);
const ro = (i) => Math.round(i);
const log = (i) => Math.log(i);


let gameSpeed = 1;
const calcGameSpeed = () => {
    return 1;
}

const UPDATE_SPEED = 50; // ms per tick
let last, dt;
onMount(() => {
    last = Date.now();
    const mainLoop = setInterval(() => {
        const dt = (Date.now() - last) / 50;
        addProgress(dt);
        last = Date.now();
    }, 1000/UPDATE_SPEED)
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
    const PROGRESS_BASE = 10 * delta;
    if (true) {
        let progGems = (PROGRESS_BASE * $miningUpgrades[0]['formula']($miningUpgradeLevels[0]));
        $progress['gems'] += progGems;
        if (progGems > gemAt*0.33) $antiFlickerFlags['gems'] = true;
    }
    if ($miningUpgradeLevels[3] > 0) {
        let progKey1 = PROGRESS_BASE *
        $miningUpgrades[3]['formula']($miningUpgradeLevels[3]);
        $progress['key1'] += progKey1;
        if (progKey1 > key1At*0.1) $antiFlickerFlags['key1'] = true;
    }
    if ($progress['gems'] >= gemAt) {
        addGems(Math.floor($progress['gems'] / gemAt));
        dropRoll(Math.floor($progress['gems'] / gemAt));
        $progress['gems'] %= gemAt;
    }
    if ($progress['key1'] >= key1At) {
        const KEY1_BASE = 10;
        const key1Gain = KEY1_BASE * $miningUpgrades[4]['formula']($miningUpgradeLevels[4])
        $wallet['key1'] = ($wallet['key1'] || 0) + key1Gain * Math.floor($progress['key1'] / key1At);
        $progress['key1'] %= key1At;
    }
}

/** 
 * @param n - number of times to add gems
 */
function addGems(n) {
    $wallet['gems'] += 1 + 
    n * $miningUpgrades[1]['formula']($miningUpgradeLevels[1]);
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