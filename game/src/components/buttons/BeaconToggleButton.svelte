
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class='grid grid-cols-2'>
<div on:click={() => add()}
class='has-tooltip tooltip-text game-btn
py-2 items-center text-center border-solid select-none m-1'>+</div>
    <div on:click={() => sub()}
        class='has-tooltip tooltip-text 
        game-btn py-2 items-center text-center 
        border-solid select-none m-1'>-</div>
</div>
  

        

 <script>
// @ts-nocheck
import { onMount, onDestroy } from 'svelte';
import {progress, wallet, miningDropTable, miningUpgradeLevels, 
    settings, visibleTier, progressThisTick, progressAverage,
    beaconActivations, beaconLevels} from '../../data/player';
import {progressThreshold, progressPerTick, miningUpgrades, antiFlickerFlags,
gemGainFlavorText, gemProgressFlavorText } from '../../data/mining';
import {keyGainFlavorText} from '../../data/keys';
import {beaconPower, beaconBonuses, beaconFormulas, 
    beaconNums, beaconNextReqs, beaconSpendAmt} from '../../data/beacons';
import MiningUpgradeButton from '../buttons/MiningUpgradeButton.svelte';
import ref from '../../calcs/ref'
// @ts-nocheck

    export let index;
    let affordable, unlocked;
    let permUnlocked = ($miningUpgradeLevels[index] > 0)
    let affordInterval;
    
    onMount(() => {
    })

    onDestroy(() => {
    })
    const f = (n, pl = 0) => {
        if (n < 1e9) return n.toFixed((n < 1e3 ? pl : 0)).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        else return n.toExponential(3).toString().replace('+', '');
    }   

    const fp = (n, pl = 3, subOne = false) => {
        if (subOne) n -= 1;
        if (n < 1e9) return (n*100).toFixed((n < 1e3 ? pl : 0)).toLocaleString() + "%";
        else return (n*100).toExponential(pl).toString().replace('+', '') + "%";
    }

    function add() {
        if (!$wallet['beacons'] || $wallet['beacons']===0) return;
        const amt = Math.min($wallet['beacons'], $beaconSpendAmt);
        $wallet['beacons'] -= amt;
        $beaconActivations[index] += amt;
    }

    function sub() {
        const amt = Math.min($beaconActivations[index], $beaconSpendAmt);
        $beaconActivations[index] -= amt;
        $wallet['beacons'] += amt;
    }

    function isUnlocked() {
        for (let [type, val] of Object.entries($miningUpgrades[index]['unlockAt'])) {
            if ($wallet[type] < val) {
                return false;
            }
        }  
        return true;
    }

 </script>
<style>

</style>