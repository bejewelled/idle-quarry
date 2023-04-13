// @ts-nocheck
import { writable, get } from "svelte/store";
import Decimal from "break_infinity.js";

/**
 * @param {any} context
 * 
 * for a singular Decimal value
 */
function single(context) {
    // @ts-ignore
    const {subscribe, set, update, get} = writable(context);
    return {
        subscribe,
        add(amt) {
            update(i => {
                if (typeof i === 'Decimal') return i.plus(amt);
                else return new Decimal(i).plus(new Decimal(amt));
            })
        },
        sub(amt, negatable = false) {
            update(i => {
                let c;
                if (typeof i === 'Decimal') c = i.minus(amt);
                else c = new Decimal(i).minus(new Decimal(amt));
                if (negatable) return c;
                else return c.max(0);
            })
        }
    }
}
/**
 * 
 * @param {any} context 
 *
 * for arrays of Decimal values
 */
function array(context) {
    // @ts-ignore
    const {subscribe, set, update, get} = writable(context);
    return {
        subscribe,
        addToIndex(amt, index) {
            update(i => {
                if (index < i.length && index >= 0)
                    if (typeof i[index] === 'Decimal') return i[index].plus(amt);
                    else return new Decimal(i[index]).plus(new Decimal(amt));
            })
        },
        subFromIndex(amt, index, negatable = false) {
            update(i => {
                if (index < i.length && index >= 0) {
                    let c;
                    if (typeof i[index] === 'Decimal') c = i[index].minus(amt);
                    else c = new Decimal(i[index]).minus(new Decimal(amt));
                    if (negatable) i[index] = c;
                    else  i[index] = c.max(0);
                    return i;
                }
            })
        }
    }
}

// things (L1)
export const things = single(new Decimal(0));

// thing (L1) producers
export const thingProds = array(new Array(8).fill(new Decimal(0)));

// thing (L1) multiplier from things (L1)
export const thingsBoost = single(new Decimal(1));

// game speed mplr from things (L1)
export const thingsSpeed = single(new Decimal(1));
