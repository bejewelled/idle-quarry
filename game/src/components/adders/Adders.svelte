
<script>
// @ts-nocheck

// invisible component handling addition math


import Decimal from 'break_infinity.js'
import {progressThreshold, progressPerTick, miningUpgrades, 
    gemGainFlavorText, gemProgressFlavorText, gemProgressFlavorNextUpdate} from '../../data/mining' 
import {keyGainFlavorText, keyProgressFlavorText, keyProgressFlavorNextUpdate,
key1DropTable, key2DropTable, key3DropTable, key4DropTable, key5DropTable,
keyCrafts, keyUpgrades} from '../../data/keys'
import {progress, miningUpgradeLevels, wallet, miningDropTable, 
    unlockedRes, settings, progressThisTick, visibleTier,progressAverage,
    beaconActivations, beaconLevels, beaconProgress, resources, 
    beaconUpgradeLevels, enchantProgress, enchantUpgradeLevels, 
    automationItemsUnlocked, activityLog, mineLevel, 
    buttonStats, buttonUpgradeLevels, keyCraftMastery, 
    keyCraftTimes, keyCraftAmount, antiFlickerFlags, 
    miningUpgradeLevelsBought, miningUpgradeLevelsFree, 
    activityLogShow, challengeActive,
    challengesCompleted, challengeProgress,
    challenge3Multi} from '../../data/player'
import {buttonUpgrades} from '../../data/button'
import {beaconFormulas, beaconBonuses, beaconNextReqs, 
    beaconNums, beaconUpgrades, beaconPowerFlavorText, beaconNameText} from '../../data/beacons'
import {challengeGoals} from '../../data/challenges'
import {enchantUpgrades, enchantThreshold} from '../../data/fame'
import {allMultipliers} from '../../data/artifacts'
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

let i = 0;
function addToActivityLog(text, color, showParam) {
    if (!$activityLogShow[showParam]) return;
    const item = [text, color]
    $activityLog = [...$activityLog, item]
    if ($activityLog.length > 100) $activityLog.shift();
}


let lastDropTableUpdate = Date.now();

const UPDATE_SPEED = $settings['UPDATE_SPEED']; // ms per tick
let last, dt;
let beaconUpdateCounter = 0;
onMount(() => {
    updateBeaconBonuses();
    last = Date.now();
    const mainLoop = setInterval(() => {
        dt = (Date.now() - last) / UPDATE_SPEED;
        addProgress(dt);
        updateMiningLevel();
        checkForKeyCraftCompletion();
        checkForChallengeCompletion();
        // out of focus - update more slowly to conserve resources
        if ($settings['activeTab'] !== 'beacons') {
            if (beaconUpdateCounter >= 10) {
                addBeaconProgress(dt*10, true);
                beaconUpdateCounter = 0;
            } else beaconUpdateCounter++;
        } else {
            addBeaconProgress(dt);
            beaconUpdateCounter++;
        }
        if ($automationItemsUnlocked['beaconizer']) 
            $wallet['beacons'] = ($wallet['beacons'] || 0) + 50*(UPDATE_SPEED*dt / 1000);
        
        
        
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

function updateMiningLevel() {
    if ($mineLevel['xp'] >= $mineLevel['xpNextReq']) {
        $mineLevel['xp'] -= $mineLevel['xpNextReq'];
        $mineLevel['level']++;
        $mineLevel['xpNextReq'] = 500*$mineLevel['level'] * Math.pow(1.25, $mineLevel['level']);
    }
}

const PROGRESS_BASE = 1;
let progressBonusMulti = 1;


function updateprogressThisTick(delta) {
    if (!($challengeActive === 3)) $challenge3Multi = 1;

    let progressMultiAll = $allMultipliers['gems']['formula']($wallet['artifacts'] || 0)

    let challengeMultiplier = 1;
    let challengeExponent = 1;
    if ($challengeActive === 1) {
        challengeMultiplier = (0.25 / (1+$challengesCompleted[0]));
        challengeExponent = Math.max(0.15, 0.38-$challengesCompleted[0]);
    }

    const progGems = Math.pow(PROGRESS_BASE
    * $miningUpgrades[0]['formula']($miningUpgradeLevels[0])
    * (Math.max(1,$beaconBonuses[1]))
    * progressBonusMulti
    * $challenge3Multi
    * challengeMultiplier
    * progressMultiAll
    , challengeExponent);
    $progressAverage['gems'] = progGems;
    $progressThisTick['gems'] = progGems * delta;

    
    const progKey1 = Math.pow(($miningUpgradeLevels[3] > 0 ?
    PROGRESS_BASE * $miningUpgrades[3]['formula']($miningUpgradeLevels[3]) : 0)
    * $miningUpgrades[26]['formula']($miningUpgradeLevels[26])
    * $beaconBonuses[5]
    * progressBonusMulti
    * $challenge3Multi
    * progressMultiAll
    * challengeMultiplier, challengeExponent);
    $progressAverage['key1'] = progKey1;
    $progressThisTick['key1'] = progKey1 * delta;

    const progKey2 = Math.pow(($miningUpgradeLevels[4] > 0 ?
    PROGRESS_BASE * $miningUpgrades[4]['formula']($miningUpgradeLevels[4]) : 0)
    * $miningUpgrades[26]['formula']($miningUpgradeLevels[26])
    * $beaconBonuses[5]
    * progressBonusMulti
    * $challenge3Multi
    * progressMultiAll
    * challengeMultiplier, challengeExponent);

    $progressAverage['key2'] = progKey2;
    $progressThisTick['key2'] = progKey2 * delta;

    const progKey3 = Math.pow(($miningUpgradeLevels[18] > 0 ?
    PROGRESS_BASE * $miningUpgrades[18]['formula']($miningUpgradeLevels[18]) : 0)
    * $miningUpgrades[26]['formula']($miningUpgradeLevels[26])
    * $beaconBonuses[5]
    * progressBonusMulti
    * $challenge3Multi
    * progressMultiAll
    * challengeMultiplier, challengeExponent);

    $progressAverage['key3'] = progKey3;
    $progressThisTick['key3'] = progKey3 * delta;

    // TODO change index when adding
    // const progKey3 = ($miningUpgradeLevels[5] > 0 ?
    // PROGRESS_BASE * $miningUpgrades[5]['formula']($miningUpgradeLevels[5]) : 0);
    // $progressAverage['key3'] = progKey3;
    // $progressThisTick['key3'] = progKey3 * delta;
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

    for (let [k,v] of Object.entries($progressThisTick)) {
        if (isNaN($progress[k])) $progress[k] = 0;
        $progress[k] += v;
    }

    if ($progress['gems'] >= gemAt) {
        // increase fame thresholds 
        // TODO: implement enchant proc method
        for (let [k,v] of Object.entries($enchantProgress)) {
            $enchantProgress[k] += Math.floor($progress['gems']/gemAt);
            if ($enchantProgress[k] >= $enchantThreshold[k]) {
                procEnchants(Math.floor($enchantProgress[k] / $enchantThreshold[k]), k)
                $enchantProgress[k] %= $enchantThreshold[k];
            }
        }

       
        addGems($progress['gems'] / gemAt, $progressAverage['gems']);
        dropRoll(Math.floor($progress['gems'] / gemAt));

        $mineLevel['xp'] += $progress['gems'] / gemAt, $progressAverage['gems'];
        $progress['gems'] = 0;
    }
    // add keys
    if ($progress['key1'] >= keyAt[0]) {
       addKey1(Math.floor($progress['key1'] / keyAt[0]), keyAt);
    }
    if ($progress['key2'] >= keyAt[1]) {
       addKey2(Math.floor($progress['key2'] / keyAt[1]), keyAt);

    }
    if ($progress['key3'] >= keyAt[2]) {
       addKey3(Math.floor($progress['key3'] / keyAt[2]), keyAt);

    }

    // add warp for being in a challenge
    if ($challengeActive !== 0 && $challengeActive !== 4) {
        $wallet['warp'] = ($wallet['warp'] || 0) + Math.log($progress['gems'] + 1)*(UPDATE_SPEED/1000)
    }

}

/** 
 * @param n - number of times to add gems
 */
let lastGemGainTextUpdate = Date.now();
function addGems(n, avgProgress) {
    if ($challengeActive === 3) {
        $challenge3Multi *= 0.999 - ($challengesCompleted[2]*0.001);
    }

    const GEM_BASE = 1;
    const gemGain = (GEM_BASE + $miningUpgrades[1]['formula']($miningUpgradeLevels[1]))
    * ($miningUpgrades[8]['formula']($miningUpgradeLevels[8]))
    * (Math.max(1,$beaconBonuses[3]))
    * (Math.max(1,$miningUpgrades[10]['formula']($miningUpgradeLevels[10])))
    * (Math.max(1,$miningUpgrades[20]['formula']($miningUpgradeLevels[20])))
    * (Math.max(1,$miningUpgrades[25]['formula']($miningUpgradeLevels[25])))
    * (Math.max(1,$allMultipliers['gems']['formula']($wallet['artifacts'] || 0)))
    * $buttonStats['hardenedBonus'];
    // update the flavor text if there is a minor change, otherwise don't
    if (Date.now() - lastGemGainTextUpdate > 1000) {
        $gemGainFlavorText = gemGain;
        lastGemGainTextUpdate = Date.now();
    }
    $wallet['gems'] += gemGain * n;

    // add chance to get fame

    if ($challengeActive !== 0 && dt < 1000) {
        $wallet['challengePoints'] = ($wallet['challengePoints'] || 0) 
        + formula.calcChallengePointGain(gemGain*n, 'gems');
    }

}

function addKey1(n, keyAt) {
    const KEY1_BASE = 4;
        const key1Gain = KEY1_BASE 
        * $miningUpgrades[5]['formula']($miningUpgradeLevels[5])
        * $miningUpgrades[26]['formula']($miningUpgradeLevels[26]);
        
        $wallet['key1'] = ($wallet['key1'] || 0) + key1Gain * n;
        $progress['key1'] %= keyAt[0];
        $keyGainFlavorText['key1'] = key1Gain;
        if ($challengeActive !== 0  && dt < 1000) {
            $wallet['challengePoints'] = ($wallet['challengePoints'] || 0) 
            + formula.calcChallengePointGain(key1Gain*n, 'key1');
        }
}

function addKey2(n, keyAt) {
    const KEY2_BASE = 1;
        const key2Gain = KEY2_BASE 
        * $miningUpgrades[5]['formula']($miningUpgradeLevels[5])
        * $miningUpgrades[26]['formula']($miningUpgradeLevels[26]);
         
        $wallet['key2'] = ($wallet['key2'] || 0) + key2Gain * n;
        $progress['key2'] %= keyAt[1];
        $keyGainFlavorText['key2'] = key2Gain;
        if ($challengeActive !== 0  && dt < 1000) {
            $wallet['challengePoints'] = ($wallet['challengePoints'] || 0) 
            + formula.calcChallengePointGain(key2Gain*n, 'key2');
        }
}

function addKey3(n, keyAt) {
    const KEY3_BASE = 1;
        const key3Gain = KEY3_BASE 
        * $miningUpgrades[5]['formula']($miningUpgradeLevels[5])
        * $miningUpgrades[26]['formula']($miningUpgradeLevels[26]);
         
        $wallet['key3'] = ($wallet['key3'] || 0) + key3Gain * n;
        $progress['key3'] %= keyAt[2];
        $keyGainFlavorText['key3'] = key3Gain;
        if ($challengeActive !== 0  && dt < 1000) {
            $wallet['challengePoints'] = ($wallet['challengePoints'] || 0) 
            + formula.calcChallengePointGain(key3Gain*n, 'key3');
        }
}

function dropRoll(n) {
    let rewards = {}
    for (let [item, vals] of Object.entries($miningDropTable)) {
        if ($visibleTier >= ref.dropTiers[item]) {
            if (vals[0] >= 1) {
                rewards[item] = (rewards[item] || 0) 
                + vals[1]+(Math.random() * (vals[2] - vals[1]));
                continue;
            } else if (n > (1 / vals[0])) {
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

function checkForKeyCraftCompletion() {
    for (let [i, val] of $keyCrafts.entries()) {
        const item = val['item'];
        if (!$keyCraftTimes[item]) {
            $keyCraftTimes[item] = [-1, -1]; 
            $keyCraftAmount[item] = 0
            $keyCraftMastery[item] = [1,0,10]
            continue;
        }
        const finish = $keyCraftTimes[item][1];
        if (Date.now() > finish && finish != -1) {
            $keyCraftAmount[item]++;
            $wallet[item] = ($wallet[item] || 0) + formula.calcKeyCraftAmountGained(i);
            $keyCraftTimes[item][1] = -1;
    
            $keyCraftMastery[item][1] = parseInt(($keyCraftMastery[item][1] || 0)) + 1;
            if ($keyCraftMastery[item][1] >= $keyCraftMastery[item][2]) {
                $keyCraftMastery[item][0]++;
                $keyCraftMastery[item][1] = 0;

                // formula
                if (item == 'energizedCrystal') 
                $keyCraftMastery[item][2] = (3 * $keyCraftMastery[item][0]) * Math.pow(1.2,$keyCraftMastery[item][0])
                else $keyCraftMastery[item][2] = (25 * $keyCraftMastery[item][0]) * Math.pow(1.25,$keyCraftMastery[item][0])
                $keyCraftMastery[item][2] = Math.floor($keyCraftMastery[item][2]);
                addToActivityLog('[Keys] Crafting Mastery for ' + val['name'] + 'increased! ('
                +$keyCraftMastery[item][0] + ')', 
                'text-amber-400', 'crafting')
            }
        addToActivityLog('[Keys] Crafting complete: +' 
        + f(formula.calcKeyCraftAmountGained(i)) + ' ' + $keyCrafts[i]['name'], $keyCrafts[i]['style']||'text-white', 'crafting')
        }
        
    }
}

function checkForChallengeCompletion() {
    if ($wallet['challengePoints'] > ($challengeGoals[$challengeActive-1] || 1e300)) {
        $challengesCompleted[$challengeActive-1]++;
        $challengeActive = 0;
        $wallet['challengePoints'] = 0;
        $wallet['trophies'] = ($wallet['trophies'] || 0) + 1;
        challengeGoals.updateChallengeReqs();

    }
}




let locks = new Set(); // makes sure levelups don't repeat when leveling up from next function call
function addBeaconProgress(delta, isOffFocus = false) {
    if (isNaN($resources['beaconPower'])) $resources['beaconPower'] = 0;
    const progressGains = $beaconActivations.map((e) => e * delta
    * Math.max(1, $beaconUpgrades[0]['formula']($beaconUpgradeLevels[0]))
    * Math.max(1,$beaconUpgrades[2]['formula']($beaconUpgradeLevels[2]))
    * Math.max(1,$miningUpgrades[12]['formula']($miningUpgradeLevels[12]))
    * Math.max(1,$miningUpgrades[24]['formula']($miningUpgradeLevels[24])));
    // adds progressGains to progress
    const challenge4Multi = ($challengeActive == 4 ? 
    Math.max(1e-18, 1e-2 / (Math.pow(10, $challengesCompleted[3] || 0))) : 1);
    $beaconProgress = $beaconProgress.map((e, i) => e + Math.pow(progressGains[i],
    $challengeActive == 4 ? 
    Math.max(0.05, 0.9 - $challengesCompleted[3]*0.05) : 1) * challenge4Multi);
    // check for levelups
    for (let i = 0; i < 10; i++) {
        if (isNaN($beaconProgress[i])) $beaconProgress[i] = 0;
        if ($beaconProgress[i] >= $beaconNextReqs[i] && !locks.has(i)) {
            // console.log('LEVELUP!!!')
            locks.add(i);
            
            const numLevels = 
            Math.max(1,formula.maxNumGeom($beaconProgress[i], $beaconNextReqs[i], $beaconNums[i][1]));

            if ($challengeActive === 4) {
                $wallet['challengePoints'] += numLevels * ref.challengePointValues['beaconLevels'];
            }

            // subtract excess progress
            // console.log("PROG SUBTRACTED: " + formula.gSum($beaconNextReqs[i], $beaconNums[i][1], numLevels));
            $beaconProgress[i] -= Math.max($beaconNextReqs[i], 
            formula.gSum($beaconNextReqs[i], $beaconNums[i][1], numLevels));   
            // increase levels         
            $beaconLevels[i] += numLevels;
            // update formulas as needed
            const EXPONENT_MULTI = 1.0000025;
            $beaconBonuses[i] = $beaconFormulas[i]($beaconLevels[i]) * Math.pow(EXPONENT_MULTI, $beaconLevels[i]);
            // update next reqs

            // EDIT WITH CAUTION!! Do not cause an overflow (>1e308) at high levels
            const EXP_MULTI = 1.0005; 
            $beaconNextReqs[i] = (($beaconNums[i][0]+1) * $beaconLevels[i]) * Math.pow(EXP_MULTI, $beaconLevels[i]);
            if (Date.now() - lastDropTableUpdate > 1000) {
                lastDropTableUpdate = Date.now();
                miningDropTable.updateTable();
            }

            $wallet['beacons'] = ($wallet['beacons'] || 0) + 
                ($beaconUpgrades[1]['formula']($beaconUpgradeLevels[1]));

            locks.delete(i);
        }
    }
    const maxLevel = Math.max(...$beaconLevels);
    // add beacon power, gain more power if all levels are nearly equal
    // will always give at least 20% of potential gain

    // NOTE!!!!! When you update this, make sure to update the display in Beacons.svelte line 7
    const bpGain = (200 * (UPDATE_SPEED / 1000)) 
    $beaconLevels.reduce((s, c) => s * (c > 10000 ? Math.log(c) - 4 : 1) , 1) * delta;
   
    $resources['beaconPower'] = ($resources['beaconPower'] || 0) + bpGain;
    if (challengeActive !== 0) {
        $wallet['challengePoints'] = ($wallet['challengePoints'] || 0) 
        + formula.calcChallengePointGain(bpGain, 'beaconPower');
    }
    $beaconPowerFlavorText = bpGain;
}

function updateBeaconBonuses() {
    for (let i = 0; i < $beaconLevels.length; i++) {   
        $beaconBonuses[i] = $beaconFormulas[i]($beaconLevels[i]);
    }
}

let lightningBlastLockout = false;
function procEnchants(n, tier) { 
    const size = $enchantUpgrades[0]['formula']($enchantUpgradeLevels[0]);
    const quality = $enchantUpgrades[1]['formula']($enchantUpgradeLevels[1]);
    
    for (let [i,ench] of $enchantUpgrades.entries()) {
        const rand = Math.random() / n;
        
        if (rand < ench['formula']($enchantUpgradeLevels[i])) {
            switch(i) {
                case 0:
                    break;
                case 1:
                    break;
                case 2: // burst
                    addGems(size);
                    addToActivityLog('[Burst] ' + f(size) + ' mining cycles', 'text-violet-300', 'burst');
                    break;
                case 3: // orb rush
                    const val = (Math.random() + 0.3) * Math.pow(1 + quality, 3);
                    $wallet['orbs'] += val
                    addToActivityLog('[Orb Rush] +' + f(val) + ' orbs', 'text-violet-300', 'orb rush');
                    break;
                case 4: // lightning blast
                    if (lightningBlastLockout) break;
                    progressBonusMulti *= Math.sqrt($enchantUpgrades[0]['formula']($enchantUpgradeLevels[0]));
                    lightningBlastLockout = true;
                    setTimeout(() => {
                        progressBonusMulti /= Math.sqrt($enchantUpgrades[0]['formula']($enchantUpgradeLevels[0]));
                        if (Math.abs(progressBonusMulti - Math.round(progressBonusMulti)) < 0.1) 
                            progressBonusMulti = Math.round(progressBonusMulti);
                        lightningBlastLockout = false;
                    }, 3000)
                    addToActivityLog('[Lightning Blast] ' + f(Math.sqrt($enchantUpgrades[0]['formula']($enchantUpgradeLevels[0]))) + 'x mining speed for 3 seconds!',
                     'text-violet-300', 'lightning blast');
                    break;
                case 5: // scavenger
                    const allowedUpgrades = [0, 1, 2, 3, 4, 7, 8]
                    let done = false;
                    while (!done) {
                        const rand = Math.floor(Math.random() * allowedUpgrades.length);
                        const item = allowedUpgrades[rand];
                        
                        if ($miningUpgradeLevelsBought[item] < $miningUpgrades[item]['maxLevel']) {
                            $miningUpgradeLevels[item]++;
                            $miningUpgradeLevelsFree[item]++;
                            
                            done = true;
                            addToActivityLog('[Scavenger] Added 1 level of ' + $miningUpgrades[item]['name'] + '!', 
                            'text-violet-300', 'scavenger');

                        }
                    }
                    break;
                case 6: // key boon
                    const keyRand = Math.random() + (0.2 * (quality/1e6));
                    const BASE_KEYGAIN = size;
                    let tier, amtDivider;
                    if (keyRand > 1.18) {
                        tier = 5;
                        amtDivider = 250000; 
                        addToActivityLog('[KEY BOON] INCREDIBLE! +' + reward + ' [*****] keys!', 
                    'text-amber-400', 'key boon');
                    } else if (keyRand > 1.15) {
                        tier = 4;
                        amtDivider = 10000;
                        addToActivityLog('[Key Boon] Excellent! +' + reward + ' [****] keys', 
                            'text-violet-400', 'key boon');
                    } else if (keyRand > 0.9975) {
                        tier = 3;
                        amtDivider = 1000;
                        addToActivityLog('[Key Boon] Great! +' + reward + ' [***] keys', 
                            'text-pink-300', 'key boon');                              
                    } else if (keyRand > 0.925) {
                        tier = 2;
                        amtDivider = 10;
                        addToActivityLog('[Key Boon] Great! +' + reward + ' [**] keys', 
                            'text-blue-300', 'key boon'); 
                    } else {
                        tier = 1;
                        amtDivider = 0.1;
                        addToActivityLog('[Key Boon] +' + reward + ' [*] keys', 
                            'text-green-300', 'key boon'); 
                    }
                    const randFactor = Math.random() * 0.2 + 0.9;
                    const reward = (1 + Math.floor(randFactor * BASE_KEYGAIN / amtDivider));
                    $wallet['key'+tier] += reward;
                    break;  
                case 7: //clicker hero
                    const BASE_REWARD = size / 10;
                    const absDist = Math.random() * (400 - (quality / 2550));
                    let rewardAmount, rewardDescriptionText, rewardStyle;
                    if (absDist < 1) {
                        rewardAmount = 150;
                        rewardDescriptionText = 'PERFECT! +';
                        rewardStyle = 'text-amber-500'
                    } else if (absDist <= 2) {
                        rewardAmount = 12;
                        rewardDescriptionText = 'INCREDIBLE +';
                        rewardStyle = 'text-pink-500'
                    } else if (absDist <= 4) {
                        rewardAmount = 5;
                        rewardDescriptionText = 'Excellent +';
                        rewardStyle = 'text-violet-500'
                    } else if (absDist <= 7) {
                        rewardAmount = 4;
                        rewardDescriptionText = 'Great +';
                        rewardStyle = 'text-sky-500'
                    } else if (absDist <= 10) {
                        rewardAmount = 3;
                        rewardDescriptionText = 'Good +';
                        rewardStyle = 'text-green-500'
                    } else {  
                        rewardAmount = 1;
                        rewardDescriptionText = 'Okay +';
                        rewardStyle = 'text-gray-500';
                    } 
                    rewardAmount = Math.floor(rewardAmount * BASE_REWARD);
                    addToActivityLog('[Clicker Hero] Result: ' + rewardDescriptionText + rewardAmount + ' crystals', 
                        rewardStyle, 'clicker hero');
                    break;           
            }
        }
    }

}


</script>