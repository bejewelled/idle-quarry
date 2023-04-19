
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click={() => open()}
class='has-tooltip tooltip-text 
{affordable && keyKnowledgeCriteria() ? 'game-btn' : 'game-btn-noafford'}
py-2 items-center text-center border-solid ml-1 mr-1 col-span-12
select-none'>
{#if unlocked && keyKnowledgeCriteria()}
    {#if amt == 1}
    Use <span class='{ref.colors['key' + rarity]}'>{getKeyDisplayName()}</span> Key
    {:else}
    x{amt}
    {/if}
{:else if keyKnowledgeCriteria()}
    {#if amt == 1}
        Find a key of this rarity to use it.
    {:else}
        ---
    {/if}
{:else}
    {#if amt == 1}
        {keyNoKnowledgeText()}
    {:else}
        ---
    {/if}
{/if}
 </div>

        

 <script>
// @ts-nocheck

    import { onDestroy, onMount } from 'svelte';
    import { wallet, miningUpgradeLevels, miningDropTable, keysOpened} from '../../data/player';
    import { progressThreshold, progressPerTick, miningUpgrades } from '../../data/mining';
    import ref from '../../calcs/ref'
    import { key1DropTable } from '../../data/keys';
    import { keyRewardText } from '../../data/keys'
// @ts-nocheck
    export let rarity, amt;
    let affordable, unlocked;
    let affordInterval;
    
    onMount(() => {
        setTimeout(() => {
            affordable = canAfford();
        }, 50)
        affordInterval = setInterval(() => {
            affordable = canAfford();
            unlocked = isUnlocked();
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


    function open() {
        if (keyKnowledgeCriteria() && $wallet['key'+rarity.toString()] >= amt) {
            $wallet['key'+rarity.toString()] -= amt;
            $keysOpened['key'+(rarity-1)] += amt;
            openKeys(amt);
        }
    }

    function openKeys(amt) {
        let rewards = {};
        $keysOpened['key'+(rarity-1)] += amt;
        for (let [type, vals] of Object.entries($key1DropTable)) {
            // if E[x] > 5, then we can calculate based on variance
            if (amt*vals[0] > 5) {
                const stdev= Math.sqrt(amt*vals[0]*(1-vals[0]));
                const val = Array.from({length: Math.floor(Math.sqrt(amt))}, 
                () => Math.floor(vals[1] + Math.random()*vals[2]));
                const c = (Math.random()*2.83)+0.01;
                const numWins = vals[0]*amt +
                Math.max(((Math.random() > 0.5 ? 1 : -1) * Math.pow(c/(c-5), 6)),0);

                // monte carlo value selector
                const rewardVal = (val[Math.floor(Math.random()*val.length)] + 
                val[Math.floor(Math.random()*val.length)] + 
                val[Math.floor(Math.random()*val.length)]) / 3

                console.log(val);
                rewards[type] = (rewards[type] || 0) + numWins*rewardVal;

            } else {
                for (let i = 0; i < amt; i++) {
                    if (Math.random() < vals[0]) {
                        rewards[type] = (rewards[type] || 0) + Math.floor(vals[1] + Math.random()*vals[2]) ;
                    }
                }   
        }
    }

    for (let [type, amt] of Object.entries(rewards)) {
        $wallet[type] = ($wallet[type] || 0) + amt;
    }
    updateKeyRewardText(rewards);
}
    let rewardTextTimeout = undefined;
    function updateKeyRewardText(r) {
        $keyRewardText = r;
        if (rewardTextTimeout) clearTimeout(rewardTextTimeout);
        rewardTextTimeout = setTimeout(() => {
            $keyRewardText = '';
        }, 5000)
    }

    function canAfford() {
        return ($wallet['key'+rarity.toString()] >= amt);
    }

    function isUnlocked() {
        return ($wallet['key'+rarity.toString()] > 0 ||
                $keysOpened['key'+(rarity-1)] > 0);
    }

    function getKeyDisplayName() {
        const display = ['T1 [*]', 'T2 [**]', 'T3 [***]', 'T4 [****]', 'T5 [*****]'];
        return display[rarity-1];
    }

    function keyKnowledgeCriteria() {
        switch (rarity) {
            case 1:
                return $wallet['key1'] && $wallet['key1'] >= 1;
            case 2:
                return $wallet['beacon'] && $wallet['beacon'] >= 1;
            case 3:
                return $wallet['sigil'] && $wallet['sigil'] >= 1;
            case 4:
                return $wallet['artifactsTotal'] && $wallet['artifactsTotal'] >= 1;
            case 5:
                return $wallet['holyLight'] && $wallet['holyLight'] >= 1;
        }
    }

    function keyNoKnowledgeText() {
        switch (rarity) {
            case 1:
                return 'Requires 1 [*] key';
            case 2:
                return 'Requires 1 beacon';
            case 3:
                return 'Requires 1 sigil';
            case 4:
                return 'Requires 1 artifact (any kind)';
            case 5:
                return 'Requires 1 holy light';
        }
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