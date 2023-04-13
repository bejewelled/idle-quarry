<ConcurrentAdders />
{f($things)}
<br />
{#each $thingProds as prod}
    {f(prod)}
    <br />
{/each}

<script lang="ts">
// @ts-nocheck

import Decimal from 'break_infinity.js'
import {things, thingProds, thingsBoost, thingsSpeed} from '../data/things.js'
import ConcurrentAdders from '../components/adders/ConcurrentAdders.svelte';

import { onMount } from 'svelte'

const d = (i: string | number) => {
    return new Decimal(i); 
}
/**
 * 
 * @param i
 * @param dpl - precision for Decimals and any number over 1,000,000
 * @param npl - precision for any number under 1,000
 */
const f = (i: Decimal, dpl = 3, npl = 0) => {
    if (i.gte(1e6)) return i.toExponential(dpl).replace("+", "");
    else if (i.gte(1000)) return i.floor().toNumber().toLocaleString();
    else return i.toNumber().toFixed(npl);
}


</script>

<style>
    :global(body) {
        font-family: 'Roboto', sans-serif;
    }
</style>
