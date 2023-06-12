
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

export const challengeUnlockCriteria = array([
    () => (get(automationItemsUnlocked)['game on']),
    () => (get(automationItemsUnlocked)['game on']),
    () => (get(automationItemsUnlocked)['game on']),
    () => get(automationItemsUnlocked)['hellfire'],
    () => get(automationItemsUnlocked)['hellfire'],
    () => get(automationItemsUnlocked)['hellfire']]
    .concat(Array(3).fill(get(automationItemsUnlocked)['???notimplemented2221391']))
    .concat(Array(12).fill(false))
)

export const challengeNames = array([
    "C1: Rusty",
    "C2: Muted",
    "C3: Slowdown",
    "C4: Dark",
])

export const challengeDescriptions = array([
    "Mining and key finder progress is drastically slowed. (It gets reduced more on each completion).",
    "All non-fame mining upgrades except Lootmaster are reset. You cannot buy mining upgrades.",
    "Every time a mining cycle completes, the next one takes slightly longer. (Each completion increases the slowdown).",
    "All beacon path levels are reset. Beacon path progress is drastically slowed, but each level gives challenge points. All sources of challenge points other than beacon levels are heavily slowed. (Slowdown increases each completion until completion 18.)",
])

export const challengeGoals = array([2000, 2400, 10000, 6000, 6000, 6000, 6000, 6000, 6000, 6000])

export const baseChallengeGoals = array([2000, 2400, 10000, 6000, 6000, 6000, 6000, 6000, 6000, 6000])


export const challengeMultipliers = array([1.2, 1.2, 1.2, 1.2, 1.2, 1.2, 1.1, 1.1, 1.1, 1.1])

export const currChallengeInfo = object({

})


export const challengeRewards = array([
    'Mining speed slowly increases over time.',

])
