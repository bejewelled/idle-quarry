<label class='input-wrapper mr-3'>
    <input type='checkbox'
    onclick={() => console.log('clicked')}
    bind:checked={$beaconSmartSplits[index]} class='checkbox w-6 h-6'/>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <span 
    class='game-text text-med text-center
    select-none cursor-pointer'>S</span>
</label>

<script lang='ts'>
    import {beaconSmartSplits} from '../../data/player';
    interface Props {
        index: number;
    }

    let { index }: Props = $props();
</script>