
import { writable, get } from 'svelte/store';
import {wallet, miningUpgradeLevels, enchantUpgradeLevels, automationItemsUnlocked, challengesCompleted, ascensionStats} from './player'
import Decimal  from 'break_infinity.js';
import formula from '../calcs/formula';

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


// the number of mining operations until enchants will have a chance to proc
export const enchantThreshold = object({
    t1: 100,
    t2: 6475,
    t3: 1e9
})


// edit when changing the level of the haste upgrade
export const progressPerTick = single(1);


/* NOTE:
*  The cost of a specific item must be at least 1 to be imposed on the player.
*  If an upgrade should cost additional TYPES of resources at later levels, they must be added to the cost
*  object at a value of less than 1.
*/
export const enchantUpgrades = array([{
    name: 'Mine Size',
    description: 'Increases the size of your mine, which increases the effect of many enchants below..',
    cost: {
        fame: 10,
    },
    tier: 1,
    ratio: 1.3,
    formula: (lv: any) => lv + 5,
    extFormula: (lv: any) => lv + 5,
    unlockAt: () => (true),
    isPercent: false,
    suffix: ' tiles square',
    roundOverride: 0, // override rounding (base 3 digits)
    maxLevel: 1000,
    notes: ''
},
{
    name: 'Mine Quality',
    description: 'Increases the quality of your mine, which increases the effect of many enchants below.',
    cost: {
        fame: 10,
    },
    tier: 1,
    ratio: 1.3,
    formula: (lv: any) => lv + 5,
    extFormula: (lv: any) => lv + 5,
    unlockAt: () => (true),
    isPercent: false,
    suffix: ' quality rating',
    roundOverride: 0,
    maxLevel: 1000,
    notes: ''
},
{
    index: 2,
    name: 'Burst',
    description: 'Has a chance to clear a mine level, instantly giving mining cycles based on mine size.',
    cost: {
        fame: 30,
    },
    tier: 1,
    ratio: 10,
    formula: (lv: any) => (0.15/20) * lv,
    extFormula: (lv: number, size: number, quality: number) => lv * size * 3, // used for the enchant tooltip
    extPrefix: "You will gain ",
    extSuffix: " mining cycles on proc.",
    unlockAt: () => (get(wallet)['totalFame'] >= 100 || get(enchantUpgradeLevels)[0] > 0),
    isPercent: true,
    suffix: ' chance',
    maxLevel: 20,
    notes: ''
},
{
    index: 3,
    name: 'Orb Rush',
    description: 'Has a chance to give orbs based on mine quality.',
    cost: {
        fame: 30
    },
    tier: 1,
    ratio: 10,
    formula: (lv: any) => (0.12/20) * lv,
    extFormula: (lv: number, size: number, quality: number) => lv * (quality ** 3.8) + 20*(quality ** 2),
    extPrefix: "You will gain ",
    extSuffix: " orbs on proc.",
    unlockAt: () => (get(wallet)['totalFame'] >= 100 || get(enchantUpgradeLevels)[0] > 0),
    isPercent: true,
    suffix: '  chance',
    maxLevel: 20,
    notes: ''
},
{
    index: 4,
    name: 'Lightning Blast',
    description: 'Has a chance to significantly increase mining speed for 3 seconds, based on mine size.',
    cost: {
        fame: 2500,
    },
    tier: 1,
    ratio: 25,
    formula: (lv: any) => (0.02/20) * lv,
    extFormula: (lv: number, size: number, quality: number) => 2 + Math.pow(size, 0.5), // used for the enchant tooltip
    extPrefix: "Your mining speed will be increased by ",
    extSuffix: "x for 3 seconds on proc.",
    unlockAt: () => (get(wallet)['totalFame'] >= 1e3),
    isPercent: true,
    suffix: '  chance',
    maxLevel: 20,
    notes: ''
},
{
    index: 5,
    name: 'Scavenger',
    description: 'Has a chance to increase a random mining upgrade level by 1.',
    cost: {
        fame: 2500,
    },
    tier: 1,
    ratio: 25,
    formula: (lv: any) => Math.pow(lv/20, 2) * 0.05,
    extFormula: (lv: number, size: number, quality: number) => 1,
    unlockAt: () => (get(wallet)['totalFame'] >= 1e3),
    isPercent: true,
    suffix: '  chance',
    maxLevel: 20,
    notes: ''
},
{
    index: 6,
    name: 'Nuclear Fission',
    description: 'Gives radioactivity, based on mine size and quality.',
    cost: {
        fame: 1e11,
    },
    tier: 1,
    ratio: 100,
    formula: (lv: any) => Math.sqrt(lv)*0.0045645,
    extFormula: (lv: number, size: number, quality: number) => (size * quality * 12),
    extPrefix: "You will gain ",
    extSuffix: " radioactivity on proc.",
    unlockAt: () => (get(wallet)['totalFame'] >= 1e6),
    isPercent: true,
    suffix: '  chance',
    maxLevel: 30,
    notes: ''
},
{
    index: 7,
    name: 'Key Caller',
    description: 'Gives keys of a random tier 1-3. The amount is based on size and quality.',
    cost: {
        fame: 1e11,
    },
    tier: 1,
    ratio: 100,
    formula: (lv: any) => (lv/30)*0.05 + (lv>0 ? 0.005 : 0),
    // vv key1 base; key2 and key3 values would be divide
    extFormula: (lv: number, size: number, quality: number) => (size**1.6) * (quality**1.6) * ((lv+3)/3),
    unlockAt: () => (get(wallet)['totalFame'] >= 1e6),
    isPercent: true,    
    extPrefix: "You will gain ",
    extSuffix: " [*] keys, reduced for higher tiers.",
    suffix: '  chance',
    maxLevel: 30,
    notes: ''
},
{
    index: 8,
    name: 'Rift Tearing',
    description: 'Has a chance to open a rift in the mine, giving essence.',
    cost: {
        fame: 1e18,
    },
    tier: 2,
    ratio: 1e12,
    formula: (lv: any) => (lv/10) * 0.16,
    extFormula: (lv: number, size: number, quality: number) => Math.floor(1 + Math.pow(size / 100, 0.6)),
    extPrefix: "You will gain ",
    extSuffix: " of a random essence on proc.",
    unlockAt: () => (get(wallet)['totalAntimatter'] > 0 || get(wallet)['antimatter'] > 0),
    isPercent: true,
    suffix: '  chance',
    maxLevel: 10,
    notes: ''
},
{
    index: 9,
    name: 'Double Down',
    description: 'Has a chance to immediately add enchant progress.',
    cost: {
        fame: 1e18,
    },
    tier: 2,
    ratio: 1e12,
    formula: (lv: any) => (lv/10) * 0.5,
    extFormula: (lv: number, size: number, quality: number) => Math.floor(1 + (size/20) * (quality/20)),
    extPrefix: "You will gain ",
    extSuffix: " enchant progress (for all tiers) on proc.",
    unlockAt: () => (get(wallet)['totalAntimatter'] > 0 || get(wallet)['antimatter'] > 0),
    isPercent: true,
    suffix: '  chance',
    maxLevel: 10,
    notes: ''
},

]);


export const enchantTierUnlockAt = array([
    () => true,
    () => (get(wallet)['antimatter'] > 0 || get(wallet)['totalAntimatter'] > 0),
])



export const automationUpgrades = array([{
    index: 0,
    name: 'Jumpstart',
    description: 'Start with 5000 gems and 100 gold.',
    cost: {
        fame: 100,
    },
    unlockAt: () => (get(wallet)['totalFame'] >= 1),
    isPercent: true,
    suffix: ' chance',
},
{
    index: 1,
    name: 'Deep Pockets',
    description: 'Lootmaster I is automatially unlocked and stays unlocked on relocate.',
    cost: {
        fame: 2150,
    },
    unlockAt: () => (get(wallet)['totalFame'] >= 1),
    isPercent: true,
    suffix: ' chance',
},
{
    index: 1,
    name: 'Deep Pockets II',
    description: 'Lootmaster II is automatially unlocked and stays unlocked on relocate.',
    cost: {  
        trophies: 5,
    },
    unlockAt: () => (get(wallet)['trophies'] >= 1 && get(miningUpgradeLevels)[9] >= 1),
    isPercent: false,
    suffix: '---',
},
{
    index: 1,
    name: 'Deep Pockets III',
    description: 'Lootmaster III is automatially unlocked and stays unlocked on ascension.',
    cost: {
        void: 5,
    },
    unlockAt: () => (get(wallet)['void'] >= 1),
    isPercent: true,
    suffix: ' chance',
},
{
    index: 2,
    name: 'Beacon Tools',
    description: 'Unlock the ability to split beacons evenly across all paths, and to recall all beacons at once.',
    cost: {
        fame: 2500,
    },
    unlockAt: () => (get(wallet)['totalFame'] >= 1),
    isPercent: true,
    suffix: ' chance',
},
{
    index: 3,
    name: 'Omnipotent',
    description: 'Except for Lootmaster upgrades, mining upgrades are not reset on relocation.',
    cost: {
        fame: 25000,
    },
    unlockAt: () => (get(wallet)['totalFame'] >= 1),
    isPercent: true,
    suffix: ' chance',
},
{
    index: 4,
    name: 'Masterful',
    description: 'Unlocks Mastery.',
    cost: {
        fame: 100000,
    },
    unlockAt: () => (get(wallet)['totalFame'] >= 1),
    isPercent: true,
    suffix: ' chance',
},
{
    index: 5,
    name: 'Another Button',
    description: 'You can now hold enter to click the button really really fast (you will only get "okay" clicks).',
    cost: {
        trophies: 1,
    },
    unlockAt: () => (get(wallet)['trophies'] >= 1e297 || formula.sumArray(get(challengesCompleted)) > 1e20),
    isPercent: false,
},
{
    index: 6,
    name: 'Beaconizer',
    description: 'Start each relocation with 50,000 beacons. Gain 15 beacons per second.',
    cost: {
        trophies: 4,
    },
    unlockAt: () => (get(wallet)['trophies'] >= 1 || formula.sumArray(get(challengesCompleted)) > 0),
    isPercent: true,
},
{
    index: 7,
    name: 'Beacon Tools II',
    description: 'You can now "smart split" beacons among chosen paths.',
    cost: {
        trophies: 4,
    },
    unlockAt: () => (get(wallet)['trophies'] >= 1 || formula.sumArray(get(challengesCompleted)) > 0),
    isPercent: true,
},
{
    index: 8,
    name: 'Unlimited Power!',
    description: 'Beacon power (and its upgrades) are not reset on relocation.',
    cost: {
        trophies: 2,
    },
    unlockAt: () => (get(wallet)['trophies'] >= 1 || formula.sumArray(get(challengesCompleted)) > 0),
    isPercent: true,
},
{
    index: 9,
    name: 'Spellcaster',
    description: 'You can trigger enchants 10% faster.',
    cost: {
        trophies: 5,
    },
    unlockAt: () => (get(wallet)['trophies'] >= 1 || formula.sumArray(get(challengesCompleted)) > 0),
    isPercent: true,
},
{
    index: 11,
    name: 'Spellcaster II',
    description: 'You can trigger enchants an additional 10% faster.',
    cost: {
        dust: 1e6,
        trophies: 5,
    },
    unlockAt: () => (get(automationItemsUnlocked)['spellcaster'] !== undefined),
    isPercent: true,
},
{
    index: 12,
    name: '[unimplemented]',
    description: '---',
    cost: {
        antimatter: 4500000,
    },
    unlockAt: () => (get(wallet)['antimatter'] >= 1e29 || get(wallet)['totalAntimatter'] >= 1e29),
    isPercent: true,
},
{
    index: 13,
    name: 'Abundance',
    description: 'Key Finder 1-3 gains a 4,096x / 16x / 2x multiplier to yield.',
    cost: {
        antimatter: 270,
    },
    unlockAt: () => (get(wallet)['antimatter'] >= 1 || get(wallet)['totalAntimatter'] >= 1),
    isPercent: true,
    noResetAscension: true,
},
{
    index: 14,
    name: 'Gateway',
    description: 'T2 [**] keys can give T3 [***] keys.',
    cost: {
        antimatter: 20,
    },
    unlockAt: () => (get(wallet)['antimatter'] >= 1 || get(wallet)['totalAntimatter'] >= 1),
    isPercent: true,
    noResetAscension: true,
},
{
    index: 15,
    name: 'Auto-fission',
    description: 'Gain 1 radium; start each ascension with 1 radium.',
    cost: {
        antimatter: 160,
    },
    unlockAt: () => (get(wallet)['antimatter'] >= 1 || get(wallet)['totalAntimatter'] >= 1),
    isPercent: true,
    noResetAscension: true,
},
{
    index: 16,
    name: 'Robotic',
    description: 'All augments are kept on ascension.',
    cost: {
        antimatter: 300,
    },
    unlockAt: () => (get(wallet)['antimatter'] >= 1 || get(wallet)['totalAntimatter'] >= 1),
    isPercent: true,
    noResetAscension: true,
},
{
    index: 17,
    name: 'Irreversible Greed',
    description: 'Fortune slightly increases mining droprate softcaps.',
    cost: {
        antimatter: 65,
    },
    unlockAt: () => (get(ascensionStats)['ascensionCount'] >= 2 || get(wallet)['totalAntimatter'] >= 100),
    isPercent: true,
    noResetAscension: true,
},
{
    index: 18,
    name: 'Artificer',
    description: 'T3 [***] keys can drop T4 [****] keys.',
    cost: {
        antimatter: 24000,
    },
    unlockAt: () => (get(ascensionStats)['ascensionCount'] >= 7),
    isPercent: true,
    noResetAscension: true,
},




]);