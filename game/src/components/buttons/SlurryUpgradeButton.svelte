
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#key permUnlocked || affordable || $keyUpgradeLevels[index] > 0}
{#if $keyUpgrades[index]['unlockAt']() || permUnlocked || $keyUpgradeLevels[index] > 0}
<div on:click={() => buy()}
class='has-tooltip tooltip-text 
{(
($keyUpgradeLevels[index] >= $keyUpgrades[index]['maxLevel']) ?
'game-btn-noafford text-indigo-300 bg-indigo-800' :
(affordable ? 'game-btn text-indigo-300' : 'game-btn-noafford text-indigo-300')
)}
py-2 items-center text-center border-solid ml-1 mr-1 col-span-12
select-none'>
{$keyUpgrades[index]['name']} [{$keyUpgradeLevels[index]} / {$keyUpgrades[index]['maxLevel']}]
         <span class='px-2 mx-4 max-w-[300px] tooltip tooltip-text shadow-lg p-1
       border-white border-double border bg-[#222529] ml-16
         pointer-events-none'>
         <div class='title text-small-gray items-start text-center pb-1'>
           [{$keyUpgradeLevels[index]} / {$keyUpgrades[index]['maxLevel']}] 
           {$keyUpgrades[index]['description']}
        </div>
        <div class='text-center effect-wrapper'>
            <div class='tooltip-text-xs text-[#cccccc]'>
                 <span class='current text-[#cccccc]'>
                    {$keyUpgrades[index]['prefix'] || ""}{$keyUpgrades[index]['isPercent'] ?
                    fp($keyUpgrades[index]['formula']($keyUpgradeLevels[index]),3, false) :
                    f($keyUpgrades[index]['formula']($keyUpgradeLevels[index]),3)}{$keyUpgrades[index]['suffix'] || ""}
                 </span>
                 <span class='current text-[#999999]'>  => 
                    {$keyUpgrades[index]['prefix'] || ""}{$keyUpgrades[index]['isPercent'] ?
                   fp($keyUpgrades[index]['formula']($keyUpgradeLevels[index]+$settings['buyAmount']),3, false) :
                   f($keyUpgrades[index]['formula']($keyUpgradeLevels[index]+$settings['buyAmount']),3)}{$keyUpgrades[index]['suffix'] || ""}
                 </span>

            </div>
        </div>
        <hr />
        <div class='pt-1 cost items-start text-center grid grid-cols-4'>
            {#if $keyUpgradeLevels[index] >= $keyUpgrades[index]['maxLevel']}
                <div class='col-span-4 text-[#999999]'>This upgrade is at max level.</div>
            {:else}
            {#each Object.entries(costs) as c}
                {#if c[1] >= 1}
                    <div class='{ref.colors[c[0]] || ref.colors['default']} text-right pr-3 col-span-2'>{
                    $wallet[c[0]] || $unlockedRes.has(c[0]) ? 
                    (ref.displayNames[c[0]] ? ref.displayNames[c[0]] : c[0]) : "???"}</div>
                    <div class='col-span-2 text-left {!(thisTypeAffordable(c[0])) ?'text-red-600' : ''}'>{f(c[1])}</div>
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
         settings, visibleTier, unlockedRes, 
         buttonStats, buttonNumClicks, buttonUpgradeLevels,
        keyUpgradeLevels} from '../../data/player';
    import {progressThreshold, progressPerTick } from '../../data/mining';
    import {keyUpgrades, key1DropTable, key2DropTable, 
        key3DropTable, key4DropTable, key5DropTable} from '../../data/keys';
    import { enchantUpgrades } from '../../data/fame';
    import {buttonUpgrades} from '../../data/button';
    import ref from '../../calcs/ref'
    import formula from '../../calcs/formula'
// @ts-nocheck
    export let index;
    let getCosts = () => {
        let c = {};
        for (let [type, base] of Object.entries($keyUpgrades[index]['cost'])) {
            c[type] = cost(base);
        }
        return c;
    }
    let costs = {};
    let affordable, unlocked;
    let permUnlocked = ($keyUpgradeLevels[index] > 0)
    let affordInterval;
    
    onMount(() => {
        setTimeout(() => {
            costs = getCosts();
            affordable = canAfford();
            if ($keyUpgrades[index]['unlockAt']()) permUnlocked = true;
            permUnlocked = ($keyUpgradeLevels[index] > 0)
        }, 50)
        affordInterval = setInterval(() => {
            affordable = canAfford();
            unlocked = isUnlocked();
            if ($keyUpgrades[index]['unlockAt']()) permUnlocked = true;
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

    function cost(start) {
       const base = start * Math.pow($keyUpgrades[index]['ratio'], $keyUpgradeLevels[index]);  
       const r =  $keyUpgrades[index]['ratio']
       const l = $settings['buyAmount']

       return formula.gSum(base,r,l)
    }

    function buy() {
        if ($keyUpgradeLevels[index] >= $keyUpgrades[index]['maxLevel']) return;
        costs = getCosts();
        for (let [type, val] of Object.entries(costs)) {
            if ((val >=  1 && $wallet[type] < val) || !($wallet[type])) {
                return;
            }
        }
        for (let [type, val] of Object.entries(costs)) {
            if (val >= 1) $wallet[type] -= val;
        }
        $keyUpgradeLevels[index] += $settings['buyAmount'];
        costs = getCosts();
        permUnlocked = true;
        updateDropTables()
    }

    function thisTypeAffordable(type) {
        return ($wallet[type] >= costs[type]);
    }

    function updateDropTables() {
        key1DropTable.updateTable()
        key2DropTable.updateTable()
        key3DropTable.updateTable()
        key4DropTable.updateTable()
        key5DropTable.updateTable()
    }

    function canAfford() {
        costs = getCosts();
        for (let [type, val] of Object.entries(costs)) {
            if ((val >= 1 && $wallet[type] < val) || !($wallet[type])) {
                return false;
            }
        }  
        return true;
    }

    function isUnlocked() {
        for (let [type, val] of Object.entries($keyUpgrades[index]['unlockAt'])) {
            if ($wallet[type] < val) {
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