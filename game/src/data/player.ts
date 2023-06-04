
import { writable, get } from 'svelte/store';
import ref from '../calcs/ref'
import { miningUpgrades } from './mining';
import { beaconUpgrades, beaconBonuses } from './beacons';

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
                i = {};
                for (let [item, val] of Object.entries(get(baseMiningDropTable))) {
                    i[item]= [
                        // add drop table multipliers here
                        val[0] * 
                            //@ts-ignore - Fortune (T1) item multiplier
                            (ref.dropTiers[item] === 1 ?
                            Math.max(get(miningUpgrades)[2]['formula'](get(miningUpgradeLevels)[2]),1)
                            : 1) 
                            * Math.max(1,get(miningUpgrades)[6]['formula'](get(miningUpgradeLevels)[6]))
                            * Math.max(1,get(miningUpgrades)[22]['formula'](get(miningUpgradeLevels)[22]))
                            * Math.max(1,get(beaconBonuses)[2]),
                           
                        //@ts-ignore
                        (val[1])
                        * get(miningUpgrades)[11]['formula'](get(miningUpgradeLevels)[11])
                        * (item === 'gold' ? get(miningUpgrades)[7]['formula'](get(miningUpgradeLevels)[7]) : 1),
                        //@ts-ignore
                        (val[2])
                        * get(miningUpgrades)[11]['formula'](get(miningUpgradeLevels)[11])
                        * (item === 'gold' ? get(miningUpgrades)[7]['formula'](get(miningUpgradeLevels)[7]) : 1),
                    ]
                    i[item][1] += Math.max(0,(i[item][0]-1)*i[item][1])
                    i[item][2] += Math.max(0,(i[item][0]-1)*i[item][1])

                }
                return i;
            })
        }
    }
}


// edit when changing the level of the haste upgrade
export const wallet = object({
    gems: 0,
    gold: 0,
})

export const resources = object({

})

export const unlockedRes = single(new Set());

export const visibleTier = single(1); 


export const progress = object({
    gems: 0,
    key1: 0
});



export const miningUpgradeLevelsBought = array(Array(200).fill(0));
export const miningUpgradeLevelsFree = array(Array(200).fill(0));
export const miningUpgradeLevels = array(Array(200).fill(0));

export const keyUpgradeLevels = array(Array(50).fill(0));

export const baseMiningDropTable = dropTable({
    gold: [0.20,1,3], // 10% chance to drop 1 gold
    key1: [0.025,1,1], 
    orbs: [0.01,10,50],
    beacons: [0.005,1,1],
    key2: [0.00075,1,1],
    key3: [1e-6,1,1],
    sigils: [0.0003,1,3]
});

export const miningDropTable = dropTable({
    gold: [0.20,1,3], // 10% chance to drop 1 gold
    key1: [0.025,1,1], 
    orbs: [0.01,10,50000],
    beacons: [0.005,1,1],
    key2: [0.00075,1,1],
    key3: [1e-6,1,1],
    sigils: [0.0003,1,3]
});


export const keysOpened = array(Array(5).fill(0))

export const settings = object({
    UPDATE_SPEED: 20,
    buyAmount: 1,
    activeTab: '',
})

export const flags = object({
    relocateNavBack: false,
})

export const keyItemsUnlocked = object({
    key1: new Set(),
    key2: new Set(),
    key3: new Set(),
    key4: new Set(),
    key5: new Set(),
})

// used for calculations
export const progressThisTick = object({})

// assuming dt=1, used for display text
export const progressAverage = object({})

export const beaconActivations = array(Array(30).fill(0))

export const beaconLevels = array(Array(30).fill(0))

export const beaconProgress = array(Array(30).fill(0))

export const beaconUpgradeLevels = array(Array(20).fill(0))


export const enchantUpgradeLevels = array(Array(20).fill(0))

export const automationItemsUnlocked = object({})

export const enchantProgress = object({
    t1: 0,
    t2: 0,
    t3: 0
})

export const activityLog = array([])

export const mineLevel = object({
    level: 0,
    xp: 0,
    xpNextReq: 100,
})

export const buttonNumClicks = object({
    okay: 0,
    good: 0,
    great: 0,
    excellent: 0,
    incredible: 0,
    perfect: 0
})

export const buttonStats = object({
    clicksUntilFame: 1e308,
    totalClicks: 0,
    totalClicksToday: 0,
    todayStartTime: Date.now(),
    hardenedBonus: 1,
})

export const buttonUpgradeLevels = array(Array(20).fill(0))

export const stats = object({
    lastRelocate: Date.now(),
})

export const keyCraftTimes = object({
    // [start, finish]
    energizedCrystal: [-1, -1], 
    key3: [-1, -1],
    key4: [-1, -1],
    key5: [-1, -1],
    beacons: [-1, -1],
})

export const keyCraftMastery = object({
    // [item]: [level, xp, xpNextReq]
    energizedCrystal: [1,0,3],
    key3: [1, 0, 100],
    key4: [1, 0, 100],
    key5: [1, 0, 100],
    beacons: [1 ,0, 100],
})

export const keyCraftAmount = object({
    energizedCrystal: 0,
    key3: 0,
    key4: 0,
    key5: 0,
    beacons: 0,
})

export const antiFlickerFlags = object({
    gems: false,
    key1: false,
    key2: false,
    key3: false,
    crafting: false,
    beacons: false,
})

export const saveVersion = single(0);

export const startOfGame = single(Date.now());

export const activityLogShow = object({})