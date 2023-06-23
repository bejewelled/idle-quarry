<div class='wrapper py-2'>

<div class='py-2'>
</div>

<div class='grid grid-cols-12'>
    {#key $challengeActive}
        {#each $challengeNames as c,i}
            {#if $challengeUnlockCriteria[i]()}
                <div class='col-span-2 game-text text-left'>{c} [{$challengesCompleted[i]}]</div>
                <div class='col-span-6 align-middle tooltip-text text-xs text-justify'>{$challengeDescriptions[i]}</div>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class='col-span-2 tooltip-text text-xs'>
                    <div class='grid grid-cols-2'>
                        <div class='text-center 
                        text-amber-500'>points </div>
                        <div class='text-left col-span-1'>{f($challengeGoals[i])}</div>
                    </div>
                </div>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class='col-span-2 ml-2 align-middle mb-5 text-center 
                {$challengeActive == i+1 ? 'game-btn-toggleon' : 'game-btn'}'
                on:click={() => toggleChallenge(i+1)}>
                    {#if $challengeActive == i+1}
                        Exit
                    {:else}
                        Start
                    {/if}
                </div>
                <div class='col-span-12 py-1'></div>
            {/if}
        {/each}
        
    {/key}

</div>
</div>


<script lang='ts'>
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
miningUpgradeLevelsFreeTemp, miningUpgradeLevelsTemp} from '../../data/player';
import {challengeNames, challengeDescriptions, challengeGoals,
challengeUnlockCriteria} from '../../data/challenges';
import {buttonUpgrades} from '../../data/button';
import {progressThreshold, progressPerTick, miningUpgrades,
gemGainFlavorText, gemProgressFlavorText } from '../../data/mining';
import {keyGainFlavorText} from '../../data/keys';
import {beaconPower, beaconBonuses,
    beaconFormulas, beaconNums, beaconNextReqs, beaconSpendAmt ,
beaconUpgrades, beaconNameText, baseBeaconNextReqs} from '../../data/beacons';
import {enchantUpgrades, enchantThreshold} from '../../data/fame';
import MiningUpgradeButton from '../buttons/MiningUpgradeButton.svelte';
import ref from '../../calcs/ref'
import formula from '../../calcs/formula';


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

function toggleChallenge(i) {
    challengeGoals.updateChallengeReqs();
    if ($challengeActive == i) {
        if (confirm("Are you sure? Challenge progress will be lost.")) {
            if ($challengeActive === 2) {
                for (let i in $miningUpgradeLevels) {
                    if (!$miningUpgrades[i]['noResetRelocate'] && !($miningUpgrades[i]['name'].includes('Lootmaster'))) {
                            $miningUpgradeLevels[i] = $miningUpgradeLevelsTemp[i];
                            $miningUpgradeLevelsBought[i] = $miningUpgradeLevelsBoughtTemp[i];
                            $miningUpgradeLevelsFree[i] = $miningUpgradeLevelsFreeTemp[i];
                            $miningUpgradeLevelsTemp[i] = 0;
                            $miningUpgradeLevelsBoughtTemp[i] = 0;
                            $miningUpgradeLevelsFreeTemp[i] = 0;
                        }
                    }
            }
            $challengeActive = 0;
            $wallet['challengePoints'] = 0;
        }
    } else {
        console.log(i);
        if (i == 2) {
            let y = confirm("Are you sure? ALL mining upgrades will be lost!")
            if (y) {
                $wallet['challengePoints'] = 0;
                $challengeActive = i;
                for (let i in $miningUpgrades) {
                    if (!$miningUpgrades[i]['noResetRelocate'] && !($miningUpgrades[i]['name'].includes('Lootmaster'))) {
                        console.log($miningUpgrades[i]['name'])
                        $miningUpgradeLevelsTemp[i] = $miningUpgradeLevels[i];
                        $miningUpgradeLevelsBoughtTemp[i] = $miningUpgradeLevelsBought[i];
                        $miningUpgradeLevelsFreeTemp[i] = $miningUpgradeLevelsFree[i];
                        $miningUpgradeLevels[i] = 0;
                        $miningUpgradeLevelsBought[i] = 0;
                        $miningUpgradeLevelsFree[i] = 0;
                    }
                }
                $wallet['challengePoints'] = 0;
                $challengeActive = i;
            }

        } 
        else if (i == 4) {
            let y = confirm("Are you sure? ALL beacon path levels will be lost!")
            if (y) {
                for (let i in $beaconLevels) {
                    $beaconLevels[i] = 0;   
                    $beaconProgress[i] = 0;
                    $beaconNextReqs[i] = $baseBeaconNextReqs[i];
                }
            }
            $wallet['challengePoints'] = 0;
            $challengeActive = i;

        } else {
            $wallet['challengePoints'] = 0;
            $challengeActive = i;
        }
    }
}

</script>