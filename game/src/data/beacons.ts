
import { writable, get } from 'svelte/store';
import { miningUpgrades } from './mining';
import { miningUpgradeLevels, wallet, resources } from './player';

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
                    console.log(item, val)
                    console.log(get(miningUpgradeLevels));
                    i[item]= [
                        Math.min(1,val[0] * (get(miningUpgrades)[2]['formula'](get(miningUpgradeLevels)[2]))),
                        val[1], 
                        val[2]
                    ]
                }
                return i;
            })
        }
    }
}


export const beaconPower = single(0);

export const beaconBonuses = array(Array(30).fill(1))

// for reference
export const beaconNameText = array([
    'Beacon Power Multiplier',
    'Mine Speed Multiplier',
    'Droprate Multiplier I',
    'Gem Bonus',
    'Fame Bonus',
    'Key Finder Speed',]
    .concat(Array(26).fill(''))
)
export const beaconMiningLevelReqs = array([0,0,0,12,12,12,20,20,30,30])

export const beaconFormulas = array([
   /*beacon power*/ function(lv: number) {return 1 + (Math.pow(lv,0.65) * 0.01)},
   /*mining haste*/ function(lv: number) {return 1 + 3.125*(lv / (lv+40000))},
   /*droprate*/ function(lv: number) {return 1 + (Math.pow(lv,0.8) * 0.003)},
   /*gem bonus*/ function(lv: number) {return 1 + Math.pow(lv,0.9)*0.02},
    /* fame bonus */ function(lv: number) {return 1 + Math.pow(lv,0.5)*0.02},
    /* key finder speed */ function(lv: number) {return 1 + Math.pow(lv, 0.5)*0.05}]
    .concat(Array(25).fill(function(lv: number) {return 1}))
)

export const beaconNextReqs = array(Array(3).fill(1e4)
.concat(Array(3).fill(1e8))
.concat(Array(2).fill(1e14)
.concat(Array(2).fill(1e23))))

export const baseBeaconNextReqs = array(Array(3).fill(1e4)
.concat(Array(3).fill(1e8))
.concat(Array(2).fill(1e14)
.concat(Array(2).fill(1e23))))

export const beaconNums = array(
    Array(3).fill([1e4, 1.0004])
    .concat(Array(3).fill([1e8, 1.0008])
    .concat(Array(2).fill([1e14, 1.0012])
    .concat(Array(2).fill([1e23, 1.0016])))))

export const beaconMaxLevels = array(Array(10).fill(1e6))



export const beaconSpendAmt = single(1);

export const beaconPowerFlavorText = single(1);

export const beaconUpgrades = array([{
    name: 'Supercharged',
    description: 'Increases all beacon path progress.',
    cost: {
        beaconPower: 5000,
    },
    ratio: 1.33,
    formula: (lv: any) => 1 + 0.25*lv,
    mineLevelReq: 0,
    isPercent: true,
    prefix: '+',
    maxLevel: 300,
    notes: '0.25*lv until 36, (lv-36)*0.025 until 916, sqrt(lv-916)*0.025 after'
},
{
    name: 'Shining Light',
    description: 'Each level in a beacon path gives beacons.',
    cost: {
        beaconPower: 100000,
    },
    ratio: 2.5,
    formula: (lv: any) => 0.025*lv,
    mineLevelReq: 6,
    isPercent: false,
    prefix: '+',
    suffix: ' beacons per level',
    maxLevel: 100,
    notes: '0.25*lv until 36, (lv-36)*0.025 until 916, sqrt(lv-916)*0.025 after'
},
{
    name: 'Ramping Power',
    description: 'Unspent beacon power boosts beacon path progress. Upgrades multiply this amount.',
    cost: {
        beaconPower: 2.5e6,
    },
    ratio: 4,
    formula: (lv: any) => (lv === 0 ? 1 : 1 + Math.log((lv+1) * get(resources)['beaconPower']/1e3 + 1) / Math.log(5)),
    mineLevelReq: 12,
    isPercent: true,
    suffix: ' bonus',
    maxLevel: 10,
    notes: ''
},])