
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

export const allMultipliers = object({
    startLayer: {
        description: 'Starting layer increased to',
        prefix: '',
        unlockAt: 1,
        formula: (amt: number) => 1 + Math.min(amt/4, 100) + Math.min(Math.sqrt(amt), 300) + Math.pow(amt, 0.25),
        colorStyle: 'layer'
    },
    gems: {
        description: 'Multiplying gem gain by',
        prefix: 'x',
        unlockAt: 1,
        formula: (amt: number) => 1 + 0.35 * Math.pow(amt, 0.96),
        colorStyle: 'gems'
    },
    mineSpeed: {
        description: 'Multiplying mining speed by',
        prefix: 'x',
        unlockAt: 1,
        formula: (amt: number) => 1 + Math.pow(Math.log(amt/1000+1), 0.75),
        colorStyle: 'gold'
    },
    mineXP: {
        description: 'Multiplying mining experience by',
        prefix: 'x',
        unlockAt: 100,
        formula: (amt: number) => 1 + Math.log10(amt/60+1),
        colorStyle: 'artifacts'
    },
    artifacts: {
        description: 'Multiplying artifact drop chance by',
        prefix: 'x',
        unlockAt: 1000,
        formula: (amt: number) => 1 + Math.pow(Math.log10(amt/10000+1), 0.33),
        colorStyle: 'artifacts'
    },
    radium: {
        description: 'Multiplying passive radioactivity gain by ',
        prefix: 'x',
        unlockAt: 10000,
        formula: (amt: number) => 1 + Math.log(Math.pow(amt,0.8)/1100+1),
        colorStyle: 'radium'
    },
    mastery: {
        description: 'Multiplying mastery gain by ',
        prefix: 'x',
        unlockAt: 1e8,
        formula: (amt: number) => 1 + Math.log10(Math.pow(amt,0.6)/3795+1),
        colorStyle: 'fame'
    },

})