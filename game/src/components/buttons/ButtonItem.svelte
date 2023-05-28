{#if showRewardDescription}
<div class='absolute flex w-[400px] h-[35px] {rewardStyle} 
text-center items-center justify-center'
style = 'top: {textPosition.y}px; left: {textPosition.x}px;'>
{rewardDescriptionText}</div>
{/if}
<button
    id="button"
    class="absolute w-[100px] h-[100px] border-4 border-white text-white flex items-center justify-center rounded-full cursor-pointer transition-all duration-300"
    style="top: {buttonPosition.y}px; left: {buttonPosition.x}px;"
    on:click={handleClick}
  ></button>
{#if $buttonUpgradeLevels[2] > 0}
<button
    id="button"
    class="absolute w-[20px] h-[20px] bg-gray-400 text-white flex items-center justify-center rounded-full cursor-pointer transition-all duration-300"
    style="top: {buttonPosition.y+40}px; left: {buttonPosition.x+40}px;"
    on:click={handleClick}
  > </button>
{/if}
{#if $buttonUpgradeLevels[7] > -1}
<button
    id="button"
    class="absolute w-[4px] h-[4px] bg-red-400 text-white flex items-center justify-center rounded-full cursor-pointer transition-all duration-300"
    style="top: {buttonPosition.y+48}px; left: {buttonPosition.x+48}px;"
    on:click={handleClick}
  > </button>
{/if}


<script>
import { onMount } from 'svelte';
// @ts-ignore
import {progress, wallet, miningDropTable, miningUpgradeLevels, 
    // @ts-ignore
    settings, visibleTier, progressThisTick, progressAverage,
buttonNumClicks, mineLevel, buttonStats, buttonUpgradeLevels} from '../../data/player';
// @ts-ignore
import {progressThreshold, progressPerTick, miningUpgrades, antiFlickerFlags,
// @ts-ignore
gemGainFlavorText, gemProgressFlavorText } from '../../data/mining';
// @ts-ignore
import {keyGainFlavorText} from '../../data/keys';
import {buttonUpgrades} from '../../data/button';
// @ts-ignore
import MiningUpgradeButton from '../buttons/MiningUpgradeButton.svelte';
// @ts-ignore
import ref from '../../calcs/ref'
import formula from '../../calcs/formula'

    let showRewardDescription = false;
    let rewardDescriptionText = '';
    let rewardStyle = '';

const BUTTON_SIZE= 100;
  
  let buttonPosition = {
      x: 0,
      y: 0
    };
  let textPosition = {
        x: 0,
        y: 0,
    }
  
    // @ts-ignore
    const handleClick = (event) => {
        textPosition = {
        x: buttonPosition.x,
        y: buttonPosition.y
      }


    // calculate how close to the center of the button the cursor was
    // @ts-ignore
    const cursorX = (event ? event.clientX : 0);
    // @ts-ignore
    const cursorY = (event ? event.clientY : 0);

    const absDist = Math.sqrt(Math.abs(cursorX - buttonPosition.x-(BUTTON_SIZE/2)) ** 2 + Math.abs(cursorY - buttonPosition.y-(BUTTON_SIZE/2)) ** 2);
    
    let rewardAmount = 0;

    console.log(absDist);

    $buttonStats['totalClicks']++;
    $buttonStats['totalClicksToday']++;
    if (Date.now() - $buttonStats['todayStartTime'] > 8.64e7) {
        $buttonStats['totalClicksToday'] = 0;
        $buttonStats['todayStartTime'] = Date.now();
    }
    $buttonStats['clicksUntilFame']--;
    if ($buttonStats['clicksUntilFame'] <= 0) {
        $buttonStats['clicksUntilFame'] = $buttonUpgrades[0]['formula']($buttonUpgradeLevels[0])
        $wallet['fame'] += 1000;
    }
    console.log(absDist)
    if (absDist < 0.004) {
        rewardAmount = 400;
        rewardDescriptionText = 'PERFECT! +';
        rewardStyle = 'border-2 text-large text-amber-500 border-amber-500 font-bold'
        $buttonNumClicks['perfect']++;
        $mineLevel['xp'] += 3;
    } else if (absDist <= 2) {
        rewardAmount = 12;
        rewardDescriptionText = 'INCREDIBLE +';
        rewardStyle = 'text-large text-pink-500 border-pink-500 font-bold'
        $buttonNumClicks['incredible']++;
        $mineLevel['xp'] += 3;
    } else if (absDist <= 4) {
        rewardAmount = 4;
        rewardDescriptionText = 'Excellent +';
        rewardStyle = 'text-med text-violet-500 border-violet-500'
        $buttonNumClicks['excellent']++;
        $mineLevel['xp'] += 2;
    } else if (absDist <= 7) {
        rewardAmount = 3;
        rewardDescriptionText = 'Great +';
        rewardStyle = 'text-med text-sky-500 border-sky-500'
        $buttonNumClicks['great']++;
        $mineLevel['xp'] += 1;
    } else if (absDist <= 10) {
        rewardAmount = 2;
        rewardDescriptionText = 'Good +';
        rewardStyle = 'text-med text-green-500 border-green-500'
        $buttonNumClicks['good']++;
        $mineLevel['xp'] += 1;
    } else {  
        rewardAmount = 1;
        rewardDescriptionText = 'Okay +';
        rewardStyle = 'text-small text-gray-500 border-gray-500';
        $buttonNumClicks['okay']++;
        $mineLevel['xp'] += 1;
    } 

    rewardAmount = rewardAmount 
    * formula.calcButtonStreakBonus($buttonStats['totalClicksToday'])
    * $miningUpgrades[23]['formula']($miningUpgradeLevels[23])
    
    const isLucky = Math.random() < $buttonUpgrades[5]['formula']($buttonUpgradeLevels[5]);
    let mplr;
    if (isLucky) {
        mplr = 8 + Math.round(Math.random() * 12);
        rewardAmount *= mplr;
    }
   
    rewardDescriptionText += f(rewardAmount,
    rewardAmount > 100 ? 0 : 1);
    if (isLucky)rewardDescriptionText += ' [ LUCKY! x' + f(mplr,0) + ' ]';


    $wallet['crystals'] += rewardAmount;

    $buttonStats['hardenedBonus'] = formula.calcHardenedGemBonus($buttonNumClicks)
    

      // @ts-ignore
      // @ts-ignore
      const box = document.getElementById('box');
      const MINX = 370;
      const MAXX = 1050;
      const MINY = 300;
      const MAXY = 750;
      const moveMulti = $buttonUpgrades[0]['formula']($buttonUpgradeLevels[0]);
      // find a new location then multiply the distance by the multiplier
      let lastX, lastY;
      if (buttonPosition.x > MINX && buttonPosition.y > MINY)
        lastX = buttonPosition.x, lastY = buttonPosition.y;
      else
        lastX = MINX, lastY = MINY;

      let randomX = MINX + (Math.floor(Math.random() * (MAXX-MINX)))
      let randomY = MINY + Math.floor(Math.random() * (MAXY-MINY));
      randomX = (randomX - lastX) * moveMulti + lastX;
      randomY = (randomY - lastY) * moveMulti + lastY;
      

      buttonPosition = {
        x: randomX,
        y: randomY
      };


      showRewardDescriptionTimeout(isLucky);
    }
  
    // @ts-ignore
    function showRewardDescriptionTimeout(isLucky) {
        showRewardDescription = true;
      setTimeout(() => {
        showRewardDescription = false;
      }, (isLucky ? 900 : 500))
    }

    onMount(() => {
      handleClick();
    });
    
// @ts-ignore
const f = (n, pl = 0) => {
        if (n < 1e9) return n.toFixed((n < 1e3 ? pl : 0)).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        else return n.toExponential(3).toString().replace('+', '');
    }   

// @ts-ignore
const fp = (n, pl = 3, subOne = false) => {
    if (subOne) n -= 1;
    if (n < 1e9) return (n*100).toFixed((n < 1e3 ? pl : 0)).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "%";
    else return (n*100).toExponential(pl).toString().replace('+', '') + "%";
}

// @ts-ignore
const fpf = (n, subOne = false) => {
    if (subOne) n -= 1;
    if (n < 1e9) return (n*100).toFixed(3).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "%";
    else return (n*100).toExponential(3).toString().replace('+', '') + "%";
}
</script>