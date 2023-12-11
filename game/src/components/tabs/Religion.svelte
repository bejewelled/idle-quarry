<div class="wrapper py-2">
  <div class='col-span-9'>
    <div class='w-full my-1 bg-gray-200 rounded-sm h-4 dark:bg-gray-700 has-tooltip'>
      <span class='tooltip-style'>
        <div class='text-amber-100 text-small text-center pl-2 pr-2'>
          [{f($deity['xp'])} / {f($deity['xpNextReq'])}]
        </div>
        {#if $deity['level'] == 0}
        <div class='tooltip-text text-small italic'>Something is coming...</div>
        {:else}
        <div class='tooltip-text text-small'>Your deity gains progress based on deity power.</div>
        {/if}
      </span>
        <div class="
        flex w-full">
          <div class="bg-amber-100 w-4 h-4 rounded-sm 
          relative z-0" 
          style="width: {deityBarWidth}; transition: width 0.1s;"> 
          </div>
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
  </div>
  <div class='col-span-3 text-center has-tooltip'>
    <div class='tooltip-text text-med'>Your deity power is 
      <span class='text-amber-100 font-bold'>{f(deityPower, 
      deityPower> 1000 ? 0 :
      deityPower > 10 ? 3 : 5)}.</span>
    <!-- <span class='text-lime-300 text-med pl-2 pr-2'>
      {f($deity['xp'])} / {f($deity['xpNextReq'])}
    </span> -->
    </div>

  <div class='py-1'></div>
  <DeityConvertMistButton />
  </div>
  {#if $deity['level'] >= 1}
  <div class='col-span-3 text-center has-tooltip py-1'>
    <div class='tooltip-text text-med'>You have 
      <span class='{ref.colors['faith']} font-bold'>{f($wallet['faith'] || 0)}</span> faith.
    </div>
  </div>
  {/if}
</div>

<script lang="ts">
	import DeityConvertMistButton from "../buttons/DeityConvertMistButton.svelte";
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

  $: deityBarWidth = `${Math.min(1,$deity['xp'] / $deity['xpNextReq']) * 100}%`;
  let deityPower = formula.calcDeityPower();
  let clockInterval: any;
  onMount(() => {
    clockInterval = setInterval(() => {
      deityPower = formula.calcDeityPower();
    }, 112);
  });

  onDestroy(() => {
      clearInterval(clockInterval);
    });

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
