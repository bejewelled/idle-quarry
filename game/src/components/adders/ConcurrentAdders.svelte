
<script>
// @ts-nocheck

// invisible component handling addition math


import Decimal from 'break_infinity.js'
import {progress, progressThreshold, progressPerTick, miningUpgrades} from '../../data/mining' 
import {miningUpgradeLevels, wallet, miningDropTable} from '../../data/player'

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

let progressGain = 0;
function addProgress(delta) {
    const gemAt = $progressThreshold['gems'];
    progressGain = $miningUpgrades[0]['formula']($miningUpgradeLevels[0]);
    $progress += progressGain * delta;
    if ($progress >= gemAt) {
        addGems(Math.floor($progress / gemAt));
        dropRoll(Math.floor($progress / gemAt));
        $progress %= gemAt;
    }
}

/** 
 * @param n - number of times to add gems
 */
function addGems(n) {
    $wallet['gems'] += 1 + 
    n * $miningUpgrades[1]['formula']($miningUpgradeLevels[1]);
}

function dropRoll(n) {
    for (let [item, val] of Object.entries($miningDropTable)) {
        if ((Math.random() / n) < val[0]) {
            console.log(val[1])
            
            $wallet[item] = ($wallet[item] || 0) + val[1];
        }
    }
}
</script>