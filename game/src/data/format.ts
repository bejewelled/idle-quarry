import { writable, get } from 'svelte/store';
import { miningUpgrades } from './mining';
import { miningUpgradeLevels, wallet } from './player';

function format(context: any) {
    // @ts-ignore
    const {subscribe, set, update} = writable(context);
    return {
        subscribe,
        f(n: number, pl = 0) {
            if (!n) return 'N/A';
            if (n < 1e9) return n.toFixed(pl).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            else return n.toExponential(3).toString().replace('+', '');
        },
        fp(n: number, pl = 3, subOne = false) {
            if (!n) return 'N/A';
            if (subOne) n -= 1;
            if (n < 1e9) return (n*100).toFixed(pl).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + "%";
            else return (n*100).toExponential(pl).toString().replace('+', '') + "%";
        }
    }
}

export const f = format(0);

