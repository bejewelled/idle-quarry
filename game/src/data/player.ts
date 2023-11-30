
import { writable, get } from 'svelte/store';
import ref from '../calcs/ref'
import { miningUpgrades } from './mining';
import { beaconUpgrades, beaconBonuses } from './beacons';
import { allMultipliers } from './artifacts';
import formula from '../calcs/formula';

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
                    let baseChance = val[0] 
                        * Math.max(get(miningUpgrades)[2]['formula'](get(miningUpgradeLevels)[2]),1)
                        * Math.max(1,get(miningUpgrades)[6]['formula'](get(miningUpgradeLevels)[6]))
                        * Math.max(1,get(miningUpgrades)[11]['formula'](get(miningUpgradeLevels)[11]))
                        * Math.max(1,get(miningUpgrades)[22]['formula'](get(miningUpgradeLevels)[22]))
                        * Math.max(1,get(beaconBonuses)[2])
                        * (item === 'beacons' ? get(beaconUpgrades)[1]['formula'](get(beaconUpgradeLevels)[1]) : 1)
                        * (item === 'artifacts' ? get(allMultipliers)['artifacts']['formula'](get(wallet)['artifacts'] || 0) : 1)
                        * (item === 'dust' ? formula.getAntimatterBonusAtAscensionNumber(7) : 1)
                        
                        i[item]= [
                        // add drop table multipliers here
                        //@ts-ignore
                        (baseChance >= val[3]*formula.calcMiningDropSoftcapIncrease(val[3])
                             ? val[3]*formula.calcMiningDropSoftcapIncrease(val[3]) 
                             + Math.pow((baseChance-val[3])/3.5, 2.33) : baseChance),
                        //@ts-ignore
                        Math.max(1,(val[1])
                        * ((item === 'gold' || item === 'orbs')
                          ? (get(miningUpgrades)[7]['formula'](get(miningUpgradeLevels)[7]) 
                          * get(miningUpgrades)[19]['formula'](get(miningUpgradeLevels)[19]))
                          : 1))
                          * Math.max(1,get(miningUpgrades)[20]['formula'](get(miningUpgradeLevels)[20])),
                        //@ts-ignore
                        Math.max(1,(val[2])
                        * ((item === 'gold' || item === 'orbs')
                        ? (get(miningUpgrades)[7]['formula'](get(miningUpgradeLevels)[7])
                        * get(miningUpgrades)[19]['formula'](get(miningUpgradeLevels)[19]))
                        : 1))
                        * Math.max(1,get(miningUpgrades)[20]['formula'](get(miningUpgradeLevels)[20])),
                        val[3],
                        val[4]
                    ]
                    //overload
                    if (get(miningUpgradeLevels)[15] > 0 && i[item][0] > 1) {
                        i[item][1] += Math.max(0, Math.pow(
                            (i[item][0]-1)*i[item][1], 0.45))
                        i[item][2] += Math.max(0,
                        Math.pow((i[item][0]-1)*i[item][1], 0.45))
                        
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

export const permaWallet = object({
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


export const starProgress = array([0, 1000])


export const miningUpgradeLevelsBought = array(Array(200).fill(0));
export const miningUpgradeLevelsFree = array(Array(200).fill(0));
export const miningUpgradeLevels = array(Array(200).fill(0));
export const miningUpgradeLevelsBoughtTemp = array(Array(200).fill(0));
export const miningUpgradeLevelsFreeTemp = array(Array(200).fill(0));
export const miningUpgradeLevelsTemp = array(Array(200).fill(0));

export const keyUpgradeLevels = array(Array(50).fill(0));

export const baseMiningDropTable = dropTable({
    gold: [0.25,1,3,10,1], // 20% chance to drop 1 - 3 gold, softcap at 100%, min tier 1 (lm0)
    key1: [0.05,1,1,1, 1], 
    orbs: [0.035,1,1,0.3, 1],
    //lm1
    beacons:  [0.003,1,2,0.1,2],
    fame:     [0.0005,1,3,0.025,2],
    //lm2    chance, min, max, softcap, tier
    sigils: [0.000015,0.08,0.27,0.02, 3],
    dust:   [1e-6,0.5, 0.625, 0.005, 3],
    //lm3
    key2:   [0.00000275,0.04,0.16,0.02,4],
    artifacts: [3.3e-8, 0.04, 0.05, 1e-5, 4],
    //lm4a
    key3:   [2e-7, 0.01, 0.03, 0.004, 5],
    radium: [1e-7, 0.01, 0.03, 1e-4, 5],
    void:   [1e-13, 1e-6, 3e-6, 1e-7, 5]

});

export const miningDropTable = dropTable({
    gold: [0.25,1,3,10,1], // 20% chance to drop 1 - 3 gold, softcap at 100%, min tier 1 (lm0)
    key1: [0.05,1,1,1, 1], 
    orbs: [0.035,1,1,0.3, 1],
    //lm1
    beacons:  [0.003,1,2,0.1,2],
    fame:     [0.0005,1,3,0.025,2],
    //lm2    chance, min, max, softcap, tier
    sigils: [0.000015,0.08,0.27,0.02, 3],
    dust:   [1e-6,0.5, 0.625, 0.005, 3],
    //lm3
    key2:   [0.00000275,0.04,0.16,0.02,4],
    artifacts: [3.3e-8, 0.04, 0.05, 1e-5, 4],
    //lm4a
    key3:   [2e-7, 0.01, 0.03, 0.004, 5],
    radium: [1e-7, 0.01, 0.03, 1e-4, 5],
    void:   [1e-13, 1e-6, 3e-6, 1e-7, 5]

});


export const keysOpened = array(Array(5).fill(0))

export const settings = object({
    UPDATE_SPEED: 20,
    buyAmount: 1,
    activeTab: '',
})

export const flags = object({
    relocateNavBack: false,
    pressButton: false,
    costRatioChanged: false,
    showMineXPGain: -1,
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

export const sumUpgradeLevels = single(0)

export const beaconActivations = array(Array(30).fill(0))

export const beaconLevels = array(Array(30).fill(0))

export const beaconProgress = array(Array(30).fill(0))

export const beaconUpgradeLevels = array(Array(20).fill(0))

export const beaconSmartSplits = array(Array(10).fill(0));

export const enchantUpgradeLevels = array(Array(20).fill(0))

export const automationItemsUnlocked = object({})

// progress, maxProgress
export const radiumProgress = array([0, 1000000])


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

export const layer = object({
    layer: 0,
    blocks: 0,
    blocksNextReq: 100,
})

export const buttonNumClicks = object({
    okay: 0,
    good: 0,
    great: 0,
    excellent: 0,
    incredible: 0,
    perfect: 0
})

export const baseButtonNumClicks = object({
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

export const baseButtonStats = object({
    clicksUntilFame: 1e308,
    totalClicks: 0,
    totalClicksToday: 0,
    todayStartTime: Date.now(),
    hardenedBonus: 1,
})

export const buttonUpgradeLevels = array(Array(20).fill(0))

export const stats = object({
    lastRelocate: Date.now(),
    relocateCount: 0,
})

export const totalCrafts = single(0);

export const craftMasteryLevel = single(1);
export const craftMasteryProgress = single(0);
export const craftMasteryNextReq = single(35);

export const keyCraftTimes = object({
    // [start, finish]
    energy: [-1, -1], 
    key3: [-1, -1],
    key4: [-1, -1],
    key5: [-1, -1],
    beacons: [-1, -1],
})
export const baseKeyCraftTimes = object({
    // [start, finish]
    energy: [-1, -1], 
    key3: [-1, -1],
    key4: [-1, -1],
    key5: [-1, -1],
    beacons: [-1, -1],
})

export const keyCraftMastery = object({
    // [item]: [level, xp, xpNextReq]
    energy: [1,0,3],
    key3: [1, 0, 100],
    key4: [1, 0, 100],
    key5: [1, 0, 100],
    beacons: [1 ,0, 100],
})

export const baseKeyCraftMastery = object({
    // [item]: [level, xp, xpNextReq]
    energy: [1,0,3],
    key3: [1, 0, 100],
    key4: [1, 0, 100],
    key5: [1, 0, 100],
    beacons: [1 ,0, 100],
})

export const keyCraftAmount = object({
    energy: 0,
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

export const activityLogShow = object({
    'always': true,
})

export const challengeActive = single(0);

export const challengeProgress = single(0);

export const challenge3Multi = single(1);

export const challengesCompleted = array(Array(30).fill(0));

export const perSecond = object({})

export const walletStamp = object({})


export const resetLastTimes = object({
    relocate: Date.now(),
    ascension: Date.now(),
})


export const slurryToggles = object({
    key1: false,
    key2: false,
    key3: false,
    key4: false,
    key5: false,
})

// ---

export const ascensionLevels = object({
    // level 0 (0 / 2 essence)
    fire: [1, 0, 2],
    earth: [1, 0, 2],
    water: [1, 0, 2],
    magic: [1, 0, 2],
    celestial: [1, 0, 2], 
    antimatter: [1, 0, 35],
    
})

export const artifactPermanentBonuses = object({
    
})

export const ascensionStats = object({
    lastAscension: -1,
    ascensionCount: 0,
});

export const ascensionUpgradeLevels = array(Array(100).fill(0))

export const antimatterBonusesUnlocked = single(0); 

export const masteryItemLevels = object({
    gems: 0,
    gold: 0,
    orbs: 0,
    crystals: 0,
    sigils: 0,
    slurry: 0,
    dust: 0,
    artifacts: 0,
    radium: 0
})
