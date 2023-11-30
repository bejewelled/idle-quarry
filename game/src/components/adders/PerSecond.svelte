


<script>
// @ts-nocheck
  import { onMount } from 'svelte'
  import {wallet, perSecond} from '../../data/player'
  let lastSnapshot = {}
  let lastGainTime = {} 
  let gainsLastThree = {}
  onMount(() => {
    lastSnapshot = JSON.parse(JSON.stringify($wallet)); // deep copy
    for (let k of Object.keys($wallet)) {
        gainsLastThree[k] = [0, 0, 0]
        lastGainTime[k] = Date.now()
    }
    const interval = setInterval(() => {
        const current = $wallet;
    
        for (let k of Object.keys(current)) {
            // @ts-ignore
            if (Math.abs(current[k] - lastSnapshot[k]) > 0.025) {
                const timeSince = (Date.now() - (lastGainTime[k] || 0)) / 1000
                const gain = (current[k] - lastSnapshot[k]) / timeSince
                gainsLastThree[k].unshift(Number(gain))
                gainsLastThree[k].pop()
                //if (k == 'gems') console.log(gainsLastThree[k])
                $perSecond[k] = (gainsLastThree[k][0] + gainsLastThree[k][1] + gainsLastThree[k][2]) / 3             
                lastGainTime = Date.now();
            }  
        }
        lastSnapshot = JSON.parse(JSON.stringify($wallet));
       // console.log($perSecond)
    },250)
    lastGainTime.value = Date.now()
  })

</script>

<style>
  /* Component styles go here */
</style>