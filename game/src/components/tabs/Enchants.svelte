<div class='wrapper py-2'>
    <div class='fame-upgrade-wrapper grid grid-cols-2'>
        {#each Object.entries($enchantUpgrades) as upgrade,i}
            {#if i < 2}
            <div class='py-1 col-span-1 mine-upgrade-button-wrapper'>
                 <EnchantUpgradeButton index={i}/>
            </div>
            {/if}
        {/each}
    </div>
    <div class='text-[#989898] text-small pt-4'>enchant progress
        [ {f(0.01 * $progressAverage['gems']*(1000/$settings['UPDATE_SPEED'])/$progressThreshold['gems'])} / sec ]
    </div>
    <div class = 'grid grid-cols-12 pt-1'>
    <div class='{$antiFlickerFlags['enchants'] ? 'col-span-12' :'col-span-10'}'>
        <div class='ench-t1-wrapper align-middle'>
            <div class="w-full my-1 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                <div class="bg-violet-300 h-2.5 rounded-full" 
                style="width: {$antiFlickerFlags['enchants'] ? '100%' : encht1BarWidth}"></div>
            </div>
        </div>
    </div>
    <div class='{$antiFlickerFlags['enchants'] ? '' :'col-span-2'} pl-1 text-center align-text-middle'>
        <div class='text-[#989898] text-small'> <strong>
            {!$antiFlickerFlags['enchants'] ? (f($enchantProgress['t1'], 0) +  ' / ' +  f($enchantThreshold['t1'], 0)) : ''}
        </strong>

        </div>
    </div>
    </div>
    <div class='py-2'>
        <div class='fame-upgrade-wrapper grid grid-cols-2 pt-2'>
            {#each Object.entries($enchantUpgrades) as upgrade,i}
                {#if i >= 2 && $enchantUpgrades[i]['unlockAt']()}
                <div class='py-1 col-span-1 mine-upgrade-button-wrapper'>
                     <EnchantUpgradeButton index={i}/>
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
     keysOpened, unlockedRes, beaconUpgradeLevels, flags, 
     enchantUpgradeLevels, enchantProgress, antiFlickerFlags} from '../../data/player';
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
import BeaconToggleButton from '../buttons/BeaconToggleButton.svelte';
import BeaconPowerUpgradeButton from '../buttons/BeaconPowerUpgradeButton.svelte';
import EnchantUpgradeButton from '../buttons/EnchantUpgradeButton.svelte';


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


const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']



</script>