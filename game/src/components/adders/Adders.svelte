
<script>
// @ts-nocheck

// invisible component handling addition math


import Decimal from 'break_infinity.js'
import {progressThreshold, progressPerTick, miningUpgrades, antiFlickerFlags, 
    gemGainFlavorText, gemProgressFlavorText, gemProgressFlavorNextUpdate} from '../../data/mining' 
import {keyGainFlavorText, keyProgressFlavorText, keyProgressFlavorNextUpdate} from '../../data/keys'
import {progress, miningUpgradeLevels, wallet, miningDropTable, 
    unlockedRes, settings, progressThisTick, visibleTier,progressAverage,
    beaconActivations, beaconLevels, beaconProgress, resources, beaconUpgradeLevels} from '../../data/player'
import {beaconFormulas, beaconBonuses, beaconNextReqs, beaconNums, beaconUpgrades} from '../../data/beacons'
import ref from '../../calcs/ref'
import formula from '../../calcs/formula'

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

let lastDropTableUpdate = Date.now();

const UPDATE_SPEED = $settings['UPDATE_SPEED']; // ms per tick
let last, dt;
onMount(() => {
    updateBeaconBonuses();
    last = Date.now();
    let dt;
    const mainLoop = setInterval(() => {
        dt = (Date.now() - last) / UPDATE_SPEED;
        addProgress(dt);
        addBeaconProgress(dt);
        last = Date.now();
    }, UPDATE_SPEED)
    // slowLoop updates at random intervals, do NOT add time-dependent items here!
    const slowLoop = setInterval(() => {
        for (let [k,v] of Object.entries($wallet)) {
            if (v > 0 && !$unlockedRes.has(k)) $unlockedRes.add(k);
        }
        
    },773 + Math.random()*227)
    const progressUpdater = setInterval(() => {
        updateprogressThisTick(dt);
    }, 191) // set intervals to prime numbers to avoid sync
})

const PROGRESS_BASE = 1;

function updateprogressThisTick(delta) {
    const progGems = PROGRESS_BASE
    * $miningUpgrades[0]['formula']($miningUpgradeLevels[0])
    * (Math.max(1,$beaconBonuses[1]));
    $progressAverage['gems'] = progGems;
    $progressThisTick['gems'] = progGems * delta;
    const progKey1 = ($miningUpgradeLevels[3] > 0 ?
    PROGRESS_BASE * $miningUpgrades[3]['formula']($miningUpgradeLevels[3]) : 0);
    $progressAverage['key1'] = progKey1;
    $progressThisTick['key1'] = progKey1 * delta;
}

let progressGain = 0;
function addProgress(delta) {
    addBeaconProgress(delta);
    const gemAt = $progressThreshold['gems'];
    const keyAt = [
    $progressThreshold['key1'], 
    $progressThreshold['key2'], 
    $progressThreshold['key3'],
    $progressThreshold['key4'],
    $progressThreshold['key5']
    ];

    for (let [k,v] of Object.entries($progressThisTick)) {
        $progress[k] += v;
    }
    if ($progress['gems'] >= gemAt) {
        addGems(Math.floor($progress['gems'] / gemAt));
        dropRoll(Math.floor($progress['gems'] / gemAt));
        $progress['gems'] %= gemAt;
    }
    // add keys
    if ($progress['key1'] >= keyAt[0]) {
       addKeys(Math.floor($progress['key1'] / keyAt[0]));
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

function addKeys(n) {
    const KEY1_BASE = 10;
        const key1Gain = KEY1_BASE * $miningUpgrades[4]['formula']($miningUpgradeLevels[4]);
        $wallet['key1'] = ($wallet['key1'] || 0) + key1Gain * n;
        $progress['key1'] %= keyAt[0];
        $keyGainFlavorText['key1'] = key1Gain;
    }

function dropRoll(n) {
    let rewards = {}
    for (let [item, vals] of Object.entries($miningDropTable)) {
        if ($visibleTier >= ref.dropTiers[item]) {
            if (n > (1 / vals[0])) {
                const stdev= Math.sqrt(n*vals[0]*(1-vals[0]));
                const val = Array.from({length: Math.floor(Math.sqrt(n))}, 
                () => Math.floor(vals[1] + Math.random()*(vals[2]-vals[1])));
                const c = (Math.random()*2.83)+0.01;
                const numWins = vals[0]*n +
                Math.max(((Math.random() > 0.5 ? 1 : -1) * Math.pow(c/(c-5), 6)),0);

                // monte carlo value selector
                const rewardVal = (val[Math.floor(Math.random()*val.length)] + 
                val[Math.floor(Math.random()*val.length)] + 
                val[Math.floor(Math.random()*val.length)]) / 3

                rewards[item] = (rewards[item] || 0) + numWins*rewardVal;
            } else if ((Math.random() / n) < vals[0]) {
                const valGain = vals[1] + Math.random()*(vals[2]-vals[1]);
                
                rewards[item] = (rewards[item] || 0) + valGain;
            }
        }
    }

    for (let [item, val] of Object.entries(rewards)) {
        $wallet[item] = ($wallet[item] || 0) + val;
    }
}

function addBeaconProgress(delta) {
    const progressGains = $beaconActivations.map((e) => e * delta * 
    $beaconUpgrades[0]['formula']($beaconUpgradeLevels[0]));
    // adds progressGains to progress
    $beaconProgress = $beaconProgress.map((e, i) => e + progressGains[i]);
    // check for levelups
    for (let i = 0; i < $beaconProgress.length; i++) {
        if ($beaconProgress[i] >= $beaconNextReqs[i]) {
            const numLevels = formula.maxNumGeom($beaconProgress[i], $beaconNextReqs[i], $beaconNums[i][1]);
            // subtract excess progress
            $beaconProgress[i] -= formula.gSum($beaconNextReqs[i], $beaconNums[i][1], numLevels);   
            // increase levels         
            $beaconLevels[i] += numLevels;
            // update formulas as needed
            $beaconBonuses[i] = $beaconFormulas[i]($beaconLevels[i]);
            // update next reqs
            $beaconNextReqs[i] = $beaconNums[i][0] * Math.pow($beaconNums[i][1],$beaconLevels[i]);
            if (Date.now() - lastDropTableUpdate > 1000) {
                lastDropTableUpdate = Date.now();
                miningDropTable.updateTable();
            }
        }
    }
    const maxLevel = Math.max(...$beaconLevels);
    // add beacon power, gain more power if all levels are nearly equal
    $resources['beaconPower'] = ($resources['beaconPower'] || 0) + 
    Math.log10($beaconLevels.reduce((s, c) => s+Math.pow(c/maxLevel+1, 4), 0)) * delta;

}

function updateBeaconBonuses() {
    for (let i = 0; i < $beaconLevels.length; i++) {   
        $beaconBonuses[i] = $beaconFormulas[i]($beaconLevels[i]);
    }
}
</script>