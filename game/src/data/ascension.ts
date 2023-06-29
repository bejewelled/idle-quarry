import { writable, get } from "svelte/store";
import { wallet, miningUpgradeLevels, enchantUpgradeLevels } from "./player";
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

export const ascensionStats = object({
    lastAscension: -1,
    ascensionCount: 0,
});

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
        suffix: "%",
        text: "speed softcap",
    },
    {
        prefix: "+",
        suffix: "%",
        text: "crystal production",
    },
    {
        prefix: "+",
        suffix: "%",
        text: "challenge point gain",
    },
    {
        prefix: "+",
        suffix: "%",
        text: "enchant proc speed",
    },
    {
        prefix: "+",
        suffix: "",
        text: "celestial upgrade levels",
    },
    {
        prefix: "+",
        suffix: "",
        text: "unique bonuses",
    },
]);

export const ascensionConstants = object({
    levelFormula: (lv: number) => 1 + (Math.pow(lv,2) * 0.14),
})
