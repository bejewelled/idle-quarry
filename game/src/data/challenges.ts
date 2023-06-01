
import { writable, get } from 'svelte/store';
import {wallet, miningUpgradeLevels, 
    enchantUpgradeLevels,buttonNumClicks,buttonStats} from './player'
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
    }
}
function object(context: any) {
    // @ts-ignore
    const {subscribe, set, update, get} = writable(context);
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
        }
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
    "Challenge 1: Rusty",
    "Challenge 2: Clicker Hell"
])

export const challengeDescriptions = array([
    "Each time your mine collects gems, your mine speed is decreased by 0.01% (multiplicatively).",
    "You start unable to buy upgrades. Every 20 button clicks allows you to buy 1 upgrade level.",
])

export const challengeGoals = array([
    {
        gems: 1e7,
    },
    {
        gems: 1e9,
    }
])

export const challengeActive = single(0);

export const currChallengeInfo = object({

})


export const challengeRewards = array([
    'Mining speed slowly increases over time.',

])
