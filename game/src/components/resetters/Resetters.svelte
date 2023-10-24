<script>
    import {
        keyCrafts,
        key1DropTable,
        key2DropTable,
        key3DropTable,
        key4DropTable,
        key5DropTable,
    } from './../../data/keys.ts'
    import { challengeGoals } from './../../data/challenges.ts'
    import {
        ascensionElements,
        ascensionConstants,
        ascFormula,
    } from './../../data/ascension.ts'
    import {
        buttonStats,
        baseButtonStats,
        ascensionLevels,
        keyCraftTimes,
        keyCraftMastery,
        baseKeyCraftMastery,
        keyUpgradeLevels,
        buttonNumClicks,
        baseButtonNumClicks,
        ascensionStats,
    } from './../../data/player.ts'

    import { onMount, onDestroy } from 'svelte'
    import {
        progress,
        wallet,
        miningDropTable,
        miningUpgradeLevels,
        settings,
        visibleTier,
        progressThisTick,
        progressAverage,
        beaconActivations,
        beaconLevels,
        beaconProgress,
        resources,
        keysOpened,
        unlockedRes,
        beaconUpgradeLevels,
        flags,
        enchantUpgradeLevels,
        enchantProgress,
        automationItemsUnlocked,
        mineLevel,
        buttonUpgradeLevels,
        stats,
        keyCraftAmount,
        miningUpgradeLevelsBought,
        miningUpgradeLevelsFree,
        challengesCompleted,
        radiumProgress,
        permaWallet
    } from '../../data/player'
    import { buttonUpgrades } from '../../data/button'
    import {
        progressThreshold,
        progressPerTick,
        miningUpgrades,
        gemGainFlavorText,
        gemProgressFlavorText,
    } from '../../data/mining'
    import { keyGainFlavorText } from '../../data/keys'
    import {
        beaconPower,
        beaconBonuses,
        beaconFormulas,
        beaconNums,
        beaconNextReqs,
        beaconSpendAmt,
        beaconUpgrades,
        beaconNameText,
        baseBeaconNextReqs,
    } from '../../data/beacons'
    import { enchantUpgrades, enchantThreshold } from '../../data/fame'
    import MiningUpgradeButton from '../buttons/MiningUpgradeButton.svelte'
    import ref from '../../calcs/ref'
    import formula from '../../calcs/formula'
    import BeaconToggleButton from '../buttons/BeaconToggleButton.svelte'
    import BeaconPowerUpgradeButton from '../buttons/BeaconPowerUpgradeButton.svelte'
    import EnchantUpgradeButton from '../buttons/EnchantUpgradeButton.svelte'

    const resourceResetItems = ['beaconPower']
    const sumEssence = () => {
        let sum = 0
        for (let i = 0; i < $ascensionElements.length; i++) {
            sum += $wallet['e' + $ascensionElements[i]] || 0
        }
        console.log(sum)
        return sum
    }
    export function ascend() {
        try {
            $ascensionStats['ascensionCount']++
            const antimatterOnAscend =
                ($wallet['antimatter'] || 0) + sumEssence()
            for (let i of $ascensionElements) {
                if (i == 'antimatter') {
                    $ascensionLevels[i][1] += sumEssence()
                } else {
                    $ascensionLevels[i][1] += $wallet['e' + i] || 0
                }
                if ($ascensionLevels[i][1] >= $ascensionLevels[i][2]) {
                    while ($ascensionLevels[i][1] >= $ascensionLevels[i][2]) {
                        console.log(
                            i + ' ascended!' + ' ' + $ascensionLevels[i][2]
                        )
                        $ascensionLevels[i][1] -= $ascensionLevels[i][2]
                        $ascensionLevels[i][0]++
                        $ascensionLevels[i][2] = $ascensionConstants[
                            'levelFormula'
                        ]($ascensionLevels[i][0])
                    }
                }
                console.log($ascensionLevels[i])
            }

            $wallet = {
                gems: 0,
                antimatter: antimatterOnAscend,
                totalAntimatter: antimatterOnAscend
            }
            $permaWallet = {
                gems: 0,
                antimatter: antimatterOnAscend,
                totalAntimatter: antimatterOnAscend
            }
            $resources = {}
            // for (let k in Object.keys($wallet)) {
            //     // @ts-ignore
            //     if (ref.dropTiers[k] <= walletResetTier) {
            //         delete $wallet[k];
            //     }
            // }
            $visibleTier = 1
            $miningUpgradeLevelsFree = Array(200).fill(0)
            for (let i in $miningUpgrades) {
                if (!($miningUpgrades[i]['noResetAscension']))  {
                    $miningUpgradeLevelsBought[i] = 0;
                    $miningUpgradeLevels[i] = $miningUpgradeLevelsBought[i]
                    + $miningUpgradeLevelsFree[i];
                }
            }

            $stats['relocateCount'] = 0
            $keysOpened = Array(5).fill(0)
            $keyCrafts = Array(40).fill(0)
            $beaconLevels = Array(30).fill(0)
            $beaconActivations = Array(30).fill(0)
            $buttonStats = $baseButtonStats
            $enchantUpgradeLevels = Array(200).fill(0)
            $automationItemsUnlocked = {}
            $enchantThreshold['t1'] = 100;
            $challengesCompleted = Array(30).fill(0)
            challengeGoals.updateChallengeReqs()
            $buttonNumClicks = $baseButtonNumClicks
            $radiumProgress = [0, 1000000]

            for (let k in Object.keys($keyCraftTimes)) {
                $keyCraftTimes[k] = [-1, -1]
            }
            for (let i of Object.keys($keyCraftAmount)) {
                $keyCraftAmount[i] = 0
            }

            $keyCraftMastery = $baseKeyCraftMastery
            $keyUpgradeLevels = Array(200).fill(0)
            $buttonUpgradeLevels = Array(200).fill(0)
            $beaconUpgradeLevels = Array(200).fill(0)
            $beaconBonuses = Array(30).fill(1)
            $beaconProgress = Array(30).fill(0)

            

            miningDropTable.updateTable()
            key1DropTable.updateTable()
            key2DropTable.updateTable()
            key3DropTable.updateTable()
            key4DropTable.updateTable()
            key5DropTable.updateTable()
            $beaconNextReqs = $baseBeaconNextReqs
            console.log(ascFormula.getVal('magic'))
            
            setTimeout(() => {
                console.log($keyCraftMastery)
                console.log($keyCraftAmount)
            }, 500)


        } catch (e) {
            console.log(
                'Error! Please report this on discord. Code: ascend ' + e
            )
        }
    }
</script>
