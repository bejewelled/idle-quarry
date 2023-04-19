
import { writable, get } from 'svelte/store';
import {wallet, miningUpgradeLevels} from './player'
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

export const progressThreshold = object({
    gems: 500,
    key1: 500,
    key2: 2000000,
})

// edit when changing the level of the haste upgrade
export const progressPerTick = single(1);


/* NOTE:
*  The cost of a specific item must be at least 1 to be imposed on the player.
*  If an upgrade should cost additional TYPES of resources at later levels, they must be added to the cost
*  object at a value of less than 1.
*/
export const miningUpgrades = array([{
    name: 'Haste',
    description: 'Increases progress per tick.',
    cost: {
        gems: 3,
    },
    ratio: 1.6,
    formula: (lv: any) => (lv>=36 ? 
    10 +(lv-36)*0.025 : lv*0.25+1),
    unlockAt: () => (get(wallet)['gems'] >= 1),
    isPercent: false,
    maxLevel: 1000,
    notes: 'Progress equal to level + 1.'
},
{
    name: 'Efficiency',
    description: 'Increases gem yield.',
    cost: {
        gems: 10,
    },
    ratio: 1.25,
    unlockAt: () => (get(wallet)['gems'] >= 3 && get(miningUpgradeLevels)[0] >= 1),
    formula: (lv: any) => lv*0.35*pow(lv,0.6),
    isPercent: false,
    prefix: '+',
    suffix: ' gems',
    maxLevel: 1000,
    notes: '(1 + floor(level/10)) * level^0.6'
},
// i = 2
{
    name: 'Fortune',
    description: 'Improves droprates for common [*] items.',
    cost: {
        gems: 100,
        gold: 15
    },
    ratio: 1.5,
    unlockAt: () => (get(wallet)['gems'] > 30 && get(wallet)['gold'] > 5),
    formula: (lv: any) => (1 + Math.pow(lv, 0.33)*0.1),
    isPercent: true,
    prefix: '+',
    maxLevel: 300,
    notes: '(1 + floor(level/10)) * level^0.6'  
},
{
    name: '[*] Key Finder',
    description: 'While mining, you will occasionally find a bundle of 10 T1 [*] keys.' 
    + '\nUpgrades increase progress gained towards this milestone.',
    cost: {
        orbs: 15,
    },
    ratio: 1.5,
    unlockAt: () => (get(wallet)['orbs'] >= 1),
    formula: (lv: any) => (1 + Math.max(0,Math.pow(lv-1, 0.6)*0.15)),
    isPercent: false,
    suffix: 'x speed',
    maxLevel: 300,
    notes: '(1 + floor(level/10)) * level^0.6' 
},
{
    name: '[**] Key Finder',
    description: 'While mining, you will occasionally find a bundle of 3 T2 [**] keys.' 
    + '\nUpgrades increase progress gained towards this milestone.',
    cost: {
        orbs: 30000,
        beacons: 200
    },
    ratio: 1.5,
    unlockAt: () => (get(wallet)['orbs'] >= 1000 && get(miningUpgradeLevels)[3] >= 1),
    formula: (lv: any) => (1 + Math.pow(lv, 0.5)*0.15),
    isPercent: false,
    suffix: 'x speed',
    maxLevel: 300,
    notes: '' 
},
// i = 5
{
    name: '[*] Key Mastery',
    description: 'Increases the number of keys found when a Key Finder of any rarity triggers.',
    cost: {
        orbs: 1000,
        key1: 50,
        key2: 0.25
    },
    ratio: 1.15,
    unlockAt: () => (get(miningUpgradeLevels)[3] > 0),
    formula: (lv: any) => (1 + Math.pow(lv, 0.5)*0.1),
    isPercent: false,
    suffix: 'x keys',
    maxLevel: 100,
    notes: ''
},
{
    name: 'Lootmaster I',
    description: 'The first level unlocks a new tier of findable drops. Additional levels increase all drop rates.',
    cost: {
        gold: 10000,
    },
    ratio: 1.25,
    unlockAt: () => (get(miningUpgradeLevels)[0] > 10 && get(miningUpgradeLevels)[1] > 10),
    formula: (lv: any) => ((1 + Math.max(0, Math.pow(lv-1, 0.325))) || 1),
    isPercent: false,
    suffix: 'x droprates',
    maxLevel: 100,
    notes: ''
},
{
    name: 'Shiny',
    description: 'Gold drops are significantly improved.',
    cost: {
        gems: 10000,
    },
    ratio: 1.25,
    unlockAt: () => (get(miningUpgradeLevels)[0] > 10 && get(miningUpgradeLevels)[1] > 10),
    formula: (lv: any) => (1 + lv*0.5*pow(lv, 0.11)),
    isPercent: false,
    suffix: 'x gold from drops',
    maxLevel: 300,
    notes: ''
},
// i = 8
]);

// if true, progress bars will be solid instead of flickering
export const antiFlickerFlags = object({
    gems: false,
    key1: false,
})

// for flavor text on mining page
export const gemGainFlavorText = single(0)
export const gemProgressFlavorText = single(0)
export const gemProgressFlavorNextUpdate = single(Date.now() + 500)