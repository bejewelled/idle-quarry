<svelte:window on:keydown|preventDefault={keyDown} on:keyup={keyUp} />
{#if badKeyDown && !$automationItemsUnlocked['another button']} <!-- will be bound to an upgrade-->
<div class='game-text text-small text-center'>You have not unlocked key-bound button clicking yet; holding a key disables the button.</div>
{/if}
{#if showRewardDescription}
<div class='absolute flex w-[350px] h-[35px] {rewardStyle} 
text-center items-center justify-center'
style = 'top: {textPosition.y}px; left: {textPosition.x}px;'>
{rewardDescriptionText}</div>
{/if}

<button
    id="button"
    class="absolute w-[100px] h-[100px] border-4 border-white border-opacity-50 text-white flex items-center justify-center rounded-full cursor-pointer transition-all duration-300"
    style="top: {buttonPosition.y}px; left: {buttonPosition.x}px;"
    on:click={handleClick} on:keydown={handleClick}
  ></button>
{#if $buttonUpgradeLevels[2] > 0}
<button
    id="button"
    class="absolute w-[20px] h-[20px] bg-gray-400 bg-opacity-50 text-white flex items-center justify-center rounded-full cursor-pointer transition-all duration-300"
    style="top: {buttonPosition.y+40}px; left: {buttonPosition.x+40}px;"
    on:click={handleClick}
  > </button>
{/if}
{#if $buttonUpgradeLevels[7] > 0}
<button
    id="button"
    class="absolute w-[4px] h-[4px] bg-red-400 bg-opacity-50 text-white flex items-center justify-center rounded-full cursor-pointer transition-all duration-300"
    style="top: {buttonPosition.y+48}px; left: {buttonPosition.x+48}px;"
    on:click={handleClick}
  ></button>
{/if}


<script>
// @ts-nocheck

import { onMount } from 'svelte';
// @ts-ignore
import {progress, wallet, miningDropTable, miningUpgradeLevels, 
    // @ts-ignore
    settings, visibleTier, progressThisTick, progressAverage,
buttonNumClicks, mineLevel, buttonStats, buttonUpgradeLevels,
automationItemsUnlocked} from '../../data/player';
// @ts-ignore
import {progressThreshold, progressPerTick, miningUpgrades,
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

    function keyDown(e) {
        if (e.keyCode > 0) badKeyDown = true;
    }

    function keyUp(e) {
      if (e.keyCode > 0) badKeyDown = false;
    }
  
    let badKeyDown = false;
    // @ts-ignore
    const handleClick = (event) => {
        if (badKeyDown && !$automationItemsUnlocked['another button']) return;
        textPosition = {
        x: buttonPosition.x - 100,
        y: buttonPosition.y - 18
      }


    // calculate how close to the center of the button the cursor was
    // @ts-ignore
    const cursorX = (event ? event.clientX : 0);
    // @ts-ignore
    const cursorY = (event ? event.clientY : 0);

   let absDist = Math.sqrt(Math.abs(cursorX - buttonPosition.x-(BUTTON_SIZE/2)) ** 2 
    + Math.abs(cursorY - buttonPosition.y-(BUTTON_SIZE/2)) ** 2);
    
    let rewardAmount = 0;


    $buttonStats['totalClicks']++;

    const isLucky = Math.random() < $buttonUpgrades[5]['formula']($buttonUpgradeLevels[5]);

    if (isLucky && absDist > 1 && absDist <= 2) absDist = 0;

    if (absDist < 1) {
        rewardAmount = 150;
        rewardDescriptionText = 'PERFECT! +';
        rewardStyle = 'text-large text-amber-500 border-amber-500 font-bold'
        $buttonNumClicks['perfect']++;
        $mineLevel['xp'] += 3;
    } else if (absDist <= 2) {
        rewardAmount = 12;
        rewardDescriptionText = 'INCREDIBLE +';
        rewardStyle = 'text-large text-pink-500 border-pink-500 font-bold'
        $buttonNumClicks['incredible']++;
        $mineLevel['xp'] += 3;
    } else if (absDist <= 4) {
        rewardAmount = 5;
        rewardDescriptionText = 'Excellent +';
        rewardStyle = 'text-med text-violet-500 border-violet-500'
        $buttonNumClicks['excellent']++;
        $mineLevel['xp'] += 2;
    } else if (absDist <= 7) {
        rewardAmount = 4;
        rewardDescriptionText = 'Great +';
        rewardStyle = 'text-med text-sky-500 border-sky-500'
        $buttonNumClicks['great']++;
        $mineLevel['xp'] += 1;
    } else if (absDist <= 10) {
        rewardAmount = 3;
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
    * formula.calcButtonStreakBonus($buttonStats['totalClicks'])
    * $miningUpgrades[23]['formula']($miningUpgradeLevels[23])
    
    if (isNaN($wallet['crystals'])) $wallet['crystals'] = 0;
    
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
      const MIN_X = 350;
      const MAX_X = 950;
      const MIN_Y = 300;
      const MAX_Y = 550;
      const moveMulti = $buttonUpgrades[0]['formula']($buttonUpgradeLevels[0]);
      // find a new location then multiply the distance by the multiplier
      let lastX, lastY;
      if (buttonPosition.x > MIN_X && buttonPosition.y > MIN_Y)
        lastX = buttonPosition.x, lastY = buttonPosition.y;
      else
        lastX = MIN_X, lastY = MIN_Y;
      const MAX_MOVE2 = (300*moveMulti)**2;
      const x2 = (Math.random()*0.7+0.3) * MAX_MOVE2;
      const y2 = MAX_MOVE2 - x2; 
      const xDir = Math.random() < 0.5 ? -1 : 1;
      const yDir = Math.random() < 0.5 ? -1 : 1; 
      let randomX, randomY;
      randomX = Math.max(MIN_X, Math.min(MAX_X, lastX + (xDir * Math.sqrt(x2))))
      randomY = Math.max(MIN_Y, Math.min(MAX_Y, lastY + (yDir * Math.sqrt(y2))))
      
      buttonPosition = {
        x: Math.min(Math.max(MIN_X,randomX), MAX_X),
        y: Math.min(Math.max(MIN_Y,randomY), MAX_Y)
      };


      showRewardDescriptionTimeout(isLucky);
    }
  
    let showTimer;
    // @ts-ignore
    function showRewardDescriptionTimeout(isLucky) {
        clearTimeout(showTimer);
        showRewardDescription = true;
      showTimer = setTimeout(() => {
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