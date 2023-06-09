<div class='wrapper py-2'>
    <div class='grid grid-cols-12 artifact-page'>
        <div class='col-span-12 pb-1 artifact-display text-center game-text-large'>
            You have <span class='text-slate-200'>{$wallet['artifacts']}</span> artifacts
        </div>
        <div class ='col-span-12 divider py-3'></div>
        {#each Object.entries($allMultipliers) as multi}
                {#if $wallet['artifacts'] >= multi[1]['unlockAt']}
                    <div class='col-span-4 game-text text-right'>
                    {multi[1]['description']} 
                    </div>
                    <div class='ml-2 col-span-2 text-left {ref.colors[multi[1]['colorStyle']]}'>
                    {multi[1]['prefix']}{f(multi[1]['formula']($wallet['artifacts']),3)}
                    </div>
                    <div class='col-span-6'></div>
                {:else}
                    <div class='text-slate-200'>Unlocks at {f(multi[1]['unlockAt'])} artifacts</div>
                {/if}
            {/each}
            </div>
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
import {allMultipliers} from '../../data/artifacts';
import MiningUpgradeButton from '../buttons/MiningUpgradeButton.svelte';
import ref from '../../calcs/ref'
import formula from '../../calcs/formula';
import BeaconToggleButton from '../buttons/BeaconToggleButton.svelte';
import BeaconPowerUpgradeButton from '../buttons/BeaconPowerUpgradeButton.svelte';
import FameUpgradeButton from '../buttons/EnchantUpgradeButton.svelte';
import AutomationUpgradeButton from '../buttons/AutomationUpgradeButton.svelte';




onDestroy(() => {
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