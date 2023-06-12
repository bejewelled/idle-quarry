
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#key affordable}
{#if $automationUpgrades[index]['unlockAt']() || permUnlocked || $enchantUpgradeLevels[index] > 0}
<div on:click={() => buy(index)}
class='has-tooltip tooltip-text 
{affordable ?
(($automationItemsUnlocked[$automationUpgrades[index]['name'].toLowerCase()]) ? 'game-btn-automation-maxed': 'game-btn')
: ($automationItemsUnlocked[$automationUpgrades[index]['name'].toLowerCase()]) ? 'game-btn-automation-maxed' : 'game-btn-noafford'}
py-2 items-center text-center border-solid ml-1 mr-1 col-span-12
select-none'>{$automationUpgrades[index]['name']}
         <span class='px-2 mx-4 max-w-[300px] tooltip tooltip-text shadow-lg p-1
       border-white border-double border bg-[#222529] ml-16
         pointer-events-none'>
         <div class='title text-small-gray items-start text-center pb-1'>
            {$automationUpgrades[index]['description']}
        </div>
        <hr />
        <div class='pt-1 cost items-start text-center grid grid-cols-4'>
            {#if ($automationItemsUnlocked[$automationUpgrades[index]['id']])}
                <div class='col-span-4 text-[#999999]'>This automation has been purchased!</div>
            {:else}
            {#each Object.entries(costs) as c}
                {#if c[1] >= 1}
                    <div class='{ref.colors[c[0]] || ref.colors['default']} text-right pr-3 col-span-2'>
                    {$wallet[c[0]] || $unlockedRes.has(c[0]) ? 
                    (ref.displayNames[c[0]] ? ref.displayNames[c[0]] : c[0]) : "???"}</div>
                    <div class='col-span-2 text-left'>{f(c[1])}</div>
                {/if}
            {/each}
            {/if}
        </div>
         </span>
     </div>
        {/if}
    {/key}

        

 <script>
// @ts-nocheck

    import { onDestroy, onMount } from 'svelte';
    import { progress, wallet, enchantUpgradeLevels, miningDropTable,
         settings, visibleTier, unlockedRes, automationItemsUnlocked} from '../../data/player';
    import {progressThreshold, progressPerTick } from '../../data/mining';
    import { enchantUpgrades, automationUpgrades, enchantThreshold } from '../../data/fame';
    import ref from '../../calcs/ref'
    import formula from '../../calcs/formula'
// @ts-nocheck
    export let index;
    let getCosts = () => {
        let c = {};
        for (let [type, base] of Object.entries($automationUpgrades[index]['cost'])) {
            c[type] = base
        }
        return c;
    }
    let costs = {};
    let affordable, unlocked;
    let permUnlocked = false;
    let affordInterval;
    
    onMount(() => {
        setTimeout(() => {
            costs = getCosts();
            affordable = canAfford();
        }, 50)
        affordInterval = setInterval(() => {
            affordable = canAfford();
        }, 100 + (Math.random() * 20))
    })

    onDestroy(() => {
        clearInterval(affordInterval);
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

    function buy() {
        if ($automationItemsUnlocked[$automationUpgrades[index]['name'].toLowerCase()]) return;
        costs = getCosts();
        for (let [type, val] of Object.entries(costs)) {
            if ((val >=  1 && $wallet[type] < val) || !$wallet[type]) {
                return;
            }
        }
        for (let [type, val] of Object.entries(costs)) {
            if (val >= 1) $wallet[type] -= val;
        }
        $automationItemsUnlocked[$automationUpgrades[index]['name'].toLowerCase()] = true;

        // special cases
        if ($automationItemsUnlocked['spellcaster ii']) $enchantThreshold['t1'] = 81;
        else if ($automationItemsUnlocked['spellcaster']) $enchantThreshold['t1'] = 90;
    }

    function canAfford() {
        costs = getCosts();
        for (let [type, val] of Object.entries(costs)) {
            if ((val >= 1 && $wallet[type] < val) || !$wallet[type]) {
                return false;
            }
        }  
        return true;
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