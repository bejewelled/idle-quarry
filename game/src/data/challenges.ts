
import { writable, get } from 'svelte/store';
import {wallet, miningUpgradeLevels, 
    enchantUpgradeLevels,buttonNumClicks,buttonStats, challengesCompleted} from './player'
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

export const challengeUnlockCriteria = array([
    Array(10).fill(() => true)
])

export const challengeNames = array([
    "C1: Rusty",
    "C2: Clicker Hell"
])

export const challengeDescriptions = array([
    "Mining and key finder progress is drastically slowed. (It gets reduced more on each completion).",
    "All mining upgrades are reset. You cannot buy mining upgrades.",
])

export const challengeGoals = array([6000, 6000, 6000, 6000, 6000, 6000, 6000, 6000, 6000, 6000])

export const baseChallengeGoals = array([6000, 6000, 6000, 6000, 6000, 6000, 6000, 6000, 6000, 6000])


export const challengeMultipliers = array([1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1, 1.1])

export const currChallengeInfo = object({

})


export const challengeRewards = array([
    'Mining speed slowly increases over time.',

])
