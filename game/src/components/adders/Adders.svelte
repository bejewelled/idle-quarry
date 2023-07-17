<script>
    import { ascFormula } from './../../data/ascension.ts'
    // @ts-nocheck
    // invisible component handling addition math
    import Decimal from 'break_infinity.js'
    import {
        progressThreshold,
        progressPerTick,
        miningUpgrades,
        gemGainFlavorText,
        gemProgressFlavorText,
        gemProgressFlavorNextUpdate,
    } from '../../data/mining'
    import {
        keyGainFlavorText,
        keyProgressFlavorText,
        keyProgressFlavorNextUpdate,
        key1DropTable,
        key2DropTable,
        key3DropTable,
        key4DropTable,
        key5DropTable,
        keyCrafts,
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
        antiFlickerFlags,
        miningUpgradeLevelsBought,
        miningUpgradeLevelsFree,
        activityLogShow,
        challengeActive,
        challengesCompleted,
        challengeProgress,
        challenge3Multi,
        miningUpgradeLevelsTemp,
        miningUpgradeLevelsBoughtTemp,
        miningUpgradeLevelsFreeTemp,
        buttonRadiumProgress,
    } from '../../data/player'
    import { buttonUpgrades } from '../../data/button'
    import {
        beaconFormulas,
        beaconBonuses,
        beaconNextReqs,
        beaconNums,
        beaconUpgrades,
        beaconPowerFlavorText,
        beaconNameText,
    } from '../../data/beacons'
    import { challengeGoals } from '../../data/challenges'
    import { enchantUpgrades, enchantThreshold } from '../../data/fame'
    import { allMultipliers } from '../../data/artifacts'
    import ref from '../../calcs/ref'
    import formula from '../../calcs/formula'

    import { onMount } from 'svelte'

    const d = i => {
        return new Decimal(i)
    }

    const fExp = (n, pl = 3) => {
        return n.toExponential(pl).toString().replace('+', '')
    }

    const f = (n, pl = 0) => {
        if (n < 1e9)
            return n
                .toFixed(pl)
                .toString()
                .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
        else return n.toExponential(3).toString().replace('+', '')
    }

    const fp = (n, pl = 3, subOne = false) => {
        if (subOne) n -= 1
        if (n < 1e9) return (n * 100).toFixed(pl).toLocaleString() + '%'
        else
            return (n * 100).toExponential(pl).toString().replace('+', '') + '%'
    }

    const fl = i => Math.floor(i)
    const ce = i => Math.ceil(i)
    const ro = i => Math.round(i)
    const log = i => Math.log(i)

    let gameSpeed = 1
    const calcGameSpeed = () => {
        return 1
    }

    let i = 0
    function addToActivityLog(text, color, showParam) {
        if (!$activityLogShow[showParam]) return
        const item = [text, color]
        $activityLog = [...$activityLog, item]
        if ($activityLog.length > 100) $activityLog.shift()
    }

    let lastDropTableUpdate = Date.now()

    const UPDATE_SPEED = $settings['UPDATE_SPEED'] // ms per tick
    let last, dt
    let beaconUpdateCounter = 0
    onMount(() => {
        updateBeaconBonuses()
        last = Date.now()
        const mainLoop = setInterval(() => {
            dt = (Date.now() - last) / UPDATE_SPEED
            addProgress(dt)
            updateMiningLevel()
            checkForKeyCraftCompletion()
            checkForChallengeCompletion()
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
                    50 * ((UPDATE_SPEED * dt) / 1000)

            last = Date.now()
        }, UPDATE_SPEED)
        // slowLoop updates at random intervals, do NOT add time-dependent items here!
        const slowLoop = setInterval(() => {
            for (let [k, v] of Object.entries($wallet)) {
                if (v > 0 && !$unlockedRes.has(k)) $unlockedRes.add(k)
            }
        }, 773 + Math.random() * 227)
        const progressUpdater = setInterval(() => {
            updateprogressThisTick(dt)
        }, UPDATE_SPEED + Math.random() * 3) // set intervals to prime numbers to avoid sync
    })

    function updateMiningLevel() {
        if ($mineLevel['xp'] >= $mineLevel['xpNextReq']) {
            $mineLevel['xp'] -= $mineLevel['xpNextReq']
            $mineLevel['level']++
            // 100 * (A73^3) * ((1.01+((A73^2)*$D$2))^A73) * (2+Max(0, A73-69)*0.3)^Max(0, A73)
            const lv = $mineLevel['level']
            const BASE = 0.00015
            $mineLevel['xpNextReq'] =
                100 *
                lv ** 3 *
                Math.pow(1.01 + lv ** 2 * BASE, lv) *
                Math.pow(2 + Math.max(0, lv - 69) * 0.3, lv > 69 ? lv : 0)
        }
    }

    const PROGRESS_BASE = 1
    let progressBonusMulti = 1

    function updateprogressThisTick(delta) {
        if (!($challengeActive === 3)) $challenge3Multi = 1

        let progressMultiArtifacts = $allMultipliers['mineSpeed']['formula'](
            $wallet['artifacts'] || 0
        )

        let challengeMultiplier = 1
        let challengeExponent = 1
        if ($challengeActive === 1) {
            challengeMultiplier = 0.5 / (1 + $challengesCompleted[0])
            challengeExponent = Math.max(
                0.15,
                0.54 - $challengesCompleted[0] * 0.03
            )
        }

        const TEST_SPEEDUP = ($settings['speed'] || 1)
        const GLOBAL_MULTI = formula.getAntimatterBonusAmount(0) * TEST_SPEEDUP

        

        let progGems = Math.pow(
            PROGRESS_BASE *
                $miningUpgrades[0]['formula']($miningUpgradeLevels[0]) *
                Math.max(1, $beaconBonuses[1]) *
                $buttonUpgrades[3]['formula']($buttonUpgradeLevels[3]) *
                progressBonusMulti *
                $challenge3Multi *
                challengeMultiplier *
                progressMultiArtifacts *
                GLOBAL_MULTI,
            challengeExponent
        )

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

        let progKey1 = Math.pow(
            ($miningUpgradeLevels[3] > 0
                ? PROGRESS_BASE *
                  $miningUpgrades[3]['formula']($miningUpgradeLevels[3])
                : 0) *
                $miningUpgrades[26]['formula']($miningUpgradeLevels[26]) *
                progressBonusMulti *
                $challenge3Multi *
                progressMultiArtifacts *
                GLOBAL_MULTI *
                challengeMultiplier,
            challengeExponent
        )

        softcapThresh = $progressThreshold['key1'] * (UPDATE_SPEED / 1000) * 25
        //softcap!
        if (progKey1 > softcapThresh) {
            progKey1 = softcapThresh + Math.sqrt(progKey1 - softcapThresh)
        }

        $progressAverage['key1'] = progKey1
        $progressThisTick['key1'] = progKey1 * delta

        let progKey2 = Math.pow(
            ($miningUpgradeLevels[4] > 0
                ? PROGRESS_BASE *
                  $miningUpgrades[4]['formula']($miningUpgradeLevels[4])
                : 0) *
                $miningUpgrades[26]['formula']($miningUpgradeLevels[26]) *
                progressBonusMulti *
                $challenge3Multi *
                progressMultiArtifacts *
                GLOBAL_MULTI *
                challengeMultiplier,
            challengeExponent
        )

        softcapThresh = $progressThreshold['key2'] * (UPDATE_SPEED / 1000) * 10
        //softcap!
        if (progKey2 > softcapThresh) {
            progKey2 = softcapThresh + Math.sqrt(progKey2 - softcapThresh)
        }

        $progressAverage['key2'] = progKey2
        $progressThisTick['key2'] = progKey2 * delta

        let progKey3 = Math.pow(
            ($miningUpgradeLevels[18] > 0
                ? PROGRESS_BASE *
                  $miningUpgrades[18]['formula']($miningUpgradeLevels[18])
                : 0) *
                $miningUpgrades[26]['formula']($miningUpgradeLevels[26]) *
                $beaconBonuses[5] *
                progressBonusMulti *
                $challenge3Multi *
                progressMultiArtifacts *
                challengeMultiplier *
                GLOBAL_MULTI,
            challengeExponent
        )

        softcapThresh = $progressThreshold['key3'] * (UPDATE_SPEED / 1000) * 1
        //softcap!
        if (progKey3 > softcapThresh) {
            progKey3 = softcapThresh + Math.sqrt(progKey3 - softcapThresh)
        }

        $progressAverage['key3'] = progKey3
        $progressThisTick['key3'] = progKey3 * delta

        let progKey4 = Math.pow(
            ($miningUpgradeLevels[38] > 0
                ? PROGRESS_BASE *
                  $miningUpgrades[38]['formula']($miningUpgradeLevels[38])
                : 0) *
                $miningUpgrades[26]['formula']($miningUpgradeLevels[26]) *
                $beaconBonuses[5] *
                progressBonusMulti *
                $challenge3Multi *
                progressMultiArtifacts *
                challengeMultiplier *
                GLOBAL_MULTI,
            challengeExponent
        )

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

    let tempGemProgress = 0
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

        // optimize out of focus
        // if (delta > 16) {
        //     console.log("oi");
        //     addGems(
        //         ($progressThisTick["gems"] / $progressThreshold["gems"]) * 0.9
        //     );

        //     mineXpBackup = $mineLevel["xp"];
        //     $mineLevel["xp"] +=
        //         ($progressThisTick["gems"] / $progressThreshold["gems"]) *
        //         formula.getMineXPPerCycle();

        //     if ($challengeActive !== 0) {
        //         $wallet["warp"] =
        //             ($wallet["warp"] || 0) +
        //             Math.log($progressAverage["gems"] + 1) *
        //                 (UPDATE_SPEED / 1000) *
        //                 (1 + $challengesCompleted[$challengeActive - 1] * 0.33);
        //     }

        //     if (isNaN($mineLevel["xp"])) {
        //         $mineLevel["xp"] = mineXpBackup;
        //     }

        //     tempGemProgress += $progressAverage["gems"] * delta;
        //     if (tempGemProgress > $progressThreshold["gems"]) {
        //         console.log(
        //             Math.floor(tempGemProgress / $progressThreshold["gems"])
        //         );
        //         dropRoll(
        //             Math.floor(tempGemProgress / $progressThreshold["gems"])
        //         );
        //         tempGemProgress %= $progressThreshold["gems"];
        //     }

        //     addKey1(
        //         ($progressThisTick["key1"] / $progressThreshold["key1"]) * 0.9,
        //         keyAt
        //     );
        //     addKey2(
        //         ($progressThisTick["key2"] / $progressThreshold["key2"]) * 0.9,
        //         keyAt
        //     );
        //     addKey3(
        //         ($progressThisTick["key3"] / $progressThreshold["key3"]) * 0.9,
        //         keyAt
        //     );
        //     enchProgressBackup = $enchantProgress["t1"];
        //     $enchantProgress["t1"] +=
        //         $progressThisTick["gems"] / $progressThreshold["gems"];
        //     if ($enchantProgress["t1"] > $enchantThreshold["t1"]) {
        //         procEnchants(
        //             Math.floor(
        //                 $enchantProgress["t1"] / $enchantThreshold["t1"]
        //             ),
        //             "t1"
        //         );
        //         $enchantProgress["t1"] %= $enchantThreshold["t1"];
        //     }

        //     if (isNaN(enchProgressBackup)) {
        //         $enchantProgress["t1"] = enchProgressBackup;
        //     }
        //     if ($challengeActive !== 0 && $challengeActive !== 4) {
        //         $wallet["warp"] =
        //             ($wallet["warp"] || 0) +
        //             Math.log($progress["gems"] + 1) *
        //                 (UPDATE_SPEED / 1000) *
        //                 (1 + $challengesCompleted[$challengeActive - 1] * 0.33);
        //     }
        //     sanityChecks();
        //     if ($challengeActive !== 0) {
        //         for (let i of [
        //             "gems",
        //             "key1",
        //             "key2",
        //             "key3",
        //             "key4",
        //             "key5",
        //         ]) {
        //             addChallengePoints(
        //                 ($progressThisTick[i] || 0) /
        //                     ($progressThreshold[i] || 1),
        //                 i,
        //                 true
        //             );
        //         }
        //     }
        //     return;
        // }

        for (let [k, v] of Object.entries($progressThisTick)) {
            if (isNaN($progress[k])) $progress[k] = 0
            $progress[k] += v
        }

        if ($progress['gems'] >= gemAt) {
            // increase fame thresholds
            // TODO: implement enchant proc method
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

            $mineLevel['xp'] +=
                ($progress['gems'] / gemAt) * formula.getMineXPPerCycle()

            $progress['gems'] = 0
        }
        // add keys
        if ($progress['key1'] >= keyAt[0]) {
            addKey1(Math.floor($progress['key1'] / keyAt[0]), keyAt)
        }
        if ($progress['key2'] >= keyAt[1]) {
            addKey2(Math.floor($progress['key2'] / keyAt[1]), keyAt)
        }
        if ($progress['key3'] >= keyAt[2]) {
            addKey3(Math.floor($progress['key3'] / keyAt[2]), keyAt)
        }
        if ($progress['key4'] >= keyAt[3]) {
            addKey4(Math.floor($progress['key4'] / keyAt[3]), keyAt)
        }
        // add warp for being in a challenge
        if ($challengeActive !== 0) {
            $wallet['warp'] =
                ($wallet['warp'] || 0) +
                Math.log($progress['gems'] + 1) *
                    (UPDATE_SPEED / 1000) *
                    (1 + $challengesCompleted[$challengeActive - 1] * 0.33)
        }

        // glorious space turtles upgrade
        $wallet['fame'] =
            ($wallet['fame'] || 0) +
            $miningUpgrades[28]['formula']($miningUpgradeLevels[28]) *
                (UPDATE_SPEED / 1000)

        sanityChecks()
    }

    function addChallengePoints(n, t) {
        $wallet['challengePoints'] =
            ($wallet['challengePoints'] || 0) +
            formula.calcChallengePointGain(n, t)
    }

    /**
     * @param n - number of times to add gems
     */
    let lastGemGainTextUpdate = Date.now()
    function addGems(n, avgProgress) {
        if (isNaN(n)) {
            n = 1
        }
        if ($challengeActive === 3) {
            $challenge3Multi *= 0.999 - $challengesCompleted[2] * 0.001
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

        if ($challengeActive !== 0) {
            addChallengePoints(n, 'gems')
        }
    }

    function addKey1(n, keyAt) {
        const KEY1_BASE = 8
        const key1Gain =
            KEY1_BASE *
            $beaconBonuses[5] *
            $miningUpgrades[5]['formula']($miningUpgradeLevels[5]) *
            $miningUpgrades[26]['formula']($miningUpgradeLevels[26]) *
            formula.calcKeyFinderAbundanceBonus(1)

        $wallet['key1'] = ($wallet['key1'] || 0) + key1Gain * n
        $progress['key1'] %= keyAt[0]
        $keyGainFlavorText['key1'] = key1Gain

        if ($challengeActive !== 0) {
            addChallengePoints(n, 'key1')
        }
    }

    function addKey2(n, keyAt) {
        const KEY2_BASE = 1
        const key2Gain =
            KEY2_BASE *
            $beaconBonuses[5] *
            $miningUpgrades[5]['formula']($miningUpgradeLevels[5]) *
            $miningUpgrades[26]['formula']($miningUpgradeLevels[26])* 
            formula.calcKeyFinderAbundanceBonus(2)

        $wallet['key2'] = ($wallet['key2'] || 0) + key2Gain * n
        $progress['key2'] %= keyAt[1]
        $keyGainFlavorText['key2'] = key2Gain

        if ($challengeActive !== 0) {
            addChallengePoints(n, 'key2')
        }
    }

    function addKey3(n, keyAt) {
        const KEY3_BASE = 0.075
        const key3Gain =
            KEY3_BASE *
            $beaconBonuses[5] *
            $miningUpgrades[5]['formula']($miningUpgradeLevels[5]) *
            $miningUpgrades[26]['formula']($miningUpgradeLevels[26])*
            formula.calcKeyFinderAbundanceBonus(3)

        $wallet['key3'] = ($wallet['key3'] || 0) + key3Gain * n
        $progress['key3'] %= keyAt[2]
        $keyGainFlavorText['key3'] = key3Gain

        if ($challengeActive !== 0) {
            addChallengePoints(n, 'key3')
        }
    }

    function addKey4(n, keyAt) {
        const KEY4_BASE = 0.0016
        const key3Gain =
            KEY4_BASE *
            $beaconBonuses[5] *
            $miningUpgrades[5]['formula']($miningUpgradeLevels[5]) *
            $miningUpgrades[26]['formula']($miningUpgradeLevels[26])*
            formula.calcKeyFinderAbundanceBonus(3)

        $wallet['key4'] = ($wallet['key4'] || 0) + key3Gain * n
        $progress['key4'] %= keyAt[2]
        $keyGainFlavorText['key4'] = key3Gain

        if ($challengeActive !== 0) {
            addChallengePoints(n, 'key4')
        }
    }

    function dropRoll(n) {
        let rewards = {}
        for (let [item, vals] of Object.entries($miningDropTable)) {
            if ($visibleTier >= vals[4]) {
                // when P(x) >= 1
                if (vals[0] >= 1) {
                    rewards[item] =
                        (rewards[item] || 0) +
                        n * (vals[1] + Math.random() * (vals[2] - vals[1]))
                    continue
                    // when E[x] > 1 but P(x) < 1
                } else if (n * vals[0] >= 1) {
                    const stdev = Math.sqrt(n * vals[0] * (1 - vals[0]))
                    const val = Array.from(
                        { length: Math.floor(Math.sqrt(n)) },
                        () =>
                            Math.floor(
                                vals[1] + Math.random() * (vals[2] - vals[1])
                            )
                    )
                    const c = Math.random() * 2.83 + 0.01
                    const numWins =
                        vals[0] * n +
                        Math.max(
                            (Math.random() > 0.5 ? 1 : -1) *
                                stdev *
                                Math.pow(c / (c - 5), 6),
                            0
                        )

                    // monte carlo value selector
                    const rewardVal =
                        (val[Math.floor(Math.random() * val.length)] +
                            val[Math.floor(Math.random() * val.length)] +
                            val[Math.floor(Math.random() * val.length)]) /
                        3

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

                    rewards[item] = (rewards[item] || 0) + valGain
                }
            }
        }

        for (let [item, val] of Object.entries(rewards)) {
            $wallet[item] = ($wallet[item] || 0) + val
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
                $keyCraftAmount[item]++
                $wallet[item] =
                    ($wallet[item] || 0) + formula.calcKeyCraftAmountGained(i)
                $keyCraftTimes[item][1] = -1

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
                            'increased! (' +
                            $keyCraftMastery[item][0] +
                            ')',
                        'text-amber-400',
                        'crafting'
                    )
                }
                addToActivityLog(
                    '[Crafting] Crafting complete: +' +
                        f(formula.calcKeyCraftAmountGained(i)) +
                        ' ' +
                        $keyCrafts[i]['name'],
                    $keyCrafts[i]['style'] || 'text-white',
                    'crafting'
                )
            }
        }
    }

    function checkForChallengeCompletion() {
        if (
            $wallet['challengePoints'] >
            ($challengeGoals[$challengeActive - 1] || 1e300)
        ) {
            $challengesCompleted[$challengeActive - 1]++

            $wallet['challengePoints'] = 0
            $wallet['trophies'] = ($wallet['trophies'] || 0) + 1
            challengeGoals.updateChallengeReqs()
            addToActivityLog(
                '[Challenges] Challenge ' +
                    $challengeActive +
                    ' completed! (Completion ' +
                    $challengesCompleted[$challengeActive - 1] +
                    ')',
                'text-amber-400',
                'challenges'
            )
            if ($challengeActive === 2) {
                $challengeActive = 0

                for (let i in $miningUpgradeLevels) {
                    $miningUpgradeLevelsBought[i] =
                        $miningUpgradeLevelsBoughtTemp[i]
                    $miningUpgradeLevelsFree[i] =
                        $miningUpgradeLevelsFreeTemp[i]
                }
                for (let i in $miningUpgradeLevels) {
                    $miningUpgradeLevelsTemp[i] = 0
                    $miningUpgradeLevelsBoughtTemp[i] = 0
                    $miningUpgradeLevelsFreeTemp[i] = 0
                }

                $miningUpgradeLevels = $miningUpgradeLevels.map(
                    (x, i) =>
                        $miningUpgradeLevelsBought[i] +
                        $miningUpgradeLevelsFree[i]
                )

                console.log($miningUpgradeLevels)
                console.log($miningUpgradeLevelsBought)
            }

            $challengeActive = 0
            $wallet['challengePoints'] = 0
        }
    }

    let locks = new Set() // makes sure levelups don't repeat when leveling up from next function call
    function addBeaconProgress(delta, isOffFocus = false) {
        if (isNaN($resources['beaconPower'])) $resources['beaconPower'] = 0
        const progressGains = $beaconActivations.map(
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
        // adds progressGains to progress
        const challenge4Multi =
            $challengeActive == 4
                ? Math.max(
                      1e-18,
                      1e-2 / Math.pow(10, $challengesCompleted[3] || 0)
                  )
                : 1
        $beaconProgress = $beaconProgress.map(
            (e, i) =>
                e +
                Math.pow(
                    progressGains[i],
                    $challengeActive == 4
                        ? Math.max(0.05, 0.9 - $challengesCompleted[3] * 0.05)
                        : 1
                ) *
                    challenge4Multi
        )
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

                if ($challengeActive === 4) {
                    $wallet['challengePoints'] +=
                        numLevels * ref.challengePointValues['beaconLevels']
                }

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
            25 *
            (UPDATE_SPEED / 1000) *
            $beaconLevels.reduce(
                (s, c) => s * (c > 10000 ? Math.log10(c) - 3 : 1),
                1
            ) *
            $beaconBonuses[0] *
            delta

        $resources['beaconPower'] = ($resources['beaconPower'] || 0) + bpGain
        if (challengeActive !== 0) {
            $wallet['challengePoints'] =
                ($wallet['challengePoints'] || 0) +
                formula.calcChallengePointGain(bpGain, 'beaconPower')
        }
        $beaconPowerFlavorText = bpGain
    }

    function updateBeaconBonuses() {
        for (let i = 0; i < $beaconLevels.length; i++) {
            $beaconBonuses[i] = $beaconFormulas[i]($beaconLevels[i])
        }
    }

    let lightningBlastLockout = false
    /**
     * @param {number | undefined} [n]
     * @param {string | undefined} [tier]
     */
    function procEnchants(n, tier) {
        if (n > 100) return
        const size = $enchantUpgrades[0]['formula']($enchantUpgradeLevels[0])
        const quality = $enchantUpgrades[1]['formula']($enchantUpgradeLevels[1])

        for (let [i, ench] of $enchantUpgrades.entries()) {
            if (ench['tier'] != tier) continue
            const rand = Math.random() / n

            if (rand < ench['formula']($enchantUpgradeLevels[i])) {
                switch (i) {
                    case 0:
                        break
                    case 1:
                        break
                    case 2: // burst
                        addGems(size / 15)
                        addToActivityLog(
                            '[Burst] +' + f(size / 15) + ' mining cycles',
                            'text-violet-300',
                            'burst'
                        )
                        break
                    case 3: // orb rush
                        const val =
                            (Math.random() + 0.3) * Math.pow(1 + (quality/20), 3.5)
                        $wallet['orbs'] += val
                        addToActivityLog(
                            '[Orb Rush] +' + f(val) + ' orbs',
                            'text-violet-300',
                            'orb rush'
                        )
                        break
                    case 4: // lightning blast
                        if (lightningBlastLockout) break
                        progressBonusMulti *= Math.pow(size, 0.7) * 3 + 3
                        lightningBlastLockout = true
                        setTimeout(() => {
                            progressBonusMulti /= Math.pow(size, 0.7) * 3 + 3
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
                                f(Math.pow(size, 0.7) * 3 + 3) +
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
                    case 6: // key boon
                        const keyRand = Math.random() + 0.2 * (quality / 1e6)
                        const BASE_KEYGAIN = size
                        let tier, amtDivider
                        const randFactor = Math.random() * 0.2 + 0.9
                        let reward = 1 + Math.floor(randFactor * BASE_KEYGAIN)
                        if (keyRand > 1.18) {
                            tier = 5
                            reward = reward / 250000 + 1
                            addToActivityLog(
                                '[KEY BOON] INCREDIBLE! +' +
                                    f(reward) +
                                    ' [*****] keys!',
                                'text-amber-400',
                                'key boon'
                            )
                        } else if (keyRand > 1.15) {
                            tier = 4
                            reward = reward / 10000 + 1
                            addToActivityLog(
                                '[Key Boon] Excellent! +' +
                                    f(reward) +
                                    ' [****] keys',
                                'text-violet-400',
                                'key boon'
                            )
                        } else if (keyRand > 0.9975) {
                            tier = 3
                            reward = reward / 1000 + 1
                            addToActivityLog(
                                '[Key Boon] Great! +' +
                                    f(reward) +
                                    ' [***] keys',
                                'text-pink-300',
                                'key boon'
                            )
                        } else if (keyRand > 0.925) {
                            tier = 2
                            reward = reward / 10 + 1
                            addToActivityLog(
                                '[Key Boon] Great! +' +
                                    f(reward) +
                                    ' [**] keys',
                                'text-blue-300',
                                'key boon'
                            )
                        } else {
                            tier = 1
                            reward = reward * 10 + 1
                            addToActivityLog(
                                '[Key Boon] +' + f(reward) + ' [*] keys',
                                'text-green-300',
                                'key boon'
                            )
                        }
                        $wallet['key' + tier] += reward
                        break
                    case 7: //clicker hero
                        const BASE_REWARD = size / 100
                        const absDist = Math.random() * (400 - quality / 2550)
                        let rewardAmount, rewardDescriptionText, rewardStyle
                        if (absDist < 1) {
                            rewardAmount = 120000
                            rewardDescriptionText = 'PERFECT! +'
                            rewardStyle = 'text-amber-500'
                        } else if (absDist <= 2) {
                            rewardAmount = 9000
                            rewardDescriptionText = 'INCREDIBLE +'
                            rewardStyle = 'text-pink-500'
                        } else if (absDist <= 4) {
                            rewardAmount = 750
                            rewardDescriptionText = 'Excellent +'
                            rewardStyle = 'text-violet-500'
                        } else if (absDist <= 7) {
                            rewardAmount = 85
                            rewardDescriptionText = 'Great +'
                            rewardStyle = 'text-sky-500'
                        } else if (absDist <= 10) {
                            rewardAmount = 25
                            rewardDescriptionText = 'Good +'
                            rewardStyle = 'text-green-500'
                        } else {
                            rewardAmount = 10
                            rewardDescriptionText = 'Okay +'
                            rewardStyle = 'text-gray-400'
                        }
                        rewardAmount = Math.floor(rewardAmount * BASE_REWARD)
                        $buttonRadiumProgress[0] += rewardAmount
                        if (
                            $buttonRadiumProgress[0] >= $buttonRadiumProgress[1]
                        ) {
                            $wallet['radium'] += Math.floor(
                                $buttonRadiumProgress[0] /
                                    $buttonRadiumProgress[1]
                            )
                            $buttonRadiumProgress[0] %= $buttonRadiumProgress[1]
                        }
                        addToActivityLog(
                            '[Clicker Hero] ' +
                                rewardDescriptionText +
                                f(rewardAmount) +
                                ' radioactivity',
                            rewardStyle,
                            'clicker hero'
                        )
                        break
                    case 8: // rift tearing
                        const essences = ['efire', 'eearth', 'ewater', 'emagic', 'ecelestial'];
                        const type = essences[Math.floor(Math.random() * essences.length)];
                        const amt = Math.ceil(size / 1275) + 1;
                        $wallet[type] = ($wallet[type] || 0) + amt;
                        addToActivityLog('[Rift Tearing] +' + f(amt) + ' ' + type.substring(1) + ' essence', 
                        // @ts-ignore
                        ref.colors[type], 'rift tearing');
                        break
                    case 9: // double down
                        addToActivityLog('[Double Down] Another enchant cycle completed.', 'text-violet-300', 'double down')
                        procEnchants();
                }
            }
        }
    }
</script>
