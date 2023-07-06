
import { writable, get } from 'svelte/store';
import {wallet, miningUpgradeLevels, enchantUpgradeLevels, automationItemsUnlocked, challengesCompleted} from './player'
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
    t2: 40000,
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
    description: 'Increases your mine size, which increases the effect of many enchants below..',
    cost: {
        fame: 10,
    },
    tier: 1,
    ratio: 1.25,
    formula: (lv: any) => pow(lv+5,2),
    unlockAt: () => (true),
    isPercent: false,
    suffix: ' tiles',
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
    ratio: 1.25,
    formula: (lv: any) => (lv*lv) + 10,
    unlockAt: () => (true),
    isPercent: false,
    suffix: ' quality rating',
    maxLevel: 1000,
    notes: ''
},
{
    index: 2,
    name: 'Burst',
    description: 'Has a chance to clear a mine level, instantly giving mining cycles (the number of mining cycles is equal to mine size).',
    cost: {
        fame: 30,
    },
    tier: 1,
    ratio: 1.25,
    formula: (lv: any) => (0.15/400) * lv,
    unlockAt: () => (get(wallet)['fame'] >= 100 || get(enchantUpgradeLevels)[0] > 0),
    isPercent: true,
    suffix: ' chance',
    maxLevel: 400,
    notes: ''
},
{
    index: 3,
    name: 'Orb Rush',
    description: 'Has a chance to give orbs based on mine quality.',
    cost: {
        fame: 30,
        gems: 1e7
    },
    tier: 1,
    ratio: 1.25,
    formula: (lv: any) => (0.12/400) * lv,
    unlockAt: () => (get(wallet)['fame'] >= 100 || get(enchantUpgradeLevels)[0] > 0),
    isPercent: true,
    suffix: '  chance',
    maxLevel: 400,
    notes: ''
},
{
    index: 4,
    name: 'Lightning Blast',
    description: 'Has a chance to dramatically increase mining speed for 3 seconds (speed based on mine size).',
    cost: {
        fame: 2500,
    },
    tier: 1,
    ratio: 1.3,
    formula: (lv: any) => (0.02/400) * lv,
    unlockAt: () => (get(wallet)['totalFame'] >= 100 || get(enchantUpgradeLevels)[0] > 0),
    isPercent: true,
    suffix: '  chance',
    maxLevel: 400,
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
    ratio: 1.3,
    formula: (lv: any) => Math.pow(lv/400, 2) * 0.05,
    unlockAt: () => (get(wallet)['totalFame'] >= 100 || get(enchantUpgradeLevels)[0] > 0),
    isPercent: true,
    suffix: '  chance',
    maxLevel: 400,
    notes: ''
},
{
    index: 6,
    name: 'Key Boon',
    description: 'Gives you keys. Mine size increases key amount, mine quality increases the chance for higher tier keys.',
    cost: {
        fame: 1e6,
    },
    tier: 1,
    ratio: 1.32,
    formula: (lv: any) => (lv/400) * 0.025,
    unlockAt: () => (get(wallet)['totalFame'] >= 1e4 || get(enchantUpgradeLevels)[0] >= 25),
    isPercent: true,
    suffix: '  chance',
    maxLevel: 400,
    notes: ''
},
{
    index: 7,
    name: 'Clicker Hero',
    description: '"Clicks" the button for you. Mine size increases crystal gain, Mine quality increases click quality.',
    cost: {
        fame: 1e6,
    },
    tier: 1,
    ratio: 1.32,
    formula: (lv: any) => (lv/400) * 0.5,
    unlockAt: () => (get(wallet)['totalFame'] >= 1e4 || get(enchantUpgradeLevels)[0] > 0),
    isPercent: true,
    suffix: '  chance',
    maxLevel: 400,
    notes: ''
},
{
    index: 8,
    name: 'Rift Tearing',
    description: 'Has a chance to open a rift in the mine, giving essence.',
    cost: {
        fame: 1e18,
    },
    tier: 1,
    ratio: 1.34,
    formula: (lv: any) => (lv/200) * 0.02,
    unlockAt: () => (get(wallet)['totalAntimatter'] > 0 || get(wallet)['antimatter'] > 0),
    isPercent: true,
    suffix: '  chance',
    maxLevel: 200,
    notes: ''
},
{
    index: 9,
    name: 'Double Down',
    description: 'Has a chance to immediately trigger the next enchant cycle.',
    cost: {
        fame: 1e18,
    },
    tier: 1,
    ratio: 1.34,
    formula: (lv: any) => (lv/200) * 0.1,
    unlockAt: () => (get(wallet)['totalAntimatter'] > 0 || get(wallet)['antimatter'] > 0),
    isPercent: true,
    suffix: '  chance',
    maxLevel: 200,
    notes: ''
},

]);




export const automationUpgrades = array([{
    index: 0,
    name: 'Jumpstart',
    description: 'Start with 5000 gems and 100 gold.',
    cost: {
        fame: 100,
    },
    unlockAt: () => (get(wallet)['fame'] >= 1),
    isPercent: true,
    suffix: ' chance',
},
{
    index: 1,
    name: 'Deep Pockets',
    description: 'Lootmaster I is automatially unlocked and stays unlocked on relocate.',
    cost: {
        fame: 1850,
    },
    unlockAt: () => (get(wallet)['fame'] >= 1),
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
    unlockAt: () => (get(wallet)['trophies'] >= 1),
    isPercent: true,
    suffix: ' chance',
},
{
    index: 1,
    name: 'Deep Pockets III',
    description: 'Lootmaster III is automatially unlocked and stays unlocked on relocate.',
    cost: {
        void: 90,
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
    unlockAt: () => (get(wallet)['fame'] >= 1),
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
    unlockAt: () => (get(wallet)['fame'] >= 1),
    isPercent: true,
    suffix: ' chance',
},
{
    index: 4,
    name: 'Game On',
    description: 'Unlocks challenges 1 - 3.',
    cost: {
        fame: 100000,
    },
    unlockAt: () => (get(wallet)['fame'] >= 1),
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
    unlockAt: () => (get(wallet)['trophies'] >= 1 || formula.sumArray(get(challengesCompleted)) > 0),
    isPercent: false,
},
{
    index: 6,
    name: 'Beaconizer',
    description: 'Start each relocation with 50,000 beacons. Gain 50 beacons per second.',
    cost: {
        trophies: 2,
    },
    unlockAt: () => (get(wallet)['trophies'] >= 1 || formula.sumArray(get(challengesCompleted)) > 0),
    isPercent: true,
},
{
    index: 7,
    name: 'Beacon Tools II',
    description: 'You can now "smart split" beacons among chosen paths.',
    cost: {
        trophies: 2,
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
        trophies: 3,
    },
    unlockAt: () => (get(wallet)['trophies'] >= 1 || formula.sumArray(get(challengesCompleted)) > 0),
    isPercent: true,
},
{
    index: 10,
    name: 'Hellfire',
    description: '[NOT IMPLEMENTED YET] Unlocks challenges 4 - 6.',
    cost: {
        dust: 1e207,
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
        trophies: 3,
    },
    unlockAt: () => (get(automationItemsUnlocked)['spellcaster'] !== undefined),
    isPercent: true,
},




]);