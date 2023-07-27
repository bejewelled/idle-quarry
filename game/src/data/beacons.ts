
import { writable, get } from 'svelte/store';
import { miningUpgrades } from './mining';
import { miningUpgradeLevels, wallet, resources } from './player';
import { ascFormula } from './ascension';

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
    'Key Finder Yield',
    'Crafting Yield',
    'Key Droprate',
    'Droprate Multiplier II',
    'Antimatter Gain on Ascension']
    .concat(Array(26).fill(''))
)
export const beaconMiningLevelReqs = array([0,0,0,12,14,16,24,27,36,40])

export const beaconFormulas = array([
   /*beacon power*/ function(lv: number) {return 1 + (Math.pow(lv,0.65) * 0.01)},
   /*mining haste*/ function(lv: number) {return 1 + 3.125*(lv / (lv+40000))},
   /*droprate*/ function(lv: number) {return 1 + (Math.pow(lv,0.8) * 0.0035)},
   /*gem bonus*/ function(lv: number) {return 1 + Math.pow(lv,0.9)*0.02},
    /* fame bonus */ function(lv: number) {return 1 + Math.pow(lv,0.5)*0.02},
    /* key finder speed */ function(lv: number) {return 1 + Math.pow(lv, 0.5)*0.05},
    /* craft yield */ function(lv: number) {return 1 + (Math.pow(lv,1.2) * 0.000025)},
    /* key droprate */ function(lv: number) {return 1 + (Math.pow(lv,0.6) * 0.003)},
    /* droprate ii */ function(lv: number) {return 1 + (Math.pow(lv,0.5) * 0.001)},
    /* antimatter */ function(lv: number) {return 1 + (Math.pow(lv,0.65) * 0.004)},]
    .concat(Array(25).fill(function(lv: number) {return 1}))
)

export const beaconNextReqs = array(Array(3).fill(250)
.concat(Array(3).fill(5e7))
.concat(Array(2).fill(1e11)
.concat(Array(2).fill(1e17))))

export const baseBeaconNextReqs = array(Array(3).fill(250)
.concat(Array(3).fill(5e7))
.concat(Array(2).fill(1e11)
.concat(Array(2).fill(1e17))))

export const beaconNums = array(
    Array(3).fill([250, 1.0005])
    .concat(Array(3).fill([5e7, 1.0005])
    .concat(Array(2).fill([1e11, 1.0005])
    .concat(Array(2).fill([1e17, 1.0005])))))

export const beaconMaxLevels = array(Array(10).fill(1e6))



export const beaconSpendAmt = single(1);

export const beaconPowerFlavorText = single(1);

export const beaconUpgrades = array([{
    index: 0,
    name: 'Supercharged',
    description: 'Increases all beacon path progress.',
    cost: {
        beaconPower: 5000,
    },
    ratio: 1.33,
    formula: (lv: any) => (lv > 100 ? 
        26 + Math.pow((lv-100), 0.6)*0.2 :
        1 + 0.25*lv),
    mineLevelReq: 0,
    unlockAt: () => true,
    isPercent: true,
    prefix: '+',
    maxLevel: 300,
    notes: '0.25*lv until 36, (lv-36)*0.025 until 916, sqrt(lv-916)*0.025 after'
},
{
    index: 1,
    name: 'Shining Light',
    description: 'Increases the droprate for beacons (mining only).',
    cost: {
        beaconPower: 10000,
    },
    ratio: 2,
    formula: (lv: any) => 1 + 0.1*lv,
    mineLevelReq: 6,
    unlockAt: () => true,
    isPercent: false,
    prefix: 'x',
    suffix: '  droprate',
    maxLevel: 100,
    notes: '0.25*lv until 36, (lv-36)*0.025 until 916, sqrt(lv-916)*0.025 after'
},
{
    index: 2,
    name: 'Ramping Power',
    description: 'Unspent beacon power boosts beacon path progress. Upgrades multiply this amount.',
    cost: {
        beaconPower: 2.5e6,
    },
    ratio: 4,
    formula: (lv: any) => (lv === 0 ? 1 : 1 + Math.log((lv+1) * get(wallet)['beaconPower']/1e3 + 1) / Math.log(5)),
    mineLevelReq: 12,
    unlockAt: () => true,
    isPercent: true,
    suffix: ' bonus',
    maxLevel: 10,
    notes: ''
},
{
    index: 3,
    name: 'Angelic Intervention',
    description: 'Glory, oh glory. Beacons gain additional power based on the path\'s level.',
    cost: {
        antimatter: 8,
    },
    ratio: 2,
    formula: (lv: any) => 1 + lv*0.001,
    mineLevelReq: 12,
    unlockAt: () => ascFormula.getVal('celestial') >= 2,
    isPercent: true,
    suffix: ' per level',
    maxLevel: 50,
    notes: '',
    isCelestial: true,
},
{
    index: 4,
    name: 'Divine Blessing',
    description: 'Dramatically increases the effect of beacon levels on beacon power.',
    cost: {
        antimatter: 96,
    },
    ratio: 1.65,
    formula: (lv: any) => 1 + lv * 0.33,
    mineLevelReq: 12,
    unlockAt: () => ascFormula.getVal('celestial') >= 2,
    isPercent: true,
    suffix: ' increased level effectiveness',
    maxLevel: 50,
    notes: '',
    isCelestial: true,
}, 
{
    index: 5,
    name: '[???]',
    description: '[coming soon]',
    cost: {
        antimatter: 8294,
    },
    ratio: 1.65,
    formula: (lv: any) => lv * 0.33,
    mineLevelReq: 12,
    unlockAt: () => ascFormula.getVal('celestial') >= 3,
    isPercent: true,
    suffix: ' ???',
    maxLevel: 50,
    notes: '',
    isCelestial: true,
}, 
])