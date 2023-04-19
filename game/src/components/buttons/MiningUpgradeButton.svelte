
<!-- svelte-ignore a11y-click-events-have-key-events -->
{#if $miningUpgrades[index]['unlockAt']() || permUnlocked}
<div on:click={() => buy(index)}
class='has-tooltip tooltip-text 
{affordable ? 'game-btn' : 'game-btn-noafford'}
py-2 items-center text-center border-solid ml-1 mr-1 col-span-12
select-none'>{$miningUpgrades[index]['name']} [{f($miningUpgradeLevels[index],0)}]
         <span class='px-2 mx-4 tooltip tooltip-text shadow-lg p-1
       border-white border-double border bg-[#222529] ml-16
         pointer-events-none'>
         <div class='title text-small-gray items-start text-center pb-1'>
            {$miningUpgrades[index]['description']}
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
                   fp($miningUpgrades[index]['formula']($miningUpgradeLevels[index]+1),3, true) :
                   f($miningUpgrades[index]['formula']($miningUpgradeLevels[index]+1),3)}{$miningUpgrades[index]['suffix'] || ""}
                 </span>

            </div>
        </div>
        <hr />
        <div class='pt-1 cost items-start text-center grid grid-cols-4'>
            {#each Object.entries(costs) as c}
                <div class='{ref.colors[c[0]] || ref.colors['default']} col-span-2'>{
                $wallet[c[0]] && $wallet[c[0]] > 0 ? c[0] : "???"}</div>
                <div class='col-span-2 text-left'>{f(c[1])}</div>
            {/each}
        </div>
         </span>
     </div>
        {/if}

        

 <script>
// @ts-nocheck

    import { onDestroy, onMount } from 'svelte';
    import { progress, wallet, miningUpgradeLevels, miningDropTable } from '../../data/player';
    import {progressThreshold, progressPerTick, miningUpgrades } from '../../data/mining';
    import ref from '../../calcs/ref'
// @ts-nocheck
    export let index;
    let getCosts = () => {
        let c = {};
        for (let [type, base] of Object.entries($miningUpgrades[index]['cost'])) {
            c[type] = cost(base);
        }
        return c;
    }
    let costs = {};
    let affordable, unlocked;
    let permUnlocked = ($miningUpgradeLevels[index] > 0)
    let affordInterval;
    
    onMount(() => {
        setTimeout(() => {
            costs = getCosts();
            affordable = canAfford();
            if ($miningUpgrades[index]['unlockAt']()) permUnlocked = true;
        }, 50)
        affordInterval = setInterval(() => {
            affordable = canAfford();
            unlocked = isUnlocked();
            if ($miningUpgrades[index]['unlockAt']()) permUnlocked = true;
        }, 100 + (Math.random() * 20))
    })

    onDestroy(() => {
        clearInterval(affordInterval);
    })
    const f = (n, pl = 0) => {
        if (n < 1e9) return n.toFixed(pl).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        else return n.toExponential(3).toString().replace('+', '');
    }   

    const fp = (n, pl = 3, subOne = false) => {
        if (subOne) n -= 1;
        if (n < 1e9) return (n*100).toFixed(pl).toLocaleString() + "%";
        else return (n*100).toExponential(pl).toString().replace('+', '') + "%";
    }

    function cost(base) {
        return base * Math.pow($miningUpgrades[index]['ratio'], 
                   $miningUpgradeLevels[index]);   
    }

    function buy() {
        for (let [type, val] of Object.entries(costs)) {
            if ($wallet[type] < val) {
                return;
            }
        }
        for (let [type, val] of Object.entries(costs)) {
            $wallet[type] -= val;
        }
        $miningUpgradeLevels[index]++;
        costs = getCosts();
        permUnlocked = true;
        miningDropTable.updateTable();
    }

    function canAfford() {
        for (let [type, val] of Object.entries(costs)) {
            if ($wallet[type] < val) {
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