import { writable, get } from "svelte/store";
import { wallet, miningUpgradeLevels, enchantUpgradeLevels, ascensionLevels } from "./player";
import Decimal from "break_infinity.js";

function single(context: any) {
    // @ts-ignore
    const { subscribe, set, update, get } = writable(context);
    return {
        subscribe,
        set(amt: any) {
            update((i: any) => {
                i = amt;
                return amt;
            });
        },
        add(amt: any) {
            update((i) => {
                return i + amt;
            });
        },
        sub(amt: any, negatable = false) {
            update((i) => {
                if (negatable) return i - amt;
                else return Math.max(i, 0);
            });
        },
        multiply(amt: any) {
            update((i) => {
                return i * amt;
            });
        },
        divide(amt: any) {
            update((i) => {
                return i / amt;
            });
        },
    };
}
function array(context: any) {
    // @ts-ignore
    const { subscribe, set, update, get } = writable(context);
    return {
        subscribe,
        set(amt: any) {
            update((i: any) => {
                i = amt;
                return amt;
            });
        },
        add(amt: any) {
            update((i: { plus: (arg0: any) => any }) => {
                return i + amt;
            });
        },
        sub(amt: any, negatable = false) {
            update((i) => {
                if (negatable) return i - amt;
                else return Math.max(i, 0);
            });
        },
        multiply(amt: any) {
            update((i) => {
                return i * amt;
            });
        },
        divide(amt: any) {
            update((i) => {
                return i / amt;
            });
        },
    };
}
function object(context: any) {
    // @ts-ignore
    const { subscribe, set, update, get } = writable(context);
    return {
        subscribe,
        set(item: string | number, amt: any) {
            update((i: any) => {
                i[item] = amt;
                return i;
            });
        },
        add(item: string | number, amt: any) {
            update((i: any) => {
                i[item] += amt;
                return i;
            });
        },
        sub(item: string | number, amt: any, negatable = false) {
            update((i: any) => {
                if (negatable) i[item] -= amt;
                else i[item] = Math.max(i[item], 0);
                return i;
            });
        },
        multiply(item: string | number, amt: any) {
            update((i: any) => {
                i[item] *= amt;
                return i;
            });
        },
        divide(item: string | number, amt: any) {
            update((i: any) => {
                i[item] /= amt;
                return i;
            });
        },
    };
}

function ascFormulaGetter(context: any) {
    // @ts-ignore
    const { subscribe, set, update} = writable(context);
    return {
        subscribe,
        set(item: string | number, amt: any) {
            update((i: any) => {
                i[item] = amt;
                return i;
            });
        },
        refresh(item: string | number) {
        },
        // get value based on current level
        getVal(ele: string) {
            return context[ele](get(ascensionLevels)[ele][0]);
        },
        // get value @ certain level
        getValAt(ele: string, lv: number) { 
            return context[ele](lv);
        }

    }
}


export const elementNames = array([
    "Path of Fire",
    "Path of Earth",
    "Path of Water",
    "Path of Magic",
    "Path of the Stars",
    "Antimatter"
]);

export const elementDescriptions = array([
    "Engulf your mines with the fury of flames, increasing your speed.",
    "Fortify your mines with the earth, giving yourself more access to its wealth.",
    "Empower your mines with the relentlessness of water, improving your challenge power.",
    "Enchant your mines with the magic of the arcane, increasing the frequency of enchants.",
    "Harness the power of the stars themselves, unlocking incredible beacon powers.",
    "Your prowess creates unstable, but lucrative, ripples of antimatter through the universe."
]);

export const elementBonusText = array([
    {
        prefix: "+",
        suffix: "",
        text: "speed softcap",
        isPercent: true
    },
    {
        prefix: "+",
        suffix: "",
        text: "crystal production",
        isPercent: true
    },
    {
        prefix: "+",
        suffix: "",
        text: "mastery gain",
        isPercent: true
    },
    {
        prefix: "+",
        suffix: "",
        text: "enchant proc speed",
        isPercent: true
    },
    {
        prefix: "+",
        suffix: "",
        text: "celestial beacon upgrades",
        isPercent: false
    },
    {
        prefix: "+",
        suffix: "",
        isPercent: true,
        text: "antimatter bonuses",
    },
]);

export const ascensionConstants = object({
    levelFormula: (lv: number) => 2 + (Math.pow(lv,2) * 0.14),
    levelFormulaNums: {
        multi: {
            fire: 0.14,
            earth: 0.14,
            water: 0.14,
            magic: 0.14,
            celestial: 0.14,
        },
        const: {
            fire: 2,
            earth: 2,
            water: 2,
            magic: 2,
            celestial: 15,
        }
    },
    antimatterLevelFormula: (lv: number) => 35 + (Math.pow(lv,2) * 3),
    antimatterLevelFormulaNums: {
        multi: 3,
        const: 35
    },
})

export const ascensionElements = array([
    "fire",
    "earth",
    "water",
    "magic",
    "celestial",
    "antimatter"
]);

// formula for bonuses
// returns a non-percentile value
export const ascFormula = ascFormulaGetter({
    fire: (lv: number) => 1 + 0.4*Math.pow(lv-1, 0.6), // mine speed softcap
    earth: (lv: number) => 1 + 0.3*Math.pow(lv-1, 0.8), // crystal gain
    water: (lv: number) => 1 + 0.13*Math.pow(lv-1, 0.7), // challenge point gain
    magic: (lv: number) => 1 + 0.04*Math.pow(lv-1, 0.8), // enchant proc speed
    celestial: (lv: number) => lv-1, // beacon special levels
    antimatter: (lv: number) => 1 + 0.24*Math.pow(lv-1, 0.75), // minespeed/droprate
})

export const antimatterBonusAscensionReqs = array([
1, 2, 3, 5, 7, 10, 16, 25, 35, 60, 100
])

export const antimatterBonusText = object([
    "Mining Speed",
    "Key Droprate",
    "Radioactivity Gain",
    "Slurry Gain",
    "Dust Droprate"
].concat(Array(20).fill('[to be implemented]')))