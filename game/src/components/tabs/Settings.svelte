<div class='wrapper pt-3'>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class='wrapper bg-gray-700 my-1 border-2 border-gray-600'>
        <div class='w-full text-left py-1 pl-1 text-medium text-gray-400'>Anti-Flickering - Bar will appear as solid when enabled</div>
            <div class='wrapper grid grid-cols-1 py-1'>
                <div class='wrapper col-span-1 grid grid-cols-8'>
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
                <div class='wrapper col-span-1 py-1 grid grid-cols-8'>
                    <div class='setting col-span-2 mx-1 px-1 py-1 text-center
                    {$antiFlickerFlags['enchants'] ? 'game-btn-toggleon' : 'game-btn-toggleoff' } py-1' 
                    on:click={() => changeFlickerFlag('enchants')}>Enchants</div>
                </div>
            </div>
    </div>

    <div class='pb-1'></div>
    <div class='wrapper bg-gray-700 my-1 border-2 border-gray-600'>
        <div class='w-full text-left py-1 pl-1 text-medium text-gray-400'>Enable/disable activity log entries</div>
           <div class='grid grid-cols-12 py-1'>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class='col-span-3 grid-cols-3 pt-1'>
                    <div class='setting col-span-3 mx-1 px-1 py-1 text-center
                    {$activityLogShow['crafting'] ? 'game-btn-toggleon' : 'game-btn-toggleoff' } py-1' 
                    on:click={() => changeActivityLogShow('crafting')}>Crafting</div>
                </div>
                <div class='col-span-3 grid-cols-3 pt-1'>
                    <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div class='setting col-span-3 mx-1 px-1 py-1 text-center
                    {$activityLogShow['challenges'] ? 'game-btn-toggleon' : 'game-btn-toggleoff' } py-1' 
                    on:click={() => changeActivityLogShow('challenges')}>Challenges</div>
                </div>
                <div class='col-span-12 py-1'></div>
                {#each $enchantUpgrades as e}
                {#if !(e['name'] == 'Mine Size' || e['name'] == 'Mine Quality')}
                <div class='col-span-3 grid-cols-3 pt-1'>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                    <div class='setting col-span-3 mx-1 px-1 py-1 text-center
                    {$activityLogShow[e['name'].toLowerCase()] ? 'game-btn-toggleon' : 'game-btn-toggleoff' } py-1' 
                    on:click={() => changeActivityLogShow(e['name'].toLowerCase())}>{e['name']}</div>
                </div>
                {/if}
                {/each}
           </div>
         </div>
    </div>

    <div class='pb-1'></div>
    <div class='wrapper bg-gray-700 my-1 border-2 border-gray-600'>
        <div class='w-full text-left py-1 pl-1 text-medium text-gray-400'>Progression</div>
           <div class='grid grid-cols-12 py-1'>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class='col-span-3 grid-cols-3 pt-1'>
                    <div class='setting col-span-3 mx-1 px-1 py-1 text-center
                    {$settings['offlineProgress'] ? 'game-btn-toggleon' : 'game-btn-toggleoff' } py-1' 
                    on:click={() => changeOfflineProgress()}>Offline Progress</div>
                </div>

           </div>
    </div>

    <div class='pb-1'></div>
    <div class='wrapper bg-gray-700 my-1 border-2 border-gray-600'>
        <div class='w-full text-left py-1 pl-1 text-medium text-gray-400'>Other</div>
           <div class='grid grid-cols-12 py-1'>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class='col-span-3 grid-cols-3 pt-1'>
                    <div class='setting has-tooltip col-span-3 mx-1 px-1 py-1 text-center
                    {$settings['exclusiveSort'] ? 'game-btn-toggleon' : 'game-btn-toggleoff' } py-1' 
                    on:click={() => changeSetting('exclusiveSort')}>Exclusive Sort
                        <span class='tooltip tooltip-style'>
                        When enabled, changing upgrade sort tags will remove all other sorting tags.
                        </span>
                    </div>
                </div>

                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class='col-span-3 grid-cols-3 pt-1'>
                    <div class='setting select-none has-tooltip col-span-3 mx-1 px-1 py-1 text-center
                    {$settings['tutorialMode'] ? 'game-btn-toggleon' : 'game-btn-toggleoff' } py-1' 
                    on:click={() => changeSetting('tutorialMode')}>Tutorial Mode
                        <span class='tooltip tooltip-style'>
                        When enabled, hovering over resource displays will show the sources of that resource. NOTE: This may spoil some future content.
                        </span>
                    </div>
                </div>



            </div>
        </div>  

    <div class='text-large text-gray-300 text-left pb-2'>About</div>
        <div class='text-small tooltip-text'>version 0.0.4 (alpha)</div>
        <div class='text-small tooltip-text'>created by bejewelled, all rights reserved</div>



<script>
// @ts-nocheck

    import {settings, antiFlickerFlags, activityLogShow} from '../../data/player'
    import {enchantUpgrades} from '../../data/fame'

    function changeFlickerFlag(item) {
        $antiFlickerFlags[item] = !$antiFlickerFlags[item]
    }

    function changeActivityLogShow(item) {
        $activityLogShow[item] = !$activityLogShow[item]
    }
    function changeOfflineProgress() {
        $settings['offlineProgress'] = !$settings['offlineProgress']
    }

    // set value to null for toggles
    function changeSetting(item, value=null) {
        if (!$settings[item]) $settings[item] = value || true;
        else if (value == null) {
            $settings[item] = !$settings[item]
        } else {
            $settings[item] = value
        }
    }

</script>