<div class='wrapper py-2'>
<div class='grid grid-cols-12 game-text text-center'>
    <div class='col-span-12'>Relocate to a new mine and gain
        <span class='text-orange-400'> fame </span> based on your past success.
    </div>
    <div class='col-span-12 py-1'>You will gain [PLACEHOLDER] fame by relocating.</div>
    <div class='col-span-12 py-1'><hr /></div> 
    <div class='col-span-4 py-1'>Keys Used: </div>
    <div class='col-span-1 py-1'></div>
    <div class='col-span-8 py-1'>
        {#each $keysOpened as k, i}
            <span class='{ref.colors['key'+((i+1).toString())]}'>
                {" " + f(fameGainKeys[i],0)} </span> {#if i < $keysOpened.length}+{/if} 
        {/each}
    </div>
    </div>
</div>



<script lang='ts'>
 //@ts-nocheck
import { onMount } from 'svelte';
import {progress, wallet, miningDropTable, miningUpgradeLevels, 
    settings, visibleTier, progressThisTick, progressAverage,
    beaconActivations, beaconLevels, beaconProgress, resources,
     keysOpened, unlockedRes} from '../../data/player';
import {progressThreshold, progressPerTick, miningUpgrades, antiFlickerFlags,
gemGainFlavorText, gemProgressFlavorText } from '../../data/mining';
import {keyGainFlavorText} from '../../data/keys';
import {beaconPower, beaconBonuses,
    beaconFormulas, beaconNums, beaconNextReqs, beaconAmt,
beaconUpgrades, beaconNameText} from '../../data/beacons';
import MiningUpgradeButton from '../buttons/MiningUpgradeButton.svelte';
import ref from '../../calcs/ref'
import formula from '../../calcs/formula';
import BeaconToggleButton from '../buttons/BeaconToggleButton.svelte';
import BeaconPowerUpgradeButton from '../buttons/BeaconPowerUpgradeButton.svelte';

$: pbarWidths = Array(30).fill(0);
$: beaconDispBonus = $beaconBonuses
$: fameGainKeys = formula.calcFameGainKeys($keysOpened);
let beaconDispBonus = $beaconBonuses;

onMount(() => {
    beaconDispBonus = $beaconBonuses;
    const pbarUpdater = setInterval(() => {
        for (let i = 0; i < 30; i++) {
            pbarWidths[i] = Math.min(100, ($beaconProgress[i] / $beaconNextReqs[i]) * 100)
        }
        pbarWidths = pbarWidths;
    }, $settings['UPDATE_SPEED'])
})



const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']

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

</script>