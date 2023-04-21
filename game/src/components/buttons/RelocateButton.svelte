
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click={() => relocate()} class='game-btn text-center '>
Relocate</div>
 <script>
// @ts-nocheck

    import { onDestroy, onMount } from 'svelte';
    import {progress, miningUpgradeLevels, wallet, miningDropTable, 
    unlockedRes, settings, progressThisTick, visibleTier,progressAverage,
    beaconActivations, beaconLevels, beaconProgress, resources, 
    beaconUpgradeLevels} from '../../data/player'
    import {progressThreshold, progressPerTick, miningUpgrades } from '../../data/mining';
    import ref from '../../calcs/ref'
    import formula from '../../calcs/formula'
// @ts-nocheck



 </script>
<style>
  .tooltip {
    @apply invisible absolute;
  }
  .has-tooltip:hover .tooltip {
    @apply visible z-50;
  }
</style>