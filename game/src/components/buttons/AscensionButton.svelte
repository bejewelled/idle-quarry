<div
  class="border-2 select-none text-center {canAscend()
    ? 'border-fuchsia-300 text-center hover:bg-fuchsia-800 hover:bg-opacity-50 transition ease-in duration-150'
    : 'game-btn-noafford select-none pointer-events-none cursor-pointer'}
 p-1 w-full"
>
  {#if canAscend()}
    <span
      class="text-center items-center justify-center text-xl font-bold
    bg-clip-text bg-gradient-to-tl from-purple-300 to bg-fuchsia-600 text-transparent"
    >
      ASCEND
    </span>
  {:else}
    You need at least 1 of each essence type to ascend.
  {/if}
</div>

<script lang="ts">
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

  function canAscend() {
    return (
      $wallet["efire"] > 0 &&
      $wallet["eearth"] > 0 &&
      $wallet["ewater"] > 0 &&
      $wallet["emagic"] > 0 &&
      $wallet["ecelestial"] > 0
    );
  }
</script>
