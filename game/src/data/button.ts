
import { writable, get } from 'svelte/store';
import {wallet, miningUpgradeLevels, enchantUpgradeLevels, buttonNumClicks} from './player'
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
export const buttonUpgrades = array([
{
    index: 0,
    name: 'Stability',
    description: 'The button moves less after each click.',
    cost: {
        crystals: 750,
    },
    ratio: 3.25,
    formula: (lv: any) => 1 - Math.pow(lv/10.25,0.45),
    unlockAt: () => (true),
    isPercent: false,
    suffix: 'x movement multiplier',
    maxLevel: 10,
    notes: ''
},
{
    index: 1,
    name: 'Hot Button',
    description: 'Accumulate a multiplier to crystals as more clicks are made (max 10,000).',
    cost: {
        crystals: 1200,
    },
    ratio: 4e150,
    formula: (lv: any) => lv,
    unlockAt: () => (true),
    isPercent: false,
    maxLevel: 1,
    notes: ''
},
{
    index: 2,
    name: 'I\'m Feeling Nice',
    description: 'The center of the button is highlighted.',
    cost: {
        crystals: 8000,
    },
    ratio: 4e150,
    formula: (lv: any) => lv,
    unlockAt: () => (true),
    isPercent: false,
    maxLevel: 1,
    notes: ''
},
{
    index: 3,
    name: 'Insanity!',
    description: 'Your lifetime Incredible and Perfect clicks increase mining speed; Perfect clicks have a drastically higher impact.',
    cost: {
        crystals: 20000,
    },
    ratio: 4e150,
    formula: (lv: any) => 1 + 
    Math.min(4,
        (get(buttonNumClicks)['perfect']*0.00075 + get(buttonNumClicks)['incredible']*0.000075)*Math.min(1,lv)
    ),
    unlockAt: () => (true),
    isPercent: false,
    suffix: 'x speed multiplier',
    maxLevel: 1,
    notes: ''
},
{
    index: 4,
    name: 'Fractals',
    description: 'Increases mining experience gained from excellent+ button clicks.',
    cost: {
        crystals: 100000
    },
    ratio: 1.75,
    formula: (lv: any) => 1 + Math.pow(lv, 1.4)*1.35,
    unlockAt: () => (get(wallet)['crystals'] > 1000),
    isPercent: false,
    suffix: 'x multiplier',
    maxLevel: 65,
    notes: ''
},
{
    index: 5,
    name: 'The Duck',
    description: 'Increases the chance you get "lucky" and multiply your crystals.',
    cost: {
        crystals: 900000,
    },
    ratio: 4,
    formula: (lv: any) => 0.025 + lv*0.025,
    unlockAt: () => (get(wallet)['crystals'] > 10000),
    isPercent: true,
    suffix: ' chance',
    maxLevel: 10,
    notes: ''
},
{
    index: 6,
    name: '[PLACEHOLDER]',
    description: 'PLACEHOLDER',
    cost: {
        crystals: 2e200,
    },
    ratio: 4,
    formula: (lv: any) => lv,
    unlockAt: () => (get(wallet)['crystals'] > 1e5),
    isPercent: false,
    maxLevel: 1,
    notes: ''
},
{
    index: 7,
    name: 'Deadly Precision',
    description: 'The precision point of the button is highlighted red. Incredible clicks that are lucky become Perfect instead.',
    cost: {
        crystals: 6e7,
    },
    ratio: 4,
    formula: (lv: any) => lv,
    unlockAt: () => (get(wallet)['crystals'] > 1e6),
    isPercent: false,
    maxLevel: 1,
    notes: ''
},
]);


