<script>
	// @ts-ignore
	import { thoriumDepositActive } from './../../data/button.ts';
	// @ts-ignore
	import { keyFinderBases } from './../../data/mining.ts';
	// @ts-ignore
	import { craftMasteryProgress, craftMasteryNextReq, craftMasteryLevel, keyUpgradeLevels, starProgress } from './../../data/player.ts';
// @ts-nocheck

    // @ts-ignore
    import { ascFormula } from './../../data/ascension.ts'
    // @ts-nocheck
    // invisible component handling addition math
    import Decimal from 'break_infinity.js'
    import {
        progressThreshold,
        // @ts-ignore
        progressPerTick,
        miningUpgrades,
        gemGainFlavorText,
        // @ts-ignore
        gemProgressFlavorText,
        // @ts-ignore
        gemProgressFlavorNextUpdate,
    } from '../../data/mining'
    import {
        keyGainFlavorText,
        // @ts-ignore
        keyProgressFlavorText,
        // @ts-ignore
        keyProgressFlavorNextUpdate,
        // @ts-ignore
        key1DropTable,
        // @ts-ignore
        key2DropTable,
        // @ts-ignore
        key3DropTable,
        // @ts-ignore
        key4DropTable,
        // @ts-ignore
        key5DropTable,
        keyCrafts,
        // @ts-ignore
        keyUpgrades,
    } from '../../data/keys'
    import {
        progress,
        miningUpgradeLevels,
        wallet,
        miningDropTable,
        unlockedRes,
        settings,
        progressThisTick,
        visibleTier,
        progressAverage,
        beaconActivations,
        beaconLevels,
        beaconProgress,
        // @ts-ignore
        resources,
        beaconUpgradeLevels,

        enchantProgress,
        enchantUpgradeLevels,
        automationItemsUnlocked,
        activityLog,
        mineLevel,
        buttonStats,
        buttonUpgradeLevels,
        keyCraftMastery,
        keyCraftTimes,
        keyCraftAmount,
        // @ts-ignore
        antiFlickerFlags,
        miningUpgradeLevelsBought,
        miningUpgradeLevelsFree,
        activityLogShow,
        // @ts-ignore
        challengeActive,
        // @ts-ignore
        challengesCompleted,
        challengeProgress,
        // @ts-ignore
        challenge3Multi,
        // @ts-ignore
        miningUpgradeLevelsTemp,
        // @ts-ignore
        miningUpgradeLevelsBoughtTemp,
        // @ts-ignore
        miningUpgradeLevelsFreeTemp,
        radiumProgress,
        masteryItemLevels,
        permaWallet,
        // @ts-ignore
        perSecond,
        // @ts-ignore
        walletStamp,
        layer,
        sumUpgradeLevels
    } from '../../data/player'
    import { buttonUpgrades } from '../../data/button'
    import {
        beaconFormulas,
        beaconBonuses,
        beaconNextReqs,
        beaconNums,
        beaconUpgrades,
        beaconPowerFlavorText,
        // @ts-ignore
        beaconNameText,
    } from '../../data/beacons'
    import {masteryItemReqs, masteryItemInfo} from '../../data/mastery'
    // @ts-ignore
    import { challengeGoals } from '../../data/challenges'
    import { enchantUpgrades, enchantThreshold } from '../../data/fame'
    import { allMultipliers } from '../../data/artifacts'
    import { masteryNextReq } from '../../data/mastery'
    import ref from '../../calcs/ref'
    import formula from '../../calcs/formula'

    import { onMount } from 'svelte'

    // @ts-ignore
    const d = i => {
        return new Decimal(i)
    }

    // @ts-ignore
    const fExp = (n, pl = 3) => {
        return n.toExponential(pl).toString().replace('+', '')
    }

    // @ts-ignore
    const f = (n, pl = 0) => {
        n = Math.floor(n)
        if (n < 1e9)
            return n
                .toFixed(pl)
                .toString()
                .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
        else return n.toExponential(3).toString().replace('+', '')
    }

    // @ts-ignore
    const fp = (n, pl = 3, subOne = false) => {
        if (subOne) n -= 1
        if (n < 1e9) return (n * 100).toFixed(pl).toLocaleString() + '%'
        else
            return (n * 100).toExponential(pl).toString().replace('+', '') + '%'
    }

    // @ts-ignore
    const fl = i => Math.floor(i)
    // @ts-ignore
    const ce = i => Math.ceil(i)
    // @ts-ignore
    const ro = i => Math.round(i)
    // @ts-ignore
    const log = i => Math.log(i)

    // @ts-ignore
    let gameSpeed = 1
    // @ts-ignore
    const calcGameSpeed = () => {
        return 1
    }

    // @ts-ignore
    let i = 0
    // @ts-ignore
    function addToActivityLog(text, color, showParam) {
        if (!$activityLogShow[showParam]) return
        const timestamp = new Date().toLocaleTimeString('it-IT')
        const item = ['[' + timestamp + "] " + text, color]
        $activityLog = [...$activityLog, item]
        if ($activityLog.length > 100) $activityLog.shift()
    }

    let lastDropTableUpdate = Date.now()

    const UPDATE_SPEED = $settings['UPDATE_SPEED'] // ms per tick
    // @ts-ignore
    let last, dt
    let beaconUpdateCounter = 0
    onMount(() => {
        updateBeaconBonuses()
        last = Date.now()
        // @ts-ignore
        const mainLoop = setInterval(() => {
            const TEST_SPEEDUP = 1
            // @ts-ignore
            dt = (Date.now() - last) / UPDATE_SPEED * TEST_SPEEDUP
            addProgress(dt)
            updateMiningLevel()
            updateLayer()
            checkForKeyCraftCompletion()
            addMastery(dt)
            // out of focus - update more slowly to conserve resources
            if ($settings['activeTab'] !== 'beacons') {
                if (beaconUpdateCounter >= 10) {
                    addBeaconProgress(dt * 10, true)
                    beaconUpdateCounter = 0
                } else beaconUpdateCounter++
            } else {
                addBeaconProgress(dt)
                beaconUpdateCounter++
            }
            if ($automationItemsUnlocked['beaconizer'])
                $wallet['beacons'] =
                    ($wallet['beacons'] || 0) +
                    15 * ((UPDATE_SPEED * dt) / 1000)

            last = Date.now()
        }, UPDATE_SPEED)
        // slowLoop updates at random intervals, do NOT add time-dependent items here!
        // @ts-ignore
        const slowLoop = setInterval(() => {
            for (let [k, v] of Object.entries($wallet)) {
                if (v > 0 && !$unlockedRes.has(k)) $unlockedRes.add(k)
            }
            setPermaWallet();
        }, 773 + Math.random() * 227)
        // @ts-ignore
        const passiveLoop = setInterval(() => {
            miningDropTable.updateTable();
        }, 5153 + Math.random() * 139)
        // @ts-ignore
        const progressUpdater = setInterval(() => {
            // @ts-ignore
            updateprogressThisTick(dt)
        }, UPDATE_SPEED + Math.random() * 3) // set intervals to prime numbers to avoid sync
        // @ts-ignore
        const perSecond = setInterval(() => {
            checkThoriumDepositRoll();
        },1003)
    })

    // set the permanent wallet, that keeps track of unlocked resources
    function setPermaWallet() {
        for (let k of Object.keys($wallet)) {
            if (!$permaWallet[k] || $permaWallet[k] == undefined) $permaWallet[k] = $wallet[k]
            if ($wallet[k]) $permaWallet[k] = ($wallet[k] > $permaWallet[k] ? $wallet[k] : $permaWallet[k])
            
        }
    }

    function checkThoriumDepositRoll() {
        const min = $buttonUpgrades[0]['formula']($buttonUpgradeLevels[0])
        if (Math.random() < min && $thoriumDepositActive == 'off') {
            $thoriumDepositActive = 'on';
        }
    }

    // @ts-ignore
    function sumAllUpgradeLevels() {
        // @ts-ignore
        const mining = formula.sumArray($miningUpgradeLevels)
        // @ts-ignore
        const beacon = formula.sumArray($beaconUpgradeLevels)
        // @ts-ignore
        const button = formula.sumArray($buttonUpgradeLevels)
        // @ts-ignore
        const key = formula.sumArray($keyUpgradeLevels)
        $sumUpgradeLevels = sumAllUpgradeLevels;
    }

    function checkForMasteryCompletion() {
        if ($wallet['mastery'] >= $masteryNextReq) {
            $wallet['mastery'] -= $masteryNextReq
            $wallet['trophies'] = ($wallet['trophies'] || 0) + 1
            $wallet['totalTrophies'] = ($wallet['totalTrophies'] || 0) + 1
            $masteryNextReq = formula.calcMasteryNextReq()
        }
    }

    function updateMiningLevel() {
        if ($mineLevel['xp'] >= $mineLevel['xpNextReq']) {
            $mineLevel['xp'] -= $mineLevel['xpNextReq']
            $mineLevel['level']++
            // 100 * (A73^3) * ((1.01+((A73^2)*$D$2))^A73) * (2+Max(0, A73-69)*0.3)^Max(0, A73)
            const lv = $mineLevel['level']
            const BASE = 0.00015
            $mineLevel['xpNextReq'] =
                100 *
                (lv ** 2.8) *
                Math.pow(1.01 + (lv ** 2.1) * BASE, lv) *
                Math.pow(2 + Math.max(0, lv - 69) * 0.3, lv > 69 ? lv : 0)

            addToActivityLog(
                'Mining level increased to ' + $mineLevel['level'],
                'text-sky-500',
                'always'
            )
            }

    }

    function updateLayer() {
        if ($layer['blocks'] >= $layer['blocksNextReq']) {
            $layer['blocks'] -= $layer['blocksNextReq']
            $layer['layer']++
            // 100 * (A73^3) * ((1.01+((A73^2)*$D$2))^A73) * (2+Max(0, A73-69)*0.3)^Max(0, A73)
            const lv = $layer['layer']
            // @ts-ignore
            const BASE = 0.00015
            $layer['blocksNextReq'] =
                //100 * lv * lv * lv;
                (100 + (lv * 10)
                + Math.floor((lv**2 * 0.125))
                + (lv > 1000 ?    ((lv-1000)    **3  * 0.07) : 1)
                + (lv > 10000 ?   ((lv-10000)   **4  * 0.01) : 1)
                + (lv > 100000 ?  ((lv-100000)  **5  * 0.004) : 1)
                + (lv > 1000000 ? ((lv-1000000) **6  * 0.0015) : 1))

            addToActivityLog(
                'Layer ' + ($layer['layer']-1) + " mined",
                'text-yellow-300',
                'always'
            )
            }

    }

    const PROGRESS_BASE = 1
    let progressBonusMulti = 1

    // @ts-ignore
    function updateprogressThisTick(delta) {

        let progressMultiArtifacts = $allMultipliers['mineSpeed']['formula'](
            $wallet['artifacts'] || 0
        )



        const GLOBAL_MULTI = formula.getAntimatterBonusAtAscensionNumber(1)

        

        let progGems = 
            ($miningUpgrades[0]['formula']($miningUpgradeLevels[0]))
                * $miningUpgrades[13]['formula']($miningUpgradeLevels[13])
                * Math.max(1, $beaconBonuses[1]) 
                * $buttonUpgrades[3]['formula']($buttonUpgradeLevels[3]) 
                * progressBonusMulti 
                * progressMultiArtifacts 
                * GLOBAL_MULTI

        let softcapThresh =
            $progressThreshold['gems'] *
            (UPDATE_SPEED / 1000) *
            (25 * ascFormula.getVal('fire'))
        //softcap!
        if (progGems > softcapThresh) {
            progGems = softcapThresh + Math.sqrt(progGems - softcapThresh)
        }

        $progressAverage['gems'] = progGems
        $progressThisTick['gems'] = progGems * delta

        let progKey1 =
            ($miningUpgradeLevels[3] > 0
                ? PROGRESS_BASE *
                  $miningUpgrades[3]['formula']($miningUpgradeLevels[3])
                : 0) *
                $miningUpgrades[26]['formula']($miningUpgradeLevels[26]) *
                progressBonusMulti *
                progressMultiArtifacts *
                GLOBAL_MULTI

        softcapThresh = $progressThreshold['key1'] * (UPDATE_SPEED / 1000) * 25
        //softcap!
        if (progKey1 > softcapThresh) {
            progKey1 = softcapThresh + Math.sqrt(progKey1 - softcapThresh)
        }

        $progressAverage['key1'] = progKey1
        $progressThisTick['key1'] = progKey1 * delta

        let progKey2 = 
            ($miningUpgradeLevels[4] > 0
                ? PROGRESS_BASE *
                  $miningUpgrades[4]['formula']($miningUpgradeLevels[4])
                : 0) *
                $miningUpgrades[26]['formula']($miningUpgradeLevels[26]) *
                progressBonusMulti *
                progressMultiArtifacts *
                GLOBAL_MULTI

        softcapThresh = $progressThreshold['key2'] * (UPDATE_SPEED / 1000) * 10
        //softcap!
        if (progKey2 > softcapThresh) {
            progKey2 = softcapThresh + Math.sqrt(progKey2 - softcapThresh)
        }

        $progressAverage['key2'] = progKey2
        $progressThisTick['key2'] = progKey2 * delta

        let progKey3 =
            ($miningUpgradeLevels[18] > 0
                ? PROGRESS_BASE *
                  $miningUpgrades[18]['formula']($miningUpgradeLevels[18])
                : 0) *
                $miningUpgrades[26]['formula']($miningUpgradeLevels[26]) *
                $beaconBonuses[5] *
                progressBonusMulti *
                progressMultiArtifacts *
                GLOBAL_MULTI

        softcapThresh = $progressThreshold['key3'] * (UPDATE_SPEED / 1000) * 1
        //softcap!
        if (progKey3 > softcapThresh) {
            progKey3 = softcapThresh + Math.sqrt(progKey3 - softcapThresh)
        }

        $progressAverage['key3'] = progKey3
        $progressThisTick['key3'] = progKey3 * delta

        let progKey4 =
            ($miningUpgradeLevels[38] > 0
                ? PROGRESS_BASE *
                  $miningUpgrades[38]['formula']($miningUpgradeLevels[38])
                : 0) *
                $miningUpgrades[26]['formula']($miningUpgradeLevels[26]) *
                $beaconBonuses[5] *
                progressBonusMulti *
                progressMultiArtifacts *
                GLOBAL_MULTI

        softcapThresh = $progressThreshold['key3'] * (UPDATE_SPEED / 1000) * 1
        //softcap!
        if (progKey4 > softcapThresh) {
            progKey4 = softcapThresh + Math.sqrt(progKey4 - softcapThresh)
        }

        $progressAverage['key4'] = progKey4
        $progressThisTick['key4'] = progKey4 * delta

        // TODO change index when adding
        // const progKey3 = ($miningUpgradeLevels[5] > 0 ?
        // PROGRESS_BASE * $miningUpgrades[5]['formula']($miningUpgradeLevels[5]) : 0);
        // $progressAverage['key3'] = progKey3;
        // $progressThisTick['key3'] = progKey3 * delta;



    }

    // @ts-ignore
    let progressGain = 0
    let mineXpBackup = 0
    let enchProgressBackup = 0
    let challengeProgressBackup = 0

    // if anything is NaN it will be reset to a backup value
    function sanityChecks() {
        if (isNaN($enchantProgress['t1']))
            $enchantProgress['t1'] = enchProgressBackup
        if (isNaN($mineLevel['xp'])) $mineLevel['xp'] = mineXpBackup
        if (isNaN($progressThisTick['gems'])) $progressThisTick['gems'] = 0
        if (isNaN($progressThisTick['key1'])) $progressThisTick['key1'] = 0
        if (isNaN($progressThisTick['key2'])) $progressThisTick['key2'] = 0
        if (isNaN($progressThisTick['key3'])) $progressThisTick['key3'] = 0
        if (isNaN($progressThisTick['key4'])) $progressThisTick['key4'] = 0
        if (isNaN($progressThisTick['key5'])) $progressThisTick['key5'] = 0
        if (isNaN($wallet['challengePoints']))
            $wallet['challengePoints'] = challengeProgressBackup
    }

    // @ts-ignore
    let tempGemProgress = 0
    // @ts-ignore
    function addProgress(delta) {
        enchProgressBackup = $enchantProgress['t1'] || 0
        mineXpBackup = $mineLevel['xp'] || 0
        challengeProgressBackup = $challengeProgress || 0

        const gemAt = $progressThreshold['gems']
        const keyAt = [
            $progressThreshold['key1'],
            $progressThreshold['key2'],
            $progressThreshold['key3'],
            $progressThreshold['key4'],
            $progressThreshold['key5'],
        ]

        // disable offline progress if chosen
        if (delta > 6000 && !$settings['offlineProgress']) return

        // add radium
        $wallet['crystals'] +=
            $settings['speed'] * (delta * formula.calcCrystalGainFromRadium()) / UPDATE_SPEED / 2


        for (let [k, v] of Object.entries($progressThisTick)) {
            if (isNaN($progress[k])) $progress[k] = 0
            $progress[k] += v
        }

        if ($progress['gems'] >= gemAt) {
            // increase fame thresholds
            // TODO: implement enchant proc method
            // @ts-ignore
            for (let [k, v] of Object.entries($enchantProgress)) {
                $enchantProgress[k] += 
                    formula.calcEnchantProgressGain(
                        $progress['gems'] / gemAt
                    );
                if ($enchantProgress[k] >= $enchantThreshold[k]) {
                    procEnchants(
                        Math.floor($enchantProgress[k] / $enchantThreshold[k]),
                        k.substring(1)
                    )
                    $enchantProgress[k] %= $enchantThreshold[k]
                }
            }

            addGems($progress['gems'] / gemAt, $progressAverage['gems'])
            dropRoll(Math.floor($progress['gems'] / gemAt))

            addReactorProgress($progress['gems'] / gemAt)

            $mineLevel['xp'] +=
                ($progress['gems'] / gemAt) * formula.getMineXPPerCycle()
            $layer['blocks'] +=
                ($progress['gems'] / gemAt) * formula.getLayersPerCycle()

            $progress['gems'] = 0
        }
        // add keys
        if ($progress['key1'] >= keyAt[0]) {
            addKey(1,Math.floor($progress['key1'] / keyAt[0]), keyAt)
        }
        if ($progress['key2'] >= keyAt[1]) {
            addKey(2,Math.floor($progress['key2'] / keyAt[1]), keyAt)
        }
        if ($progress['key3'] >= keyAt[2]) {
            addKey(3,Math.floor($progress['key3'] / keyAt[2]), keyAt)
        }
        if ($progress['key4'] >= keyAt[3]) {
            addKey(4,Math.floor($progress['key4'] / keyAt[3]), keyAt)
        }


        // glorious space turtles upgrade
        $wallet['fame'] =
            ($wallet['fame'] || 0) +
            $miningUpgrades[28]['formula']($miningUpgradeLevels[28]) *
                (UPDATE_SPEED / 1000)
        $wallet['totalFame'] =
            ($wallet['totalFame'] || 0) +
            $miningUpgrades[28]['formula']($miningUpgradeLevels[28]) *
                (UPDATE_SPEED / 1000)

        sanityChecks()
    }
    


    // @ts-ignore
    function addReactorProgress(delta) {
        if ($mineLevel['level'] < 8) return;

        $radiumProgress[0] += delta * formula.calcRadioactivityGain();


        if ($radiumProgress[0] >= $radiumProgress[1]) {
            if (isNaN($wallet['radium'])) $wallet['radium'] = 0
            const n = Math.max(1,(Math.floor($radiumProgress[0] / $radiumProgress[1]) * formula.calcRadiumGainWhenComplete()))
            $wallet['radium'] = ($wallet['radium'] || 0) + n
            $radiumProgress[0] %= $radiumProgress[1]   
            
            addStarProgress(n);
        }
    }

    // @ts-ignore
    function addStarProgress(n) {
        if ($mineLevel['level'] < 8) return;
        $starProgress[0] += n * formula.calcStarProgressGain();

        if ($starProgress[0] >= $starProgress[1]) {
            if (isNaN($wallet['stars'])) $wallet['stars'] = 0
            const n = Math.max(1,(Math.floor($starProgress[0] / $starProgress[1]) * formula.calcStarGainWhenComplete()))
            $wallet['stars'] = ($wallet['stars'] || 0) + n
            $starProgress[0] %= $starProgress[1]   
        }
    }

    /**
     * @param n - number of times to add gems
     */
    let lastGemGainTextUpdate = Date.now()
    // @ts-ignore
    function addGems(n, avgProgress) {
        if (isNaN(n)) {
            n = 1
        }

        const GEM_BASE = 1
        const gemGain =
            (GEM_BASE +
                $miningUpgrades[1]['formula']($miningUpgradeLevels[1])) *
            $miningUpgrades[8]['formula']($miningUpgradeLevels[8]) *
            Math.max(1, $beaconBonuses[3]) *
            Math.max(
                1,
                $miningUpgrades[10]['formula']($miningUpgradeLevels[10])
            ) *
            Math.max(
                1,
                $miningUpgrades[20]['formula']($miningUpgradeLevels[20])
            ) *
            Math.max(
                1,
                $miningUpgrades[25]['formula']($miningUpgradeLevels[25])
            ) *
            Math.max(
                1,
                $allMultipliers['gems']['formula']($wallet['artifacts'] || 0)
            ) *
            Math.max(
                1,
                $miningUpgrades[30]['formula']($miningUpgradeLevels[30])
            ) *
            $buttonStats['hardenedBonus'] *
            $allMultipliers['gems']['formula']($wallet['artifacts'] || 0)
        // update the flavor text if there is a minor change, otherwise don't
        if (Date.now() - lastGemGainTextUpdate > 1000) {
            $gemGainFlavorText = gemGain
            lastGemGainTextUpdate = Date.now()
        }
        $wallet['gems'] += gemGain * n

        // add chance to get fame

    }


    // @ts-ignore
    function addKey(tier, n, keyAt) {
        const KEY_BASE = $keyFinderBases[tier];
        const keyGain =
            KEY_BASE *
            $beaconBonuses[5] *
            $miningUpgrades[5]['formula']($miningUpgradeLevels[5]) *
            $miningUpgrades[26]['formula']($miningUpgradeLevels[26]) *
            formula.calcKeyFinderAbundanceBonus(1)

        $wallet['key'+tier] = ($wallet['key'+tier] || 0) + keyGain * n
        $progress['key'+tier] %= keyAt[0]
        $keyGainFlavorText['key'+tier] = keyGain
    }

    // function addKey2(n, keyAt) {
    //     const KEY2_BASE = 1
    //     const key2Gain =
    //         KEY2_BASE *
    //         $beaconBonuses[5] *
    //         $miningUpgrades[5]['formula']($miningUpgradeLevels[5]) *
    //         $miningUpgrades[26]['formula']($miningUpgradeLevels[26])* 
    //         formula.calcKeyFinderAbundanceBonus(2)

    //     $wallet['key2'] = ($wallet['key2'] || 0) + key2Gain * n
    //     $progress['key2'] %= keyAt[1]
    //     $keyGainFlavorText['key2'] = key2Gain

    // }

    // function addKey3(n, keyAt) {
    //     const KEY3_BASE = 0.075
    //     const key3Gain =
    //         KEY3_BASE *
    //         $beaconBonuses[5] *
    //         $miningUpgrades[5]['formula']($miningUpgradeLevels[5]) *
    //         $miningUpgrades[26]['formula']($miningUpgradeLevels[26])*
    //         formula.calcKeyFinderAbundanceBonus(3)

    //     $wallet['key3'] = ($wallet['key3'] || 0) + key3Gain * n
    //     $progress['key3'] %= keyAt[2]
    //     $keyGainFlavorText['key3'] = key3Gain

    // }

    // function addKey4(n, keyAt) {
    //     const KEY4_BASE = 0.0016
    //     const key3Gain =
    //         KEY4_BASE *
    //         $beaconBonuses[5] *
    //         $miningUpgrades[5]['formula']($miningUpgradeLevels[5]) *
    //         $miningUpgrades[26]['formula']($miningUpgradeLevels[26])*
    //         formula.calcKeyFinderAbundanceBonus(3)

    //     $wallet['key4'] = ($wallet['key4'] || 0) + key3Gain * n
    //     $progress['key4'] %= keyAt[2]
    //     $keyGainFlavorText['key4'] = key3Gain

    // }

// @ts-ignore
function dropRoll(n) {
    let rewards = {}
    for (let [item, vals] of Object.entries($miningDropTable)) {
        // @ts-ignore
        if ($visibleTier >= ref.dropTiers[item]) {
            if (vals[0] >= 1) {
                // @ts-ignore
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
                    const rewardVal =
                        (val[Math.floor(Math.random() * val.length)] +
                            val[Math.floor(Math.random() * val.length)] +
                            val[Math.floor(Math.random() * val.length)]) /
                        3

                    // @ts-ignore
                    rewards[item] = (rewards[item] || 0) + numWins * rewardVal
                    // if E[x] < 1
                } else {
                    let wins = 0
                    const p = vals[0]
                    const lambda = n * p
                    // for low probability use poisson distribution
                    // maximum 2 drops per cycle to prevent latency
                    // Missed rewards only present in 1% of cycles, at most
                    // allows fast unrolling - lower latency
                    if (vals[0] < 0.1 || n * p < 10 || n * (1 - p) < 10) {
                        let pFail = Math.exp(-1 * lambda)
                        const rand = Math.random()
                        let k = 0
                        // roll once, then check again if success
                        if (rand < 1 - pFail) {
                            k++
                            pFail +=
                                (Math.exp(-1 * n * p) * Math.pow(n * p, k)) / 1
                            if (rand < 1 - pFail) {
                                k++
                            }
                        }
                        wins = k * 1.01
                        // for higher probability use normal approximation to binomial
                    } else {
                        const stdev = Math.sqrt(n * p * (1 - p))
                        let wins = formula.rNorm(lambda, stdev)
                        wins =
                            Math.random() < wins - Math.floor(wins)
                                ? Math.ceil(wins)
                                : Math.floor(wins)
                    }
                    const valGain =
                        wins * (vals[1] + Math.random() * (vals[2] - vals[1]))

                    // @ts-ignore
                    rewards[item] = (rewards[item] || 0) + valGain
                }
            }
        }

        for (let [item, val] of Object.entries(rewards)) {
            $wallet[item] = ($wallet[item] || 0) + val
            if (item == 'fame') {
                $wallet['totalFame'] = ($wallet['totalFame'] || 0) + val
            }
        }
    }

    function checkForKeyCraftCompletion() {
        for (let [i, val] of $keyCrafts.entries()) {
            const item = val['item']
            if (!$keyCraftTimes[item]) {
                $keyCraftTimes[item] = [-1, -1]
                $keyCraftAmount[item] = 0
                $keyCraftMastery[item] = [1, 0, 10]
                continue
            }
            const finish = $keyCraftTimes[item][1]
            if (Date.now() > finish && finish != -1) {
                const gain = formula.calcKeyCraftAmountGained(i)
                $keyCraftAmount[item]++
                $wallet[item] =
                    ($wallet[item] || 0) + gain
                $keyCraftTimes[item][1] = -1

                $craftMasteryProgress++;
                if ($craftMasteryProgress >= $craftMasteryNextReq) {
                    $craftMasteryProgress -= $craftMasteryNextReq
                    $craftMasteryLevel++
                    $craftMasteryNextReq = formula.calcCraftMasteryNextReq($craftMasteryLevel)
                    addToActivityLog(
                        '[Crafting] Crafting Mastery increased! (' +
                            $craftMasteryLevel +
                            ')',
                        'text-amber-500',
                        'crafting'
                    )
                }

                $keyCraftMastery[item][1] =
                    parseInt($keyCraftMastery[item][1] || 0) + 1
                if ($keyCraftMastery[item][1] >= $keyCraftMastery[item][2]) {
                    $keyCraftMastery[item][0]++
                    $keyCraftMastery[item][1] = 0

                    // formula
                    if (item == 'energy') $keyCraftMastery[item][2] = 3
                    else
                        $keyCraftMastery[item][2] =
                            10 +
                            15 *
                                $keyCraftMastery[item][0] *
                                Math.pow(1.25, $keyCraftMastery[item][0])
                    $keyCraftMastery[item][2] = Math.floor(
                        $keyCraftMastery[item][2]
                    )
                    addToActivityLog(
                        '[Keys] Crafting Mastery for ' +
                            val['name'] +
                            ' increased! (' +
                            $keyCraftMastery[item][0] +
                            ')',
                        'text-amber-400',
                        'crafting'
                    )
                }
                if (item != '') {
                    addToActivityLog(
                        '[Crafting] Crafting complete: +' +
                            f(gain) +
                            ' ' +
                            $keyCrafts[i]['name'],
                        $keyCrafts[i]['style'] || 'text-white',
                        'crafting'
                    )
                } else {
                    addToActivityLog(
                        '[Crafting] Practice craft complete, +1 global mastery.',
                        'text-gray-400',
                        'crafting'
                    )
                }
            }
        }
    }

   
    let locks = new Set() // makes sure levelups don't repeat when leveling up from next function call
    // @ts-ignore
    function addBeaconProgress(delta, isOffFocus = false) {
        if (isNaN($wallet['beaconPower'])) $wallet['beaconPower'] = 0
        const progressGains = $beaconActivations.map(
            // @ts-ignore
            (e, i) =>
                e *
                delta *
                Math.max(
                    1,
                    $beaconUpgrades[0]['formula']($beaconUpgradeLevels[0])
                ) *
                Math.max(
                    1,
                    $beaconUpgrades[2]['formula']($beaconUpgradeLevels[2])
                ) *
                Math.max(
                    1,
                    $miningUpgrades[12]['formula']($miningUpgradeLevels[12])
                ) *
                Math.max(
                    1,
                    $miningUpgrades[24]['formula']($miningUpgradeLevels[24])
                ) *
                Math.max(
                    1,
                    1 +
                        ($beaconUpgrades[3]['formula'](
                            $beaconUpgradeLevels[3]
                        ) -
                            1) *
                            $beaconLevels[i]
                )
        )
        
        $beaconProgress = $beaconProgress.map(
            // @ts-ignore
            (e, i) =>
                e + progressGains[i])
        // check for levelups
        for (let i = 0; i < 10; i++) {
            if (isNaN($beaconProgress[i])) $beaconProgress[i] = 0
            if ($beaconProgress[i] >= $beaconNextReqs[i] && !locks.has(i)) {
                // console.log('LEVELUP!!!')
                locks.add(i)

                const numLevels = Math.min(
                    Math.max(
                        1,
                        formula.maxNumGeom(
                            $beaconProgress[i],
                            $beaconNextReqs[i],
                            $beaconNums[i][1]
                        )
                    ),
                    isOffFocus ? 20 : 2
                )


                // subtract excess progress
                // console.log("PROG SUBTRACTED: " + formula.gSum($beaconNextReqs[i], $beaconNums[i][1], numLevels));
                $beaconProgress[i] -= Math.max(
                    $beaconNextReqs[i],
                    formula.gSum(
                        $beaconNextReqs[i],
                        $beaconNums[i][1],
                        numLevels
                    )
                )
                // increase levels
                $beaconLevels[i] += numLevels
                // update formulas as needed
                const BONUS_EXPONENT = 1.0000025
                $beaconBonuses[i] =
                    $beaconFormulas[i]($beaconLevels[i]) *
                    Math.pow(BONUS_EXPONENT, $beaconLevels[i])
                // update next reqs

                // EDIT WITH CAUTION!! Do not cause an overflow (>1e308) at high levels
                const REQ_EXPONENT = 1.0005
                $beaconNextReqs[i] =
                    ($beaconNums[i][0] + 1) *
                    $beaconLevels[i] *
                    Math.pow(REQ_EXPONENT, $beaconLevels[i])
                if (Date.now() - lastDropTableUpdate > 1000) {
                    lastDropTableUpdate = Date.now()
                    miningDropTable.updateTable()
                }

                locks.delete(i)
            }
        }

        // NOTE!!!!! When you update this, make sure to update the display in Beacons.svelte line 7


        const bpGain =
            ((formula.sumArray($beaconLevels) < 1) ? 0 : 
            25 *
            (UPDATE_SPEED / 1000) *
            $beaconLevels.reduce(
                // @ts-ignore
                (s, c) => s * (c > 10000 ? formula.calcBeaconPowerMulti(c): 1),
                1
            ) *
            $beaconBonuses[0] *
            delta)

        $wallet['beaconPower'] = ($wallet['beaconPower'] || 0) + bpGain
        $beaconPowerFlavorText = bpGain
    }

    function updateBeaconBonuses() {
        for (let i = 0; i < $beaconLevels.length; i++) {
            $beaconBonuses[i] = $beaconFormulas[i]($beaconLevels[i])
        }
    }

    let masteryUpdateTicks = 0, m = formula.calcMasteryGainPerTick();
    const MASTERY_GAIN_UPDATE_AT = 11
    
    // @ts-ignore
    function addMastery(dt) {
        if (masteryUpdateTicks > MASTERY_GAIN_UPDATE_AT) {
            m = formula.calcMasteryGainPerTick()
            masteryUpdateTicks = 0
        }
        if (!$automationItemsUnlocked['masterful']) return
        $wallet['mastery'] = ($wallet['mastery'] || 0) + m
        $wallet['mist'] = ($wallet['mist'] || 0) + (dt * formula.calcmistGainFromMastery() / (1000/UPDATE_SPEED))
        checkForMasteryCompletion()
        checkForItemMasteryLevelUp()
    }

    function checkForItemMasteryLevelUp() {
        //@ts-nocheck
        for (let m of Object.keys($masteryItemLevels)) {
            // console.log($masteryItemReqs)
            if ($wallet[m] > $masteryItemReqs[m]) {
                console.log(m)
                $masteryItemLevels[m]++
                $masteryItemReqs[m] = (
                    $masteryItemInfo[m]['base']
                    * Math.pow($masteryItemInfo[m]['increase'], 
                    $masteryItemLevels[m])   
                )
            }
        }
    }

    let lightningBlastLockout = false
    /**
     * @param {number | undefined} [n]
     * @param {string | undefined} [tier]
     */
    function procEnchants(n, tier) {
        // @ts-ignore
        if (n > 100) return
        // @ts-ignore
        const size = $enchantUpgrades[0]['formula']($enchantUpgradeLevels[0])
        // @ts-ignore
        const quality = $enchantUpgrades[1]['formula']($enchantUpgradeLevels[1])

        for (let [i, ench] of $enchantUpgrades.entries()) {
            if (ench['tier'] != tier) continue
            // @ts-ignore
            const rand = Math.random() / n

            if (rand < ench['formula']($enchantUpgradeLevels[i])) {
                const value = formula.getEnchantFormulaValue(i);
                switch (i) {
                    case 0:
                        break
                    case 1:
                        break
                    case 2: // burst
                        addGems(value)
                        addToActivityLog(
                            '[Burst] +' + f(value) + ' mining cycles',
                            'text-violet-300',
                            'burst'
                        )
                        break
                    case 3: // orb rush
                        $wallet['orbs'] = ($wallet['orbs'] || 0) + value
                        addToActivityLog(
                            '[Orb Rush] +' + f(value) + ' orbs',
                            'text-violet-300',
                            'orb rush'
                        )
                        break
                    case 4: // lightning blast
                        if (lightningBlastLockout) break
                        progressBonusMulti = value
                        lightningBlastLockout = true
                        setTimeout(() => {
                            progressBonusMulti = 1
                            if (
                                Math.abs(
                                    progressBonusMulti -
                                        Math.round(progressBonusMulti)
                                ) < 0.1
                            )
                                progressBonusMulti =
                                    Math.round(progressBonusMulti)
                            lightningBlastLockout = false
                        }, 3000)
                        addToActivityLog(
                            '[Lightning Blast] ' +
                                f(value, 2) +
                                'x mining speed for 3 seconds!',
                            'text-violet-300',
                            'lightning blast'
                        )
                        break
                    case 5: // scavenger
                        const allowedUpgrades = [0, 1, 2, 3, 4, 7, 8]
                        let done = false
                        while (!done) {
                            const rand = Math.floor(
                                Math.random() * allowedUpgrades.length
                            )
                            const item = allowedUpgrades[rand]

                            if (
                                $miningUpgradeLevelsBought[item] <
                                $miningUpgrades[item]['maxLevel']
                            ) {
                                $miningUpgradeLevels[item]++
                                $miningUpgradeLevelsFree[item]++

                                done = true
                                addToActivityLog(
                                    '[Scavenger] Added 1 level of ' +
                                        $miningUpgrades[item]['name'] +
                                        '!',
                                    'text-violet-300',
                                    'scavenger'
                                )
                            }
                        }
                        break
                    case 6: // nuclear fission
                        $radiumProgress[0] += value;
                        addToActivityLog(
                             '[Nuclear Fission] +' + f(value) + ' radioactivity',
                             'text-violet-300',
                             'nuclear fission')
                        break
                    case 7: // key caller
                        const rand = Math.random()
                        let tier;
                        if (rand > 0.9) tier = 3;
                        else if (rand > 0.6) tier = 2;
                        else tier = 1;

                        let val = value;
                        if (tier == 2) val /= 190;
                        else if (tier == 3) val /= 100000;

                        val = Math.floor(val)

                        $wallet['key'+tier] = ($wallet['key'+tier] || 0) + val
                        addToActivityLog(
                            // @ts-ignore
                            '[Key Caller] +' + f(val) + ' ' + ref.displayNames['key'+tier.toString()],
                            'text-violet-300',
                            'key caller')
                        break;
                    case 8: // rift tearing
                        const essences = ['efire', 'eearth', 'ewater', 'emagic', 'ecelestial'];
                        const type = essences[Math.floor(Math.random() * essences.length)];
                        $wallet[type] = ($wallet[type] || 0) + value;
                        addToActivityLog('[Rift Tearing] +' + f(value) + ' ' + type.substring(1) + ' essence', 
                        // @ts-ignore
                        ref.colors[type], 'rift tearing');
                        break
                    case 9: // double down
                        for (let i of Object.keys($enchantProgress)) {
                            $enchantProgress[i] += value;
                        }
                        addToActivityLog('[Double Down] Added ' + f(value) + ' progress to all tiers.', 'text-violet-300', 'double down')
                }
            }
        }
    }
    
</script>
