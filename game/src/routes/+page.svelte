<p>{$things}</p>


<script lang="ts">
// @ts-nocheck

import Decimal from 'break_infinity.js'
import {things, thingProds, thingsBoost, thingsSpeed} from '../data/things.js'

import { onMount } from 'svelte'

const d = (i: string | number) => {
    return new Decimal(i); 
}


</script>

<style>
    :global(body) {
        font-family: 'Roboto', sans-serif;
    }
</style>
