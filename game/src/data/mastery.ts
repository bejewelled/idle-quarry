
import { writable, get } from 'svelte/store';
import {wallet, miningUpgradeLevels, 
    enchantUpgradeLevels,buttonNumClicks,buttonStats, 
    challengesCompleted, automationItemsUnlocked} from './player'
import formula from '../calcs/formula';
import Decimal  from 'break_infinity.js';

function single(context: any) {
    // @ts-ignore
    const {subscribe, set, update, get} = writable(context);
    return {
        subscribe,
        set(amt: any) {
            update((i: any) => {
                i = amt;
                return amt;
            })
        },
        add(amt: any) {
            update((i) => {
                return i + amt;
            })
        },
        sub(amt: any, negatable = false) {
            update((i) => {
                if (negatable) return i - amt;
                else return Math.max(i,0);
            })
        },
        multiply(amt: any) {
            update(i => {
                return i * amt;
            })
        },
        divide(amt: any) {
            update(i => {
                return i / amt;
            })
        },
    }
}
function array(context: any) {
    // @ts-ignore
    const {subscribe, set, update} = writable(context);
    return {
        subscribe,
        set(amt: any) {
            update((i: any) => {
                i = amt;
                return amt;
            })
        },
        add(amt: any) {
            update((i: { plus: (arg0: any) => any; }) => {
                return i + amt;
            })
        },
        sub(amt: any, negatable = false) {
            update((i) => {
                if (negatable) return i - amt;
                else return Math.max(i,0);
            })
        },
        multiply(amt: any) {
            update(i => {
                return i * amt;
            })
        },
        divide(amt: any) {
            update(i => {
                return i / amt;
            })
        },
        updateChallengeReqs() {
            update((i: any) => {
                for (let k in i) {
                        i[k] = get(baseChallengeGoals)[k] 
                        * Math.pow(get(challengeMultipliers)[k], get(challengesCompleted)[k]) 
                        console.log(get(baseChallengeGoals)[k] * Math.pow(get(challengeMultipliers)[k], get(challengesCompleted)[k])); 
                    }
                return i;
            })
        }
    }
}
function object(context: any) {
    // @ts-ignore
    const {subscribe, set, update} = writable(context);
    return {
        subscribe,
        set(item: string | number, amt: any) {
            update((i: any) => {
                i[item] = amt;
                return i;
            })
        },
        add(item: string | number, amt: any) {
            update((i: any) => {
                i[item] += amt;
                return i;
            })
        },
        sub(item: string | number, amt: any, negatable = false) {
            update((i: any) => {
                if (negatable) i[item] -= amt;
                else i[item] = Math.max(i[item],0);
                return i;
            })
        },
        multiply(item: string | number, amt: any) {
            update((i: any) => {
                i[item] *= amt;
                return i;
            })
        },
        divide(item: string | number, amt: any) {         
            update((i: any) => {
                i[item] /= amt;
                return i;
            })
        },
    }
}


const pow = (b: number, e: number) => Math.pow(b,e);
const log = (b: number, e: number) => Math.log(e)/Math.log(b);
const floor = (n: number) => Math.floor(n);
const ceil = (n: number) => Math.ceil(n);

export const masteryNextReq = single(100)

export const masteryItemInfo = object({
    gems: {
        base: 1e13,
        increase: 1e3,
        cap: 1e295
    },
    gold: {
        base: 1e11,
        increase: 1e2,
        cap: 1e295
    },
    orbs: {
        base: 1e10,
        increase: 1e2,
        cap: 1e295
    },
    crystals: {
        base: 1e7,
        increase: 1e2,
        cap: 1e115
    },
    sigils: {
        base: 1e6,
        increase: 1e2,
        cap: 1e115
    },
    slurry: {
        base: 1e6,
        increase: 1e2,
        cap: 1e115
    },
    dust: {
        base: 1e4,
        increase: 1e1,
        cap: 1e78
    },
    artifacts: {
        base: 1e3,
        increase: 1e1,
        cap: 1e78
    },
    radium: {
        base: 1e2,
        increase: 1e1,
        cap: 1e78
    },
})

export const masteryItemReqs = object({
    gems: 0
})

