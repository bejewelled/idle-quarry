
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click={() => buy()}
class='has-tooltip tooltip-text game-btn text-teal-400 
py-2 items-center text-center border-solid ml-1 mr-1 col-span-12 select-none'>
    Convert Mist into Deity Power
         <span class='px-2 mx-4 max-w-[300px] tooltip tooltip-text shadow-lg p-1
       border-white border-double border bg-[#222529] mr-16
         pointer-events-none'>
        <div class='title text-small-gray items-start text-center pb-1'>
            Your deity is attracted by the strength of your mine. <br/>
            Convert all mist into deity power.
        </div>
         </span>
     </div>

        

 <script>
// @ts-nocheck

    import { onDestroy, onMount } from 'svelte';
    import { progress, wallet, enchantUpgradeLevels, miningDropTable,
         settings, visibleTier, unlockedRes, 
         buttonStats, buttonNumClicks, buttonUpgradeLevels, permaWallet, deity} from '../../data/player';
    import {progressThreshold, progressPerTick } from '../../data/mining';
    import { enchantUpgrades } from '../../data/fame';
    import {buttonUpgrades} from '../../data/button';
    import ref from '../../calcs/ref'
    import formula from '../../calcs/formula'
// @ts-nocheck

    onMount(() => {
    })

    onDestroy(() => {
    })

    const f = (n, pl = 0, forceExponential=false) => {
        if (n < 1e9 && !forceExponential) return n.toFixed((n < 1e3 ? pl : 0)).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        else return n.toExponential(3).toString().replace('+', '');
    }   

    const fp = (n, pl = 3, subOne = false) => {
    if (subOne) n -= 1;
    if (n < 1e9) return (n*100).toFixed((n*100 < 1e3 ? pl : 0)).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "%";
    else return (n*100).toExponential(pl).toString().replace('+', '') + "%";
}


    function buy() {
      const inv = $wallet['mist'];
      $wallet['mist'] = 0;
      $deity['mistInvested'] += inv;
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