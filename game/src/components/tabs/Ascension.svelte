<Resetters bind:this={resetFuncs}/>
<div class="py-2">
    <div
        class="text-center items-center justify-center text-3xl font-bold
bg-clip-text bg-gradient-to-tl from-purple-300 to bg-fuchsia-600 text-transparent select-none"
    >
        Ascension {$ascensionStats['ascensionCount']} >>> {$ascensionStats['ascensionCount']+1}
    </div>
    <div class="py-2"><AscensionButton /></div>

    <div class="game-text justify-center w-full flex">
        Ascension resets most things up to this point (except for mastery)  , but allows you to harness the elements to
        make your next legacy stronger.
    </div>
    <div class="game-text justify-center w-full flex">
        Craft essences to gain power in the next legacy. Each element's essence
        gives a unique bonus.
    </div>
    <div class="game-text justify-center w-full flex">Gain 
        <span class='{ref.colors['antimatter']}'>
        &nbsp;{f(formula.calcAntimatterGain())}&nbsp;antimatter&nbsp;</span> 
        based on the sum of all essence produced this ascension.
    </div>

    <div class="grid grid-cols-12 pt-3">
        {#key clock}
        {#each $ascensionElements as e, i}
            <!-- names -->
            <div class="wrapper col-span-12 grid grid-cols-12 py-2">
                <div class="col-span-3 text-large game-text">
                    <span class={ref.essenceTextColors[i]}
                        >{$elementNames[i]} [{f($ascensionLevels[e][0], 0)}]</span
                    >
                </div>
                <div class="pbar-desc col-span-7 grid grid-rows-2">
                    <div class="row-span-1 game-text text-small">
                        {$elementDescriptions[i]}
                    </div>
                    <div class="row-span-1 game-text">
                        <div class="bar-wrapper relative has-tooltip">
                            <div
                                class="my-1 absolute top-0 left-0 bg-gray-200 rounded-sm h-4 w-full dark:bg-gray-700"
                            >
                                <div
                                    class="curr-amt {ref.essenceBgColors[
                                        i
                                    ]} rounded-sm h-4 z-20"
                                    style="width: {pbarWidths[i]}%"
                                />
                            </div>
                            <div
                                class="w-full h-4 bg-transparent absolute top-1 left-0"
                            >
                                <div
                                    class="next-amt {ref.essenceBgColors[
                                        i
                                    ]} bg-opacity-40 rounded-sm h-4"
                                    style="width: {pbarForecastWidths[i]}%"
                                />
                            </div>
                            <span class="tooltip tooltip-style ml-6">
                                <span class={ref.essenceTextColors[i]}>
                                    {f($ascensionLevels[e][1], 2)}
                                    / {f($ascensionLevels[e][2],2)}
                                     (+{f(formula.calcEssenceXPGain(e),2)||0} on ascension)
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
                <div
                    class="bonus-text col-span-2 grid grid-rows-2 ml-1 p-1 text-small game-text"
                >
                    <div
                        class="{ref.essenceTextColors[
                            i
                        ]} font-bold row-span-1 text-large"
                    >
                        {$elementBonusText[i]["prefix"]}{$elementBonusText[i]['isPercent'] ?
                        f(
                            ascFormula.getVal($ascensionElements[i])*
                        ($elementBonusText['isPercent'] ? 100 : 1) - 1,3) :
                        f(ascFormula.getVal($ascensionElements[i])*
                        ($elementBonusText['isPercent'] ? 100 : 1),3)}
                        {$elementBonusText[i]["suffix"]}
                        <span class="font-normal text-small"
                            >>> 
                            {#if e === 'antimatter'}
                            {f(ascFormula.getValAt(e, Math.floor(
                                formula.maxFinitePoly2(
                                    ($ascensionLevels[e][1] || 0) + 
                                    sumEssence(), $ascensionLevels[e][0],
                                    $ascensionConstants['antimatterLevelFormulaNums'],
                                    'antimatter'
                            ))),3)}
                            {:else}
                            {$elementBonusText[i]['isPercent'] ? fp(ascFormula.getValAt(e, Math.floor(
                                formula.maxFinitePoly2(
                                    $ascensionLevels[e][1] + 
                                    ($wallet['e'+e]||0), $ascensionLevels[e][0],
                                    $ascensionConstants['levelFormulaNums'],
                                    e
                            ))) - 1,2) :
                            f(ascFormula.getValAt(e, Math.floor(
                                formula.maxFinitePoly2(
                                    $ascensionLevels[e][1] + 
                                    ($wallet['e'+e]||0), $ascensionLevels[e][0],
                                    $ascensionConstants['levelFormulaNums'],
                                    e
                            ))), 3)}
                            {/if}
                             
                            
                            {$elementBonusText[i]["suffix"]}
                        </span>
                    </div>
                    <div class="row-span-1">
                        {$elementBonusText[i]["text"]}
                    </div>
                </div>
            </div>
        {/each}
        {/key}
        <div class='col-span-12 text-left text-indigo-500 text-medium py-1'>
            Antimatter is currently boosting:
            {#each $antimatterBonusText as a,i}
                {#if $ascensionStats['ascensionCount'] >= $antimatterBonusAscensionReqs[i]}
                    <div class='col-span-12 text-indigo-500 text-small text-left'>{a}</div>
                {/if}
            {/each}
            <div class='text-small italic text-indigo-300'>Next bonus at ascension {f(getNextAntimatterReq())}.</div>
        </div>
    </div>
    <div class="grid grid-cols-12">
    </div>
</div>

<script lang="ts">
	import Resetters from './../resetters/Resetters.svelte';
    import { ascensionLevels, ascensionStats } from "./../../data/player.ts";
    import { ascFormula, ascensionElements, ascensionConstants,
    antimatterBonusText, antimatterBonusAscensionReqs} from "./../../data/ascension.ts";
    import { onMount, onDestroy } from "svelte";
    import {
        progress,
        wallet,
        miningDropTable,
        miningUpgradeLevels,
        settings,
        visibleTier,
        progressThisTick,
        progressAverage,
        beaconActivations,
        beaconLevels,
        beaconProgress,
        resources,
        keysOpened,
        unlockedRes,
        beaconUpgradeLevels,
        flags,
        enchantUpgradeLevels,
        enchantProgress,
        automationItemsUnlocked,
        mineLevel,
        buttonUpgradeLevels,
        stats,
        keyCraftAmount,
        miningUpgradeLevelsBought,
        miningUpgradeLevelsFree,
    } from "../../data/player";
    import { buttonUpgrades } from "../../data/button";
    import {
        progressThreshold,
        progressPerTick,
        miningUpgrades,
        gemGainFlavorText,
        gemProgressFlavorText,
    } from "../../data/mining";
    import { keyGainFlavorText } from "../../data/keys";
    import {
        beaconPower,
        beaconBonuses,
        beaconFormulas,
        beaconNums,
        beaconNextReqs,
        beaconSpendAmt,
        beaconUpgrades,
        beaconNameText,
        baseBeaconNextReqs,
    } from "../../data/beacons";
    import { enchantUpgrades, enchantThreshold } from "../../data/fame";
    import {
        elementNames,
        elementDescriptions,
        elementBonusText,
    } from "../../data/ascension";
    import MiningUpgradeButton from "../buttons/MiningUpgradeButton.svelte";
    import ref from "../../calcs/ref";
    import formula from "../../calcs/formula";
    import BeaconToggleButton from "../buttons/BeaconToggleButton.svelte";
    import BeaconPowerUpgradeButton from "../buttons/BeaconPowerUpgradeButton.svelte";
    import EnchantUpgradeButton from "../buttons/EnchantUpgradeButton.svelte";
    import AscensionButton from "../buttons/AscensionButton.svelte";

    let resetFuncs: Resetters;

    $: pbarWidths = [0, 0, 0, 0, 0, 0];
    $: pbarForecastWidths = [0, 0, 0, 0, 0, 0];
    $: forecastNums = [];
    const getNextAntimatterReq = () => {
        const count = $ascensionStats['ascensionCount'];
        for (let i in $antimatterBonusAscensionReqs) {
            if (count < $antimatterBonusAscensionReqs[i]) {
                return $antimatterBonusAscensionReqs[i];
            }
        }
        return $antimatterBonusAscensionReqs.length;
    }
    let clock = false;
    const sumEssence = () => {
                        let sum = 0;
                        for (let i = 0; i < $ascensionElements.length; i++) {
                            sum += ($wallet["e" + $ascensionElements[i]] || 0);
                        }
                        return sum;
                    };
    function updatePbars () {
        for (let i = 0; i < $ascensionElements.length; i++) {
                pbarWidths[i] = Math.min(
                    100,
                    ($ascensionLevels[$ascensionElements[i]][1] /
                        $ascensionLevels[$ascensionElements[i]][2]) *
                        100
                );
                if ($ascensionElements[i] == "antimatter") {
                    
                    pbarForecastWidths[i] = Math.min(
                        100,
                        (($ascensionLevels[$ascensionElements[i]][1] +
                            sumEssence()) /
                            $ascensionLevels[$ascensionElements[i]][2]) *
                            100
                    );
                } else {

                    pbarForecastWidths[i] = Math.min(
                        100,
                        (($ascensionLevels[$ascensionElements[i]][1] +
                        ($wallet["e" + $ascensionElements[i]]||0)) /
                            $ascensionLevels[$ascensionElements[i]][2]) *
                            100
                    );
                }
            }
    }

    let interval: any;
    onMount(() => {
        updatePbars();
        interval = setInterval(() => {
            updatePbars();
            clock = !clock;
        }, 1023);
        return () => clearInterval(interval);
    });

    onDestroy(() => {
        clearInterval(interval);
    });

    const f = (n: number, pl = 0) => {
        if (isNaN(n)) return "???";

        if (n < 1e9)
            return n
                .toFixed(n < 1e3 ? pl : 0)
                .toString()
                .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        else return n.toExponential(3).toString().replace("+", "");
    };

    const fp = (n: any, pl = 3, subOne = false) => {
        if (isNaN(n)) return "0.00%";
        if (subOne) n -= 1;
        if (n < 1e9)
            return (
                (n * 100)
                    .toFixed(n < 1e3 ? pl : 0)
                    .toString()
                    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "%"
            );
        else
            return (
                (n * 100).toExponential(pl).toString().replace("+", "") + "%"
            );
    };

    const fpf = (n: any, subOne = false) => {
        if (subOne) n -= 1;
        if (n < 1e9)
            return (
                (n * 100)
                    .toFixed(3)
                    .toString()
                    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "%"
            );
        else
            return (n * 100).toExponential(3).toString().replace("+", "") + "%";
    };
    

</script>
