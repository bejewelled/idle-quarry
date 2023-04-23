
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
    'Mining Progress Multiplier',
    'Droprate Multiplier I',
    'Gem Bonus']
    .concat(Array(26).fill(''))
)

export const beaconFormulas = array([
   /*beacon power*/ function(lv: number) {return 1 + (Math.pow(lv,0.6) * 0.005)},
   /*mining haste*/ function(lv: number) {return 1 + (Math.pow(lv,0.15) * (Math.log(lv+1)/Math.log(2) * 0.004))},
   /*droprate*/ function(lv: number) {return 1 + (Math.pow(lv,0.9) * 0.00025)},
   /*gem bonus*/ function(lv: number) {return 1 + Math.pow(lv,1.1)*0.2}]
    .concat(Array(27).fill(function(lv: number) {return 1}))
)

export const beaconNextReqs = array(Array(3).fill(1e4)
.concat(Array(3).fill(1e8))
.concat(Array(2).fill(1e12)
.concat(Array(2).fill(1e16))))

export const baseBeaconNextReqs = array(Array(3).fill(1e4)
.concat(Array(3).fill(3e6))
.concat(Array(2).fill(9e8)
.concat(Array(2).fill(2.7e10))))

export const beaconNums = array(
    Array(3).fill([1e4, 1.0004])
    .concat(Array(3).fill([3e6, 1.0008])
    .concat(Array(2).fill([9e8, 1.0012])
    .concat(Array(2).fill([2.7e10, 1.0016])))))

export const beaconMaxLevels = array([1.6e6, 1.6e6, 1.6e6, 8e5, 8e5, 8e5, 4e5, 4e5, 2e5, 2e5])



export const beaconSpendAmt = single(1);

export const beaconPowerFlavorText = single(1);

export const beaconUpgrades = array([{
    name: 'Supercharged',
    description: 'Increases all beacon path progress.',
    cost: {
        beaconPower: 5000,
    },
    ratio: 1.5,
    formula: (lv: any) => 0.3325*lv,
    isPercent: true,
    prefix: '+',
    maxLevel: 300,
    notes: '0.25*lv until 36, (lv-36)*0.025 until 916, sqrt(lv-916)*0.025 after'
},
{
    name: 'Shining Light',
    description: 'Every 10 levels gained in a path gives beacons.',
    cost: {
        beaconPower: 100000,
    },
    ratio: 2.5,
    formula: (lv: any) => 0.75*lv,
    isPercent: false,
    prefix: '+',
    suffix: ' *[log10(path level)]',
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
    formula: (lv: any) => (lv === 0 ? 1 : Math.log(get(resources)['beaconPower']/1e3 + 1) / Math.log(1 + 8 - lv*0.5)),
    isPercent: true,
    suffix: ' bonus',
    maxLevel: 10,
    notes: ''
},])