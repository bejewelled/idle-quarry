
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
    gems: 100,
    key1: 50000,
    key2: 2000000,
})

// edit when changing the level of the haste upgrade
export const progressPerTick = single(1);

export const miningUpgrades = array([{
    name: 'Haste',
    description: 'Increases progress per tick.',
    cost: {
        gems: 10,
    },
    ratio: 3,
    formula: (lv: any) => (Math.pow(lv,0.9)+1 >= 10 ? 
    9+Math.pow(lv, 0.2) : Math.pow(lv,0.9)+1),
    unlockAt: () => (get(wallet)['gems'] >= 3),
    isPercent: false,
    notes: 'Progress equal to level + 1.'
},
{
    name: 'Efficiency',
    description: 'Increases gem yield.',
    cost: {
        gems: 20,
    },
    ratio: 1.25,
    unlockAt: () => (get(wallet)['gems'] > 11),
    formula: (lv: any) => lv*0.35*pow(lv,0.6),
    isPercent: false,
    notes: '(1 + floor(level/10)) * level^0.6'
},
{
    name: 'Fortune',
    description: 'Improves droprates for common items.',
    cost: {
        gems: 100,
        gold: 15
    },
    ratio: 1.5,
    unlockAt: () => (get(wallet)['gems'] > 30 && get(wallet)['gold'] > 5),
    formula: (lv: any) => (1 + Math.pow(lv, 0.33)*0.1),
    isPercent: true,
    prefix: '+',
    notes: '(1 + floor(level/10)) * level^0.6'  
},
{
    name: '[*] Key Finder',
    description: 'While mining, you will occasionally find a bundle of 10 T1 [*] keys.' 
    + ' Upgrades increase the frequency.',
    cost: {
        orbs: 15,
    },
    ratio: 1.5,
    unlockAt: () => (get(wallet)['orbs'] >= 1),
    formula: (lv: any) => (1 + Math.pow(lv, 0.6)*0.15),
    isPercent: false,
    suffix: 'x speed',
    notes: '(1 + floor(level/10)) * level^0.6' 
},
{
    name: '[**] Key Finder',
    description: 'While mining, you will occasionally find a bundle of 3 T2 [**] keys.' 
    + ' Upgrades increase the frequency.',
    cost: {
        orbs: 30000,
        beacons: 200
    },
    ratio: 1.5,
    unlockAt: () => (get(wallet)['orbs'] >= 1),
    formula: (lv: any) => (1 + Math.pow(lv, 0.5)*0.15),
    isPercent: false,
    suffix: 'x speed',
    notes: '' 
},
{
    name: '[*] Key Mastery',
    description: 'Increases the number of keys found when a Key Finder of any rarity triggers.',
    cost: {
        orbs: 1000,
        key1: 50
    },
    ratio: 1.15,
    unlockAt: () => (get(miningUpgradeLevels)[3] > 0),
    formula: (lv: any) => (1 + Math.pow(lv, 0.5)*0.1),
    isPercent: false,
    suffix: 'x keys',
    notes: ''
}]);

// if true, progress bars will be solid instead of flickering
export const antiFlickerFlags = object({
    gems: false,
    key1: false,
})