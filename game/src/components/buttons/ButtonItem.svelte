<svelte:window on:keydown|preventDefault={handleClick && keyDown} on:keyup={keyUp} /> <!-- will be bound to an upgrade-->

{#if showRewardDescription}
<div class='fixed flex w-[350px] h-[35px] {rewardStyle} 
text-center items-center justify-center'
style = 'top: {textPosition.y}px; left: {textPosition.x}px;'>
{rewardDescriptionText}</div>
{/if}

<button
    id="button"
    class="fixed {buttonExtraStyle} w-[100px] h-[100px] border-4 border-white border-opacity-50 text-white flex items-center justify-center rounded-full cursor-pointer transition-all duration-300"
    style="top: {buttonPosition.y}px; left: {buttonPosition.x}px;"
    on:click={handleClick} on:keydown={handleClick}
  ></button>
{#if $buttonUpgradeLevels[2] > 0}
<button
    id="button"
    class="fixed w-[20px] 
    h-[20px] bg-gray-400 bg-opacity-50 text-white flex items-center justify-center rounded-full cursor-pointer transition-all duration-300"
    style="top: {buttonPosition.y+40}px; left: {buttonPosition.x+40}px;"
    on:click={handleClick}
  > </button>
{/if}


<script>
// @ts-nocheck

import { onMount } from 'svelte';
// @ts-ignore
import {progress, wallet, miningDropTable, miningUpgradeLevels, 
    // @ts-ignore
    settings, visibleTier, progressThisTick, progressAverage,
buttonNumClicks, mineLevel, buttonStats, buttonUpgradeLevels,
automationItemsUnlocked, flags, radiumProgress} from '../../data/player';
// @ts-ignore
import {progressThreshold, progressPerTick, miningUpgrades,
// @ts-ignore
gemGainFlavorText, gemProgressFlavorText } from '../../data/mining';
// @ts-ignore
import {keyGainFlavorText} from '../../data/keys';
import {buttonUpgrades, radiumGainText} from '../../data/button';
import {allMultipliers} from '../../data/artifacts'
// @ts-ignore
import MiningUpgradeButton from '../buttons/MiningUpgradeButton.svelte';
// @ts-ignore
import ref from '../../calcs/ref'
import formula from '../../calcs/formula'

    let showRewardDescription = false;
    let rewardDescriptionText = '';
    let rewardStyle = '';
    $: buttonExtraStyle = '';

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

    // // autoclick detection
    // lastAbsDists.shift();
    // lastAbsDists = [absDist, ...lastAbsDists];
    // const avgAbsDist = lastAbsDists.reduce((a,b) => a+b, 0) / lastAbsDists.length;
    // isAutoclicker = avgAbsDist < 1.5 && Date.now() - lastClick < 250;

    // if (isAutoclicker && !hasConfirmedAutoclicker) {
    //   alert("Note: It appears you are using an autoclicker. To ensure game balance, " + 
    //   "you will not gain any Perfect clicks while using an autoclicker.")
    //   hasConfirmedAutoclicker = true;
    // }


    let rewardAmount = 0;

    const distanceMulti = $buttonUpgrades[0]['formula']($buttonUpgradeLevels[0]);

    const buttonDistances = {
        good: Math.floor(10 * distanceMulti * window.devicePixelRatio),
        great: Math.floor(7 + distanceMulti * window.devicePixelRatio),
        excellent: Math.floor(3 + distanceMulti * window.devicePixelRatio),
        incredible: Math.floor(2 + distanceMulti * window.devicePixelRatio),
        perfect: Math.floor(1 + distanceMulti * window.devicePixelRatio),
    };
    console.log(window.devicePixelRatio)


    $buttonStats['totalClicks']++;

    const warpAdder = Math.random() < $buttonUpgrades[6]['formula']($buttonUpgradeLevels[6]);

    if (warpAdder) $wallet['warp'] = ($wallet['warp'] || 0) + Math.ceil(Math.random()*45);

    let xpGain = 0;
    if (absDist < buttonDistances['perfect']) {
        rewardAmount = ref.buttonBaseRewards['perfect'];
        rewardDescriptionText = 'PERFECT';
        rewardStyle = 'text-large text-amber-500 border-amber-500 font-bold'
        $buttonNumClicks['perfect']++;
        xpGain = 3 * $buttonUpgrades[4]['formula']($buttonUpgradeLevels[4]);
    } else if (absDist <= buttonDistances['incredible']) {
        rewardAmount = ref.buttonBaseRewards['incredible'];
        rewardDescriptionText = 'Incredible';
        rewardStyle = 'text-large text-pink-500 border-pink-500 font-bold'
        $buttonNumClicks['incredible']++;
        xpGain = 3 * $buttonUpgrades[4]['formula']($buttonUpgradeLevels[4]);
    } else if (absDist <= buttonDistances['excellent']) {
        rewardAmount = ref.buttonBaseRewards['excellent'];
        rewardDescriptionText = 'Excellent';
        rewardStyle = 'text-med text-violet-500 border-violet-500'
        $buttonNumClicks['excellent']++;
        xpGain = 2 * $buttonUpgrades[4]['formula']($buttonUpgradeLevels[4]);
    } else if (absDist <= buttonDistances['great']) {
        rewardAmount = ref.buttonBaseRewards['great'];
        rewardDescriptionText = 'Great';
        rewardStyle = 'text-med text-sky-500 border-sky-500'
        $buttonNumClicks['great']++;
        xpGain = 1;
    } else if (absDist <= buttonDistances['good']) {
        rewardAmount = ref.buttonBaseRewards['good'];
        rewardDescriptionText = 'Good';
        rewardStyle = 'text-med text-green-500 border-green-500'
        $buttonNumClicks['good']++;
        xpGain = 1;
    } else {  
        rewardAmount = ref.buttonBaseRewards['okay'];
        rewardDescriptionText = 'Okay';
        rewardStyle = 'text-small text-gray-500 border-gray-500';
        $buttonNumClicks['okay']++;
        xpGain = 1;
    } 

    $mineLevel['xp'] += xpGain;
    rewardAmount = rewardAmount 
    * formula.calcButtonRewardBonus()
    * formula.getAntimatterBonusAmount(2);

    
    const isLucky = Math.random() < $buttonUpgrades[5]['formula']($buttonUpgradeLevels[5]);

    if (isLucky) {
        console.log('sd')
        const mplr = 8 + Math.round(Math.random() * 12);
        rewardAmount *= mplr;
        rewardDescriptionText += ' [ LUCKY! x' + f(mplr) + ' ]';
    }
  

    $radiumGainText = '+ ' + f(rewardAmount)

    if (rewardAmount + $radiumProgress[0] > $radiumProgress[1])
      $radiumGainText += ('   [ + ' + f(Math.floor((rewardAmount + $radiumProgress[0]) / $radiumProgress[1])) + ' radium ]')
    
    if (rewardAmount + $radiumProgress[0] > $radiumProgress[1]*5)
      $radiumGainText = '+ ' + f(Math.floor(rewardAmount + $radiumProgress[0] / $radiumProgress[1])) + ' radium'

    if (isNaN($wallet['radium'])) $wallet['radium'] = 1;
    $radiumProgress[0] += rewardAmount;
    if ($radiumProgress[0] >= $radiumProgress[1]) {
      $wallet['radium'] = ($wallet['radium'] || 0) 
      + Math.floor($radiumProgress[0] / $radiumProgress[1])
      $radiumProgress[0] %= $radiumProgress[1];
    }
    
    setTimeout(() => {
      $radiumGainText = '';
    }, 375)
    
    let mplr;

    // star gain
    if (absDist < buttonDistances['perfect'] && $buttonUpgradeLevels[7] > 0) {
      $wallet['stars'] = ($wallet['stars'] || 0) + 1
      buttonExtraStyle = 'bg-fuchsia-300 transition-colors duration-300 ease-in-out hover:bg-violet-600'
      setTimeout(() => {
        buttonExtraStyle = '';
      }, 700)
    }


    $buttonStats['hardenedBonus'] = formula.calcHardenedGemBonus($buttonNumClicks)
    

      // @ts-ignore
      // @ts-ignore
      const box = document.getElementById('box');
      const MIN_X = 350;
      const MAX_X = 950;
      const MIN_Y = 300;
      const MAX_Y = 550;
      const MID_X = (MAX_X + MIN_X) / 2;
      const MID_Y = (MAX_Y + MIN_Y) / 2;
      const moveMulti = 0.025
      // find a new location then multiply the distance by the multiplier
      let newX = MID_X + ((Math.random() * (MAX_X - MIN_X)) - ((MAX_X - MIN_X) / 2)) * moveMulti;
      let newY = MID_Y + ((Math.random() * (MAX_Y - MIN_Y)) - ((MAX_Y - MIN_Y) / 2)) * moveMulti;
      if (newX < MIN_X) newX = MIN_X;
      if (newX > MAX_X) newX = MAX_X;
      if (newY < MIN_Y) newY = MIN_Y;
      if (newY > MAX_Y) newY = MAX_Y;
      
      buttonPosition = {
        x: newX,
        y: newY
      };

      $flags['showMineXPGain'] = xpGain;
      setTimeout(() => {
        $flags['showMineXPGain'] = -1;
      }, 700)


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
      buttonPosition = {
        x: 650,
        y: 320
      };
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