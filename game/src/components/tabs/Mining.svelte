<div class='wrapper py-2'>
    <div class='mining-flavor game-text text-large text-center'>
        You are mining in a cave.
    </div>
    <div class='mine-bar-wrapper py-1 pb-2'>
        <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div class="bg-red-300 h-2.5 rounded-full" 
            style="width: {($progressPerTick / $progressThreshold) > 5 ? '100%' : mineBarWidth}"></div>
        </div>
    </div>
    <div class='mine-upgrade-wrapper grid grid-cols-2'>
        {#each Object.entries($miningUpgrades) as upgrade,i}
            <div class='col-span-1 mine-upgrade-button-wrapper'>
                <MiningUpgradeButton index={i}/>
            </div>
        {/each}
    </div>
</div>


<script lang='ts'>
import { onMount } from 'svelte';
import { wallet } from '../../data/player';
import { progress, progressThreshold, progressPerTick, miningUpgrades } from '../../data/mining';
import MiningUpgradeButton from '../buttons/MiningUpgradeButton.svelte';

$: mineBarWidth = `${$progress / $progressThreshold['gems'] * 100}%`;

</script>