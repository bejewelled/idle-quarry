
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click={() => buy(index)}
class='has-tooltip tooltip-text 
{affordable ? 'game-btn' : 'game-btn-noafford'}
py-2 items-center text-center border-solid ml-1 mr-1 col-span-12
select-none'>{$beaconUpgrades[index]['name']} [{f($beaconUpgradeLevels[index],0)} / {f($beaconUpgrades[index]['maxLevel'],0)}]
         <span class='px-2 mx-4 max-w-[300px] tooltip tooltip-text shadow-lg p-1
       border-white border-double border bg-[#222529] ml-16
         pointer-events-none'>
         <div class='title text-small-gray items-start text-center pb-1'>
            {$beaconUpgrades[index]['description']}
        </div>
        <div class='text-center effect-wrapper'>
            <div class='tooltip-text-xs text-[#cccccc]'>
                 <span class='current text-[#cccccc]'>
                    {$beaconUpgrades[index]['prefix'] || ""}{$beaconUpgrades[index]['isPercent'] ?
                    fp($beaconUpgrades[index]['formula']($beaconUpgradeLevels[index]),3, true) :
                    f($beaconUpgrades[index]['formula']($beaconUpgradeLevels[index]),3)}{$beaconUpgrades[index]['suffix'] || ""}
                 </span>
                 <span class='current text-[#999999]'>  => 
                    {$beaconUpgrades[index]['prefix'] || ""}{$beaconUpgrades[index]['isPercent'] ?
                   fp($beaconUpgrades[index]['formula']($beaconUpgradeLevels[index]+$settings['buyAmount']),3, true) :
                   f($beaconUpgrades[index]['formula']($beaconUpgradeLevels[index]+$settings['buyAmount']),3)}{$beaconUpgrades[index]['suffix'] || ""}
                 </span>

            </div>
        </div>
        <hr />
        <div class='pt-1 cost items-start text-center grid grid-cols-5'>
            {#if $beaconUpgradeLevels[index] >= $beaconUpgrades[index]['maxLevel']}
                <div class='col-span-4 text-[#999999]'>This upgrade is at max level.</div>
            {:else}
            {#each Object.entries(costs) as c}
                {#if c[1] >= 1}
                    <div class='{ref.colors[c[0]] || ref.colors['default']} col-span-3'>
                    {(ref.displayNames[c[0]] ? ref.displayNames[c[0]] : c[0])}</div>
                    <div class='col-span-2 text-left'>{f(c[1])}</div>
                {/if}
            {/each}
            {/if}
        </div>
         </span>
     </div>

        

 <script>
// @ts-nocheck

    import { onDestroy, onMount } from 'svelte';
    import { progress, wallet, beaconUpgradeLevels, miningDropTable,
         settings, visibleTier, unlockedRes, resources} from '../../data/player';
    import {progressThreshold, progressPerTick } from '../../data/mining';
    import {beaconUpgrades} from '../../data/beacons';
    import ref from '../../calcs/ref'
    import formula from '../../calcs/formula'
// @ts-nocheck
    export let index;
    let getCosts = () => {
        let c = {};
        for (let [type, base] of Object.entries($beaconUpgrades[index]['cost'])) {
            c[type] = cost(base);
        }
        return c;
    }
    let costs = {};
    let affordable, unlocked;
    let permUnlocked = ($beaconUpgradeLevels[index] > 0)
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
    if (n < 1e9) return (n*100).toFixed((n < 999 ? pl : 0)).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "%";
    else return (n*100).toExponential(pl).toString().replace('+', '') + "%";
}

    function cost(start) {
       const base = start * Math.pow($beaconUpgrades[index]['ratio'], $beaconUpgradeLevels[index]);  
       const r =  $beaconUpgrades[index]['ratio']
       const l = $settings['buyAmount']

       return formula.gSum(base,r,l)
    }

    function buy() {
        costs = getCosts();
        for (let [type, val] of Object.entries(costs)) {
            if (val >= 1 && $resources[type] < val) {
                return;
            }
        }
        for (let [type, val] of Object.entries(costs)) {
            if (val >= 1) $resources[type] -= val;
        }
        $beaconUpgradeLevels[index] += $settings['buyAmount'];
        costs = getCosts();
    }

    function canAfford() {
        costs = getCosts();
        for (let [type, val] of Object.entries(costs)) {
            if (val >= 1 && $resources[type] < val) {
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