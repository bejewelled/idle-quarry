<div class="wrapper py-2">
  <div class='col-span-9'>
    <div class='w-full my-1 bg-gray-200 rounded-sm h-4 dark:bg-gray-700'>
        <div class="
        flex w-full">
          <!-- <div class="bg-lime-300 w-4 h-4 rounded-sm 
          relative z-0" 
          style="width: {buttonBarWidth}; transition: width 0.1s;"> 
          </div> -->
        </div>
    </div>
  </div>
  <div class='col-span-3 text-center has-tooltip'>
      <div class='tooltip-text text-med'>You have {deityPowerDescriptions($deity['level'] || 0)[1] ? 'an' : 'a'}
        <span class='text-amber-100 font-bold'>{deityPowerDescriptions($deity['level'])[0]}</span> deity.
      <!-- <span class='text-lime-300 text-med pl-2 pr-2'>
        {f($deity['xp'])} / {f($deity['xpNextReq'])}
      </span> -->
      </div>
      <div class='tooltip-text text-sm py-1'>Each deity level provides massive bonuses to religion and other systems.</div>

  </div>
</div>



<script lang="ts">
  //@ts-nocheck
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
    automationItemsUnlocked,
    enchantProgress,
    deity
  } from "../../data/player";
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
  import {
    enchantUpgrades,
    enchantThreshold,
    automationUpgrades,
  } from "../../data/fame";
  import { allMultipliers } from "../../data/artifacts";
  import MiningUpgradeButton from "../buttons/UpgradeButtons/MiningUpgradeButton.svelte";
  import ref from "../../calcs/ref";
  import formula from "../../calcs/formula";
  import BeaconToggleButton from "../buttons/BeaconToggleButton.svelte";
  import BeaconPowerUpgradeButton from "../buttons/UpgradeButtons/BeaconPowerUpgradeButton.svelte";
  import FameUpgradeButton from "../buttons/UpgradeButtons/EnchantUpgradeButton.svelte";
  import AutomationUpgradeButton from "../buttons/UpgradeButtons/AutomationUpgradeButton.svelte";

  onDestroy(() => {});
  const f = (n: number, pl = 0) => {
    if (n < 1e9)
      return n
        .toFixed(n < 1e3 ? pl : 0)
        .toString()
        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    else return n.toExponential(3).toString().replace("+", "");
  };

  const fp = (n: unknown, pl = 3, subOne = false) => {
    if (subOne) n -= 1;
    if (n < 1e9)
      return (
        (n * 100)
          .toFixed(n < 1e3 ? pl : 0)
          .toString()
          .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "%"
      );
    else return (n * 100).toExponential(pl).toString().replace("+", "") + "%";
  };

  const fpf = (n: unknown, subOne = false) => {
    if (subOne) n -= 1;
    if (n < 1e9)
      return (
        (n * 100)
          .toFixed(3)
          .toString()
          .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "%"
      );
    else return (n * 100).toExponential(3).toString().replace("+", "") + "%";
  };

  const deityPowerDescriptions = (i) => {
    console.log(i)
    const list = [
      'Emerging', 
      'Weak',
      'Fledgling',
      'Growing',
      'Influential',
      'Commanding',
      'Powerful',
      'Mighty',
      'Overloaded',
      'Overwhelming',
      'Unstoppable',
      'Limitless',
      'Infinite',
      'Omnipotent'
    ]
    const item = list[i];
    if (['a','e','i','o','u'].includes(item.charAt(0).toLowerCase))
    return [list[i], true];
    else return [list[i], false];
  }
</script>
