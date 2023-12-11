<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class='game-btn-noafford pt-1 pb-1 text-small text-center select-none
lg:max-w-[150px] sm:max-w-[100px] xl:w-full'>
    Unlock at Path Level 50
</div>

<script>
	import { radiumProgress } from '../../data/player';
    // @ts-nocheck

    import { onDestroy, onMount } from 'svelte'
    import {
        progress,
        wallet,
        enchantUpgradeLevels,
        miningDropTable,
        settings,
        visibleTier,
        unlockedRes,
        buttonStats,
        buttonNumClicks,
        buttonUpgradeLevels,
    } from '../../data/player'
    import { progressThreshold, progressPerTick } from '../../data/mining'
    import { enchantUpgrades } from '../../data/fame'
    import { buttonUpgrades, thoriumDepositActive } from '../../data/button';
    import ref from '../../calcs/ref'
    import formula from '../../calcs/formula'

    let thoriumGained = 0;

    const f = (n, pl = 0) => {
        if (n < 1e9) return n.toFixed((n < 1e3 ? pl : 0)).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        else return n.toExponential(3).toString().replace('+', '');
    }  

    function collectThorium() {
        if ($thoriumDepositActive != 'on') return;
        const gain = formula.calcThoriumDepositGain();
        thoriumGained = gain;
        $radiumProgress[0] += gain;
        $thoriumDepositActive = 'transition';
        setTimeout(() => {
            $thoriumDepositActive = 'off'; 
        }, 1500)
    }
    // @ts-nocheck
    
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
        background-image: linear-gradient(
            to right,
            #f8c102,
            #e86aa7,
            #8e2de2,
            #3a86ff,
            #4cc9f0,
            #00c9b1,
            #b4e332,
            #f8c102,
            #b4e332,
            #00c9b1,
            #4cc9f0,
            #3a86ff,
            #8e2de2,
            #e86aa7,
            #f8c102
        );
        /* Animate the gradient to create a looping effect */
        animation: rainbow-animation 6s ease-in-out infinite;
        /* Set the gradient background size to 400% to create a smooth transition */
        background-size: 400%;
        /* Increase the opacity on hover */
        opacity: 1;
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
