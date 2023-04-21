
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
                        Math.min(1,val[0] * 
                            //@ts-ignore - Fortune (T1) item multiplier
                            (ref.dropTiers[item] === 1 ?
                            get(miningUpgrades)[2]['formula'](get(miningUpgradeLevels)[2]) *
                            get(beaconBonuses)[2]
                            : 1) *
                            get(miningUpgrades)[6]['formula'](get(miningUpgradeLevels)[6])),
                        //@ts-ignore
                        val[1],
                        //@ts-ignore
                        val[2]
                    ]
                    console.log(i[item])
                    if (item === 'gold') {
                        i[item][1] = val[1] * get(miningUpgrades)[7]['formula'](get(miningUpgradeLevels)[7]);
                        i[item][2] = val[2] * get(miningUpgrades)[7]['formula'](get(miningUpgradeLevels)[7]);
                        console.log(i);
                    }
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



export const miningUpgradeLevels = array(Array(20).fill(0));

export const baseMiningDropTable = dropTable({
    gold: [0.20,1,4], // 10% chance to drop 1 gold
    key1: [0.05,1,1], 
    orbs: [0.01,1,2],
    beacons: [0.005,1,1]
});

export const miningDropTable = dropTable({

});


export const keysOpened = array(Array(5).fill(0))

export const settings = object({
    UPDATE_SPEED: 20,
    buyAmount: 1,
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