
import { writable, get } from 'svelte/store';
import {wallet, miningUpgradeLevels, 
    enchantUpgradeLevels,buttonNumClicks,buttonStats, miningUpgradeLevelsBought, permaWallet, stats, layer} from './player'
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
    gems: 250, // "base" rate = 1 progress per tick, 50 / second
    key1: 4000,
    key2: 37500,
    key3: 1200000,
})

export const upgradeSorting = object({
    all: {
        on: true,
        unlockAt: () => (true),
    },
    base: {
        on: true,
        unlockAt: () => (true),
    },
    lootmaster: {
        on: true,
        unlockAt: () => ((get(miningUpgradeLevels)[0] >= 10 && get(miningUpgradeLevels)[1] >= 10)
        || get(miningUpgradeLevels)[6] > 0),
    },
    keys: {
        on: true,
        unlockAt: () => (true),
    },
    fame: {
        on: true,
        unlockAt: () => (get(wallet)['totalFame'] > 0),
    },
    crystals: {
        on: true,
        unlockAt: () => (get(wallet)['crystals'] > 0 || get(miningUpgradeLevels)[20] > 0),
    },
    sigils: {
        on: true,
        unlockAt: () => (get(wallet)['sigils'] > 0),
    },
    dust: {
        on: true,
        unlockAt: () => (get(wallet)['dust'] > 0),
    },
    antimatter: {
        on: true,
        unlockAt: () => (get(wallet)['antimatter'] > 0),
    },
})

// edit when changing the level of the hastpe upgrade
export const progressPerTick = single(1);


export const keyFinderBases = object({
    1: 18,
    2: 3,
    3: 0.04,
    4: 0.00002
})


/* NOTE:
*  The cost of a specific item must be at least 1 to be imposed on the player.
*  If an upgrade should cost additional TYPES of resources at later levels, they must be added to the cost
*  object at a value of less than 1.
*/
export const miningUpgrades = array([{
    index: 0,
    sortType: ['base'],
    name: 'Haste',
    description: 'Increases base mining speed. This also improves many other aspects of the game that depend on mining cycles.',
    cost: {
        gems: 5,
    },
    ratio: 2,
    formula: (lv: any) => 
    (lv > 100 ? (21 + Math.pow((lv-100), 0.75)*0.2) : 1 + lv*0.2),
    unlockAt: () => (get(wallet)['gems'] >= 3),
    suffix: ' progress per tick',
    isPercent: false,
    maxLevel: 100,
},
{
    index: 1,
    sortType: ['base'],
    name: 'Efficiency',
    description: 'Increases gem yield. Improved after level 100.',
    cost: {
        gems: 5,
    },
    ratio: 1.15,
    unlockAt: () => (get(wallet)['gems'] >= 3),
    formula: (lv: any) => (lv > 10000 ? 1010297 + Math.pow((lv-10000), 0.6)*0.1 
        : lv * (1 + 0.01*lv) * (lv > 100 ? 1+0.03*(lv-100) : 1)),
    isPercent: false,
    prefix: '+',
    suffix: ' gems',
    maxLevel: 1000,
    notes: '(1 + floor(level/10)) * level^0.6'
},
// i = 2
{
    index: 2,
    sortType: ['base'],
    name: 'Fortune',
    description: 'Improves mining droprates.',
    cost: {
        gold: 10
    },
    ratio: 1.23,
    unlockAt: () => (get(wallet)['gems'] > 30 && get(wallet)['gold'] > 5),
    formula: (lv: any) => (lv > 10000 ? 601 + Math.pow((lv-10000), 0.6)*0.08 : 1 + lv*0.06),
    isPercent: true,
    prefix: '+',
    maxLevel: 1000,
    notes: '(1 + floor(level/10)) * level^0.6'  
},
{
    index: 3,
    sortType: ['keys', 'base'],
    name: '[*] Key Finder',
    description: 'While mining, you will occasionally find a bundle of T1 [*] keys.' 
    + '\nUpgrades increase progress gained towards this milestone.',
    cost: {
        orbs: 40,
        key1: 10
    },
    ratio: 1.5,
    unlockAt: () => (get(wallet)['key1'] >= 1),
    formula: (lv: any) => 1 + lv*0.2,
    isPercent: false,
    prefix: 'x',
    suffix: 'speed',
    maxLevel: 100,
    notes: '(1 + floor(level/10)) * level^0.6' 
},
{
    index: 4,
    sortType: ['keys'],
    name: '[**] Key Finder',
    description: 'While mining, you will occasionally find a bundle of T2 [**] keys.' 
    + '\nUpgrades increase progress gained towards this milestone.',
    cost: {
        orbs: 1e7,
        key2: 100,
    },
    ratio: 1.5,
    unlockAt: () => (get(permaWallet)['key2'] >= 10),                 
    formula: (lv: any) => (1 + Math.pow(lv, 0.5)*0.15),
    isPercent: false,
    prefix: 'x',
    suffix: 'speed',
    maxLevel: 100,
    notes: '' 
},
// i = 5
{
    index: 5,
    sortType: ['keys', 'base'],
    name: 'Key Mastery',
    description: 'Increases the number of keys found when a Key Finder of any rarity triggers.',
    cost: {
        orbs: 200,
    },
    ratio: 1.25,
    unlockAt: () => (get(miningUpgradeLevels)[3] > 0),
    formula: (lv: any) => (lv > 1000 ? 201 + Math.pow((lv-1000), 0.2)*0.06
    :(1 + lv * 0.2)),
    isPercent: false,
    prefix: 'x',
    suffix: 'keys',
    maxLevel: 1000,
    notes: ''
},
{
    index: 6,
    sortType: ['lootmaster', 'base'],
    name: 'Lootmaster I',
    description: 'Unlocks a new tier of findable drops. These upgrades are very powerful and sometimes unlock new resources.',
    cost: {
        gems: 1e4,
        gold: 300,
        key1: 25,
    },
    ratio: 1.25,
    unlockAt: () => ((get(miningUpgradeLevels)[0] >= 10 && get(miningUpgradeLevels)[1] >= 10)
    || get(miningUpgradeLevels)[6] > 0),
    formula: (lv: any) => lv,
    isPercent: false,
    maxLevel: 1,
    style: 'game-btn-lootmaster',
    notes: ''
},
{
    index: 7,
    sortType: ['base'],
    name: 'Shiny',
    description: 'Increases the amount of gold and orbs found from mining.',
    cost: {
        gems: 1150,
    },
    ratio: 1.25,
    unlockAt: () => (get(miningUpgradeLevels)[0] >= 10 && get(miningUpgradeLevels)[1] >= 10),
    formula: (lv: any) => (lv > 10000 ? 1501+Math.pow((lv-10000), 0.7)*0.15 
    :(1 + lv*0.15)),
    isPercent: false,
    prefix: 'x',
    suffix: 'gold/orb drops',
    maxLevel: 1000,
    notes: ''
},
// i = 8
{
    index: 8,
    sortType: ['base'],
    name: 'Efficiency II',
    description: 'Increases gem yield.',
    cost: {
        gems: 2500,
    },
    ratio: 1.25,
    unlockAt: () => (get(miningUpgradeLevels)[1] >= 20),
    formula: (lv: any) => 1 + lv * 0.1,
    isPercent: false,
    prefix: 'x',
    suffix: ' gems',
    maxLevel: 1000,
    notes: ''
},
{
    index: 9,
    sortType: ['lootmaster'],
    name: 'Lootmaster II',
    description: 'Unlocks a new tier of findable drops.',
    cost: {
        orbs: 1e6,
        crystals: 10000,
        beacons: 2500,
        key2: 150,
    },
    ratio: 1.25,
    unlockAt: () => (get(miningUpgradeLevels)[6] >= 0.9 || get(miningUpgradeLevels)[9] > 0
    || get(miningUpgradeLevelsBought)[9] > 0),
    formula: (lv: any) => (0),
    isPercent: false,
    suffix: '',
    maxLevel: 1,
    style: 'game-btn-lootmaster',
    notes: ''
},
// i = 10
{
    index: 10,
    sortType: ['fame'],
    name: 'Hoarder',
    description: 'Significantly improves gem gains.',
    cost: {
        fame: 5
    },
    ratio: 1.4,
    unlockAt: () => (get(wallet)['fame'] > 0 && get(stats)['relocateCount'] > 0),
    formula: (lv: any) => (1 + lv*2) * Math.pow(1.04, lv),
    isPercent: false,
    prefix: 'x',
    noResetRelocate: true,
    suffix: ' gem bonus',
    maxLevel: 100,
    style: 'game-btn-fame',
    notes: 'index 10'
},
{
    index: 11,
    sortType: ['fame'],
    name: 'Spelunker',
    description: 'Significantly improves mining drop rate.',
    cost: {
        fame: 5
    },
    ratio: 1.75,
    unlockAt: () => (get(wallet)['fame'] > 0 && get(stats)['relocateCount'] > 0),
    formula: (lv: any) => 1 + 0.55*Math.pow(lv, 0.9),
    isPercent: false,
    noResetRelocate: true,
    prefix: 'x',
    suffix: 'drop rate',
    maxLevel: 100,
    style: 'game-btn-fame',
    notes: ''
},
// i = 12
{
    index: 12,
    sortType: ['fame'],
    name: 'Paladin',
    description: 'Significantly improves beacon path progress.',
    cost: {
        fame: 20,
    },
    ratio: 1.4,
    unlockAt: () => (get(wallet)['fame'] > 0 && get(stats)['relocateCount'] > 0),
    formula: (lv: any) => (1 + 0.75*lv)* Math.pow(1.03, lv),
    isPercent: false,
    prefix: 'x',
    suffix: ' beacon progress',
    noResetRelocate: true,
    maxLevel: 100,
    style: 'game-btn-fame',
    notes: 'index 10'
},
{
    index: 13,
    sortType: ['fame'],
    name: 'Demon',
    description: 'Multiplies mining speed.',
    cost: {
        fame: 20,
    },
    ratio: 1.75,
    unlockAt: () => (get(wallet)['fame'] > 0 && get(stats)['relocateCount'] > 0),
    formula: (lv: any) => 1 + 0.175*Math.pow(lv, 0.85),
    isPercent: false,
    noResetRelocate: true,
    prefix: 'x',
    suffix: ' mining speed',
    maxLevel: 100,
    style: 'game-btn-fame',
    notes: ''
},
{
    index: 14,
    sortType: ['lootmaster'],
    name: 'Lootmaster III',
    description: 'Unlocks a new tier of findable drops, and automatically unlocks LM1 and LM2 if they aren\'t already.',
    cost: {
        slurry: 1e6,
        sigils: 1e5,
        key3: 10000,
        radium: 1000,
        artifacts: 10,

    },
    ratio: 1e90,
    unlockAt: () => ((get(wallet)['fame'] > 0 && get(miningUpgradeLevels)[9] > 0.003)
    || get(miningUpgradeLevelsBought)[14] > 0),
    formula: (lv: any) => (0),
    isPercent: true,
    noResetRelocate: true,
    suffix: '',
    maxLevel: 1,
    style: 'game-btn-lootmaster',
    notes: ''
},
// i = 15
{
    index: 15,
    sortType: ['fame'],
    name: 'Overload',
    description: 'Drop chances above 100% increase the amount of drops.',
    cost: {
        fame: 1200,
    },
    ratio: 200,
    unlockAt: () => (get(wallet)['totalFame'] > 200 && get(stats)['relocateCount'] > 0),
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
    sortType: ['base'],
    name: 'Legendary',
    description: 'Increases fame gain on relocation.',
    cost: {
        gems: 3e5,
        gold: 2500,
    },
    ratio: 1.35,
    unlockAt: () => (get(wallet)['totalFame'] > 60),
    formula: (lv: any) => 1 + lv * 0.25,
    isPercent: true,
    suffix: '  fame bonus',
    maxLevel: 100,
    noResetRelocate: false,
    notes: 'index 16'
},
// i = 17
{
    index: 17,
    sortType: ['base'],
    name: 'Legendary II',
    description: 'Increases fame gain on relocation.',
    cost: {
        orbs: 1e4,
        crystals: 1600,

    },
    ratio: 1.25,
    unlockAt: () => (get(wallet)['totalFame'] > 15000),
    formula: (lv: any) => (1 + (lv * 0.15)),
    isPercent: true,
    suffix: '  fame bonus',
    maxLevel: 150,
    noResetRelocate: false,
    notes: 'index 16'
},
{
    index: 18,
    sortType: ['keys'],
    name: '[***] Key Finder',
    description: 'While mining, you will occasionally find a bundle of T3 [***] keys.' 
    + '\nUpgrades increase progress gained towards this milestone.',
    cost: {
        orbs: 1e9,
        key3: 1000,
    },
    ratio: 1.5,
    unlockAt: () => (get(wallet)['key3'] > 0),
    formula: (lv: any) => (1 + Math.max(0,Math.pow(lv-1, 0.6)*0.15)),
    isPercent: false,
    prefix: 'x',
    suffix: 'speed',
    maxLevel: 100,
    notes: '(1 + floor(level/10)) * level^0.6' 
},
{
    index: 19,
    sortType: ['sigils'],
    name: 'Kleptomaniac',
    description: 'Increases gold gained from mining drops.',
    cost: {
        sigils: 1
    },
    ratio: 3,
    unlockAt: () => (get(permaWallet)['sigils'] > 0),
    formula: (lv: any) => (1 + 0.35 * lv),
    isPercent: false,
    noResetRelocate: true,
    prefix: 'x',
    suffix: 'gold drops',
    style: 'game-btn-sigil',
    maxLevel: 25,
    notes: '(1 + floor(level/10)) * level^0.6' 
},
{
    index: 20,
    sortType: ['crystals'],
    name: 'Hardened',
    description: 'Increases mining drop quantities based on your current layer.',
    cost: {
        crystals: 10000,
    },
    ratio: 1.33,
    unlockAt: () => (get(permaWallet)['crystals'] > 0),
    formula: (lv: any) => (lv == 0 ? 1 : 
        1 + Math.pow((get(layer)['layer']), 1+(lv*0.01))*0.004 + 0.003*lv*get(layer)['layer']),
    isPercent: false,
    prefix: 'x',
    suffix: ' drop quantity',
    maxLevel: 100,
    style: 'game-btn-crystal',
    notes: '(1 + floor(level/10)) * level^0.6' 
},
{
    index: 21,
    sortType: ['sigils'],
    name: 'Excavator',
    description: 'Artifact droprate from keys is improved.',
    cost: {
        sigils: 42500,
        warp: 5000,
    },
    ratio: 1.33,
    unlockAt: () => (get(wallet)['artifacts'] || 
    (get(wallet)['sigils'] > 25000 && get(wallet)['warp'] > 10000)),
    formula: (lv: any) => 1 + lv * 0.15,
    noResetRelocate: true,
    isPercent: true,
    suffix: ' droprate bonus',
    maxLevel: 250,
    style: 'game-btn-sigil',
    notes: ''
},
{
    index: 22,
    sortType: ['base'],
    name: 'Fortune II',
    description: 'Increases all droprates.',
    cost: {
        gems: 1e13,
    },
    ratio: 1.65,
    unlockAt: () => (get(wallet)['gems'] > 1e9),
    formula: (lv: any) =>  1 + Math.pow(lv,0.8)/10,
    isPercent: false,
    prefix: 'x',
    suffix: 'droprates',
    maxLevel: 400,
},
{
    index: 23,
    sortType: ['base'],
    name: 'Isotopes',
    description: 'Excavate additional blocks per mining cycle from the current layer.',
    cost: {
        gems: 1e19,
    },
    ratio: 1.6,
    unlockAt: () => (get(wallet)['gems'] > 1e13),
    formula: (lv: any) => lv*0.50,
    isPercent: false,
    prefix: '+',
    suffix: ' blocks per mining cycle',
    maxLevel: 400,
},
{
    index: 24,
    sortType: ['base'],
    name: 'Blinding Lights',
    description: 'Increases beacon path progress.',
    cost: {
        gems: 1e22,
    },
    ratio: 1.65,
    unlockAt: () => (get(wallet)['gems'] > 1e17),
    formula: (lv: any) =>  1 + Math.pow(lv,0.8)/4,
    isPercent: true,
    prefix: '+',
    suffix: ' beacon progress',
    maxLevel: 400,
},
{
    index: 25,
    sortType: ['sigils'],
    name: 'Efficiency III',
    description: 'Increases gem yield.',
    cost: {
        sigils: 1,
    },
    ratio: 3,
    unlockAt: () => (get(wallet)['sigils'] > 0),
    formula: (lv: any) =>  1 + lv*0.75,
    isPercent: false,
    prefix: 'x',
    suffix: ' gems',
    style: 'game-btn-sigil',
    noResetRelocate: true,
    maxLevel: 25,
},
{
    index: 26,
    sortType: ['fame', 'keys'],
    name: 'Lockpicks',
    description: 'Significantly increases the speed and yield of Key Master.',
    cost: {
        fame: 30
    },
    ratio: 1.4,
    unlockAt: () => (get(wallet)['totalFame'] > 200),
    formula: (lv: any) => 1 + (lv*0.1) * Math.pow(1.01, lv),
    noResetRelocate: true,
    isPercent: false,
    prefix: 'x',
    suffix: 'speed/amount',
    maxLevel: 100,
    style: 'game-btn-fame',
    notes: ''
},
{
    index: 27,
    sortType: ['dust'],
    name: 'Cosmic Brilliance',
    description: 'The first four mining upgrades gain 4 free levels that never reset (haste gets 1 level).',
    cost: {
        dust: 100,
    },
    ratio: 1.25,
    unlockAt: () => (get(wallet)['dust'] > 0),
    formula: (lv: any) => 4 * lv,
    noResetRelocate: true,
    noResetAscension: true,
    isDust: true,
    isPercent: false,
    suffix: ' free levels',
    maxLevel: 200,
    style: 'game-btn-dust',
    notes: ''
},
{
    index: 28,
    sortType: ['dust'],
    name: 'Glorious Space Turtles',
    description: 'Gain fame per second.',
    cost: {
        dust: 100000,
    },
    ratio: 1.5,
    unlockAt: () => (get(wallet)['dust'] > 0),
    formula: (lv: any) => 1000 * Math.pow(lv, 1.5),
    noResetRelocate: true,
    isDust: true,
    isPercent: false,
    suffix: ' fame / sec',
    maxLevel: 250,
    style: 'game-btn-dust',
    notes: ''
},
{
    index: 29,
    sortType: ['fame'],
    name: 'Cerium Decomposition',
    description: 'Radium produces more crystals.',
    cost: {
        fame: 100000,
    },
    ratio: 1.4,
    unlockAt: () => (get(wallet)['totalFame'] > 100000 && get(stats)['relocateCount'] > 0),
    formula: (lv: any) => 1 + lv * 0.11 * Math.pow(1.01, lv),
    noResetRelocate: true,
    isPercent: false,
    prefix: 'x',
    suffix: 'crystal gain',
    maxLevel: 100,
    style: 'game-btn-fame',
    notes: ''
},
{
    index: 30,
    sortType: ['antimatter'],
    name: 'Elusive Minerals',
    description: 'Increases gem gain.',
    cost: {
        antimatter: 5,
    },
    ratio: 150,
    unlockAt: () => (get(wallet)['antimatter'] > 0),
    formula: (lv: any) => 1 + lv*3 + Math.pow(lv,2.75),
    noResetRelocate: true,
    noResetAscension: true,
    isPercent: false,
    prefix: 'x',
    suffix: 'gem gain',
    maxLevel: 10,
    style: 'game-btn-antimatter',
    notes: ''
},
{
    index: 31,
    sortType: ['antimatter'],
    name: 'Lootmaster IV [unimplemented]',
    description: 'Unlocks a new tier of findable drops, and automatically unlocks LM1-3 if they aren\'t already.',
    cost: {
        warp: 1e7,
        antimatter: 75000,
        efire: 21000,
        eearth: 21000,
        ewater: 21000,
        emagic: 21000,
        ecelestial: 21000,
        key4: 10000,
    },
    ratio: 1e90,
    unlockAt: () => (get(miningUpgradeLevels)[14] > 0.003
    || get(miningUpgradeLevelsBought)[31] > 0),
    formula: (lv: any) => (0),
    isPercent: true,
    noResetRelocate: true,
    noResetAscension: true,
    suffix: '',
    maxLevel: 1,
    style: 'game-btn-lootmaster',
    notes: ''
},
{
    index: 32,
    sortType: ['antimatter'],
    name: 'Negative Mass',
    description: 'Decreases the cost multipliers of mining upgrades.',
    cost: {
        antimatter: 250,
    },
    ratio: 10,
    unlockAt: () => (get(wallet)['antimatter'] > 0),
    formula: (lv: any) => 1 - (0.15 * lv),
    isPercent: false,
    noResetRelocate: true,
    noResetAscension: true,
    costRatioChange: true,
    prefix: 'x',
    suffix: 'cost multipliers',
    maxLevel: 1,
    style: 'game-btn-antimatter',
    notes: ''
},
{
    index: 33,
    sortType: ['antimatter'],
    name: 'Collapse',
    description: 'Decreases the cost multipliers of mining upgrades.',
    cost: {
        antimatter: 16000,
    },
    ratio: 1e90,
    unlockAt: () => (get(miningUpgradeLevels)[32] > 0.003),
    formula: (lv: any) => 1 - (0.10 * lv),
    isPercent: false,
    noResetRelocate: true,
    noResetAscension: true,
    costRatioChange: true,
    prefix: 'x',
    suffix: 'cost multipliers',
    maxLevel: 1,
    style: 'game-btn-antimatter',
    notes: ''
},
{
    index: 34,
    sortType: ['antimatter'],
    name: 'Event Horizon',
    description: 'Decreases the cost multipliers of mining upgrades.',
    cost: {
        antimatter: 9e6,
    },
    ratio: 1e90,
    unlockAt: () => (get(miningUpgradeLevels)[33] > 0.003),
    formula: (lv: any) => 1 - (0.10 * lv),
    isPercent: false,
    noResetRelocate: true,
    noResetAscension: true,
    costRatioChange: true,
    prefix: 'x',
    suffix: 'cost multipliers',
    maxLevel: 1,
    style: 'game-btn-antimatter',
    notes: ''
},
{
    index: 35,
    sortType: ['antimatter'],
    name: 'Total Darkness',
    description: 'Decreases the cost multipliers of mining upgrades.',
    cost: {
        antimatter: 2.5e8,
    },
    ratio: 1e90,
    unlockAt: () => (get(miningUpgradeLevels)[34] > 0.003),
    formula: (lv: any) => 1 - (0.08 * lv),
    isPercent: false,
    noResetRelocate: true,
    noResetAscension: true,
    costRatioChange: true,
    prefix: 'x',
    suffix: 'cost multipliers',
    maxLevel: 1,
    style: 'game-btn-antimatter',
    notes: ''
},
{
    index: 36,
    sortType: ['antimatter'],
    name: 'Ethereal Box',
    description: 'Increases key droprates.',
    cost: {
        antimatter: 5,
    },
    ratio: 150,
    unlockAt: () => (get(wallet)['antimatter'] > 0),
    formula: (lv: any) => 1 + 0.95*Math.pow(lv,1.65),
    noResetRelocate: true,
    noResetAscension: true,
    

    isPercent: false,
    suffix: 'x key droprates',
    maxLevel: 10,
    style: 'game-btn-antimatter',
    notes: ''
},
{
    index: 37,
    sortType: ['antimatter'],
    name: 'Phantom Legend',
    description: 'Increases fame gain on relocation.',
    cost: {
        antimatter: 5,
    },
    ratio: 150,
    unlockAt: () => (get(wallet)['antimatter'] > 0),
    formula: (lv: any) => 1 + 0.75*Math.pow(lv,1.9),
    noResetRelocate: true,
    noResetAscension: true,
    isPercent: false,
    suffix: 'x fame gain',
    maxLevel: 10,
    style: 'game-btn-antimatter',
    notes: ''
},
{
    index: 38,
    sortType: ['keys', 'base'],
    name: '[****] Key Finder',
    description: 'While mining, you will occasionally find a bundle of T4 [****] keys.' 
    + '\nUpgrades increase progress gained towards this milestone.',
    cost: {
        orbs: 3e19,
        key4: 2500,
        void: 750,
    },
    ratio: 1.3,
    unlockAt: () => (get(miningUpgradeLevels)[18] > 0.003 && (get(wallet)['key4'] > 0 && get(wallet)['totalAntimatter'] > 0)),
    formula: (lv: any) => (1 + Math.max(0,Math.pow(lv-1, 0.6)*0.15)),
    isPercent: false,
    suffix: 'x speed',
    maxLevel: 100,
    notes: '(1 + floor(level/10)) * level^0.6' 
},
// {
//     index: 39,
//     sortType: ['keys', 'base'],
//     name: '[****] Key Finder',
//     description: 'Based on your current layer, increase' 
//     + '\nUpgrades increase progress gained towards this milestone.',
//     cost: {
//         orbs: 3e19,
//         key4: 2500,
//         void: 750,
//     },
//     ratio: 1.3,
//     unlockAt: () => (get(miningUpgradeLevels)[18] > 0.003 && (get(wallet)['key4'] > 0 && get(wallet)['totalAntimatter'] > 0)),
//     formula: (lv: any) => (1 + Math.max(0,Math.pow(lv-1, 0.6)*0.15)),
//     isPercent: false,
//     suffix: 'x speed',
//     maxLevel: 500,
//     notes: '(1 + floor(level/10)) * level^0.6' 
// },


]);



// for flavor text on mining page
export const gemGainFlavorText = single(0)
export const gemProgressFlavorText = single(0)
export const gemProgressFlavorNextUpdate = single(Date.now() + 500)

