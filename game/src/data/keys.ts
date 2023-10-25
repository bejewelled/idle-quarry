//@ts-nocheck
import { writable, get } from 'svelte/store';
import { miningUpgrades } from './mining';
import { miningUpgradeLevels, keyUpgradeLevels, wallet, keysOpened} from './player';
import {beaconBonuses} from './beacons'
import formula from '../calcs/formula'

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
                    let baseChance = val[3] 
                    * get(keyUpgrades)[0]['formula'](get(keyUpgradeLevels)[0])
                    * (item === 'artifacts' ? get(miningUpgrades)[21]['formula'](get(miningUpgradeLevels)[21]) : 1)
                    * get(miningUpgrades)[36]['formula'](get(miningUpgradeLevels)[36])
                    * get(beaconBonuses)[7]
                    * formula.getAntimatterBonusAmount(1);
                    i[item]= [
                        Math.min(1,
                        (baseChance > val[4] ? val[4] + Math.pow(baseChance-val[4], 3) : baseChance)),
                        val[1], 
                        val[2],
                        val[3],
                        val[4] || 1
                    ]
                }
                return i;
            })
        }
    }
}


export const key1DropTable = dropTable({
    tier: 1,
    gems: [0.6, 10, 200, 0.6, 0.9], // [chance, min, max, base, chanceSoftcap]
    orbs: [0.4, 3, 10, 0.4, 0.9], 
    gold: [0.2, 10, 20, 0.2, 0.9],
    beacons: [0.025, 1, 1, 0.025, 0.1],
    key2: [(1/2700), 1, 1, (1/2500), 0.04],
})

export const key2DropTable = dropTable({
    tier: 2,
    gems: [0.25, 1e6, 1e7, 0.25, 0.6], // [chance, min, max, base]
    gold: [0.15, 1e4, 1e5, 0.15, 0.6],
    orbs: [0.15, 3200, 18000, 0.15, 0.6],
    sigils: [0.11, 1, 1, 0.11, 0.6],
    beacons: [0.06, 250, 1000, 0.06, 0.6],
    key3: [(1/130000), 0.67, 0.9, (1/120000), 0.004],
})

export const key3DropTable = dropTable({
    tier: 3,
    // [chance (w/ multipliers), min, max, baseChance, chanceSoftcap]
    gems: [0.25, 1e14, 1e15, 0.25, 0.4], 
    gold: [0.15, 1e8, 5e8, 0.075, 0.4],
    crystals: [0.11, 1000, 10000, 0.11, 0.25],
    orbs: [0.06, 2.2e6, 1.1e7, 0.06, 0.25],
    beacons: [0.04, 1000, 3500, 0.04, 0.25],
    sigils: [0.035, 45, 160, 0.035, 0.25],
    artifacts: [4.2e-7, 0.65, 1, 4.2e-6, 0.001],
    key4: [(1/1e7), 0.84, 0.84, (1/1e7), 0.0004]
    
})

export const key4DropTable = dropTable({
    tier: 4,
    // [chance (w/ multipliers), min, max, baseChance]
    gems: [0.03, 1e26, 1e29, 0.03], 
    gold: [0.03, 1e14, 1e16, 0.03],
    crystals: [0.02, 1000, 10000, 0.02],
    orbs: [0.016, 5e7, 1e9, 0.016],
    sigils: [0.016, 2500, 10000, 0.016],
    artifacts: [0.00005, 15, 50, 0.00005],
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
        name: 'Mystic Potion',
        description: 'Concoct a potion that improves key rates for ALL keys.',
        cost: {
            slurry: 100,
            sigils: 100,
        },
        ratio: 1.3,
        formula: (lv: any) => 1 + 0.15*Math.pow(lv, 0.875),
        unlockAt: () => (get(wallet)['slurry'] > 0),
        isPercent: false,
        suffix: 'x droprates',
        maxLevel: 600,
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
        unlockAt: () => (get(wallet)['slurry'] > 0),
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
            slurry: 1e5,
        },
        ratio: 1e5,
        formula: (lv: any) => 10 - lv,
        unlockAt: () => (get(wallet)['antimatter'] > 0 || get(wallet)['totalAntimatter'] > 0),
        isPercent: false,
        suffix: ' cost ratio',
        maxLevel: 8,
        notes: ''
    },
    {
        index: 3,
        name: 'Special Slurry',
        description: 'Converting a high amount of keys into slurry will also give sigils. Increase the amount by 20% per level.',
        cost: {
            slurry: 1e11,
        },
        ratio: 1.3,
        formula: (lv: any) => 0.8 + 0.2 * lv,
        unlockAt: () => (get(wallet)['antimatter'] > 0 || get(wallet)['totalAntimatter'] > 0),
        isPercent: true,
        suffix: ' convert sigils',
        maxLevel: 100,
        notes: ''
    },
    {
        index: 4,
        name: 'Capacitor',
        description: 'Increases all crafting yields.',
        cost: {
            slurry: 7500
        },
        ratio: 10,
        formula: (lv: any) => 1 + lv * 0.25,
        unlockAt: () => (get(wallet)['antimatter'] >= 1 || get(wallet)['totalAntimatter'] >= 1)
        && (get(wallet)['slurry'] >= 1),
        isPercent: false,
        suffix: ' craft yields',
        maxLevel: 40,
        notes: ''
    },
    {
        index: 5,
        name: 'Fabrication Clocking',
        description: 'Greatly increases key finder yields.',
        cost: {
            slurry: 1e11,
        },
        ratio: 10,
        formula: (lv: any) => 1 + lv**2,
        unlockAt: () => (get(wallet)['antimatter'] >= 190 || get(wallet)['totalAntimatter'] >= 190),
        isPercent: true,
        suffix: ' craft bonus',
        maxLevel: 40,
        notes: ''
    },
    
])

export const keyCrafts = array([
    {
        item: 'energy',
        name: 'Energized Crystal',
        style: 'text-emerald-300',
        stylebg: 'bg-emerald-300',
        cost: {
            crystals: 1
        },
        craftTime: 15, // in seconds
        min: 3,
        max: 3,
        ratio: 10,
        unlockAt: () => (get(wallet)['crystals'] > 0),
    },
    {
        item: 'relics',
        name: 'Relic',
        style: 'text-transparent bg-clip-text bg-gradient-to-tr from-orange-300 to-amber-300',
        stylebg: 'bg-gradient-to-br from-fuchsia-300 to-violet-700',
        cost: {
            fragments: 100000,
            artifacts: 15000,
            antimatter: 300
        },
        craftTime: 750, // in seconds
        min: 1,
        max: 1,
        ratio: 1.33,
        unlockAt: () => (get(wallet)['fragments'] > 0),
    },
    {
        item: 'key2',
        name: '[**] Key',
        style: 'text-blue-400',
        stylebg: 'bg-blue-400',
        cost: {
            slurry: 10,
        },
        craftTime: 35, // in seconds
        min: 1,
        max: 3,
        ratio: 1.04,
        unlockAt: () => (get(keysOpened)[0] > 1000 || get(keysOpened)[0] > 1e4),
    },
    {
        item: 'key3',
        name: '[***] Key',
        style: 'text-pink-400',
        stylebg: 'bg-pink-400',
        cost: {
            sigils: 1,
            crystals: 1e6,
            fame: 10000,

        },
        craftTime: 140, // in seconds
        min: 1,
        max: 3,
        ratio: 1.04,
        unlockAt: () => (get(keysOpened)[1] > 1000 || get(keysOpened)[1] > 1e5),
    },
    // {
    //     item: 'key5',
    //     name: '[*****] Key [NOT IMPLEMENTED]',
    //     style: 'text-amber-400',
    //     stylebg: 'bg-amber-400',
    //     cost: {
    //         slurry: 1e11,
    //         sigils: 1e5,
    //     },
    //     craftTime: 3600, // in seconds
    //     baseAmount: 1,
    //     ratio: 1.06,
    //     unlockAt: () => (get(wallet)['key5'] > 0 || get(keysOpened)[4] > 0 || get(keysOpened)[3] > 1e5),
    // },
    // essences
    {
        item: 'efire',
        name: 'Fire Essence',
        style: 'text-red-500',
        stylebg: 'bg-red-500',
        cost: {
            fame: 1e15,
            energy: 1
        },
        craftTime: 180, // in seconds
        min: 2,
        max: 9,
        ratio: 1.1,
        unlockAt: () => (get(wallet)['totalFame'] > 1e15),
    },
    {
        item: 'eearth',
        name: 'Earth Essence',
        style: 'text-emerald-200',
        stylebg: 'bg-emerald-200',
        cost: {
            dust: 7500,
            energy: 1
        },
        craftTime: 180, // in seconds
        min: 2,
        max: 9,
        ratio: 1.1,
        unlockAt: () => (get(wallet)['dust'] > 7500),
    },
    {
        item: 'ewater',
        name: 'Water Essence',
        style: 'text-sky-300',
        stylebg: 'bg-sky-300',
        cost: {
            orbs: 1e15,
            energy: 1
        },
        craftTime: 180, // in seconds
        min: 2,
        max: 9,
        ratio: 1.1,
        unlockAt: () => (get(wallet)['orbs'] > 1e14),
    },
    {
        item: 'emagic',
        name: 'Magic Essence',
        style: 'text-amber-200',
        stylebg: 'bg-amber-200',
        cost: {
            sigils: 1e10,
            energy: 1
        },
        craftTime: 180, // in seconds
        min: 2,
        max: 9,
        ratio: 1.1,
        unlockAt: () => (get(wallet)['sigils'] > 1e10),
    },
    {
        item: 'ecelestial',
        name: 'Celestial Essence',
        style: 'text-transparent bg-clip-text bg-gradient-to-br from-fuchsia-300 to-violet-700',
        stylebg: 'bg-gradient-to-br from-fuchsia-300 to-violet-700',
        cost: {
            stars: 25,
            energy: 1
        },
        craftTime: 180, // in seconds
        min: 2,
        max: 9,
        ratio: 1.1,
        unlockAt: () => (get(wallet)['stars'] > 1),
    },


    /* NOTE!!!

    When adding a new item here, MAKE SURE to update the following:
    player.keyCraftFinishTimes
    player.keyCraftMastery

    */
])