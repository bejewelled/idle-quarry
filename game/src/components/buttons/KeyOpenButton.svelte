<!-- There is a lot of math in this file. -->
<!-- If you aren't familiar with what's going on here, please don't touch anything. -->

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    on:click={() => open()}
    class="has-tooltip tooltip-text
{affordable && keyKnowledgeCriteria() ? 'game-btn' : 'game-btn-noafford'}
py-2 items-center text-center border-solid ml-1 mr-1 col-span-12
select-none"
>
    {#if unlocked && keyKnowledgeCriteria()}
        {#if amt == 'single'}
            Use <span class={ref.colors['key' + rarity]}
                >{getKeyDisplayName()}</span
            > Key
        {:else if amt == 'max'}
            Open <strong>All</strong>
        {:else}
            Open <strong>{f(parseInt(amt), 0)}%</strong>
        {/if}
    {:else if keyKnowledgeCriteria()}
        {#if amt == 1}
            Find a key of this rarity to use it.
        {:else if amt == 'max'}
            Open All
        {:else}
            ---
        {/if}
    {:else if amt == 1}
        {keyNoKnowledgeText()}
    {:else}
        ---
    {/if}
</div>

<script>
// @ts-nocheck

	import { automationItemsUnlocked } from './../../data/player.ts';
    // @ts-nocheck

    import { onDestroy, onMount } from 'svelte'
    import { get } from 'svelte/store'
    import {
        wallet,
        miningUpgradeLevels,
        miningDropTable,
        keysOpened,
        keyItemsUnlocked,
    } from '../../data/player'
    import {
        progressThreshold,
        progressPerTick,
        miningUpgrades,
    } from '../../data/mining'
    import { beaconLevels } from '../../data/player'
    import ref from '../../calcs/ref'
    import formula from '../../calcs/formula'
    import {
        key1DropTable,
        key2DropTable,
        key3DropTable,
        key4DropTable,
        key5DropTable,
    } from '../../data/keys'
    import { keyRewardText } from '../../data/keys'
    import { combinations } from 'mathjs'
    // @ts-nocheck
    /**
     * @type {string | number}
     */
     export let rarity, amt
    let affordable, unlocked
    let affordInterval

    onMount(() => {
        setTimeout(() => {
            affordable = canAfford()
        }, 50)
        affordInterval = setInterval(() => {
            affordable = canAfford()
            unlocked = isUnlocked()
        }, 100 + Math.random() * 20)
    })

    onDestroy(() => {
        clearInterval(affordInterval)
    })
    const f = (n, pl = 0) => {
        if (n < 1e9)
            return n
                .toFixed(n < 1e3 ? pl : 0)
                .toString()
                .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
        else return n.toExponential(3).toString().replace('+', '')
    }

    const fp = (n, pl = 3, subOne = false) => {
        if (subOne) n -= 1
        if (n < 1e9)
            return (n * 100).toFixed(n < 1e3 ? pl : 0).toLocaleString() + '%'
        else
            return (n * 100).toExponential(pl).toString().replace('+', '') + '%'
    }

    function open() {
        if (amt == 'single' && $wallet['key' + rarity.toString()] >= 1) {
            const openAmount = 1
            $wallet['key' + rarity.toString()] -= 1
            $keysOpened['key' + (rarity - 1)] += 1
            openKeys(openAmount)
        }
        if (amt == 'max') {
            const openAmount = $wallet['key' + rarity.toString()]
            $wallet['key' + rarity.toString()] = 0
            openKeys(openAmount)
        } else if (
            keyKnowledgeCriteria() &&
            $wallet['key' + rarity.toString()] >= amt
        ) {
            const ratioOpen = parseInt(amt) / 100;
            const openAmount = Math.floor(
                $wallet['key' + rarity.toString()] * ratioOpen
            )
            $wallet['key' + rarity.toString()] -= openAmount
            $keysOpened['key' + (rarity - 1)] += openAmount
            openKeys(openAmount)
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
        amt = Number(amt)
        let rewards = {}
        if ($automationItemsUnlocked['violent openings']) 
            rewards['fragments'] = (amt * Math.pow(10, rarity*3 - 11))
        $keysOpened[rarity - 1] += Number(amt)
        let dropTable
        switch (rarity) {
            case 1:
                dropTable = get(key1DropTable)
                break
            case 2:
                dropTable = get(key2DropTable)
                break
            case 3:
                dropTable = get(key3DropTable)
                break
            case 4:
                dropTable = get(key4DropTable)
                break
            case 5:
                dropTable = get(key5DropTable)
                break
        }
        for (let [type, vals] of Object.entries(dropTable)) {
            if (vals == undefined) continue
            if (type == 'tier') continue

            else if (Number(amt) == 1) {
                if (Math.random() < vals[0]) {
                    rewards[type] = (rewards[type] || 0) + 
                    (vals[1] + Math.random() * (vals[2] - vals[1]))
                }
            }
            // if E[x] > 1, then we can calculate based on variance
            else if (Number(amt) * vals[0] >= 10) {
                // vals[0] is the probability of winning

                // Array.from takes the {length: l} parameter and applies the function given, l times
                // this produces an array with l elements, each of which is the result of the function
                const MAX_OPEN = Math.min(amt, 4e7)
                // chooses the amount of the drop to give per win
                // generate sqrt(n) random numbers between vals[1] and vals[2]
                // then, select 3 random values and average them
                const reward =
                    formula.sumArray(
                        Array.from(
                            { length: Math.floor(Math.sqrt(MAX_OPEN)) },
                            () =>
                                Math.floor(
                                    vals[1] +
                                        Math.random() * (vals[2] - vals[1])
                                )
                        )
                            .sort(() => 0.5 - Math.random())
                            .slice(0, 3)
                    ) / 3

                // now do the same thing to generate the deviation factor
                const devFactor =
                    formula.sumArray(
                        Array.from(
                            { length: Math.floor(Math.sqrt(MAX_OPEN)) },
                            () => formula.rNorm()
                        )
                            .sort(() => 0.5 - Math.random())
                            .slice(0, 3)
                    ) / 3

                const stdev = Math.sqrt(MAX_OPEN * vals[0] * (1 - vals[0]))
                // value should usually be between (-2*stdev, 2*stdev) with rare exceptions
                // BIAS_FIX fixes any constant bias (currently calculated at -0.06, approximately)
                const trueDev = stdev * devFactor

                //console.log(formula.rNormTest())

                // now, calculate the expected value of the number of wins +/- the calculated deviation
                const numWins = vals[0] * MAX_OPEN + trueDev // expected value + calcualted deviation

                // calculate reward value
                // this includes "bad luck protection":
                // you will always get at least the minimum value (vals[1]) per win,
                // even if the deviation would lower the value below 1
                let rewardVal = Math.max(numWins * vals[1], numWins * reward)
                if (amt > MAX_OPEN) rewardVal *= amt / MAX_OPEN
                rewards[type] = (rewards[type] || 0) + rewardVal           
            } else {
                let wins = 0
                const p = vals[0]
                const lambda = amt * p
                // for low probability use poisson distribution
                // maximum 2 drops per cycle to prevent latency
                // Missed rewards only present in 1% of cycles, at most
                // allows fast unrolling - lower latency
                if (vals[0] < 0.1 || amt * p < 10 || amt * (1 - p) < 10) {
                    let pFail = Math.exp(-1 * lambda)
                    const rand = Math.random()
                    let k = 0
                    // roll once, then check again if success
                    let done = false;
                    while (!done && k < 4) {
                        if (rand < 1 - pFail) {
                            k++
                            pFail += (Math.exp(-1 * amt * p) * Math.pow(amt * p, k)) / 1 
                        } else done = true;
                    }
                    wins = k;
                    // for higher probability use normal approximation to binomial
                } else {
                    const stdev = Math.sqrt(amt * p * (1 - p))
                    let wins = formula.rNorm(lambda, stdev)
                    wins =
                        Math.random() < wins - Math.floor(wins)
                            ? Math.ceil(wins)
                            : Math.floor(wins)
                }
                const valGain =
                    wins * (vals[1] + Math.random() * (vals[2] - vals[1]))

                rewards[type] = (rewards[type] || 0) + valGain
            }
        }
        if (isNaN($wallet['key' + rarity])) $wallet['key' + rarity] = 0
        const dispRewards = {}
        for (let [type, amt] of Object.entries(rewards)) {
            rewards[type] = Math.floor(amt)
            if (rewards[type] > 0) {
                $wallet[type] = ($wallet[type] || 0) + amt
                $keyItemsUnlocked['key' + rarity].add(type)
                dispRewards[type] = amt
            }
        }
        updateKeyRewardText(dispRewards)
    }
    let rewardTextTimeout = undefined
    function updateKeyRewardText(r) {
        $keyRewardText = r
        if (Object.keys(r).length === 0) $keyRewardText = {}
        if (rewardTextTimeout) clearTimeout(rewardTextTimeout)
        rewardTextTimeout = setTimeout(() => {
            $keyRewardText = ''
        }, 30000)
    }

    function canAfford() {
        if (amt == 'single') return $wallet['key' + rarity.toString()] >= 1
        if (amt == 'max') return $wallet['key' + rarity.toString()] >= 1
        return $wallet['key' + rarity.toString()] >= amt
    }

    function isUnlocked() {
        return (
            $wallet['key' + rarity.toString()] > 0 ||
            $keysOpened['key' + (rarity - 1)] > 0
        )
    }

    function getKeyDisplayName() {
        const display = [
            'T1 [*]',
            'T2 [**]',
            'T3 [***]',
            'T4 [****]',
            'T5 [*****]',
        ]
        return display[rarity - 1]
    }

    function keyKnowledgeCriteria() {
        switch (rarity) {
            case 1:
                return $wallet['key1'] && $wallet['key1'] >= 1
            case 2:
                return (
                    ($wallet['beacons'] && $wallet['beacons'] >= 1) ||
                    formula.sumArray($beaconLevels) > 0
                )
            case 3:
                return (
                    ($wallet['sigils'] && $wallet['sigils'] >= 1) ||
                    $keysOpened[2] >= 1
                )
            case 4:
                return (
                    ($wallet['artifacts'] && $wallet['artifacts'] >= 1) ||
                    $keysOpened[3] >= 1
                )
            case 5:
                return $wallet['holyLight'] && $wallet['holyLight'] >= 1
        }
    }

    function keyNoKnowledgeText() {
        switch (rarity) {
            case 1:
                return 'Requires 1 [*] key'
            case 2:
                return 'Requires 1 beacon'
            case 3:
                return 'Requires 1 sigil'
            case 4:
                return 'Requires 1 artifact (any kind)'
            case 5:
                return 'Requires 1 holy light'
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
