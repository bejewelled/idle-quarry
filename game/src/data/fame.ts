
import { writable, get } from 'svelte/store';
import {wallet, miningUpgradeLevels, enchantUpgradeLevels} from './player'
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


// the number of mining operations until enchants will have a chance to proc
export const enchantThreshold = object({
    t1: 100,
    t2: 40000,
    t3: 1e9
})


// edit when changing the level of the haste upgrade
export const progressPerTick = single(1);


/* NOTE:
*  The cost of a specific item must be at least 1 to be imposed on the player.
*  If an upgrade should cost additional TYPES of resources at later levels, they must be added to the cost
*  object at a value of less than 1.
*/
export const enchantUpgrades = array([{
    name: 'Mine Size',
    description: 'Increases your mine size, which increases the effect of many enchants below..',
    cost: {
        fame: 10,
    },
    tier: 1,
    ratio: 1.25,
    formula: (lv: any) => pow(lv+5,2),
    unlockAt: () => (true),
    isPercent: false,
    suffix: ' tiles',
    maxLevel: 1000,
    notes: ''
},
{
    name: 'Mine Quality',
    description: 'Increases the quality of your mine, which increases the effect of many enchants below.',
    cost: {
        fame: 10,
    },
    tier: 1,
    ratio: 1.25,
    formula: (lv: any) => (lv*lv) + 10,
    unlockAt: () => (true),
    isPercent: false,
    suffix: ' quality rating',
    maxLevel: 1000,
    notes: ''
},
{
    name: 'Burst',
    description: 'Has a chance to clear a mine level, instantly giving mining cycles (the number of mining cycles is equal to mine size).',
    cost: {
        fame: 30,
    },
    tier: 1,
    ratio: 1.25,
    formula: (lv: any) => (0.15/400) * lv,
    unlockAt: () => (get(wallet)['fame'] >= 100 || get(enchantUpgradeLevels)[0] > 0),
    isPercent: true,
    suffix: ' chance',
    maxLevel: 400,
    notes: ''
},
{
    name: 'Orb Rush',
    description: 'Has a chance to give orbs based on mine quality.',
    cost: {
        fame: 30,
        gems: 1e7
    },
    tier: 1,
    ratio: 1.25,
    formula: (lv: any) => (0.12/400) * lv,
    unlockAt: () => (get(wallet)['fame'] >= 100 || get(enchantUpgradeLevels)[0] > 0),
    isPercent: true,
    suffix: '  chance',
    maxLevel: 400,
    notes: ''
},
{
    name: 'Lightning Blast',
    description: 'Has a chance to dramatically increase mining speed for 3 seconds (speed based on mine size).',
    cost: {
        fame: 225,
    },
    tier: 1,
    ratio: 1.25,
    formula: (lv: any) => (0.013/400) * lv,
    unlockAt: () => (get(wallet)['fame'] >= 100 || get(enchantUpgradeLevels)[0] > 0),
    isPercent: true,
    suffix: '  chance',
    maxLevel: 400,
    notes: ''
},
{
    name: 'Scavenger',
    description: 'Has a chance to increase a random mining upgrade level by 1.',
    cost: {
        fame: 900,
    },
    tier: 1,
    ratio: 1.35,
    formula: (lv: any) => Math.pow(lv/400, 2) * 0.05,
    unlockAt: () => (get(wallet)['fame'] >= 100 || get(enchantUpgradeLevels)[0] > 0),
    isPercent: true,
    suffix: '  chance',
    maxLevel: 400,
    notes: ''
},

]);




export const automationUpgrades = array([{
    name: 'Jumpstart',
    description: 'Start with 5000 gems and 100 gold.',
    cost: {
        fame: 1600,
    },
    unlockAt: () => (get(wallet)['fame'] >= 1),
    isPercent: true,
    suffix: ' chance',
},
{
    name: 'Deep Pockets',
    description: 'Lootmaster I and II stay unlocked on relocate.',
    cost: {
        fame: 8000,
    },
    unlockAt: () => (get(wallet)['fame'] >= 1),
    isPercent: true,
    suffix: ' chance',
},
{
    name: 'Omnipotent',
    description: 'Except for Lootmaster I and II, mining upgrades are not reset on relocation',
    cost: {
        fame: 50000,
    },
    unlockAt: () => (get(wallet)['fame'] >= 1),
    isPercent: true,
    suffix: ' chance',
},
{
    name: 'Game On',
    description: 'Unlocks challenges 1 - 3. [NOT IMPLEMENTED YET]',
    cost: {
        fame: 1e5,
    },
    unlockAt: () => (get(wallet)['fame'] >= 1),
    isPercent: true,
    suffix: ' chance',
}]);