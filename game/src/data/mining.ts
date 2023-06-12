
import { writable, get } from 'svelte/store';
import {wallet, miningUpgradeLevels, 
    enchantUpgradeLevels,buttonNumClicks,buttonStats} from './player'
import formula from '../calcs/formula';
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

export const progressThreshold = object({
    gems: 167,
    key1: 2000,
    key2: 50000,
    key3: 390000,
})

// edit when changing the level of the hastpe upgrade
export const progressPerTick = single(1);


/* NOTE:
*  The cost of a specific item must be at least 1 to be imposed on the player.
*  If an upgrade should cost additional TYPES of resources at later levels, they must be added to the cost
*  object at a value of less than 1.
*/
export const miningUpgrades = array([{
    index: 0,
    name: 'Haste',
    description: 'Increases base mining speed.',
    cost: {
        gems: 5,
    },
    ratio: 1.15,
    formula: (lv: any) => (lv > 100 ? 11 + Math.pow((lv-100)*0.1, 0.75)
    : lv * 0.1 + 1),
    unlockAt: () => (get(wallet)['gems'] >= 1),
    suffix: 'x speed',
    isPercent: false,
    maxLevel: 1000,
    notes: '0.25*lv until 36, (lv-36)*0.025 until 916, sqrt(lv-916)*0.025 after'
},
{
    index: 1,
    name: 'Efficiency',
    description: 'Increases gem yield. Improved after level 100.',
    cost: {
        gems: 10,
    },
    ratio: 1.15,
    unlockAt: () => (get(wallet)['gems'] >= 3 && get(miningUpgradeLevels)[0] >= 1),
    formula: (lv: any) => lv * (1 + 0.01*lv) * (lv > 100 ? 1+0.03*(lv-100) : 1),
    isPercent: false,
    prefix: '+',
    suffix: ' gems',
    maxLevel: 1000,
    notes: '(1 + floor(level/10)) * level^0.6'
},
// i = 2
{
    index: 2,
    name: 'Fortune',
    description: 'Improves mining droprates for gold and [*] keys.',
    cost: {
        gold: 10
    },
    ratio: 1.275,
    unlockAt: () => (get(wallet)['gems'] > 30 && get(wallet)['gold'] > 5),
    formula: (lv: any) => 1 + lv*0.09,
    isPercent: true,
    prefix: '+',
    maxLevel: 1000,
    notes: '(1 + floor(level/10)) * level^0.6'  
},
{
    index: 3,
    name: '[*] Key Finder',
    description: 'While mining, you will occasionally find a bundle of T1 [*] keys.' 
    + '\nUpgrades increase progress gained towards this milestone.',
    cost: {
        orbs: 40,
        key1: 10
    },
    ratio: 1.5,
    unlockAt: () => (get(wallet)['key1'] >= 1),
    formula: (lv: any) => (1 + Math.max(0,Math.pow(lv-1, 0.6)*0.15)),
    isPercent: false,
    suffix: 'x speed',
    maxLevel: 500,
    notes: '(1 + floor(level/10)) * level^0.6' 
},
{
    index: 4,
    name: '[**] Key Finder',
    description: 'While mining, you will occasionally find a bundle of T2 [**] keys.' 
    + '\nUpgrades increase progress gained towards this milestone.',
    cost: {
        orbs: 1e6,
        key2: 10,
    },
    ratio: 1.5,
    unlockAt: () => (get(wallet)['key2'] >= 1),                 
    formula: (lv: any) => (1 + Math.pow(lv, 0.5)*0.15),
    isPercent: false,
    suffix: 'x speed',
    maxLevel: 500,
    notes: '' 
},
// i = 5
{
    index: 5,
    name: 'Key Mastery',
    description: 'Increases the number of keys found when a Key Finder of any rarity triggers.',
    cost: {
        orbs: 200,
    },
    ratio: 1.25,
    unlockAt: () => (get(miningUpgradeLevels)[3] > 0),
    formula: (lv: any) => (1 + lv * 0.1),
    isPercent: false,
    suffix: 'x keys',
    maxLevel: 1000,
    notes: ''
},
{
    index: 6,
    name: 'Lootmaster I',
    description: 'Unlocks a new tier of findable drops.',
    cost: {
        gems: 1e5,
        gold: 750,
    },
    ratio: 1.25,
    unlockAt: () => ((get(miningUpgradeLevels)[0] >= 10 && get(miningUpgradeLevels)[1] >= 10)
    || get(miningUpgradeLevels)[6] > 0),
    formula: (lv: any) => lv,
    isPercent: false,
    maxLevel: 1,
    notes: ''
},
{
    index: 7,
    name: 'Shiny',
    description: 'Gold drops are significantly improved.',
    cost: {
        gems: 1000,
    },
    ratio: 1.25,
    unlockAt: () => (get(miningUpgradeLevels)[0] >= 10 && get(miningUpgradeLevels)[1] >= 10),
    formula: (lv: any) => (1 + lv*0.25),
    isPercent: false,
    suffix: 'x gold from drops',
    maxLevel: 1000,
    notes: ''
},
// i = 8
{
    index: 8,
    name: 'Efficiency II',
    description: 'Increases gem yield again.',
    cost: {
        gems: 2500,
    },
    ratio: 1.25,
    unlockAt: () => (get(miningUpgradeLevels)[0] >= 10 && get(miningUpgradeLevels)[1] >= 10),
    formula: (lv: any) => (1+lv*(0.25+0.002*lv)),
    isPercent: true,
    prefix: '+',
    suffix: ' gems',
    maxLevel: 500,
    notes: ''
},
{
    index: 9,
    name: 'Lootmaster II',
    description: 'Unlocks a new tier of findable drops.',
    cost: {
        orbs: 1e5,
        beacons: 100,
    },
    ratio: 1.25,
    unlockAt: () => (get(miningUpgradeLevels)[6] >= 0.997 || get(miningUpgradeLevels)[9] > 0),
    formula: (lv: any) => (0),
    isPercent: false,
    suffix: ' (no bonus)',
    maxLevel: 1,
    notes: ''
},
// i = 10
{
    index: 10,
    name: 'Expansive',
    description: 'Significantly improves gem gains. Improved after level 100.',
    cost: {
        fame: 5
    },
    ratio: 1.4,
    unlockAt: () => (get(wallet)['fame'] > 0),
    formula: (lv: any) => (lv > 100 ? 
        151 + (lv-100)*6 :
        1 + lv*1.5),
    isPercent: true,
    prefix: '+',
    noResetRelocate: true,
    suffix: ' gem bonus',
    maxLevel: 1000,
    style: 'game-btn-fame',
    notes: 'index 10'
},
{
    index: 11,
    name: 'Clockwork',
    description: 'Significantly improves mining drop quantity.',
    cost: {
        fame: 5
    },
    ratio: 1.4,
    unlockAt: () => (get(wallet)['fame'] > 0),
    formula: (lv: any) => (1 + lv * 0.3),
    isPercent: false,
    noResetRelocate: true,
    suffix: 'x amount from drops',
    maxLevel: 1000,
    style: 'game-btn-fame',
    notes: ''
},
// i = 12
{
    index: 12,
    name: 'Reflectors',
    description: 'Significantly improves beacon path progress.',
    cost: {
        fame: 10
    },
    ratio: 1.4,
    unlockAt: () => (get(wallet)['fame'] > 0),
    formula: (lv: any) => (1 + lv),
    isPercent: true,
    prefix: '+',
    suffix: ' beacon progress',
    noResetRelocate: true,
    maxLevel: 1000,
    style: 'game-btn-fame',
    notes: 'index 10'
},
{
    index: 13,
    name: 'Mythical',
    description: 'Increases key open droprates when using keys. Note that some drop chances are capped.',
    cost: {
        fame: 100
    },
    ratio: 1.4,
    unlockAt: () => (get(wallet)['fame'] > 0),
    formula: (lv: any) => 1 + 0.25*Math.pow(lv, 0.75),
    isPercent: false,
    noResetRelocate: true,
    prefix: 'x',
    suffix: ' key droprates',
    maxLevel: 100,
    style: 'game-btn-fame',
    notes: ''
},
{
    index: 14,
    name: 'Lootmaster III',
    description: 'Unlocks a new tier of findable drops.',
    cost: {
        crystals: 1e7,
        slurry: 1e6,
        warp: 1e4,
        sigils: 1e4,
        trophies: 3,
        artifacts: 1,

    },
    ratio: 1e90,
    unlockAt: () => ((get(wallet)['fame'] > 0 && get(miningUpgradeLevels)[9] > 0.003)
    || get(miningUpgradeLevels)[14] > 0),
    formula: (lv: any) => (0),
    isPercent: true,
    noResetRelocate: true,
    suffix: ' (no bonus)',
    maxLevel: 1,
    style: 'game-btn-fame',
    notes: ''
},
// i = 15
{
    index: 15,
    name: 'Overload',
    description: 'Drop chances above 100% increase the amount of drops.',
    cost: {
        fame: 1200,

    },
    ratio: 200,
    unlockAt: () => (get(wallet)['totalFame'] > 200),
    formula: (lv: any) => (0),
    noResetRelocate: true,
    isPercent: true,
    suffix: '  (N/A)',
    maxLevel: 1,
    style: 'game-btn-fame',
    notes: 'index 15'
},
{
    index: 16,
    name: 'Legendary',
    description: 'Increases fame gain on relocation.',
    cost: {
        gems: 1e7,

    },
    ratio: 1.5,
    unlockAt: () => (get(wallet)['totalFame'] > 200),
    formula: (lv: any) => (1 + (lv * 0.13)),
    isPercent: true,
    suffix: '  fame bonus',
    maxLevel: 500,
    noResetRelocate: false,
    notes: 'index 16'
},
// i = 17
{
    index: 17,
    name: 'Legendary II',
    description: 'Increases fame gain on relocation.',
    cost: {
        gold: 1e6,

    },
    ratio: 1.5,
    unlockAt: () => (get(wallet)['totalFame'] > 200),
    formula: (lv: any) => (1 + (lv * 0.13)),
    isPercent: true,
    suffix: '  fame bonus',
    maxLevel: 500,
    noResetRelocate: false,
    notes: 'index 16'
},
{
    index: 18,
    name: '[***] Key Finder',
    description: 'While mining, you will occasionally find a bundle of T3 [***] keys.' 
    + '\nUpgrades increase progress gained towards this milestone.',
    cost: {
        orbs: 1e8,
        key3: 10,
    },
    ratio: 1.5,
    unlockAt: () => (get(wallet)['key3'] > 0),
    formula: (lv: any) => (1 + Math.max(0,Math.pow(lv-1, 0.6)*0.15)),
    isPercent: false,
    suffix: 'x speed',
    maxLevel: 400,
    notes: '(1 + floor(level/10)) * level^0.6' 
},
{
    index: 19,
    name: 'Legendary III',
    description: 'Increases fame gain on relocation.',
    cost: {
        sigils: 2500
    },
    ratio: 2,
    unlockAt: () => (get(wallet)['sigil'] > 25),
    formula: (lv: any) => (1 + 0.1 * lv),
    isPercent: false,
    suffix: 'x fame gain',
    style: 'game-btn-sigil',
    maxLevel: 300,
    notes: '(1 + floor(level/10)) * level^0.6' 
},
{
    index: 20,
    name: 'Hardened',
    description: 'Your lifetime number of quality button clicks increase gem gain.',
    cost: {
        crystals: 400,
    },
    ratio: 1.33,
    unlockAt: () => (get(wallet)['crystals'] > 0),
    formula: (lv: any) =>  formula.dispCalcHardenedGemBonus(get(buttonNumClicks), lv),
    isPercent: true,
    suffix: ' gems',
    maxLevel: 1000,
    style: 'game-btn-crystal',
    notes: '(1 + floor(level/10)) * level^0.6' 
},
{
    index: 21,
    name: 'PLACEHOLDER',
    description: '---',
    cost: {
        crystals: 1e299,
    },
    ratio: 1.33,
    unlockAt: () => (get(wallet)['crystals'] > 1e299),
    formula: (lv: any) =>  formula.dispCalcHardenedGemBonus(get(buttonNumClicks), lv),
    isPercent: true,
    suffix: ' gems',
    maxLevel: 100,
    style: 'game-btn-crystal',
    notes: '(1 + floor(level/10)) * level^0.6' 
},
{
    index: 22,
    name: 'Fortune II',
    description: 'Increases all droprates.',
    cost: {
        gems: 1e11,
    },
    ratio: 1.8,
    unlockAt: () => (get(wallet)['crystals'] > 0),
    formula: (lv: any) =>  1 + lv/10,
    isPercent: false,
    suffix: 'x droprates',
    maxLevel: 400,
},
{
    index: 23,
    name: 'Geodes',
    description: 'Increases crystal gain from the button.',
    cost: {
        gems: 1e13,
    },
    ratio: 1.8,
    unlockAt: () => (get(wallet)['crystals'] > 0),
    formula: (lv: any) =>  1 + lv/4,
    isPercent: true,
    prefix: '+',
    suffix: ' crystal gain',
    maxLevel: 400,
},
{
    index: 24,
    name: 'Blinding Lights',
    description: 'Increases beacon path progress.',
    cost: {
        gems: 1e14,
    },
    ratio: 1.8,
    unlockAt: () => (get(wallet)['crystals'] > 0),
    formula: (lv: any) =>  1 + lv/4,
    isPercent: true,
    prefix: '+',
    suffix: ' beacon progress',
    maxLevel: 400,
},
{
    index: 25,
    name: 'Efficiency III',
    description: 'Increases gem gain again.',
    cost: {
        crystals: 1e6,
    },
    ratio: 1.3,
    unlockAt: () => (get(wallet)['crystals'] > 0),
    formula: (lv: any) =>  1 + Math.pow(lv, 0.9)*0.75,
    isPercent: true,
    prefix: '+',
    suffix: ' gem gain',
    style: 'game-btn-crystal',
    maxLevel: 500,
},
{
    index: 26,
    name: 'Lockpicks',
    description: 'Key Finder speed/amount is dramatically increased.',
    cost: {
        fame: 2500
    },
    ratio: 1.4,
    unlockAt: () => (get(wallet)['fame'] > 0),
    formula: (lv: any) => 1 + lv*0.75,
    noResetRelocate: true,
    isPercent: false,
    suffix: 'x speed/amount',
    maxLevel: 250,
    style: 'game-btn-fame',
    notes: ''
},

]);



// for flavor text on mining page
export const gemGainFlavorText = single(0)
export const gemProgressFlavorText = single(0)
export const gemProgressFlavorNextUpdate = single(Date.now() + 500)

