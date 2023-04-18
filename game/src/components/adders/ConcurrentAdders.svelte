
<script>
// @ts-nocheck

// invisible component handling addition math


import Decimal from 'break_infinity.js'
import {progress, progressThreshold, progressPerTick, miningUpgrades} from '../../data/mining' 
import {wallet} from '../../data/player'

import { onMount } from 'svelte'

const d = (i) => {
    return new Decimal(i);
}

const fl = (i) => Math.floor(i);
const ce = (i) => Math.ceil(i);
const ro = (i) => Math.round(i);
const log = (i) => Math.log(i);


let gameSpeed = 1;
const calcGameSpeed = () => {
    return 1;
}

const UPDATE_SPEED = 50; // ms per tick
let last, dt;
onMount(() => {
    last = Date.now();
    setInterval(() => {
        const dt = (Date.now() - last) / 50;
        addProgress(dt);
        last = Date.now();
    }, 1000/UPDATE_SPEED)
})


function addProgress(delta) {
    const gemAt = $progressThreshold['gems'];
    $progress += $progressPerTick * delta*120;
    if ($progress >= gemAt) {
        addGems(Math.floor($progress / gemAt));
        $progress %= gemAt;
    }
}

/** 
 * @param n - number of times to add gems
 */
function addGems(n) {
    $wallet['gems'] += (n * 1);
}
</script>