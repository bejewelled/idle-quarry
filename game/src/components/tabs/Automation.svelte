<div class='wrapper py-2'>
    <div class='py-2'>
        <div class='fame-upgrade-wrapper grid grid-cols-2 pt-2'>
            <div class='col-span-2 p-1 content-center items-center'>
                <label class='items-center col-span-2'>
                    <input hidden type='checkbox' class='form-checkbox display-none'
                     bind:checked={showBought}/>
                     <span class='p-1 
                     col-span-2 items-center game-text {showBought ? 'game-btn-toggleon' : 'game-btn'}'>
                        Show purchased upgrades
                     </span>
                </label>
            </div>
            {#each Object.entries($automationUpgrades) as upgrade,i}
                {#if ($automationUpgrades[i]['unlockAt']()) &&
                (showBought || !$automationItemsUnlocked[upgrade[1]['name'].toLowerCase()])}
                <div class='py-1 col-span-1 mine-upgrade-button-wrapper'>
                     <AutomationUpgradeButton index={i}/>
                </div>
                {/if}
            {/each}
        </div>
    </div>
</div>

<div class='pb-16 pt-8 tooltip-text text-center w-full italic'>
    Any augments that boost production do so multiplicatively. <br/>
</div>

    




<script lang='ts'>
 //@ts-nocheck
import { onMount, onDestroy } from 'svelte';
import {progress, wallet, miningDropTable, miningUpgradeLevels, 
    settings, visibleTier, progressThisTick, progressAverage,
    beaconActivations, beaconLevels, beaconProgress, resources,
     keysOpened, unlockedRes, beaconUpgradeLevels, flags, enchantUpgradeLevels,
    automationItemsUnlocked, enchantProgress} from '../../data/player';
import {progressThreshold, progressPerTick, miningUpgrades,
gemGainFlavorText, gemProgressFlavorText } from '../../data/mining';
import {keyGainFlavorText} from '../../data/keys';
import {beaconPower, beaconBonuses,
    beaconFormulas, beaconNums, beaconNextReqs, beaconSpendAmt ,
beaconUpgrades, beaconNameText, baseBeaconNextReqs} from '../../data/beacons';
import {enchantUpgrades, enchantThreshold, automationUpgrades} from '../../data/fame';
import MiningUpgradeButton from '../buttons/MiningUpgradeButton.svelte';
import ref from '../../calcs/ref'
import formula from '../../calcs/formula';
import BeaconToggleButton from '../buttons/BeaconToggleButton.svelte';
import BeaconPowerUpgradeButton from '../buttons/BeaconPowerUpgradeButton.svelte';
import FameUpgradeButton from '../buttons/EnchantUpgradeButton.svelte';
import AutomationUpgradeButton from '../buttons/AutomationUpgradeButton.svelte';


$: encht1BarWidth = `${$enchantProgress['t1']/$enchantThreshold['t1'] * 100}%`
$: pbarWidths = Array(30).fill(0);
$: beaconDispBonus = $beaconBonuses
$: fameGainKeys = formula.calcFameGainKeys($keysOpened);
$: fameMultiGems = formula.calcFameGemMulti($wallet['gems']);
$: fameMultiBeaconLevels = formula.calcFameGainBeacons(formula.sumArray($beaconLevels));
let beaconDispBonus = $beaconBonuses;
let reloadClock = true;
let reloadNumbers;
let showBought = false;

onMount(() => {
    const reloadFameGain = setTimeout(() => {
        fameGainKeys = formula.calcFameGainKeys($keysOpened);
        fameMultiGems = formula.calcFameGemMulti($wallet['gems']);
        fameMultiBeaconLevels = formula.calcFameGainBeacons(formula.sumArray($beaconLevels));
    }, 100)
    reloadNumbers = setInterval(() => {
        reloadClock= !reloadClock;
    }, 1049)
})

onDestroy(() => {
    clearInterval(reloadNumbers)
})
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

const fameGridInfo = [
    {
     name: 'Keys Used',
     value: () => formula.sumArray(fameGainKeys || []),
     criteria: true
    },
    {
     name: 'Gem Amount', 
     value: () => fameMultiGems, 
     colorRef: 'gems',
     criteria: $wallet['gems'] > 0
    },
    {
     name: 'Beacon Paths', 
     value: () => fameMultiBeaconLevels,
     colorRef: 'beacons',
     criteria: $wallet['beacons'] > 0
    },
]

function calcFameGain() {
    return formula.sumArray(fameGainKeys) * fameMultiGems * fameMultiBeaconLevels;
}

const walletResetItems = ['gems', 'gold', 'orbs', 'beacons']
const resourceResetItems = ['beaconPower']

const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']



</script>