
<script>
// @ts-nocheck

// invisible component handling addition math


import Decimal from 'break_infinity.js'
import {progressThreshold, progressPerTick, miningUpgrades, antiFlickerFlags, 
    gemGainFlavorText, gemProgressFlavorText, gemProgressFlavorNextUpdate} from '../../data/mining' 
import {keyGainFlavorText, keyProgressFlavorText, keyProgressFlavorNextUpdate,
key1DropTable, key2DropTable, key3DropTable, key4DropTable, key5DropTable} from '../../data/keys'
import {progress, miningUpgradeLevels, wallet, miningDropTable, 
    unlockedRes, settings, progressThisTick, visibleTier,progressAverage,
    beaconActivations, beaconLevels, beaconProgress, resources, beaconUpgradeLevels} from '../../data/player'
import {beaconFormulas, beaconBonuses, beaconNextReqs, beaconNums, beaconUpgrades, beaconPowerFlavorText} from '../../data/beacons'
import {fameUpgrades, enchantThreshold, enchantProgress} from '../../data/fame'
import ref from '../../calcs/ref'
import formula from '../../calcs/formula'

import { onMount } from 'svelte'

const d = (i) => {
    return new Decimal(i);
}

const fExp = (n, pl = 3) => {
    return n.toExponential(pl).toString().replace('+', '');
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
let beaconCounter = 0;
onMount(() => {
    updateBeaconBonuses();
    last = Date.now();
    const mainLoop = setInterval(() => {
        dt = (Date.now() - last) / UPDATE_SPEED;
        addProgress(dt);
        if ($settings['activeTab'] !== 'beacons') {
            if (beaconCounter >= 10) {
                addBeaconProgress(dt*10);
                beaconCounter = 0;
            } else beaconCounter++;
        } else {
            addBeaconProgress(dt);
            beaconCounter++;
        }
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
    }, UPDATE_SPEED + Math.random() * 3) // set intervals to prime numbers to avoid sync
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

    const progKey2 = ($miningUpgradeLevels[4] > 0 ?
    PROGRESS_BASE * $miningUpgrades[4]['formula']($miningUpgradeLevels[4]) : 0);
    $progressAverage['key2'] = progKey2;
    $progressThisTick['key2'] = progKey2 * delta;

    // TODO change index when adding
    // const progKey3 = ($miningUpgradeLevels[5] > 0 ?
    // PROGRESS_BASE * $miningUpgrades[5]['formula']($miningUpgradeLevels[5]) : 0);
    // $progressAverage['key3'] = progKey3;
    // $progressThisTick['key3'] = progKey3 * delta;
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
        if (isNaN($progress[k])) $progress[k] = 0;
        $progress[k] += v;
    }

    if ($progress['gems'] >= gemAt) {
        // increase fame thresholds 
        // TODO: implement enchant proc method
        for (let [k,v] of Object.entries($enchantProgress)) {
            $enchantProgress[k] += 1;
            if ($enchantProgress[k] >= $enchantThreshold[k]) {
                procEnchants(Math.floor($enchantProgress[k] / $enchantThreshold[k]), k)
                $enchantProgress[k] %= $enchantThreshold[k];
            }
        }

        if ($progressThisTick['gems'] > gemAt*0.25) $antiFlickerFlags['gems'] = true;
        else if ($antiFlickerFlags['gems'] && $progressThisTick['gems'] < gemAt*0.025) {
            $antiFlickerFlags['gems'] = false;
        }
        addGems($progress['gems'] / gemAt, $progressAverage['gems']);
        dropRoll(Math.floor($progress['gems'] / gemAt));
        $progress['gems']  = 0;
    }
    // add keys
    if ($progress['key1'] >= keyAt[0]) {
       addKey1(Math.floor($progress['key1'] / keyAt[0]), keyAt);
    }
    if ($progress['key2'] >= keyAt[0]) {
       addKey2(Math.floor($progress['key2'] / keyAt[1]), keyAt);
    }

}

/** 
 * @param n - number of times to add gems
 */
let lastGemGainTextUpdate = Date.now();
function addGems(n, avgProgress) {
    const GEM_BASE = 1;
    const gemGain = (GEM_BASE + $miningUpgrades[1]['formula']($miningUpgradeLevels[1]))
    * ($miningUpgrades[8]['formula']($miningUpgradeLevels[8])
    * (Math.max(1,$beaconBonuses[3])));
    // update the flavor text if there is a minor change, otherwise don't
    if (Date.now() - lastGemGainTextUpdate > 1000) {
        $gemGainFlavorText = gemGain;
        lastGemGainTextUpdate = Date.now();
    }
    $wallet['gems'] += gemGain * n;
}

function addKey1(n, keyAt) {
    const KEY1_BASE = 10;
        const key1Gain = KEY1_BASE * $miningUpgrades[5]['formula']($miningUpgradeLevels[5]);
        $wallet['key1'] = ($wallet['key1'] || 0) + key1Gain * n;
        $progress['key1'] %= keyAt[0];
        $keyGainFlavorText['key1'] = key1Gain;
}

function addKey2(n, keyAt) {
    const KEY2_BASE = 3;
        const key2Gain = KEY2_BASE * $miningUpgrades[5]['formula']($miningUpgradeLevels[5]);
        $wallet['key2'] = ($wallet['key2'] || 0) + key2Gain * n;
        $progress['key2'] %= keyAt[1];
        $keyGainFlavorText['key2'] = key2Gain;
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
                Math.max(((Math.random() > 0.5 ? 1 : -1) * stdev * Math.pow(c/(c-5), 6)),0);

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

let locks = new Set(); // makes sure levelups don't repeat when leveling up from next function call
function addBeaconProgress(delta) {
    const progressGains = $beaconActivations.map((e) => e * delta
    * $beaconUpgrades[0]['formula']($beaconUpgradeLevels[0])
    * Math.max(1,$beaconUpgrades[2]['formula']($beaconUpgradeLevels[2])));
    // adds progressGains to progress
    $beaconProgress = $beaconProgress.map((e, i) => e + progressGains[i]);
    // check for levelups
    for (let i = 0; i < $beaconProgress.length; i++) {
        if (isNaN($beaconProgress[i])) $beaconProgress[i] = 0;
        if ($beaconProgress[i] >= $beaconNextReqs[i] && !locks.has(i)) {
            // console.log('LEVELUP!!!')
            locks.add(i);
            // console.log("LOCKS")
            // console.log(locks)
            const numLevels = Math.max(1,formula.maxNumGeom($beaconProgress[i], $beaconNextReqs[i], $beaconNums[i][1]));
            // subtract excess progress
            // console.log("PROG SUBTRACTED: " + formula.gSum($beaconNextReqs[i], $beaconNums[i][1], numLevels));
            $beaconProgress[i] -= Math.max($beaconNextReqs[i], 
            formula.gSum($beaconNextReqs[i], $beaconNums[i][1], numLevels));   
            // increase levels         
            $beaconLevels[i] += numLevels;
            // update formulas as needed
            $beaconBonuses[i] = $beaconFormulas[i]($beaconLevels[i]);
            // update next reqs
            $beaconNextReqs[i] = ($beaconNums[i][0] * $beaconLevels[i])
            * Math.pow($beaconNums[i][1],$beaconLevels[i]);
            if (Date.now() - lastDropTableUpdate > 1000) {
                lastDropTableUpdate = Date.now();
                miningDropTable.updateTable();
            }

            if ($beaconLevels[i] % 10 == 0) {
                $wallet['beacons'] = ($wallet['beacons'] || 0) + 
                ($beaconUpgrades[1]['formula']($beaconUpgradeLevels[1]) 
                * Math.log10($beaconLevels[i]+1));
            }
            locks.delete(i);
        }
    }
    const maxLevel = Math.max(...$beaconLevels);
    // add beacon power, gain more power if all levels are nearly equal
    // will always give at least 20% of potential gain
    const bpGain = Math.log10(1 + 
    $beaconLevels.reduce((s, c) => s+(c/50 * Math.max(0.2, Math.pow(c/maxLevel, 2)))), 0) * delta;
   
    $resources['beaconPower'] = ($resources['beaconPower'] || 0) + bpGain;
    $beaconPowerFlavorText = bpGain;
}

function updateBeaconBonuses() {
    for (let i = 0; i < $beaconLevels.length; i++) {   
        $beaconBonuses[i] = $beaconFormulas[i]($beaconLevels[i]);
    }
}

function procEnchants(n, tier) { /* TODO implement */ }


</script>