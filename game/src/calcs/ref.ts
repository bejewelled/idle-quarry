export default class ref {
    static colors = {
        default: '#ffffff',
        gems: 'text-red-500',
        gold: 'text-yellow-500',
        orbs: 'text-neutral-400',
        key1: 'text-green-400',
        key2: 'text-blue-400',
        key3: 'text-pink-400',
        key4: 'text-violet-400',
        key5: 'text-amber-400',
        beacons: 'text-sky-400',
        beaconPower: 'text-cyan-300',
        fame: 'text-orange-400',
        crystals: 'text-indigo-300',
        sigils: 'text-fuchsia-600',
        slurry: 'text-teal-400',
        artifacts: 'text-slate-200',
        challengePoints: 'text-amber-500',
        warp: 'text-emerald-600',
        trophies: 'text-amber-500',
        dust: 'text-indigo-600',
    }

    static challengePointValues = {
        default: 0,
        beaconPower: 0.025,
        gems: 1,
        key1: 1,
        key2: 36,
        key3: 850,

        beaconLevels: 10,
    }

    static displayNames = {
        key1: '[*] key',
        key2: '[**] key',
        key3: '[***] key',
        key4: '[****] key',
        key5: '[*****] key',
        beaconPower: 'Beacon Power',
    }

    // stuff to not show on the sidebar
    static walletExclude = {
        totalFame: true,
        energizedCrystal: true,
        challengePoints: true,
    }

    static dropTiers = {
        default: 1,
        gems: 0,
        gold: 1,
        key1: 1,
        orbs: 2,
        beacons: 2,
        fame: 2,
        key2: 3,
        key3: 3,
        slurry: 3,
        sigils: 3,
        artifacts: 4,
        warp: 4,
        trophies: 4,
        dust: 4
    }
    
    static keyMainNames = {
       1: 'T1 [*]', 
       2: 'T2 [**]', 
       3: 'T3 [***]', 
       4: 'T4 [****]', 
       5: 'T5 [*****]'
    }

    static dropTierColors = {
        0: 'text-white',
        1: 'text-white',
        2: 'text-green-200',
        3: 'text-blue-300',
        4: 'text-purple-300',
    }

    static tabs = [
        'mining', 'keys', 'beacons', 'button', 'relocate',
        'enchants', 'automation', 'challenges', 'artifacts',
        'ascension', 'mastery'
    ]

    static tabNotUnlockedText = {
        beacons: "Find a beacon while mining to unlock.",
        sigils: "Find a sigil while mining to unlock.",
        relocate: "Use 200 total keys to unlock.",
        enchants: "Relocate and gain at least 100 fame to unlock.",
        automation: "Relocate and gain at least 1 fame to unlock.",
        challenges: "Buy challenges with fame to unlock.",
        artifacts: "Find an artifact with a T3 [***] or higher key to unlock.",
        mastery: "???",
        ascension: "Gain a total of 25 trophies.",
        button: "Reach Mining Level 8 to unlock.",

    }

    static miningUpgradeSortOrder = {
        'haste': 1, 'efficiency': 2,
        'fortune': 3, 'shiny': 4,
        '[*] key finder': 5, 'lootmaster i': 6,
        '[**] key finder': 7, 'lootmaster ii': 8,
        '[***] key finder': 9, 'lootmaster iii': 10,
        'key mastery': 11, 'legendary': 12, 
        'efficiency ii': 13, 'legendary ii': 14,
        'efficiency iii': 15, 'legendary iii': 16,
        'expansive': 17, 'clockwork': 18,
        'reflectors': 19, 'mythical': 20,
        'overload': 21, 'lockpicks': 22,
        'hardened': 23,


        'default': 1e300,


    }

}
