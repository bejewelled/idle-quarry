<div class='key-amount-wrapper items-center'>
    <div class='grid grid-cols-8 align-middle'>
        {#each [1,2,3,4,5] as i}
            <div class='col-span-2 py-1 {ref.colors['key' + i]}'>
                {$wallet['key'+i] > 0 || $visibleTier >= i ? ref.keyMainNames[i]: '?????'}
            </div>
                <div class='col-span-1 py-1 text-left {ref.colors['key' + i]}'>
                    {f.f($wallet['key' + i])}
                </div>
                <div class='col-span-3 py-1 text-left {ref.colors['key' + i]}'>
                    <KeyOpenButton rarity={i} amt=1/>
                </div>
                <div class='col-span-1 py-1 text-left {ref.colors['key' + i]}'>
                    <KeyOpenButton rarity={i} amt=10 />
                </div>
                <div class='col-span-1 py-1 text-left {ref.colors['key' + i]}'>
                    <KeyOpenButton rarity={i} amt=100 />
                </div>
        {/each}
    </div>
    <div class='reward-disp-wrapper items-center'>
        {#if $keyRewardText != ''}
        <div class='grid grid-cols-8'>
            <div class='col-span-8 game-text text-left'>
                You received the following rewards:
            </div>
            {#each Object.entries($keyRewardText) as r}
                <div class='col-span-2'></div>
                <div class='col-span-3 text-left py-1 {ref.colors[r[0]] || 'text-white'}'>
                    {ref.displayNames[r[0]] ? ref.displayNames[r[0]] : r[0]}: 
                </div>
                <div class='col-span-1 py-1 text-left {ref.colors[r[0]] || 'text-white'}'>
                    {f.f(parseInt(r[1]),0)}
                </div>
                <div class='col-span-2'></div>
            {/each}
        </div>
        {/if}

    </div>

</div>

<script lang='ts'>
    //@ts-nocheck
import { onMount } from 'svelte';
import { wallet, visibleTier } from '../../data/player';
import { progressThreshold, progressPerTick, miningUpgrades } from '../../data/mining';
import { miningUpgradeLevels } from '../../data/player';
import { keyRewardText } from '../../data/keys'
import { f } from '../../data/format';
import ref from '../../calcs/ref';
import KeyOpenButton  from '../buttons/KeyOpenButton.svelte';

</script>