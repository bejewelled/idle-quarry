{#if !ghost}
<div class='wrapper pt-1'>
<div class='grid grid-cols-12 game-text text-center'>
    <div class='col-span-12'>Relocate to a new mine and gain
        fame based on your past success.
    </div>
    <div class='col-span-12'>Relocating resets all previous resources and upgrades.
    </div>
    <div class='col-span-12'>Tier 1 and 2 keys will be reset.</div>
    <div class='col-span-12 py-1'>You will gain 
        <span class='text-orange-400 font-bold'>{f(Math.floor(calcFameGain()),0)}</span> fame by relocating.</div>
    <div class='col-span-12 py-1'><hr /></div> 

    <div class='col-span-12 pt-3'>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class='
        {calcFameGain() >= 10 ? 'game-btn' : 'game-btn-noafford'} text-center' on:click={() => relocate()}>
            {calcFameGain() >= 10 ? 'Relocate' : 'You need to gain at least 10 fame to relocate.'}
        </div>
    </div>
</div>

    <div class='py-2'><hr /></div>

<div class='grid grid-cols-12'>
    {#key reloadClock}
    <!-- display for keys -->
    <div class='col-span-3 game-text text-left py-1'>Keys Used: </div>
    <div class='col-span-2 py-1 game-text text-right'>
        <span class=''>+{f(formula.productArray(fameGainKeys), 3)}</span>
    </div>
    <div class='col-span-7 game-text text-center px-2 py-1'>
        [ 
        {#each $keysOpened as k, i}
            <span class='{ref.colors['key'+((i+1).toString())]}'>
                {" " + f(fameGainKeys[i],2)} </span> {#if i+1 < $keysOpened.length}*{/if} 
        {/each}
         ]
    </div>

    {#each fameGridInfo as fitem, i}
        {#if i > 0 && (fitem['criteria']())}
            <div class=' {ref.colors[fitem['colorRef']] || 'text-white'} 
            col-span-3 text-left py-1'>{fitem['name']}: </div>
            <div class=' {ref.colors[fitem['colorRef']] || 'text-white'}
            col-span-2 text-right py-1'>
                <span class=''>x{f(fitem['value'](), 3)}</span>
            </div>
            <div class='col-span-7'></div>
        {:else if i > 0}
        <div class=' {ref.colors[fitem['colorRef']] || 'text-white'} 
        col-span-3 text-left py-1'>???</div>
        <div class=' {ref.colors[fitem['colorRef']] || 'text-white'}
        col-span-2 text-right py-1'>
            <span class='font-bold'>x{f(fitem['value'](), 3)}</span>
        </div>
        <div class='col-span-7'></div>
        {/if}
    {/each}
    {/key}
    </div>
</div>

<div class='pt-3 pb-16 tooltip-text text-center w-full'>
    You have relocated {f($stats['relocateCount'])} times. <br/>
    {#if $stats['relocateCount'] < 1}
        Your first relocate should yield approximately 30-40 fame for optimal progression.
    {:else if $stats['relocateCount'] < 2}
        Your second relocate should yield at least 100 fame.
    {/if}
</div>
{/if}
    



<script lang='ts'>
	import { resetLastTimes } from './../../data/player.ts';
	import { ascFormula } from './../../data/ascension.ts';
	import { allMultipliers } from './../../data/artifacts';
 //@ts-nocheck
import { onMount, onDestroy } from 'svelte';
import {progress, wallet, miningDropTable, miningUpgradeLevels, 
    settings, visibleTier, progressThisTick, progressAverage,
    beaconActivations, beaconLevels, beaconProgress, resources,
     keysOpened, unlockedRes, beaconUpgradeLevels, flags, 
     enchantUpgradeLevels, enchantProgress, automationItemsUnlocked,
    mineLevel, buttonUpgradeLevels, stats, keyCraftAmount,
miningUpgradeLevelsBought, miningUpgradeLevelsFree, layer} from '../../data/player';
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
import BeaconToggleButton from '../buttons/BeaconToggleButton.svelte';
import BeaconPowerUpgradeButton from '../buttons/BeaconPowerUpgradeButton.svelte';
import EnchantUpgradeButton from '../buttons/EnchantUpgradeButton.svelte';


$: encht1BarWidth = `${$enchantProgress['t1']/$enchantThreshold['t1'] * 100}%`
$: pbarWidths = Array(30).fill(0);
$: beaconDispBonus = $beaconBonuses
$: fameGainKeys = formula.calcFameGainKeys($keysOpened);
$: fameMultiGems = formula.calcFameGemMulti($wallet['gems']);
$: fameMultiLayer = formula.calcFameLayerMulti();
$: fameMultiBeaconLevels = formula.calcFameGainBeacons(formula.sumArray($beaconLevels));
let beaconDispBonus = $beaconBonuses;
let reloadClock = true;
let reloadNumbers;
export let ghost;

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


// make sure to update the actual formula when updating this!
const fameGridInfo = [
    {
     name: 'Keys Used',
     value: () => formula.productArray(fameGainKeys || []),
     criteria: true
    },
    {
     name: 'Mining Level', 
     value: () => ($mineLevel['level']**1.5)*0.15 + 1, 
     colorRef: 'gold',
     criteria: () => ($wallet['gems'] > 0)
    },
    {
     name: 'Current Layer', 
     value: () => fameMultiLayer, 
     colorRef: 'layer',
     criteria: () => ($wallet['gems'] > 0)
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
    {
     name: 'Fame Bonus (Beacons)', 
     value: () => $beaconFormulas[4]($beaconLevels[4]),
     colorRef: 'beacons',
     criteria: () => ($wallet['beacons'] > 0 || formula.sumArray($beaconLevels) > 0)
    },
    {
     name: 'Legendary Upgrades', 
     value: () => ($miningUpgrades[16]['formula']($miningUpgradeLevels[16]) 
        * $miningUpgrades[17]['formula']($miningUpgradeLevels[17])),
     colorRef: '',
     criteria: () => ($wallet['totalFame'] > 200 || $wallet['fame'] > 200
     || $miningUpgradeLevels[16] > 0 || $miningUpgradeLevels[17] > 0 || $miningUpgradeLevels[19] > 0)
    },
    {
     name: 'Phantom Legend', 
     value: () => ($miningUpgrades[37]['formula']($miningUpgradeLevels[37])),
     colorRef: 'antimatter',
     criteria: () => ($wallet['antimatter'] > 0 || $wallet['totalAntimatter'] > 0)
    },
]

// make sure to update the description when updating this!
function calcFameGain() {
    return formula.productArray(fameGainKeys)
    * (($mineLevel['level']**1.5)*0.15 + 1)
    * fameMultiGems 
    * fameMultiLayer
    * fameMultiBeaconLevels
    * $miningUpgrades[16]['formula']($miningUpgradeLevels[16]) // legendary i - iii 
    * $miningUpgrades[17]['formula']($miningUpgradeLevels[17])
    * $miningUpgrades[37]['formula']($miningUpgradeLevels[37]) // phantom legend
    * $beaconFormulas[4]($beaconLevels[4]) // beacon path
}

// ONLY things in these arrays will be reset on relocate
const walletResetItems = ['gems', 'gold', 'orbs', 'beacons', 'key1', 'key2', 'beaconPower']
export function relocate() {
    if (calcFameGain() >= 10) {
        if (confirm("Are you sure? Relocating will reset all previous progress.")) {
                $flags['relocateNavBack'] = true;
                $wallet['fame'] = ($wallet['fame'] || 0) + calcFameGain();
                $wallet['totalFame'] = ($wallet['fame'] || 0) + calcFameGain();

                $stats['lastRelocate'] = Date.now();
                $stats['relocateCount'] = ($stats['relocateCount'] || 0) + 1;

                // reset stuff
                
                for (let i of walletResetItems) {
                    if ($automationItemsUnlocked['unlimited power!'] && i == 'beaconPower') continue;
                    $wallet[i] = 0;
                }
                for (let i of Object.entries($progress)) {
                    $progress[i[0]] = 0;
                    $progressAverage[i[0]] = 0;
                    $progressThisTick[i[0]] = 0;
                }
                if (!($automationItemsUnlocked['persistent beacons'])) {
                    for (let i in $beaconLevels) {
                        $beaconLevels[i] = 0;
                        $beaconProgress[i] = 0;
                        $beaconActivations[i] = 0;
                    }
                }
                for (let bR in $beaconNextReqs) {
                    $beaconNextReqs[bR] = ($beaconLevels[bR]+1) * $baseBeaconNextReqs[bR];
                }
                $keysOpened = Array($keysOpened.length).fill(0);
                $beaconBonuses = Array(30).fill(1)


                $layer = {
                    layer: (ascFormula.getVal('celestial') || 0),
                    blocks: 0,
                    blocksNextReq: 100,
                }

                // reset lootmaster
                $miningUpgradeLevels[6] = 0;
                $miningUpgradeLevelsBought[6] = 0;
                $miningUpgradeLevels[9] = 0;
                $miningUpgradeLevelsBought[9] = 0;
                $visibleTier = 1;
                
                    for (let i in $miningUpgrades) {
                        //remove all free levels
                        $miningUpgradeLevels[i] = $miningUpgradeLevelsBought[i];

                        // if cosmic brilliance unlocked, use that formula
                        $miningUpgradeLevelsFree[i] = 
                        (parseInt(i) == 1 || parseInt(i) == 2 || parseInt(i) == 7
                        ? $miningUpgrades[27]['formula']($miningUpgradeLevels[27]): 
                        (parseInt(i) == 0
                        ? Math.round($miningUpgrades[27]['formula']($miningUpgradeLevels[27])/4): 0));
                        


                        if (!$automationItemsUnlocked['omnipotent']) {
                            if (!($miningUpgrades[i]['noResetRelocate']))  {
                                $miningUpgradeLevelsBought[i] = 0;
                                $miningUpgradeLevels[i] = $miningUpgradeLevelsBought[i]
                                + $miningUpgradeLevelsFree[i];
                            }
                        }
                    }
                console.log($automationItemsUnlocked)
                    
                if (!$automationItemsUnlocked['unlimited power!'])
                    for (let i in $beaconUpgrades) {
                        if (!$beaconUpgrades[i]['isCelestial'])
                            $beaconUpgradeLevels[i] = 0;
                    }

                if ($automationItemsUnlocked['jumpstart']) {
                    $wallet['gems'] = 5000;
                    $wallet['gold'] = 100;
                }
                if ($automationItemsUnlocked['beaconizer']) {
                    $wallet['beacons'] = 50000;
                }
                if ($automationItemsUnlocked['omnipotent'] && $miningUpgradeLevels[14] >= 1) {
                    $miningUpgradeLevels[14] = 1;
                    $miningUpgradeLevelsBought[14] = 1;
                    $visibleTier = 4;
                }

                $miningUpgradeLevels = $miningUpgradeLevels.map(
                    (x,i) => $miningUpgradeLevelsBought[i] + $miningUpgradeLevelsFree[i])
                // for (let k of Object.keys($keyCraftAmount)) {
                //     if (k !== 'energy')
                //     $keyCraftAmount[k] = 0;
                // }
                if ($automationItemsUnlocked['deep pockets']) {
                    $miningUpgradeLevels[6] = 1;
                    $miningUpgradeLevelsBought[6] = 1;
                    $visibleTier = 2;
                }
                if ($automationItemsUnlocked['deep pockets ii']) {
                    $miningUpgradeLevels[9] = 1;
                    $miningUpgradeLevelsBought[9] = 1;
                    $visibleTier = 3;
                }

                $resetLastTimes['relocate'] = Date.now()
            }
        }
    }


const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']



</script>