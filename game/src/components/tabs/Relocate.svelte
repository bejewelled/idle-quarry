<div class='wrapper py-2'>
<div class='grid grid-cols-12 game-text text-center'>
    <div class='col-span-12'>Relocate to a new mine and gain
        fame based on your past success.
    </div>
    <div class='col-span-12'>Relocating resets all previous resources and upgrades. 
        Keys are not removed.
    </div>
    <div class='col-span-12 py-1'>You will gain 
        <span class='text-orange-400 font-bold'>{f(Math.floor(calcFameGain()),0)}</span> fame by relocating.</div>
    <div class='col-span-12 py-1'><hr /></div> 

    <div class='col-span-12 pt-3'>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class='
        {calcFameGain() >= 5 ? 'game-btn' : 'game-btn-noafford'} text-center' on:click={() => relocate()}>
            {calcFameGain() >= 5 ? 'Relocate' : 'You need to gain at least 5 fame to relocate.'}
        </div>
    </div>
</div>

    <div class='py-2'><hr /></div>

<div class='grid grid-cols-12'>
    {#key reloadClock}
    <!-- display for keys -->
    <div class='col-span-3 game-text text-left py-1'>Keys Used: </div>
    <div class='col-span-1 py-1 game-text text-right'>
        <span class=''>+{f(formula.sumArray(fameGainKeys), 3)}</span>
    </div>
    <div class='col-span-8 game-text text-left px-2 py-1'>
        [ 
        {#each $keysOpened as k, i}
            <span class='{ref.colors['key'+((i+1).toString())]}'>
                {" " + f(fameGainKeys[i],2)} </span> {#if i+1 < $keysOpened.length}+{/if} 
        {/each}
         ]
    </div>

    {#each fameGridInfo as fitem, i}
        {#if i > 0 && (fitem['criteria']())}
            <div class=' {ref.colors[fitem['colorRef']] || 'text-white'} 
            col-span-3 text-left py-1'>{fitem['name']}: </div>
            <div class=' {ref.colors[fitem['colorRef']] || 'text-white'}
            col-span-1 text-right py-1'>
                <span class=''>x{f(fitem['value'](), 3)}</span>
            </div>
            <div class='col-span-8'></div>
        {:else if i > 0}
        <div class=' {ref.colors[fitem['colorRef']] || 'text-white'} 
        col-span-3 text-left py-1'>???</div>
        <div class=' {ref.colors[fitem['colorRef']] || 'text-white'}
        col-span-1 text-right py-1'>
            <span class='font-bold'>x{f(fitem['value'](), 3)}</span>
        </div>
        <div class='col-span-8'></div>
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
     enchantUpgradeLevels, enchantProgress} from '../../data/player';
import {progressThreshold, progressPerTick, miningUpgrades, antiFlickerFlags,
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
     criteria: () => ($wallet['gems'] > 0)
    },
    {
     name: 'Beacon Paths', 
     value: () => fameMultiBeaconLevels,
     colorRef: 'beacons',
     criteria: () => ($wallet['beacons'] > 0 || formula.sumArray($beaconLevels) > 0)
    },
]

function calcFameGain() {
    return formula.sumArray(fameGainKeys) * fameMultiGems * fameMultiBeaconLevels;
}

const walletResetItems = ['gems', 'gold', 'orbs', 'beacons']
const resourceResetItems = ['beaconPower']
function relocate() {
    if (calcFameGain() >= 5) {
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
            for (let i in $miningUpgradeLevels) {
                if (!$miningUpgrades[i]['isFame']) $miningUpgradeLevels[i] = 0;
            }
            $beaconUpgradeLevels = Array($beaconUpgradeLevels.length).fill(0);
        }
    }
}

const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']



</script>