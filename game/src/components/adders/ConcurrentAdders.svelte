
<script>
// @ts-nocheck

// invisible component handling addition math


import Decimal from 'break_infinity.js'
import {things, thingProds, thingsBoost, thingsSpeed} from '../../data/things'

import { onMount } from 'svelte'

const d = (i) => {
    return new Decimal(i);
}

let gameSpeed = 1;
const calcGameSpeed = () => {
    return 1;
}

const UPDATE_SPEED = 20; // ms per tick
let last, dt;
onMount(() => {
    last = Date.now();
    setInterval(() => {
        gameSpeed = calcGameSpeed();
        dt = d((Date.now() - last) / UPDATE_SPEED);
        thingsAdd(dt, gameSpeed);
        last = Date.now();
    }, 1000/UPDATE_SPEED)
})


function thingsAdd(delta, gameSpeed) {
    const absoluteSpeed = delta.times(gameSpeed);
    const multi = d(1).times($thingsBoost).times(absoluteSpeed).dividedBy(1000/UPDATE_SPEED); // thing mplr
    $things = $things.plus(d($thingProds[0].times(multi)));
    $thingProds[0] = $thingProds[0].plus(d($thingProds[1].times(multi)));
    $thingProds[1] = $thingProds[1].plus(d($thingProds[2].times(multi)));
    $thingProds[2] = $thingProds[2].plus(d($thingProds[3].times(multi)));
    $thingProds[3] = $thingProds[3].plus(d($thingProds[4].times(multi)));
    $thingProds[4] = $thingProds[4].plus(d($thingProds[5].times(multi)));
    $thingProds[5] = $thingProds[5].plus(d($thingProds[6].times(multi)));
    $thingProds[6] = $thingProds[6].plus(d($thingProds[7].times(multi)));
}
</script>