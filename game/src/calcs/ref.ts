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
        sigils: 'text-fuchsia-600',
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
    }

    static dropTiers = {
        default: 1,
        gems: 0,
        gold: 1,
        key1: 1,
        orbs: 2,
        beacons: 2,
        key2: 3,
        key3: 3,
        sigils: 3,
        fame: 3
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
        3: 'text-blue-300'
    }

    static tabs = [
        'mining', 'keys', 'beacons', 'sigils', 'artifacts', 'relocate',
        'enchants', 'automation', 'challenges', 'artifacts', 'mastery', 'ascension'
    ]

    static tabNotUnlockedText = {
        beacons: "Find a beacon while mining to unlock.",
        sigils: "Find a sigil while mining to unlock.",
        relocate: "Use 10,000 total keys to unlock.",
        enchants: "Relocate and gain at least 1 fame to unlock.",
        automation: "Relocate and gain at least 1 fame to unlock.",
        challenges: "Buy challenges with fame to unlock.",
        artifacts: "Find an artifact with a T3 [***] or higher key to unlock.",
        mastery: "Reach level 10,000 on any mining upgrade to unlock.",
        ascension: "Have at least 1e25 fame and 10,000 challenge points to unlock.",

    }

    static miningUpgradeSortOrder = {
        'haste': 0,
        'efficiency': 1,
        'fortune': 2,
        'shiny': 3,
        '[*] key finder': 4,
        'lootmaster i': 5,
        '[**] key finder': 6,
        'lootmaster ii': 7,
        '[***] key finder': 8,
        'lootmaster iii': 9,
        'legendary': 10,
        'legendary ii': 11,
        'default': 12,


    }

}
