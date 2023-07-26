<div class='wrapper py-2'>

<div class='py-2'>
</div>

<div class='grid grid-cols-12'>
    <div class='col-span-12 text-white'>Mastery - Do nothing, get trophies (STILL WIP STAY TUNED)</div>
    <div class='col-span-12 text-white text-small'>Progress to Next Trophy - 
        <span class='text-orange-400'>{f($wallet['mastery'] || 0)} / {f($masteryNextReq)}</span>
    </div>
    <div class='col-span-12 text-white text-small'>Your mastery 
        <span class='text-orange-400'>({f($wallet['totalTrophies'])})</span>
    is producing <span class='{ref.colors['warp']}'>{f(formula.calcWarpGainFromMastery(), 2)} warp per second.</span></div>

<div class='col-span-12'>
    <div class='mine-bar-wrapper align-middle'>
        <div class="w-full my-1 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 has-tooltip">
            <div class="bg-orange-400 h-2.5 rounded-full has-tooltip" 
            style="width: {masteryBarWidth}">

        </div>
        </div>
    </div>
</div>
</div>
</div>


<script lang='ts'>
	import { masteryNextReq } from '../../data/mastery.js';
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
miningUpgradeLevelsFreeTemp, miningUpgradeLevelsTemp} from '../../data/player.js';
import {buttonUpgrades} from '../../data/button.js';
import {progressThreshold, progressPerTick, miningUpgrades,
gemGainFlavorText, gemProgressFlavorText } from '../../data/mining.js';
import {keyGainFlavorText} from '../../data/keys.js';
import {beaconPower, beaconBonuses,
    beaconFormulas, beaconNums, beaconNextReqs, beaconSpendAmt ,
beaconUpgrades, beaconNameText, baseBeaconNextReqs} from '../../data/beacons.js';
import {enchantUpgrades, enchantThreshold} from '../../data/fame.js';
import ref from '../../calcs/ref.js'
import formula from '../../calcs/formula.js';

$: masteryBarWidth = `${($wallet['mastery']||0) / $masteryNextReq * 100}%`;

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
                    $miningUpgradeLevelsBought[i] = $miningUpgradeLevelsBoughtTemp[i];
                    $miningUpgradeLevelsFree[i] = $miningUpgradeLevelsFreeTemp[i];
                }
                for (let i in $miningUpgradeLevels) {
                    $miningUpgradeLevelsTemp[i] = 0;
                    $miningUpgradeLevelsBoughtTemp[i] = 0;
                    $miningUpgradeLevelsFreeTemp[i] = 0;
                }
            }
            $challengeActive = 0;
            $wallet['challengePoints'] = 0;
        }
    } else {
        console.log(i);
        $wallet['challengePoints'] = 0;
        if (i == 2) {
            let y = confirm("Are you sure? ALL mining upgrades will be lost!")
            if (y) {
                $wallet['challengePoints'] = 0;
                $challengeActive = i;
                for (let i in $miningUpgrades) {
                        console.log($miningUpgrades[i]['name'])
                        $miningUpgradeLevelsTemp[i] = $miningUpgradeLevels[i];
                        $miningUpgradeLevelsBoughtTemp[i] = $miningUpgradeLevelsBought[i];
                        $miningUpgradeLevelsFreeTemp[i] = $miningUpgradeLevelsFree[i];
                        
                }

                for (let i in $miningUpgradeLevels) {
                        $miningUpgradeLevels[i] = 0;
                        $miningUpgradeLevelsBought[i] = 0;
                        $miningUpgradeLevelsFree[i] = 0;
                }
                console.log($miningUpgradeLevelsBoughtTemp)
            console.log($miningUpgradeLevelsFreeTemp)
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