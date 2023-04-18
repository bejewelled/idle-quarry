

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click={() => buy(index)}
class='has-tooltip tooltip-text 
{canAfford() ? 'game-btn' : 'game-btn-noafford'}
py-1 items-center text-center border-solid ml-1 mr-1 col-span-12
select-none'>{$miningUpgrades[index]['name']}
         <span class='px-2 mx-4 tooltip tooltip-text shadow-lg p-1
       border-white border-double border bg-[#222529] ml-16
         pointer-events-none'>
         <div class='title text-small-gray items-start text-center pb-1'>
            {$miningUpgrades[index]['description']}
        </div>
        <div class='text-center effect-wrapper'>
            <div class='tooltip-text-xs text-[#cccccc]'>
                 <span class='current text-[#cccccc]'>
                    {f($miningUpgrades[index]['formula']($miningUpgradeLevels[index]),3)}
                 </span>
                 <span class='current text-[#999999]'>
                   => {f($miningUpgrades[index]['formula']($miningUpgradeLevels[index]+1),3)}
                 </span>

            </div>
        </div>
        <hr />
        <div class='pt-1 cost items-start text-center grid grid-cols-4'>
            {#each Object.entries(costs()) as c}
                <div class='{ref.colors[c[0]] || ref.colors['default']} col-span-2'>{c[0]}</div>
                <div class='col-span-2 text-left'>{c[1]}</div>
            {/each}
        </div>
         </span>
        </div>

        

 <script>
// @ts-nocheck

    import { onMount } from 'svelte';
    import { wallet, miningUpgradeLevels } from '../../data/player';
    import { progress, progressThreshold, progressPerTick, miningUpgrades } from '../../data/mining';
    import ref from '../../calcs/ref'
// @ts-nocheck
    export let index;
    $: costs = () => {
        let c = {};
        for (let [type, base] of Object.entries($miningUpgrades[index]['cost'])) {
            c[type] = cost(base);
        }
        return c;
    }

    const f = (n, pl = 0) => {
        if (n < 1e9) return n.toFixed(pl).toLocaleString();
        else return n.toExponential(pl).toString().replace('+', '');
    }

    const fp = (n, pl = 3, subOne = false) => {
        if (subOne) n -= 1;
        if (n < 1e9) return n.toFixed(pl).toLocaleString() + "%";
        else return (n*100).toExponential(pl).toString().replace('+', '') + "%";
    }

    function cost(base) {
        return base * Math.pow($miningUpgrades[index]['ratio'], 
                   $miningUpgradeLevels[index]);   
    }

    function buy() {
        console.log(costs());
        for (let [type, base] of Object.entries($miningUpgrades[index]['cost'])) {
            if ($wallet[type] < cost(base)) {
                return;
            }
        }
        for (let [type, base] of Object.entries($miningUpgrades[index]['cost'])) {
            $wallet[type] -= cost(base);
        }
        $miningUpgradeLevels[index]++;
    }

    function canAfford() {
        for (let [type, base] of Object.entries($miningUpgrades[index]['cost'])) {
            if ($wallet[type] < cost(base)) {
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