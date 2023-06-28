<div class="py-2">
    <div
        class="text-center items-center justify-center text-3xl font-bold
bg-clip-text bg-gradient-to-tl from-purple-300 to bg-fuchsia-600 text-transparent select-none"
    >
        Ascension
    </div>
    <div class="py-2"><AscensionButton /></div>

    <div class="game-text justify-center w-full flex">
        Ascension resets EVERYTHING, but allows you to harness the elements to
        make your next legacy stronger.
    </div>
    <div class="game-text justify-center w-full flex">
        Craft essences to gain power in the next legacy. Each element's essence
        gives a unique bonus.
    </div>

    <div class="grid grid-cols-12 pt-3">
        {#each $elementNames as e, i}
            <!-- names -->
            <div class="wrapper col-span-12 grid grid-cols-12 py-2">
                <div class="col-span-2 text-large game-text">
                    <span class='{ref.essenceTextColors[i]}'>{$elementNames[i]}</span>
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
                                    style="width: 19%"
                                />
                            </div>
                            <div
                                class="w-full h-4 bg-transparent absolute top-1 left-0"
                            >
                                <div
                                    class="next-amt {ref.essenceBgColors[
                                        i
                                    ]} bg-opacity-40 rounded-sm h-4"
                                    style="width: 90%"
                                />
                            </div>
                            <span class="tooltip tooltip-style ml-6">
                                <span class={ref.essenceTextColors[i]}>
                                    4,226 / 23,190 (+15,904 on ascension)
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="bonus-text col-span-3 grid grid-rows-2 ml-1 p-1 text-small game-text">
                    <div class='{ref.essenceTextColors[i]} font-bold row-span-1 text-large'>
                        {$elementBonusText[i]['prefix']} 41.97{$elementBonusText[i]['suffix']}
                        <span class='font-normal text-small'>>> 42.65{$elementBonusText[i]['suffix']}</span> 
                    </div>
                    <div class='row-span-1'>
                        {$elementBonusText[i]['text']}
                    </div>
                </div>
            </div>
        {/each}
    </div>
    <div class='grid grid-cols-12'>
        <div class='col-span-12 text-center underline font-bold text-indigo-500'>Antimatter Bonuses</div>
    </div>
</div>

<script lang="ts">
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
    import { elementNames, elementDescriptions, elementBonusText } from "../../data/ascension";
    import MiningUpgradeButton from "../buttons/MiningUpgradeButton.svelte";
    import ref from "../../calcs/ref";
    import formula from "../../calcs/formula";
    import BeaconToggleButton from "../buttons/BeaconToggleButton.svelte";
    import BeaconPowerUpgradeButton from "../buttons/BeaconPowerUpgradeButton.svelte";
    import EnchantUpgradeButton from "../buttons/EnchantUpgradeButton.svelte";
    import AscensionButton from "../buttons/AscensionButton.svelte";
</script>
