
import { writable } from 'svelte/store';
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

export const progress = single(0);
export const progressThreshold = object({
    gems: 100,
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
    formula: (lv: any) => Math.pow(lv,0.9)+1,
    unlockAt: {
        gems: 3
    },
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
    unlockAt: {
        gems: 12
    },
    formula: (lv: any) => (1+floor(lv*0.1))*pow(lv,0.6),
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
    unlockAt: {
        gold: 1
    },
    formula: (lv: any) => (1 + Math.pow(lv, 0.33)*0.1),
    isPercent: true,
    prefix: '+',
    notes: '(1 + floor(level/10)) * level^0.6'  
}]);
