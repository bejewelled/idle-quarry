
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
    name: 'Stability',
    description: 'The button moves less after each click.',
    cost: {
        crystals: 100,
    },
    ratio: 4,
    formula: (lv: any) => 1 - Math.pow(lv/10.25,0.4),
    unlockAt: () => (true),
    isPercent: false,
    suffix: 'x movement multiplier',
    maxLevel: 10,
    notes: ''
},
{
    name: 'Hot Button',
    description: 'Accumulate a multiplier to crystals as more clicks are made in the same day (max 10,000).',
    cost: {
        crystals: 750,
    },
    ratio: 4e150,
    formula: (lv: any) => lv,
    unlockAt: () => (true),
    isPercent: false,
    maxLevel: 1,
    notes: ''
},
{
    name: 'I\'m Feeling Nice',
    description: 'The center of the button is highlighted.',
    cost: {
        crystals: 4500,
    },
    ratio: 4e150,
    formula: (lv: any) => lv,
    unlockAt: () => (true),
    isPercent: false,
    maxLevel: 1,
    notes: ''
},
{
    name: 'Insanity!',
    description: 'Your lifetime Incredible and Perfect clicks increase mining speed; Perfect clicks have a drastically higher impact.',
    cost: {
        crystals: 12000,
    },
    ratio: 4e150,
    formula: (lv: any) => 1 + 
    Math.min(4,
        (get(buttonNumClicks)['perfect']*0.0075 + get(buttonNumClicks)['incredible']*0.000075)*lv
    ),
    unlockAt: () => (true),
    isPercent: false,
    suffix: 'x speed multiplier',
    maxLevel: 1,
    notes: ''
},
{
    name: 'Fractals',
    description: 'Button clicks give fame over time. [CURRENTLY DISABLED]',
    cost: {
        crystals: 1e200,
    },
    ratio: 4,
    formula: (lv: any) => lv===0 ? 1e308 :(11-lv)**3,
    unlockAt: () => (get(wallet)['crystals'] > 1000),
    isPercent: false,
    prefix: '1,000 fame every ',
    suffix: ' clicks',
    maxLevel: 10,
    notes: ''
},
{
    index: 5,
    name: 'The Duck',
    description: 'Increases the chance you get "lucky" and multiply your crystals.',
    cost: {
        crystals: 75000,
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
    name: 'Everlasting',
    description: 'Fame multiplier on relocate slowly increases over time. [CURRENTLY DISABLED]',
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
    description: '[NOT IMPLEMENTED] The precision point of the button is highlighted red. Incredible clicks that are lucky become Perfect instead.',
    cost: {
        crystals: 4e7,
    },
    ratio: 4,
    formula: (lv: any) => lv,
    unlockAt: () => (get(wallet)['crystals'] > 1e6),
    isPercent: false,
    maxLevel: 1,
    notes: ''
},
]);


