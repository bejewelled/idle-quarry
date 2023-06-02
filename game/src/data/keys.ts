//@ts-nocheck
import { writable, get } from 'svelte/store';
import { miningUpgrades } from './mining';
import { miningUpgradeLevels, keyUpgradeLevels, wallet } from './player';

function single(context: any) {
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
    }
}

function object(context: any) {
    // @ts-ignore
    const {subscribe, set, update} = writable(context);
    return {
        subscribe,
        set(obj: object) {
            update((i: any) => {
                i = obj;
                return i;
            })
        },
        setItem(item: string, amt: any) {
            update((i: any) => {
                i[item.toString().toLowerCase()] = amt;
                return i;
            })
        },
        add(item: string, amt: any) {
            update((i: any) => {
                i[item.toString().toLowerCase()] += amt;
                return i;
            })
        },
        sub(item: string | number, amt: any, negatable = false) {
            update((i: any) => {
                if (negatable) i[item] -= amt;
                else i[item.toString().toLowerCase()] = Math.max(i[item],0);
                return i;
            })
        },
        multiply(item: string | number, amt: any) {
            update((i: any) => {
                i[item.toString().toLowerCase()] *= amt;
                return i;
            })
        },
        divide(item: string | number, amt: any) {         
            update((i: any) => {
                i[item.toString().toLowerCase()] /= amt;
                return i;
            })
        }
    }
}

// same as object with additional methods
function dropTable(context: any) {
    // @ts-ignore
    const {subscribe, set, update } = writable(context);
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
        updateTable() {
            update((i: any) => {
                for (let [item, val] of Object.entries(i)) {
                    i[item]= [
                        Math.min(1,val[0]),
                            //* get(keyUpgrades)[0]['formula'](get(keyUpgradeLevels)[0])),
                        val[1], 
                        val[2]
                    ]
                }
                return i;
            })
        }
    }
}


export const key1DropTable = dropTable({
    gems: [0.6, 10, 200], // [chance, min, max]
    orbs: [0.4, 1, 5], // [chance, min, max]
    key1: [0.1, 1, 3],
    key2: [0.002, 1,1],
});

export const key2DropTable = dropTable({
    gems: [0.25, 1e3, 1e4], // [chance, min, max]
    orbs: [0.15, 150, 750],
    key1: [0.15, 3, 10],
    beacons: [0.15, 5, 15],
    key2: [0.05, 1, 1],
    sigils: [0.01, 1, 2],
    key3: [0.00013, 1, 1]
})

export const key3DropTable = dropTable({
    gems: [0.125, 1e8, 1e9], // [chance, min, max]
    gold: [0.075, 1e6, 5e6],
    crystals: [0.06, 1000, 10000],
    orbs: [0.06, 1500, 4500],
    key1: [0.06, 150, 500],
    key2: [0.04, 1, 10],
    beacons: [0.04, 1000, 3500],
    sigils: [0.025, 10, 75],
    key3: [0.0025, 1, 1],
    artifacts: [0.000011, 1, 1],
    key4: [0.0000005, 1, 1]
    
})

export const key4DropTable = dropTable({
    
})

export const key5DropTable = dropTable({
    
})


export const keyRewardText = object('')

// for displaying keys gained on mining page
export const keyGainFlavorText = object({})
export const keyProgressFlavorText = array(Array(20).fill(0))
export const keyProgressFlavorNextUpdate = single(Date.now()+500)

export const keyUpgrades = array([
    {
        name: 'Mysterious Potion',
        description: 'Concoct a potion that improves key rates for ALL keys.',
        cost: {
            slurry: 1e5,
            fame: 1e5,
            sigils: 1000,
        },
        ratio: 1.3,
        formula: (lv: any) => 1 + 0.25*Math.pow(lv,1.33),
        unlockAt: () => (get(wallet)['slurry'] > 0),
        isPercent: false,
        suffix: 'x droprates',
        maxLevel: 100,
        notes: ''
    },
    {
        name: 'Refinery',
        description: 'Increases slurry gain.',
        cost: {
            sigils: 500
        },
        ratio: 1.3,
        formula: (lv: any) => 1 + 0.2 * lv,
        unlockAt: () => (get(wallet)['sigils'] >= 100),
        isPercent: false,
        suffix: 'x slurry',
        maxLevel: 400,
        notes: ''
    }
    
])

export const keyCrafts = array([
    {
        item: 'key3',
        name: '[***] Key',
        style: 'text-pink-400',
        stylebg: 'bg-pink-400',
        cost: {
            slurry: 1e4,
            sigils: 10,
        },
        craftTime: 240, // in seconds
        baseAmount: 1,
        ratio: 1.04,
        unlockAt: () => (get(wallet)['key3'] > 0),
    },
    {
        item: 'key4',
        name: '[****] Key',
        style: 'text-violet-400',
        stylebg: 'bg-violet-400',
        cost: {
            slurry: 1e7,
            sigils: 100,
        },
        craftTime: 7200, // in seconds
        baseAmount: 1,
        ratio: 1.05, 
        unlockAt: () => (get(wallet)['key4'] > 0),
    },
    {
        item: 'key5',
        name: '[*****] Key',
        style: 'text-amber-400',
        stylebg: 'bg-amber-400',
        cost: {
            slurry: 1e11,
            sigils: 1e5,
        },
        craftTime: 86400, // in seconds
        baseAmount: 1,
        ratio: 1.06,
        unlockAt: () => (get(wallet)['key5'] > 0),
    },
    {
        item: 'beacons',
        name: 'Beacons',
        style: 'text-sky-400',
        stylebg: 'bg-sky-400',
        cost: {
            slurry: 1e3,
            sigils: 1,
        },
        craftTime: 60, // in seconds
        baseAmount: 100,
        ratio: 1.025,
        unlockAt: () => (get(wallet)['beacons'] > 0),
    },

    /* NOTE!!!

    When adding a new item here, MAKE SURE to update the following:
    player.slurryCraftFinishTimes
    player.keyCraftMastery

    */
])