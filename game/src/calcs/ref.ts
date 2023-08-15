export default class ref {
    static colors = {
        default: "#ffffff",
        gems: "text-red-500",
        gold: "text-yellow-500",
        orbs: "text-neutral-400",
        key1: "text-green-400",
        key2: "text-blue-400",
        key3: "text-pink-400",
        key4: "text-violet-400",
        key5: "text-amber-400",
        beacons: "text-sky-400",
        beaconPower: "text-cyan-300",
        fame: "text-orange-400",
        crystals: "text-indigo-300",
        energy: "text-emerald-400",
        sigils: "text-fuchsia-600",
        slurry: "text-teal-400",
        artifacts: "text-slate-200",
        challengePoints: "text-amber-500",
        warp: "text-emerald-600",
        trophies: "text-amber-500",
        dust: "text-indigo-600",
        fragments: "text-sky-600",
        stars: "text-transparent text-stone-100 bg-clip-text bg-gradient-to-br from-fuchsia-300 to-violet-700",
        efire: "text-orange-400 text-shadow-gray",
        eearth: "text-emerald-200 text-shadow-gray",
        emagic: "text-amber-200 text-shadow-gray",
        ewater: "text-sky-300 text-shadow-gray",
        ecelestial: "text-violet-300 text-shadow-gray",
        radium: "text-lime-300",
        antimatter:  "text-transparent text-stone-100 bg-clip-text bg-gradient-to-br from-blue-500 to-indigo-800",
        void: "text-gray-800",
    };

    static essenceBgColors = [
        "bg-red-500",
        "bg-emerald-400",
        "bg-sky-400",
        "bg-amber-400",
        "bg-violet-400",
        'bg-indigo-500',
    ];

    static essenceTextColors = [
        "text-red-500",
        "text-emerald-400",
        "text-sky-400",
        "text-amber-400",
        "text-violet-400",
        "text-indigo-500",
    ];

    static challengePointValues = {
        default: 0,
        beaconPower: 0.025,
        gems: 0.37,
        key1: 1,
        key2: 36,
        key3: 850,
        key4: 2375,

        beaconLevels: 10,
    };

    static displayNames = {
        key1: "[*] key",
        key2: "[**] key",
        key3: "[***] key",
        key4: "[****] key",
        key5: "[*****] key",
        beaconPower: "Beacon Power",
        efire: "[@] fire",
        eearth: "[@] earth",
        ewater: "[@] water",
        ecelestial: "[@] celestial",
        emagic: "[@] magic",
        stars: "*stars*",
        energy: "energy",
    };

    // stuff to not show on the sidebar
    static walletExclude = {
        totalFame: true,
        challengePoints: true,
        totalAntimatter: true,
        beaconPower: true,
        mastery: true,
        totalTrophies: true
    };

    static dropTiers = {
        default: 1,
        fragments: 999,
        gems: 0,
        gold: 1,
        key1: 1,
        orbs: 1,
        crystals: 2,
        beacons: 2,
        fame: 2,
        energy: 2,
        key2: 3,
        slurry: 3,
        sigils: 3,
        radium: 3,
        stars: 3,
        artifacts: 4,
        key3: 4,
        warp: 4,
        trophies: 4,
        dust: 4,
        key4: 5,
        efire: 5,
        eearth: 5,
        emagic: 5,
        ewater: 5,
        ecelestial: 5,      
        antimatter: 5,
        void: 6,
    };

    static keyMainNames = {
        1: "T1 [*]",
        2: "T2 [**]",
        3: "T3 [***]",
        4: "T4 [****]",
        5: "T5 [*****]",
    };

    static dropTierColors = {
        0: "text-white",
        1: "text-white",
        2: "text-green-200",
        3: "text-blue-300",
        4: "text-purple-300",
    };

    static tabs = [
        "mining",
        "keys",
        "beacons",
        "button",
        "relocate",
        "enchants",
        "augments",
        "mastery",
        "artifacts",
        "ascension",
    ];

    static tabNotUnlockedText = {
        beacons: "Find a beacon while mining to unlock.",
        sigils: "Find a sigil while mining to unlock.",
        relocate: "Use 200 total keys to unlock.",
        enchants: "Relocate and gain at least 100 fame to unlock.",
        automation: "Relocate and gain at least 1 fame to unlock.",
        mastery: "Buy mastery with fame to unlock.",
        artifacts: "Find an artifact with a T3 [***] or higher key to unlock.",
        ascension: "Obtain 1e15 fame.",
        button: "Reach Mining Level 8 to unlock.",
    };

    static miningUpgradeSortOrder = {
        'haste': 1,
        'efficiency': 2,
        'fortune': 3,
        'shiny': 4,
        "[*] key finder": 5,
        "lootmaster i": 6,
        "[**] key finder": 7,
        "lootmaster ii": 8,
        "[***] key finder": 9,
        "lootmaster iii": 10,
        "key mastery": 11,
        'legendary': 12,
        "efficiency ii": 13,
        "legendary ii": 14,
        "efficiency iii": 15,
        "legendary iii": 16,
        'expansive': 17,
        'clockwork': 18,
        'reflectors': 19,
        'mythical': 20,
        'lockpicks': 21,
        'overload': 22,
        'hardened': 23,
        'excavator': 24,

        default: 1e300,
    };

    static tutorialModeDescriptions = {
        default: "[not yet implemented]",
        gems: "Gain gems on each mining cycle and from keys.",
        gold: "Gain gold from random drops while mining and from keys.",
        key1: "Gain keys from random drops while mining, and the Key Finder upgrade. Keys can be opened for rewards or broken down into slurry.",
        key2: "Gain keys from random drops while mining, and the Key Finder upgrade. Keys can be opened for rewards or broken down into slurry.",
        key3: "Gain keys from random drops while mining, and the Key Finder upgrade. Keys can be opened for rewards or broken down into slurry.",
        key4: "Gain keys from random drops while mining, and the Key Finder upgrade. Keys can be opened for rewards or broken down into slurry.",
        key5: "Gain keys from random drops while mining, and the Key Finder upgrade. Keys can be opened for rewards or broken down into slurry.",
        orbs: "Gain orbs from random drops while mining and from keys.",
        crystals:
            "Gain crystals from random drops while mining, from keys, and from the button.",
        beacons: "Gain beacons from random drops while mining and from keys.",
        fame: "Gain fame from relocating, and rarely from keys.",
        slurry: "Gain slurry from breaking down keys.",
        sigils: "Gain sigils from random drops while mining and from keys.",
        artifacts:
            "Very rarely gain artifacts from keys, the button, and random drops while mining. Artifacts unlock powerful passive bonuses.",
        warp: "Gain warp from mastery.",
        trophies: "Gain trophies from mastery.",
        dust: "Gain dust very rarely while mining.",
        radium: "Gain radium from clicking the button. Radium produces crystals.",
        goldenSigils: "Gain golden sigils from crafting.",
        energy: "Enables you to craft powerful items.",
        efire: "Gained from crafting or enchants. Used in ascension.",
        eearth: "Gained from crafting or enchants. Used in ascension.",
        ewater: "Gained from crafting or enchants. Used in ascension.",
        ecelestial: "Gained from crafting or enchants.Used in ascension.",
        emagic: "Gained from crafting or enchants. Used in ascension.",
    };

    static buttonBaseRewards = {
        okay: 1000,
        good: 3000,
        great: 6000,
        excellent: 11000,
        incredible: 18000,
        perfect: 30000,
    };

    static buttonColors = {
        okay: "text-gray-500",
        good: "text-green-500",
        great: "text-sky-500",
        excellent: "text-violet-500",
        incredible: "text-pink-500",
        perfect: "text-amber-500",
    };

    static buttonDistances = {
        good: 10,
        great: 7,
        excellent: 4,
        incredible: 2,
        perfect: 1,
    };

    static slurryGainFromKeys = [
        1e-5,
        1e-3,
        1,
        1e4,
        1e9
    ]
}
