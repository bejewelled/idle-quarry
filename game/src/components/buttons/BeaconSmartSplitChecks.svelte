<label class='input-wrapper mr-3'>
    <input type='checkbox'
    on:click={() => console.log('clicked')}
    bind:checked={$beaconSmartSplits[index]} class='checkbox w-6 h-6'/>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span 
    class='game-text text-med text-center
    select-none cursor-pointer'>S</span>
</label>

<script lang='ts'>
    export let index: number;
    import {beaconSmartSplits} from '../../data/player';
</script>