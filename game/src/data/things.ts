// @ts-nocheck
import { writable, get } from "svelte/store";
import Decimal from "break_infinity.js";

/**
 * @param {any} context
 * 
 * things (L1) store
 */
function thingManager(context) {
    // @ts-ignore
    const {subscribe, set, update, get} = writable(context);
    return {
        subscribe,
        set(amt) {
            update(i => {
                if (typeof i === 'object') return amt;
                else return new Decimal(amt);
            })
        },
        add(amt) {
            update(i => {
                if (typeof i === 'object') return i.plus(amt);
                else return new Decimal(i).plus(new Decimal(amt));
            })
        },
        sub(amt, negatable = false) {
            update(i => {
                let c;
                if (typeof i === 'object') c = i.minus(amt);
                else c = new Decimal(i).minus(new Decimal(amt));
                if (negatable) return c;
                else return c.max(0);
            })
        },
        multiply(amt) {
            update(i => {
                if (typeof i === 'object') return i.times(amt);
                else return new Decimal(i).times(new Decimal(amt));
            })
        },
    }
}

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
                if (typeof i === 'object') return i.plus(amt);
                else return new Decimal(i).plus(new Decimal(amt));
            })
        },
        sub(amt, negatable = false) {
            update(i => {
                let c;
                if (typeof i === 'object') c = i.minus(amt);
                else c = new Decimal(i).minus(new Decimal(amt));
                if (negatable) return c;
                else return c.max(0);
            })
        },
        multiply(amt) {
            update(i => {
                if (typeof i === 'object') return i.times(amt);
                else return new Decimal(i).times(new Decimal(amt));
            })
        },
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
                    if (typeof i[index] === 'object') return i[index].plus(amt);
                    else return new Decimal(i[index]).plus(new Decimal(amt));
            })
        },
        set(amt) {
            update(i => {
                if (typeof i === 'object') return amt;
                else return new Decimal(amt);
            })
        },
        subFromIndex(amt, index, negatable = false) {
            update(i => {
                if (index < i.length && index >= 0) {
                    let c;
                    if (typeof i[index] === 'object') c = i[index].minus(amt);
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
export const things = thingManager(new Decimal(0));

// thing (L1) producers
export const thingProds = array(new Array(8).fill(new Decimal(2)));
// actual prod values
export const thingProdsVal = array(Array(8).fill(new Decimal(0.1))
.map((val, index) => index === 0 ? 1 : val)); // set index 0 == 1
// base prod values (ideally, don't use this, just hard-code this on reset, but it's here for reference)
export const thingProdsBase = array(Array(8).fill(new Decimal(0.1))
.map((val, index) => index === 0 ? 1 : val)); // set index 0 == 1


// thing (L1) multiplier from things (L1)
export const thingsBoost = single(new Decimal(1));

// game speed mplr from things (L1)
export const thingsSpeed = single(new Decimal(1));
