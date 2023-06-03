
  
  <div class='wrapper pt-2'>
    <div class='grid grid-cols-12'>
        <div class='text-center pb-3 text-med game-text col-span-12'>
          Total Clicks: {f($buttonStats['totalClicks'])} 
          [ 
          <span class='text-amber-500 font-bold'>{f($buttonNumClicks['perfect'],0)}</span> + 
          <span class='text-pink-500'>{f($buttonNumClicks['incredible'],0)}</span> + 
          <span class='text-violet-500'>{f($buttonNumClicks['excellent'],0)}</span> + 
          <span class='text-sky-500'>{f($buttonNumClicks['great'],0)}</span> + 
          <span class='text-green-500'>{f($buttonNumClicks['good'],0)}</span> + 
          <span class='text-gray-500'>{f($buttonNumClicks['okay'],0)}</span>
           ]
        </div>
        <div class='col-span-12 pb-3 game-text text-center'>
           Clicks Today: {f($buttonStats['totalClicks'])}
          [ <span class='game-text'>{f(formula.calcButtonStreakBonus($buttonStats['totalClicks']),3)}x 
              <span class='text-indigo-300'> crystal bonus</span>
          </span> ]
        </div>
        {#each $buttonUpgrades as b,i}
          <div class='col-span-3 pb-1 '>
            <ButtonUpgradeButton index={i}/>
          </div>
        {/each}
    </div>
      <ButtonItem />
  </div>

<script>
// @ts-nocheck

  import {buttonStats, buttonNumClicks,
    progress, wallet, enchantUpgradeLevels, miningDropTable,
        settings, visibleTier, unlockedRes} from '../../data/player';
  import {buttonUpgrades} from '../../data/button';
  import { onMount, onDestroy} from 'svelte';
  import ButtonItem from '../buttons/ButtonItem.svelte';
  import {progressThreshold, progressPerTick } from '../../data/mining';
  import { enchantUpgrades } from '../../data/fame';
  import ref from '../../calcs/ref'
  import formula from '../../calcs/formula'
  import ButtonUpgradeButton from '../buttons/ButtonUpgradeButton.svelte';
// @ts-nocheck

const f = (n, pl = 0) => {
        if (n < 1e9) return n.toFixed((n < 1e3 ? pl : 0)).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        else return n.toExponential(3).toString().replace('+', '');
    }   

const fp = (n, pl = 3, subOne = false) => {
    if (subOne) n -= 1;
    if (n < 1e9) return (n*100).toFixed((n < 1e3 ? pl : 0)).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "%";
    else return (n*100).toExponential(pl).toString().replace('+', '') + "%";
}

const fpf = (n, subOne = false) => {
    if (subOne) n -= 1;
    if (n < 1e9) return (n*100).toFixed(3).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "%";
    else return (n*100).toExponential(3).toString().replace('+', '') + "%";
}

</script>