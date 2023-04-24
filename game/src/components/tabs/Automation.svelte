<div class='wrapper py-2'>
    <div class='py-2'>
        <div class='fame-upgrade-wrapper grid grid-cols-2 pt-2'>
            {#each Object.entries($automationUpgrades) as upgrade,i}
                {#if $automationUpgrades[i]['unlockAt']()}
                <div class='py-1 col-span-1 mine-upgrade-button-wrapper'>
                     <AutomationUpgradeButton index={i}/>
                </div>
                {/if}
            {/each}
        </div>
    </div>
</div>
    




<script lang='ts'>
 //@ts-nocheck
import { onMount, onDestroy } from 'svelte';
import {progress, wallet, miningDropTable, miningUpgradeLevels, 
    settings, visibleTier, progressThisTick, progressAverage,
    beaconActivations, beaconLevels, beaconProgress, resources,
     keysOpened, unlockedRes, beaconUpgradeLevels, flags, fameUpgradeLevels,
    automationItemsUnlocked} from '../../data/player';
import {progressThreshold, progressPerTick, miningUpgrades, antiFlickerFlags,
gemGainFlavorText, gemProgressFlavorText } from '../../data/mining';
import {keyGainFlavorText} from '../../data/keys';
import {beaconPower, beaconBonuses,
    beaconFormulas, beaconNums, beaconNextReqs, beaconSpendAmt ,
beaconUpgrades, beaconNameText, baseBeaconNextReqs} from '../../data/beacons';
import {fameUpgrades, enchantThreshold, enchantProgress, automationUpgrades} from '../../data/fame';
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
$: fameMultiBeaconLevels = formula.calcFameBeaconMulti(formula.sumArray($beaconLevels));
let beaconDispBonus = $beaconBonuses;
let reloadClock = true;
let reloadNumbers;

onMount(() => {
    const reloadFameGain = setTimeout(() => {
        fameGainKeys = formula.calcFameGainKeys($keysOpened);
        fameMultiGems = formula.calcFameGemMulti($wallet['gems']);
        fameMultiBeaconLevels = formula.calcFameBeaconMulti(formula.sumArray($beaconLevels));
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
function relocate() {
        if (confirm("Are you sure? Relocating will reset all previous progress.")) {
            $flags['relocateNavBack'] = true;
            $wallet['fame'] = ($wallet['fame'] || 0) + calcFameGain();


            // reset stuff
            $visibleTier = 1;
            for (let i of walletResetItems) {
                $wallet[i] = 0;
            }
            for (let i of resourceResetItems) {
                $resources[i] = 0;
            }
            for (let i of Object.entries($progress)) {
                $progress[i[0]] = 0;
                $progressAverage[i[0]] = 0;
                $progressThisTick[i[0]] = 0;
            }
            for (let i in $beaconLevels) {
                $beaconLevels[i] = 0;
                $beaconProgress[i] = 0;
                $beaconActivations[i] = 0;
            }
            console.log($progress)
            console.log($progressAverage)
            console.log($progressThisTick)
            console.log($progressThreshold)
            $beaconNextReqs = $baseBeaconNextReqs;
            $keysOpened = Array($keysOpened.length).fill(0);
            $beaconBonuses = Array(30).fill(1)
            $miningUpgradeLevels = Array($miningUpgradeLevels.length).fill(0);
            $beaconUpgradeLevels = Array($beaconUpgradeLevels.length).fill(0);
        }
}

const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']



</script>