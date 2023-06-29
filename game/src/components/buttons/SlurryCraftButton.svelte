
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#key $wallet[item] >= 0.9}
{#if $keyCrafts[index]['unlockAt']()}
<div class='wrapper grid grid-cols-12 py-1'>
    <div on:click={() => buy(index)}
        class='has-tooltip tooltip-text 
        {affordable && craftFinishTime <= ct
        ? 'game-btn text-indigo-300' : 'game-btn-noafford text-indigo-300'}
        py-2 pr-2 items-center text-center border-solid mr-3 col-span-4
        select-none'> 
        {#key craftFinishTime}
        {#if craftFinishTime > ct}
            Crafting... {f(progressBarWidth,2)}%
        {:else}
        Craft 
        <span class='{$keyCrafts[index]['style'] || 'text-white'}'>{$keyCrafts[index]['name']}</span>
        {/if}
        {/key}
        <span class='px-2 mx-4 {craftFinishTime > ct ? 'max-w-[90px]' : 'max-w-[300px]'}
            tooltip tooltip-text shadow-lg p-1
        border-white border-double border bg-[#222529] ml-16
            pointer-events-none'>
            <div class='cost items-center text-center grid grid-cols-4'>
            {#if craftFinishTime > ct}
                <div class='tooltip-text text-center'>Crafting... </div>
            {:else}
                {#each Object.entries(costs) as c}
                    {#if c[1] >= 1} 
                        <div class='{ref.colors[c[0]] || ref.colors['default']} text-left pr-3 col-span-2'>{
                        $wallet[c[0]] || $unlockedRes.has(c[0]) ? 
                        (ref.displayNames[c[0]] ? ref.displayNames[c[0]] : c[0]) : "???"}</div>
                        <div class='col-span-2 text-left'>{f(c[1])}</div>
                    {/if}
                {/each}
                <div class='col-span-4 py-1 items-center justify-center line'><hr/></div>
                <div class='text-teal-100 text-left text-xs pr-3 col-span-2'>time</div>
                    <div class='col-span-2 text-xs text-left'>{f(
                        $keyCrafts[index]['craftTime'] * Math.pow(0.9, masteryLevel-1),0
                        )} seconds</div>

                {/if}
            </div>
        </span>
    </div>
    <div class='col-span-8 grid grid-rows-2 align-middle items-right'>
        <!-- progress bar -->
        {#key updateClock}
        <div class='row-span-1'>
            <div class='mine-bar-wrapper align-middle'>
                <div class="w-full my-1 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    
                    <div class="{$keyCrafts[index]['stylebg']}
                     h-2.5 rounded-full" 
                    style="width: {progressBarWidth}%"></div>
                </div>
            </div>
        </div>
        {/key}
        <!-- mastery bar -->
        <div class='row-span-1 grid grid-cols-9'>
            <div class='col-span-3 text-left text-small text-amber-400'>
                Skill {f($keyCraftMastery[item][0])} 
                    [{f(1 / Math.pow(0.9, masteryLevel-1), 1)}x speed]
                </div>
            <div class='col-span-6 mine-bar-wrapper align-middle'>
                <div class="has-tooltip w-full my-1 bg-gray-200 rounded-full h-1 dark:bg-gray-700">
                    <span class='px-2 mx-4 max-w-[300px] tooltip tooltip-text shadow-lg p-1
                    border-white border-double border bg-[#222529] ml-16
                    pointer-events-none grid grid-cols-1'>
                    <span class='col-span-1 text-center text-amber-400 pb-1'>
                        [ {f($keyCraftMastery[item][1])} / {f($keyCraftMastery[item][2])} crafts ] 
                    </span>
                </span>
                    <div class="bg-amber-400 h-1 rounded-full" 
                    style="width:{masteryBarWidth}%"></div>
                </div>
            </div>
        </div>
    </div>
</div>
        {/if}
{/key}
        

 <script>
// @ts-nocheck

    import { onDestroy, onMount } from 'svelte';
    import { progress, wallet, enchantUpgradeLevels, miningDropTable,
         settings, visibleTier, unlockedRes, 
         buttonStats, buttonNumClicks, buttonUpgradeLevels,
        keyUpgradeLevels, keyCraftTimes, 
        keyCraftMastery, keyCraftAmount} from '../../data/player';
    import {progressThreshold, progressPerTick } from '../../data/mining';
    import {keyUpgrades, keyCrafts} from '../../data/keys';
    import { enchantUpgrades } from '../../data/fame';
    import {buttonUpgrades} from '../../data/button';
    import ref from '../../calcs/ref'
    import formula from '../../calcs/formula'
// @ts-nocheck
    export let index;
    let renderFlag = false, updateClock = false;
    $: getCosts = () => {
        let c = {};

        for (let [type, base] of Object.entries($keyCrafts[index]['cost'])) {
            if (type == 'energy') {
                c[type] = base;
                continue;
            }
            c[type] = cost(base);
        }
        return c;
    }
    $: costs = {};
    let affordable, unlocked;
    let affordInterval;
    let item = $keyCrafts[index]['item'];
    console.log(item);
    let craftStartTime = $keyCraftTimes[item][0];
    let craftFinishTime = $keyCraftTimes[item][1];
    if (!$keyCraftMastery[item]) $keyCraftMastery[item] = [1,0,10];
    $: masteryLevel = $keyCraftMastery[item][0];

    let progressBarWidth = 0;
    let getProgressBarWidth = (ct) => 
        ((craftFinishTime != craftStartTime) ?
        Math.min(100,(craftFinishTime > ct ?
    (ct - craftStartTime) / (craftFinishTime - craftStartTime) * 100 :
    0)) : 0);
    let masteryBarWidth = 0;
    const getMasteryBarWidth = () => (($keyCraftMastery[item][1] / $keyCraftMastery[item][2])*100)

    let updateInterval, costUpdater;
    let ct = Date.now();
    onMount(() => {
        setTimeout(() => {
            costs = getCosts();
            affordable = canAfford();
        }, 209)

        updateInterval = setInterval(() => {
            ct = Date.now();
            progressBarWidth = getProgressBarWidth(ct);
            masteryBarWidth = getMasteryBarWidth();
        }, 23 + (Math.random() * 11))
        
        craftStartTime = $keyCraftTimes[item][0];
        craftFinishTime = $keyCraftTimes[item][1];
        costUpdater = setInterval(() => {
            costs = getCosts();
        }, 793)
        affordInterval = setInterval(() => {
            affordable = canAfford();
            unlocked = isUnlocked();
        }, 100 + (Math.random() * 20))
    })

    onDestroy(() => {
        clearInterval(affordInterval);
        clearInterval(updateInterval);
        clearInterval(costUpdater);
    })
    const f = (n, pl = 0) => {
        if (n < 1e9) return n.toFixed((n < 1e3 ? pl : 0)).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        else return n.toExponential(3).toString().replace('+', '');
    }   

    const fp = (n, pl = 3, subOne = false) => {
    if (subOne) n -= 1;
    if (n < 1e9) return (n*100).toFixed((n*100 < 1e3 ? pl : 0)).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "%";
    else return (n*100).toExponential(pl).toString().replace('+', '') + "%";
}

    function cost(start) {
       const base = start * Math.pow(
        (item == 'energy' ? $keyUpgrades[2]['formula']($keyUpgradeLevels[2]) 
       : $keyCrafts[index]['ratio']), $keyCraftAmount[item]);  
       const r =  (item == 'energy' ? $keyUpgrades[2]['formula']($keyUpgradeLevels[2]) 
       : $keyCrafts[index]['ratio'])
       
       const l = 1; // number of items to buy


       return formula.gSum(base,r,l)
    }

    function calcCraftTime() {
        let base = $keyCrafts[index]['craftTime'];
        base *= Math.pow(0.9, $keyCraftMastery[item][0]-1);
        return base*1000;
    }

    function buy() {
        if (craftFinishTime > ct) return
        if ($wallet['slurry'] < 1) return
        costs = getCosts();
        for (let [type, val] of Object.entries(costs)) {
            if (val >=  1 && $wallet[type] < val) {
                return;
            }
        }
        for (let [type, val] of Object.entries(costs)) {
            if (val >= 1) $wallet[type] -= val;
        }
        costs = getCosts();

        // starts crafting job
        craftStartTime = Date.now();
        $keyCraftTimes[item][0] = craftStartTime;
        const finishTime = craftStartTime + calcCraftTime();
        craftFinishTime = finishTime;
        $keyCraftTimes[item][1] = finishTime;
    }

    function canAfford() {
        costs = getCosts();
        for (let [type, val] of Object.entries(costs)) {
            if (val >= 1 && $wallet[type] < val) {
                return false;
            }
        }  
        return true;
    }

    function isUnlocked() {
        for (let [type, val] of Object.entries($keyCrafts[index]['unlockAt'])) {
            if ($wallet[type] < val) {
                return false;
            }
        }  
        return true;
    }

    function getKeyDisplayName() {
        const display = ['T3 [***]', 'T4 [****]', 'T5 [*****]'];
        return display[index];
    }

 </script>
<style>
  .tooltip {
    @apply invisible absolute;
  }
  .has-tooltip:hover .tooltip {
    @apply visible z-50;
  }

  .rainbow-effect {
  /* Set the initial background color with some opacity */
  /* Add a transition for smooth color change */
  transition: background-color 0.5s ease-in-out;
}

.rainbow-effect > span {
    opacity: 1;
}

/* Add the rainbow effect on hover */
.rainbow-effect:hover {
    color: #fff;
    font-weight: 600;
  /* Use a linear gradient to create the rainbow effect */
  background-image: linear-gradient(to right, 
    #f8c102, #e86aa7, #8e2de2, #3a86ff, #4cc9f0, #00c9b1, #b4e332, #f8c102,
    #b4e332, #00c9b1, #4cc9f0, #3a86ff, #8e2de2, #e86aa7, #f8c102);
  /* Animate the gradient to create a looping effect */
  animation: rainbow-animation 6s ease-in-out infinite;
  /* Set the gradient background size to 400% to create a smooth transition */
  background-size: 400%;
  /* Increase the opacity on hover */
  opacity: 1
}

/* Define the animation */
@keyframes rainbow-animation {
  /* Move the gradient position to create the animation effect */
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

</style>