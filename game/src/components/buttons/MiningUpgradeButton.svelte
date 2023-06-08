
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#key permUnlocked || affordable || $miningUpgradeLevels[index] > 0}
{#if $miningUpgrades[index]['unlockAt']() || permUnlocked || $miningUpgradeLevels[index] > 0}
<div class='pt-1'></div>
<div on:click={() => buy(index)}
class='has-tooltip tooltip-text 
{affordable && $miningUpgradeLevelsBought[index] < $miningUpgrades[index]['maxLevel']
 ? $miningUpgrades[index]['style'] || 'game-btn' : ($miningUpgrades[index]['style'] || 'game-btn')+'-noafford'}
py-2 items-center text-center border-solid ml-1 mr-1 col-span-12
select-none'>{$miningUpgrades[index]['name']} [ {f($miningUpgradeLevelsBought[index],0)} / {f($miningUpgrades[index]['maxLevel'],0)}
{#if $miningUpgradeLevelsFree[index] > 0}
+ {f($miningUpgradeLevelsFree[index],0)} 
{/if}] 
{#if $settings['maxBuy'] && maxBuyCalcFinished && buyAmount >= 1}
(+{buyAmount})
{/if}
         <span class='px-2 mx-4 max-w-[275px] tooltip tooltip-text shadow-lg p-1
       border-white border-double border bg-[#222529] ml-16
         pointer-events-none'>
         <div class='title text-small-gray items-start text-center pb-1'>
            {$miningUpgrades[index]['description']}
            {#if $miningUpgrades[index]['name'] == 'Expansive'}
                <span class='text-orange-400'> (Upgrades in orange aren't reset when you relocate.) </span>
            {/if}
        </div>
        <div class='text-center effect-wrapper'>
            <div class='tooltip-text-xs text-[#cccccc]'>
                 <span class='current text-[#cccccc]'>
                    {$miningUpgrades[index]['prefix'] || ""}{$miningUpgrades[index]['isPercent'] ?
                    fp($miningUpgrades[index]['formula']($miningUpgradeLevels[index]),3, true) :
                    f($miningUpgrades[index]['formula']($miningUpgradeLevels[index]),3)}{$miningUpgrades[index]['suffix'] || ""}
                 </span>
                 <span class='current text-[#999999]'>  => 
                    {$miningUpgrades[index]['prefix'] || ""}{$miningUpgrades[index]['isPercent'] ?
                   fp($miningUpgrades[index]['formula']($miningUpgradeLevels[index]+buyAmount),3, true) :
                   f($miningUpgrades[index]['formula']($miningUpgradeLevels[index]+buyAmount),3)}{$miningUpgrades[index]['suffix'] || ""}
                 </span>

            </div>
        </div>
        <hr />
        <div class='pt-1 cost items-start text-center grid grid-cols-4'>
            {#if $miningUpgradeLevels[index] >= $miningUpgrades[index]['maxLevel']}
                <div class='col-span-4 text-[#999999]'>This upgrade is at max level.</div>
            {:else}
            {#each Object.entries(costs) as c}
                {#if c[1] >= 1}
                    <div class='{ref.colors[c[0]] || ref.colors['default']} text-right pr-3 col-span-2'>{
                    $wallet[c[0]] || $unlockedRes.has(c[0]) ? 
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
    import { progress, wallet, miningUpgradeLevels, miningDropTable,
         settings, visibleTier, unlockedRes, miningUpgradeLevelsBought, 
         miningUpgradeLevelsFree, challengeActive} from '../../data/player';
    import {progressThreshold, progressPerTick, miningUpgrades } from '../../data/mining';
    import ref from '../../calcs/ref'
    import formula from '../../calcs/formula'
// @ts-nocheck
    export let index;
    let getCosts = () => {
        let c = {};
        for (let [type, base] of Object.entries($miningUpgrades[index]['cost'])) {
            c[type] = cost(base, type);
        }
        return c;
    }
    let costs = {};
    let affordable, unlocked;
    let permUnlocked = ($miningUpgradeLevels[index] > 0)
    let affordInterval;
    let maxBuyCalcFinished = false;
    let buyAmount = $settings['buyAmount'];
    
    onMount(() => {
        
        setTimeout(() => {
            costs = getCosts();
            affordable = canAfford();
            if ($miningUpgrades[index]['unlockAt']()) permUnlocked = true;
            permUnlocked = ($miningUpgradeLevels[index] > 0)
        }, 50)
        affordInterval = setInterval(() => {
            affordable = canAfford();
            unlocked = isUnlocked();
            if ($miningUpgrades[index]['unlockAt']()) permUnlocked = true;
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
       const base = start * Math.pow($miningUpgrades[index]['ratio'], $miningUpgradeLevelsBought[index]);  
       const r =  $miningUpgrades[index]['ratio']
       const l = (Math.max(1, buyAmount));

       return formula.gSum(base,r,l)
    }

    function calcMaxBuyAmount() {
        const levelsRemaining = $miningUpgrades[index]['maxLevel'] - $miningUpgradeLevelsBought[index];
        maxBuyCalcFinished = false;
        let maxBuy = 1e9; // or any large number
        for (let [type, bCost] of Object.entries($miningUpgrades[index]['cost'])) {
            const base = bCost * Math.pow($miningUpgrades[index]['ratio'], $miningUpgradeLevelsBought[index]); 
            maxBuy = Math.min(maxBuy, 
            formula.maxNumGeom($wallet[type], base, $miningUpgrades[index]['ratio']));
        }
        maxBuyCalcFinished = true;
        return Math.min(levelsRemaining, maxBuy);
    }

    function buy() {
        if ($challengeActive === 2) return;
        if ($miningUpgradeLevelsBought[index] >= $miningUpgrades[index]['maxLevel']) return;
        costs = getCosts();
        for (let [type, val] of Object.entries(costs)) {
            if (val >=  1 && (!$wallet[type] || $wallet[type] < val-0.003)) {
                return;
            }
        }
        for (let [type, val] of Object.entries(costs)) {
            if (val >= 1) $wallet[type] -= (val-0.003);
        }
        $miningUpgradeLevels[index] += Math.min(buyAmount,
        $miningUpgrades[index]['maxLevel'] - $miningUpgradeLevels[index]);
        $miningUpgradeLevelsBought[index] += Math.min(buyAmount,
        $miningUpgrades[index]['maxLevel'] - $miningUpgradeLevelsBought[index]);
        costs = getCosts();
        permUnlocked = true;
        miningDropTable.updateTable();
        if (($miningUpgrades[index]['name'] || '') == 'Lootmaster I') $visibleTier = 2;
        if (($miningUpgrades[index]['name'] || '') == 'Lootmaster II') $visibleTier = 3;
        if (($miningUpgrades[index]['name'] || '') == 'Lootmaster III') $visibleTier = 4;
    }

    function canAfford() {
        if ($challengeActive === 2) return false;
        if ($settings['maxBuy'] && buyAmount == 0) return false;
        costs = getCosts();
        for (let [type, val] of Object.entries(costs)) {
            if (val >= 1 && $wallet[type] < val-0.003) {
                return false;
            }
        }  
        return true;
    }

    function isUnlocked() {
        for (let [type, val] of Object.entries($miningUpgrades[index]['unlockAt'])) {
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
</style>