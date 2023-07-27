<Resetters bind:this={resetFuncs} />
<div
  class="border-2 select-none text-center {canAscend()
    ? 'border-fuchsia-300 text-center hover:bg-fuchsia-800 hover:bg-opacity-50 transition ease-in duration-150'
    : 'game-btn-noafford select-none pointer-events-none cursor-pointer'}
 p-1 w-full"
>
  {#if canAscend()}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div on:click={() => ascend()}
      class="text-center items-center justify-center text-xl font-bold
    bg-clip-text bg-gradient-to-tl from-purple-300 to bg-fuchsia-600 text-transparent"
    >
      ASCEND
  </div>
  {:else}
    You need at least 30 total essence to ascend.
  {/if}
</div>

<script lang="ts">
	import { ascensionElements } from './../../data/ascension.ts';
	import Resetters from './../resetters/Resetters.svelte';
  import { onMount, onDestroy } from "svelte";
  import {
    progress,
    wallet,
    miningDropTable,
    miningUpgradeLevels,
    settings,
    visibleTier,
    progressThisTick,
    progressAverage,
    beaconActivations,
    beaconLevels,
    beaconProgress,
    resources,
    keysOpened,
    unlockedRes,
    beaconUpgradeLevels,
    flags,
    enchantUpgradeLevels,
    enchantProgress,
    automationItemsUnlocked,
    mineLevel,
    buttonUpgradeLevels,
    stats,
    keyCraftAmount,
    miningUpgradeLevelsBought,
    miningUpgradeLevelsFree,
  } from "../../data/player";
  import { buttonUpgrades } from "../../data/button";
  import {
    progressThreshold,
    progressPerTick,
    miningUpgrades,
    gemGainFlavorText,
    gemProgressFlavorText,
  } from "../../data/mining";
  import { keyGainFlavorText } from "../../data/keys";
  import {
    beaconPower,
    beaconBonuses,
    beaconFormulas,
    beaconNums,
    beaconNextReqs,
    beaconSpendAmt,
    beaconUpgrades,
    beaconNameText,
    baseBeaconNextReqs,
  } from "../../data/beacons";
  import { enchantUpgrades, enchantThreshold } from "../../data/fame";
  import MiningUpgradeButton from "../buttons/MiningUpgradeButton.svelte";
  import ref from "../../calcs/ref";
  import formula from "../../calcs/formula";
  import BeaconToggleButton from "../buttons/BeaconToggleButton.svelte";
  import BeaconPowerUpgradeButton from "../buttons/BeaconPowerUpgradeButton.svelte";
  import EnchantUpgradeButton from "../buttons/EnchantUpgradeButton.svelte";

let resetFuncs: any;

  function canAscend() {
    return formula.sumEssence() >= 30
  }
  function ascend() {
        if (confirm('ARE YOU SURE??? This will reset EVERYTHING! If this is your first ascension, MAKE SURE you are gaining a bonus of some sort, or you will essentially be hard resetting!')) {
            resetFuncs.ascend();
        }
    }
</script>
