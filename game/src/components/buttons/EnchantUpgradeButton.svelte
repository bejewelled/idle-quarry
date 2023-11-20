
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#key permUnlocked || affordable || $enchantUpgradeLevels[index] > 0}
{#if $enchantUpgrades[index]['unlockAt']() || permUnlocked || $enchantUpgradeLevels[index] > 0}
<div on:click={() => buy(index)}
class='has-tooltip tooltip-text 
{(affordable && maxBuyCalcFinished
 && ($enchantUpgradeLevels[index] < $enchantUpgrades[index]['maxLevel'])  ?
 'game-btn-encht' + $enchantUpgrades[index]['tier'] : 'game-btn-encht' + $enchantUpgrades[index]['tier'] + '-noafford')}
py-2 items-center text-center border-solid ml-1 mr-1 col-span-12
select-none'>{$enchantUpgrades[index]['name']} [{f($enchantUpgradeLevels[index],0)} / {f($enchantUpgrades[index]['maxLevel'],0)}] 
{#if ($settings['maxBuy'] && buyAmount > 0) || buyAmount > 1}
<span class='text-gray-300'>(x{buyAmount})</span>
{/if}
         <span class='px-2 mx-4 max-w-[300px] tooltip tooltip-text shadow-lg p-1
       border-white border-double border bg-[#222529] ml-16
         pointer-events-none'>
         <div class='title text-small-gray items-start text-center pb-1'>
            {$enchantUpgrades[index]['description']} 
            {#if $enchantUpgrades[index]['name'] == 'Rift Tearing'}
            <span class='text-[#7fbf8a] font-bold'> (Enchants in green only fire when the green bar fills.) </span>
            {/if}
        </div>
        <div class='text-center effect-wrapper'>
            {#if $enchantUpgrades[index]['extPrefix'] && $enchantUpgrades[index]['extSuffix']}
            <div class='tooltip-text-xs text-[#888888]'>
                 <span class='current text-[#888888] italic pb-1'>
                    {$enchantUpgrades[index]['extPrefix']} 
                    {f($enchantUpgrades[index]['extFormula']
                    ($enchantUpgradeLevels[index],
                    formula.getMineSize(),
                    formula.getMineQuality()),($enchantUpgrades[index]['roundOverride'] || 3))}
                    {$enchantUpgrades[index]['extSuffix']}
                 </span>
            </div>
            {/if}
        </div>
        <div class='text-center effect-wrapper'>
            <div class='tooltip-text-xs text-[#cccccc]'>
                <span class='current text-[#cccccc]'>{$enchantUpgrades[index]['prefix'] || ""}</span>  
                 <span class='current text-[#cccccc]'>
                    {$enchantUpgrades[index]['isPercent'] ?
                    fp($enchantUpgrades[index]['formula']($enchantUpgradeLevels[index]),
                    $enchantUpgrades[index]['roundOverride'] || 3, false) :
                    f($enchantUpgrades[index]['formula']($enchantUpgradeLevels[index]),
                    $enchantUpgrades[index]['roundOverride'] || 3)}
                 </span>
                 <span class='current text-[#888888]'>  => 
                    {$enchantUpgrades[index]['isPercent'] ?
                   fp($enchantUpgrades[index]['formula']($enchantUpgradeLevels[index]+buyAmount),
                   $enchantUpgrades[index]['roundOverride'] || 3, false) :
                   f($enchantUpgrades[index]['formula']($enchantUpgradeLevels[index]+buyAmount),
                   $enchantUpgrades[index]['roundOverride'] || 3)}
                 </span>
                 <span class='current text-[#cccccc]'>{$enchantUpgrades[index]['suffix'] || ""}</span>  
                 {#if $settings['costRatios']}
                 <br/>
                 <span class='current text-[#888888]'>
                 Cost Multiplier: {f($enchantUpgrades[index]['ratio'],3)}x
                 </span>
                 {/if}
            </div>
        </div>
        <hr />
        <div class='pt-1 cost items-start text-center grid grid-cols-4'>
            {#if $enchantUpgradeLevels[index] >= $enchantUpgrades[index]['maxLevel']}
                <div class='col-span-4 text-[#888888]'>This upgrade is at max level.</div>
            {:else}
            {#each Object.entries(costs) as c}
                {#if c[1] >= 1}
                    <div class='{ref.colors[c[0]] || ref.colors['default']} text-right pr-3 col-span-2'>{
                    $wallet[c[0]] || $unlockedRes.has(c[0]) ? 
                    (ref.displayNames[c[0]] ? ref.displayNames[c[0]] : c[0]) : "???"}</div>
                    <div class='col-span-2  {!(thisTypeAffordable(c[0])) ?'text-red-600' : ''} text-left'>{f(c[1])}</div>
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
         settings, visibleTier, unlockedRes} from '../../data/player';
    import {progressThreshold, progressPerTick } from '../../data/mining';
    import { enchantUpgrades } from '../../data/fame';
    import ref from '../../calcs/ref'
    import formula from '../../calcs/formula'
// @ts-nocheck
    export let index;
    let getCosts = () => {
        let c = {};
        for (let [type, base] of Object.entries($enchantUpgrades[index]['cost'])) {
            c[type] = cost(base);
        }
        return c;
    }
    let costs = {};
    let affordable, unlocked;
    let permUnlocked = ($enchantUpgradeLevels[index] > 0)
    let affordInterval;
    let maxBuyCalcFinished = true;
    let buyAmount = $settings['buyAmount']
    
    onMount(() => {
        setTimeout(() => {
            costs = getCosts();
            affordable = canAfford();
            if ($enchantUpgrades[index]['unlockAt']()) permUnlocked = true;
            permUnlocked = ($enchantUpgradeLevels[index] > 0)
        }, 50)
        affordInterval = setInterval(() => {
            affordable = canAfford();
            unlocked = isUnlocked();
            if ($enchantUpgrades[index]['unlockAt']()) permUnlocked = true;
            if ($settings['maxBuy']) {
                buyAmount = calcMaxBuyAmount();
                costs = getCosts();
            } else {
                buyAmount = $settings['buyAmount'];
            }
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
       const base = start * Math.pow($enchantUpgrades[index]['ratio'], $enchantUpgradeLevels[index]);  
       const r =  $enchantUpgrades[index]['ratio']
       const l = (Math.max(1, buyAmount));

       return formula.gSum(base,r,l)
    }

    function buy() {
        costs = getCosts();
        for (let [type, val] of Object.entries(costs)) {
            if (val >=  1 && $wallet[type] < val) {
                return;
            }
        }
        for (let [type, val] of Object.entries(costs)) {
            if (val >= 1) $wallet[type] -= val;
        }
        $enchantUpgradeLevels[index] += buyAmount;
        costs = getCosts();
        permUnlocked = true;
    }

    function thisTypeAffordable(type) {
        return ($wallet[type] >= costs[type]);
    }

    function calcMaxBuyAmount() {
        maxBuyCalcFinished = false;
        let maxBuy = 1e9; // or any large number
        for (let [type, bCost] of Object.entries($enchantUpgrades[index]['cost'])) {
            const base = bCost * Math.pow($enchantUpgrades[index]['ratio'], $enchantUpgradeLevels[index]); 
            maxBuy = Math.min(maxBuy, 
            formula.maxNumGeom($wallet[type], base, $enchantUpgrades[index]['ratio']));
        }
        maxBuyCalcFinished = true;
        return maxBuy;
    }

    function canAfford() {
        if ($settings['maxBuy'] && buyAmount == 0) return false;
        costs = getCosts();
        for (let [type, val] of Object.entries(costs)) {
            if (val >= 1 && $wallet[type] < val) {
                return false;
            }
        }  
        return true;
    }

    function isUnlocked() {
        for (let [type, val] of Object.entries($enchantUpgrades[index]['unlockAt'])) {
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