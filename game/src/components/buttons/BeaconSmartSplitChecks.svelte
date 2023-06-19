<label class='input-wrapper mr-3'>
    <input type='checkbox'
    on:click={() => console.log('clicked')}
    bind:checked={$beaconSmartSplits[index]} class='checkbox w-4 h-4'/>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span 
    class='game-text text-small py-1 text-center
    mt-5 select-none cursor-pointer'>S</span>
</label>

<script lang='ts'>
    export let index: number;
    import {beaconSmartSplits} from '../../data/player';
</script>