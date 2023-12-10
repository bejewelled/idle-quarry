<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    on:click={() => buy(index)}
    class="has-tooltip tooltip-text py-1
{affordable ? ($beaconUpgrades[index]['isCelestial'] ? 'game-btn-celestial' : 'game-btn') : 
($beaconUpgrades[index]['isCelestial'] ? 'game-btn-celestial-noafford' : 'game-btn-noafford')}
py-2 items-center text-center border-solid ml-1 mr-1 col-span-12
select-none"
>
    {$beaconUpgrades[index]['name']} [{f($beaconUpgradeLevels[index], 0)}] 
    {#if $settings['maxBuy'] && buyAmount >= 1}
        (+{buyAmount})
    {/if}
    {#key $wallet['beaconPower']}
        <span
            class="px-2 mx-4 max-w-[300px] tooltip tooltip-text shadow-lg p-1
       border-white border-double border bg-[#222529] ml-16
         pointer-events-none"
        >
            <div class="title text-small-gray items-start text-center pb-1">
                {$beaconUpgrades[index]['description']}
            </div>
            <div class="text-center effect-wrapper">
                <div class="tooltip-text-xs text-[#cccccc]">
                    <span class='current text-[#cccccc]'>{$beaconUpgrades[index]['prefix'] || ""}</span>  
                    <span class="current text-[#cccccc]">
                        {$beaconUpgrades[index]['isPercent']
                            ? fp(
                                  $beaconUpgrades[index]['formula'](
                                      $beaconUpgradeLevels[index]
                                  ),
                                  3,
                                  true
                              )
                            : f(
                                  $beaconUpgrades[index]['formula'](
                                      $beaconUpgradeLevels[index]
                                  ),
                                  3
                              )}
                    </span>
                    <span class="current text-[#888888]">
                        =>
                        {$beaconUpgrades[index]['isPercent']
                            ? fp(
                                  $beaconUpgrades[index]['formula'](
                                      $beaconUpgradeLevels[index]+Math.max(1,buyAmount),3
                                  ),
                                  3,
                                  true
                              )
                            : f(
                                  $beaconUpgrades[index]['formula'](
                                     $beaconUpgradeLevels[index]+Math.max(1,buyAmount),3
                                  ),
                                  3
                              )}
                    </span>
                    <span class='current text-[#cccccc]'>{$beaconUpgrades[index]['suffix'] || ""}</span>  
                    {#if $settings['maxBuy'] && buyAmount >= 1}
                    (x{buyAmount})
                    {/if}
                    {#if $settings['costRatios']}
                    <br/>
                    <span class='current text-[#888888]'>
                    Cost Multiplier: {f($beaconUpgrades[index]['ratio'],3)}x
                    </span>
                    {/if}
                </div>
            </div>
            <hr />
            <div class="pt-1 cost items-start text-center grid grid-cols-5">
                {#each Object.entries(costs) as c}
                    {#if c[1] >= 1}
                        <div
                            class="{ref.colors[c[0]] ||
                                ref.colors['default']} col-span-3"
                        >
                            {ref.displayNames[c[0]]
                                ? ref.displayNames[c[0]]
                                : c[0]}
                        </div>
                        <div
                            class="col-span-2 {$wallet['beaconPower'] < c[1]
                                ? 'text-red-600'
                                : ''}
                    text-left"
                        >
                            {f(c[1])}
                        </div>
                    {/if}
                {/each}
            </div>
        </span>
    {/key}
</div>

<script>
    // @ts-nocheck

    import { onDestroy, onMount } from 'svelte'
    import {
        progress,
        wallet,
        beaconUpgradeLevels,
        miningDropTable,
        settings,
        visibleTier,
        unlockedRes,
        resources,
    } from '../../../data/player'
    import { progressThreshold, progressPerTick } from '../../../data/mining'
    import { beaconUpgrades } from '../../../data/beacons'
    import ref from '../../../calcs/ref'
    import formula from '../../../calcs/formula'
    // @ts-nocheck
    export let index
    let getCosts = () => {
        let c = {}
        for (let [type, base] of Object.entries(
            $beaconUpgrades[index]['cost']
        )) {
            c[type] = cost(base)
        }
        return c
    }
    let costs = {}
    let affordable, unlocked
    let permUnlocked = $beaconUpgradeLevels[index] > 0
    let affordInterval
    let buyAmount;

    onMount(() => {
        setTimeout(() => {
            costs = getCosts()
            affordable = canAfford()
        }, 50)
        affordInterval = setInterval(() => {
            affordable = canAfford()
            if ($settings['maxBuy']) {
                buyAmount = calcMaxBuyAmount();
                costs = getCosts();
            } else {
                buyAmount = $settings['buyAmount'];
            }
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
            return (
                (n * 100)
                    .toFixed(n < 999 ? pl : 0)
                    .toString()
                    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',') + '%'
            )
        else
            return (n * 100).toExponential(pl).toString().replace('+', '') + '%'
    }

    function cost(start) {
        const base =
            start *
            Math.pow(
                $beaconUpgrades[index]['ratio'],
                $beaconUpgradeLevels[index]
            )
        const r = $beaconUpgrades[index]['ratio']
        const l = Math.max(1,buyAmount)
        // console.log(formula.gSum(base, r, l))
        return formula.gSum(base, r, l)
    }

    function calcMaxBuyAmount() {
        let maxBuy = 1e9; // or any large number
        for (let [type, bCost] of Object.entries($beaconUpgrades[index]['cost'])) {
            if (!$wallet[type]) return 0;
            const base = bCost * Math.pow($beaconUpgrades[index]['ratio'], $beaconUpgradeLevels[index]); 

            maxBuy = Math.min(maxBuy, 
            formula.maxNumGeom($wallet[type], base, $beaconUpgrades[index]['ratio']));
        }
        return maxBuy;
    }

    function buy() {
        if (isNaN($wallet['beaconPower'])) return
        costs = getCosts()
        for (let [type, val] of Object.entries(costs)) {
            if ((type =='beaconPower' && 
            (!$wallet['beaconPower'] || $wallet['beaconPower'] < val)) ||
            (type != 'beaconPower' && (!$wallet[type] || $wallet[type] < val))) {
                return
            }
        }
        for (let [type, val] of Object.entries(costs)) {
            if (type == 'beaconPower') {
                $wallet['beaconPower'] -= val
            } else {
                $wallet[type] -= val
            }
        }
        $beaconUpgradeLevels[index] += buyAmount
        costs = getCosts()
    }

    function canAfford() {
        if (isNaN($wallet['beaconPower'])) return false
        costs = getCosts()
        for (let [type, val] of Object.entries(costs)) {
            if ((val >= 1 && $wallet[type] < val-0.003) || !$wallet[type]) {
                return false;
            }
        }  
        return true
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
