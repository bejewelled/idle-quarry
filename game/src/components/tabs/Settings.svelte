<div class='wrapper pt-3'>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    
    <div class='text-large text-gray-300 text-center pb-2'>Progress Bars</div>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class='wrapper bg-gray-700 my-1 border-2 border-gray-600 pb-1'>
        <div class='w-full text-left py-1 text-medium text-gray-400'>Anti-Flickering - Bar will appear as solid when enabled</div>
            <div class='wrapper grid grid-cols-8'>
                <div class='setting col-span-2 mx-1 px-1 py-1 text-center
                {$antiFlickerFlags['gems'] ? 'game-btn-toggleon' : 'game-btn-toggleoff' } py-1' 
                on:click={() => changeFlickerFlag('gems')}>Mining (gems)</div>
                <div class='setting col-span-2 mx-1 px-1 py-1 text-center
                {$antiFlickerFlags['keyfinder'] ? 'game-btn-toggleon' : 'game-btn-toggleoff' } py-1' 
                on:click={() => changeFlickerFlag('keyfinder')}>Mining (key finder)</div>
                <div class='setting col-span-2 mx-1 px-1 py-1 text-center
                {$antiFlickerFlags['crafting'] ? 'game-btn-toggleon' : 'game-btn-toggleoff' } py-1' 
                on:click={() => changeFlickerFlag('crafting')}>Crafting</div>
                <div class='setting col-span-2 mx-1 px-1 py-1 text-center
                {$antiFlickerFlags['beacons'] ? 'game-btn-toggleon' : 'game-btn-toggleoff' } py-1' 
                on:click={() => changeFlickerFlag('beacons')}>Beacons</div>
            </div>
    </div>

    <div class='py-3'></div>

    <div class='text-large text-gray-300 text-left pb-2'>About</div>
        <div class='text-small tooltip-text'>version 0.0.3 (alpha)</div>
        <div class='text-small tooltip-text'>created by bejewelled, all rights reserved</div>
</div>


<script>
// @ts-nocheck

    import {settings, antiFlickerFlags} from '../../data/player'

    function changeFlickerFlag(item) {
        $antiFlickerFlags[item] = !$antiFlickerFlags[item]
    }

</script>