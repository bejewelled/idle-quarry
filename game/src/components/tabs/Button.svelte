
  
  <div class='wrapper pt-2'>
    <div class='grid grid-cols-12'>
        <!-- <div class='text-center pb-3 text-med game-text col-span-12'>
          Total Clicks: {f($buttonStats['totalClicks'])} 
          [ 
          <span class='text-amber-500 font-bold'>{f($buttonNumClicks['perfect'],0)}</span> + 
          <span class='text-pink-500'>{f($buttonNumClicks['incredible'],0)}</span> + 
          <span class='text-violet-500'>{f($buttonNumClicks['excellent'],0)}</span> + 
          <span class='text-sky-500'>{f($buttonNumClicks['great'],0)}</span> + 
          <span class='text-green-500'>{f($buttonNumClicks['good'],0)}</span> + 
          <span class='text-gray-500'>{f($buttonNumClicks['okay'],0)}</span>
           ]
        </div> -->

        <div class='pb-3 col-span-12 game-text text-center'>
          At your current <span class='text-yellow-300'>layer</span>, 
          you gain <span class='{ref.colors['radium']} font-bold'>
            {f(radioactivityGain, 2)} radioactivity</span>
          per mining cycle.
        </div>

        <div class='pb-3 col-span-12 game-text text-center'>
          Your <span class='{ref.colors['radium']}'>radium</span>
          is producing 
          <span class='{ref.colors['crystals']} font-bold'>
            {f(crystalGains,
            crystalGains > 100 ? 0 : 2)}  crystals</span> per second
        </div>

        <div class='col-span-12 pb-3 game-text text-center'>

        <div class='col-span-9'>
          <div class='w-full my-1 bg-gray-200 rounded-sm h-4 dark:bg-gray-700'>
              <div class="
              flex justify-start items-left">
                <div class="bg-lime-300 w-4 h-4 rounded-sm 
                relative z-0" 
                style="width: {buttonBarWidth}; transition: width 0.1s;"> 
                </div>
              </div>
          </div>
        </div>
        <div class='col-span-3 text-left align-text-middle has-tooltip'>
            <div class='tooltip-text text-med'>Radioactivity 
            <span class='text-lime-300 text-med pl-2 pr-2'>
              {f($radiumProgress[0])} / {f($radiumProgress[1])}
            </span>
            for <span class='text-lime-300 text-med pl-0 pr-2'>
              +{f(formula.calcRadiumGainWhenComplete(), 2)} radium
            </span> 
            {#if $radiumGainText.length > 0}
              <span class='text-lime-300 text-opacity-70 text-med pl-2'>
                {$radiumGainText}
              </span>
            {/if}
            </div>
  
        </div>

        </div>
        {#each $buttonUpgrades as b,i}
          <div class='col-span-3 pb-1 '>
            <ButtonUpgradeButton index={i}/>
          </div>
        {/each}
    </div>

    <div class='pb-16 pt-8 tooltip-text text-center w-full italic'>
      The chance of discovering a thorium deposit is <span class='text-lime-500'>
        {fp($buttonUpgrades[0]['formula']($buttonUpgradeLevels[0]))}</span> per second.<br/>
      {#if $wallet['totalFame'] > 1e13 || $stats['ascensionCount'] > 0}
        When you gain radium, you have a 
        <span class={ref.colors['stars']}>
          {fp($buttonUpgrades[5]['formula']($buttonUpgradeLevels[5]))}
        </span>
        chance to gain a <span class='{ref.colors['stars']}'>star.</span>
        <br/>
      {/if}
      Base radioactivity gain increases after layer 100. <br/>


  </div>

  
  </div>

<script>
	import { buttonUpgradeLevels, stats } from './../../data/player.ts';
// @ts-nocheck

  import {buttonStats, buttonNumClicks,
    progress, wallet, enchantUpgradeLevels, miningDropTable,
        settings, visibleTier, unlockedRes, radiumProgress} from '../../data/player';
  import {buttonUpgrades, radiumGainText} from '../../data/button';
  import { onMount, onDestroy} from 'svelte';
  import {progressThreshold, progressPerTick } from '../../data/mining';
  import { enchantUpgrades } from '../../data/fame';
  import ref from '../../calcs/ref'
  import formula from '../../calcs/formula'
  import ButtonUpgradeButton from '../buttons/ButtonUpgradeButton.svelte';
// @ts-nocheck

let clockinterval;
let radioactivityGain = formula.calcRadioactivityGain();

onMount(() => {
  clockinterval = setInterval(() => {
    crystalGains = formula.calcCrystalGainFromRadium();
    radioactivityGain = formula.calcRadioactivityGain();
  }, 653);
});

onDestroy(() => {
  clearInterval(clockinterval);
});

$: buttonBarWidth = `${Math.min(1,$radiumProgress[0] / $radiumProgress[1]) * 100}%`;
$: crystalGains = formula.calcCrystalGainFromRadium()
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