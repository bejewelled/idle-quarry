//@ts-nocheck
import { writable, get } from 'svelte/store';
import { miningUpgrades } from './mining';
import { miningUpgradeLevels, keyUpgradeLevels, wallet, keysOpened} from './player';
import {beaconBonuses} from './beacons'

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
                    if (item == 'tier') continue;
                    i[item]= [
                        Math.min((item.toString().includes('key'+i['tier']) ? 0.25 / val[2] : 
                        (item.toString().includes('key') ? 0.33333333 : 1)),
                        val[3] 
                        * get(miningUpgrades)[13]['formula'](get(miningUpgradeLevels)[13])
                        * get(keyUpgrades)[0]['formula'](get(keyUpgradeLevels)[0]
                        * get(beaconBonuses)[7])),
                        val[1], 
                        val[2],
                        val[3]
                    ]
                }
                return i;
            })
        }
    }
}


export const key1DropTable = dropTable({
    tier: 1,
    gems: [0.6, 10, 200, 0.6], // [chance, min, max, base]
    orbs: [0.4, 3, 10, 0.4], 
    gold: [0.2, 10, 20, 0.2],
    beacons: [0.01, 1, 1, 0.01],
    key2: [(1/2500), 1, 1, (1/2500)],
})

export const key2DropTable = dropTable({
    tier: 2,
    gems: [0.25, 1e3, 1e4, 0.25], // [chance, min, max, base]
    orbs: [0.15, 500, 2500, 0.15],
    key2: [0.075, 1, 4, 0.075],
    beacons: [0.15, 25, 100, 0.15],
    sigils: [0.01, 1, 2, 0.01],
    key3: [(1/120000), 1, 1, (1/120000)],
})

export const key3DropTable = dropTable({
    tier: 3,
    // [chance (w/ multipliers), min, max, baseChance]
    gems: [0.25, 1e8, 1e9, 0.125], 
    gold: [0.15, 1e6, 5e6, 0.075],
    crystals: [0.11, 1000, 10000, 0.06],
    orbs: [0.06, 25000, 2.5e5, 0.06],
    beacons: [0.04, 1000, 3500, 0.04],
    sigils: [0.025, 10, 75, 0.025],
    key3: [0.001, 1, 1, 0.001],
    artifacts: [0.00025, 1, 1, 0.00025],
    key4: [(1/5e7), 1, 1, (1/5e7)]
    
})

export const key4DropTable = dropTable({
    tier: 4,
    // [chance (w/ multipliers), min, max, baseChance]
    gems: [0.03, 1e20, 1e21, 0.03], 
    gold: [0.03, 1e11, 1e12, 0.03],
    crystals: [0.02, 1000, 10000, 0.02],
    orbs: [0.016, 5e7, 1e9, 0.016],
    sigils: [0.016, 2500, 10000, 0.016],
    artifacts: [0.00005, 15, 50, 0.00005],
    key4: [(1/5e5), 1, 1, (1/5e5)],
    key5: [(1/1e11), 1, 1, (1/1e11)]
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
        index: 0,
        name: 'Mysterious Potion',
        description: 'Concoct a potion that improves key rates for ALL keys.',
        cost: {
            slurry: 1000,
            sigils: 1000,
        },
        ratio: 1.4,
        formula: (lv: any) => 1 + 0.25*Math.pow(lv, 0.9),
        unlockAt: () => (get(wallet)['slurry'] > 0),
        isPercent: false,
        suffix: 'x droprates',
        maxLevel: 100,
        notes: ''
    },
    {
        index: 1,
        name: 'Refinery',
        description: 'Increases slurry gain.',
        cost: {
            sigils: 500
        },
        ratio: 1.3,
        formula: (lv: any) => 1 + 0.2 * lv,
        unlockAt: () => (get(wallet)['sigils'] >= 100 && get(wallet)['slurry'] > 0),
        isPercent: false,
        suffix: 'x slurry',
        maxLevel: 400,
        notes: ''
    },
    {
        index: 2,
        name: 'Rift Control',
        description: 'Decreases the cost ratio for energized crystals.',
        cost: {
            sigils: 5e5,
            warp: 2500,
        },
        ratio: 1.3,
        formula: (lv: any) => 4 - 0.063*Math.pow(lv, 0.6),
        unlockAt: () => (get(wallet)['sigils'] >= 1e4),
        isPercent: false,
        suffix: ' cost ratio',
        maxLevel: 100,
        notes: ''
    }
    
])

export const keyCrafts = array([
    {
        item: 'energizedCrystal',
        name: 'Energized Crystal',
        style: 'text-emerald-300',
        stylebg: 'bg-emerald-300',
        cost: {
            crystals: 1000
        },
        craftTime: 30, // in seconds
        baseAmount: 1,
        ratio: 3,
        unlockAt: () => (get(wallet)['crystals'] > 0),
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
        unlockAt: () => (get(wallet)['key3'] > 0 || get(keysOpened)[2] > 0 || get(keysOpened)[1] > 1e5),
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
        unlockAt: () => (get(wallet)['key4'] > 0 || get(keysOpened)[3] > 0 || get(keysOpened)[2] > 1e5),
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
        unlockAt: () => (get(wallet)['key5'] > 0 || get(keysOpened)[4] > 0 || get(keysOpened)[3] > 1e5),
    },
    {
        item: 'artifacts',
        name: 'Artifacts',
        style: 'text-slate-200',
        stylebg: 'bg-slate-200',
        cost: {
            slurry: 1e11,
            sigils: 1e5,
        },
        craftTime: 86400, // in seconds
        baseAmount: 1,
        ratio: 1.06,
        unlockAt: () => (get(wallet)['artifacts'] > 0 || get(keysOpened)[2] > 2000),
    },


    /* NOTE!!!

    When adding a new item here, MAKE SURE to update the following:
    player.keyCraftFinishTimes
    player.keyCraftMastery

    */
])