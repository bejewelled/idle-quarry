<!-- There is a lot of math in this file. -->
<!-- If you aren't familiar with what's going on here, please don't touch anything. -->


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
    x{f(parseInt(amt),0)}
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
    import { get } from 'svelte/store'
    import { wallet, miningUpgradeLevels, miningDropTable, keysOpened, 
    keyItemsUnlocked} from '../../data/player';
    import { progressThreshold, progressPerTick, miningUpgrades } from '../../data/mining';
    import { beaconLevels } from '../../data/player';
    import ref from '../../calcs/ref'
    import formula from '../../calcs/formula';
    import { key1DropTable, key2DropTable, key3DropTable, key4DropTable, key5DropTable} from '../../data/keys';
    import { keyRewardText } from '../../data/keys'
    import { combinations } from 'mathjs'
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
        if (n < 1e9) return n.toFixed((n < 1e3 ? pl : 0)).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        else return n.toExponential(3).toString().replace('+', '');
    }   

    const fp = (n, pl = 3, subOne = false) => {
        if (subOne) n -= 1;
        if (n < 1e9) return (n*100).toFixed((n < 1e3 ? pl : 0)).toLocaleString() + "%";
        else return (n*100).toExponential(pl).toString().replace('+', '') + "%";
    }


    function open() {
        if (keyKnowledgeCriteria() && $wallet['key'+rarity.toString()] >= amt) {
            $wallet['key'+rarity.toString()] -= parseInt(amt);
            $keysOpened['key'+(rarity-1)] += parseInt(amt);
            openKeys(amt);
        }
    }
    /**
     * Key opening formula O_O
     * DO NOT EDIT unless you are familiar with the math behind this
     * If E[x] > 1, use expected value with simulated randomness
     * If E[x] < 1, use binomial sequences
     * @param amt
     */
    function openKeys(amt) {
        amt = parseInt(amt);
        let rewards = {};
        $keysOpened[(rarity-1)] += parseInt(amt);
        let dropTable;
        switch(rarity) {
            case 1:
                dropTable = get(key1DropTable);
                break;
            case 2:
                dropTable = get(key2DropTable);
                break;
            case 3:
                dropTable = get(key3DropTable);
                break;
            case 4:
                dropTable = get(key4DropTable);
                break;
            case 5:
                dropTable = get(key5DropTable);
                break;
        }
        for (let [type, vals] of Object.entries(dropTable)) {
            // if E[x] > 5, then we can calculate based on variance
            if (parseInt(amt)*vals[0] >= 1) {
                // vals[0] is the probability of winning

                // Array.from takes the {length: l} parameter and applies the function given, l times
                // this produces an array with l elements, each of which is the result of the function

                // chooses the amount of the drop to give per win
                // generate sqrt(n) random numbers between vals[1] and vals[2]
                // then, select 3 random values and average them
                const reward = formula.sumArray(Array.from({length: Math.floor(Math.sqrt(amt))}, 
                () => Math.floor(vals[1] + Math.random()*(vals[2]-vals[1])))
                .sort(() => 0.5 - Math.random()).slice(0, 3)) / 3;

                // now do the same thing to generate the deviation factor
                const devFactor = formula.sumArray(Array.from({length: Math.floor(Math.sqrt(amt))}, 
                () => formula.rNorm()).sort(() => 0.5 - Math.random()).slice(0, 3)) / 3;

                const stdev = Math.sqrt(amt * vals[0] * (1-vals[0]));
                // value should usually be between (-2*stdev, 2*stdev) with rare exceptions
                const trueDev = stdev * devFactor;
                // now, calculate the expected value of the number of wins +/- the calculated deviation
                const numWins = (vals[0])*amt + trueDev; // expected value + calcualted deviation


                // calculate reward value
                // this includes "bad luck protection":
                // you will always get at least the minimum value (vals[1]) per win,
                // even if the deviation would lower the value below 1
                const rewardVal = Math.max(numWins*vals[1], numWins * reward)

                rewards[type] = (rewards[type] || 0) + rewardVal;

            } else {
                    if (parseInt(amt) === 1) {
                        rewards[type] = (Math.random() < vals[0] ? 
                        vals[1] + Math.random()*(vals[2] - vals[1]) : 0);
                        continue;
                    } else {
                    //console.log(amt);
                    rewards[type] = 0;
                    const div = Math.floor(Math.log10(amt))
                   // console.log('div: ' + div)
                    const nEff = (amt > 100 ? Math.round(amt / Math.pow(10, div)) : amt);
                    const pEff = (amt > 100 ? vals[0] * Math.pow(10, div) : amt);
                   // console.log("neff: " + nEff + " peff: " + pEff);
                    let done = false;
                    let k = 1;
                    let pK = combinations(nEff, k) * Math.pow(pEff, k) * Math.pow(1-pEff, nEff-k);
                   // console.log(pK + " for k " + k + " and n " + nEff + " and p " + pEff)
                    const rVal = Math.random();
                    console.log(pK);
                    while (!done) {
                        //console.log('rval: ' + rVal + ' for k = ' + k);
                        if (rVal >= pK) {
                            k -= 1;
                            done = true;
                        } else {                           
                           // console.log(nEff);
                            k++;
                            if (nEff < k) {
                                done = true;
                                continue;
                            }
                            pK = combinations(nEff, k) * Math.pow(pEff, k) * Math.pow(1-pEff, nEff-k);
                           // console.log(pK + " for k " + k + " and n " + nEff + " and p " + pEff)
                        }
                    }
                    const stdev = Math.sqrt(nEff*pEff*(1-pEff));
                    rewards[type] += 
                    k * (vals[1] + Math.random()*(vals[2] - vals[1]) + formula.rNorm()*stdev);
                
                }
            }  
        }

    for (let [type, amt] of Object.entries(rewards)) {
        if (rewards[type] > 0) {
            $wallet[type] = ($wallet[type] || 0) + amt;
            $keyItemsUnlocked['key'+rarity].add(type);
        }

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
                return ($wallet['beacons'] && $wallet['beacons'] >= 1) || formula.sumArray($beaconLevels) > 0;
            case 3:
                return $wallet['sigils'] && $wallet['sigils'] >= 1;
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