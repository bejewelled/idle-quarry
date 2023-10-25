
import { writable, get } from 'svelte/store';
import {wallet, miningUpgradeLevels, enchantUpgradeLevels, buttonNumClicks, challengesCompleted} from './player'
import Decimal  from 'break_infinity.js';
import formula from '../calcs/formula';

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

export const radiumGainText = single(0);

// edit when changing the level of the haste upgrade
export const progressPerTick = single(1);

// whether the random thorium deposit event is active
// 'off' - not active
// 'transition' - just clicked, about to turn off
// 'on' - active
export const thoriumDepositActive = single('off');


/* NOTE:
*  The cost of a specific item must be at least 1 to be imposed on the player.
*  If an upgrade should cost additional TYPES of resources at later levels, they must be added to the cost
*  object at a value of less than 1.
*/
export const buttonUpgrades = array([
{
    index: 0,
    name: 'Heat Sink',
    description: 'Increases the frequency of thorium deposits.',
    cost: {
        crystals: 100,
    },
    ratio: 3,
    formula: (lv: any) => 0.001 + lv * 0.0002,
    unlockAt: () => (true),
    isPercent: true,
    suffix: ' chance per second',
    maxLevel: 25,
    notes: ''
},
{
    index: 1,
    name: 'Coolant',
    description: 'Increases passive radioactivity gain.',
    cost: {
        crystals: 1100,
    },
    ratio: 1.33,
    formula: (lv: any) => 1 + lv * 0.12,
    unlockAt: () => (true),
    suffix: 'x radioactivity gain',
    isPercent: false,
    maxLevel: 250,
    notes: ''
},
{
    index: 2,
    name: 'Rich Deposits',
    description: 'Increases thorium deposit amount.',
    cost: {
        crystals: 10000,
    },
    ratio: 1.33,
    formula: (lv: any) => 1 + lv * 0.25,
    unlockAt: () => (true),
    suffix: 'x max thorium deposit radioactivity',
    isPercent: false,
    maxLevel: 250,
    notes: ''
},
{
    index: 3,
    name: 'Alpha Decay',
    description: 'Increases radium gain from full radioactivity.',
    cost: {
        crystals: 1e6,
    },
    ratio: 1.33,
    formula: (lv: any) => 1 + lv*0.1,
    unlockAt: () => (true),
    isPercent: false,
    suffix: 'x radium gain',
    maxLevel: 250,
    notes: ''
},
{
    index: 4,
    name: 'Fractals',
    description: 'Increases mining experience gained from excellent+ button clicks.',
    cost: {
        crystals: 1e5,
    },
    ratio: 1.25,
    formula: (lv: any) => 1 + Math.pow(lv, 2.5)*1.35,
    unlockAt: () => (get(wallet)['crystals'] > 1e297),
    isPercent: false,
    suffix: 'x multiplier',
    maxLevel: 65,
    notes: ''
},
{
    index: 5,
    name: 'The Duck',
    description: 'Increases the chance you get "lucky" and multiply your radioactivity.',
    cost: {
        crystals: 1e6,
    },
    ratio: 4,
    formula: (lv: any) => lv*0.01,
    unlockAt: () => (get(wallet)['crystals'] > 1e297),
    isPercent: true,
    suffix: ' chance',
    maxLevel: 25,
    notes: ''
},
{
    index: 6,
    name: 'Gamma Radiation',
    description: 'Clicks sometimes give warp.',
    cost: {
        crystals: 1e8,
    },
    ratio: 2,
    formula: (lv: any) => lv * 0.04,
    unlockAt: () => (get(wallet)['warp'] > 1e297 ),
    isPercent: true,
    suffix: ' chance',
    maxLevel: 8,
    notes: ''
},
{
    index: 7,
    name: 'Celestial Shattering',
    description: 'Legends say the perfect click can shatter the fabric of space itself...',
    cost: {
        radium: 125,
    },
    ratio: 40,
    formula: (lv: any) => 111111,
    unlockAt: () => (get(wallet)['crystals'] > 1e297),
    isRadiumUpgrade: true,
    isPercent: false,
    maxLevel: 1,
    notes: ''
},
// {
//     index: 8,
//     name: 'Quantum Tunneling',
//     description: 'Legends say the perfect click can shatter the fabric of space itself...',
//     cost: {
//         antimatter: 100,
//     },
//     ratio: 4,
//     formula: (lv: any) => 111111,
//     unlockAt: () => (get(wallet)['crystals'] > 1e6),
//     isRadiumUpgrade: true,
//     isPercent: false,
//     maxLevel: 1,
//     style: 'game-btn-antimatter',
//     notes: ''
// },
]);


