import {buttonUpgradeLevels, miningUpgradeLevels} from '../data/player';
import { get } from 'svelte/store';
export default class formula {

    // returns a normally random value
    static rNorm() {
      // Generate two random numbers between 0 and 1
      const u1 = Math.random();
      const u2 = Math.random();

      // Apply the Box-Muller transform to generate two normally distributed random numbers
      const z1 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

      // Use one of the normally distributed random numbers to generate a random number on the interval [-3,3]
      return Math.min(3,z1*2);
    }

    static gSum(a: number, r: number, n: number) {
        // calculate the sum using the formula
        const sum = a * (1 - Math.pow(r, n)) / (1 - r);
      
        return sum;
      }
    static maxNumGeom(x: number, b: number, r: number) {
        const n = Math.floor(Math.log((x/b) * (r - 1) + 1) / Math.log(r));
        const actualPrice = b * Math.pow(r, n);
        return Math.min(n, Math.floor(x/actualPrice));
      }

    static sumArray(array: Array<number>) {
        return array.reduce((sum, value) => sum + value, 0);
      }

    static productArray(array: Array<number>) {
        return array.reduce((sum, value) => sum * value, 1);
      }
    
    static calcFameGainKeys(array: Array<number>) { 
        const f = array.map((x,i) => {
          if (x < (1e5/(i+1))) { return 1 + ((i+1) * x/1e4)}
          return 10 + Math.pow((i+1) * (x-1e5)/1e5, 0.5);
        });
        return f;
    }

    static calcFameGemMulti(n: number) {
      return (n > 1e20 ? 20 + Math.pow(Math.log10(n-50),2.5) : Math.log10(n+1))
    }

    static calcFameBeaconMulti(n: number) {
      return (n > 1e6 ? 11 + Math.pow((n - 1e6) / 1e6, 0.75)  : 
              n > 150 ? 1 + (n - 150) / 1e5 :
              n / 150)
    }

    static calcFameTimeMultiplier(last: number) {
      if (get(buttonUpgradeLevels)[6] < 1) return 1;
      const sec = (Date.now() - last) / 1000;
      return 1 + 9*Math.pow(sec/86400, 2);
    }

    static calcMineSize(lv: number) {
      return Math.pow(lv+5,2);
    }

    static calcMineQuality(lv: number) {
      return 10 + lv;
    }

    static calcButtonStreakBonus(n: number) {
      if (get(buttonUpgradeLevels)[1] < 1) return 1;
      return 1 + Math.pow(n,0.7)/60;
    }
    
    static calcHardenedGemBonus(obj: { [x: string]: number; }) {
      if (get(miningUpgradeLevels)[20] < 1) return 1;
        return ((1 + 0.1*get(miningUpgradeLevels)[20])
        * ((Math.log(obj['good']+2) / Math.log(9))
          + (Math.log(obj['great']+2) / Math.log(7))
          + (Math.log(obj['excellent']+2) / Math.log(5))
          + (Math.log(obj['incredible']+2) / Math.log(3)) 
          + (Math.log(obj['perfect']+2) / Math.log(2))));
    }
    static dispCalcHardenedGemBonus(obj: { [x: string]: number;}, m: number) {
      if (m < 1) return 1;
      return ((1 + 0.1*m)
      * ((Math.log(obj['good']/40+2) / Math.log(9))
        + (Math.log(obj['great']/25+2) / Math.log(7))
        + (Math.log(obj['excellent']/20+2) / Math.log(5))
        + (Math.log(obj['incredible']/15+2) / Math.log(3)) 
        + (Math.log(obj['perfect']/10+2) / Math.log(2))));
  }

  static calcKeySlurryGain(obj: { [x: string]: number; }) {
    return (obj['key1'] || 0)/16
    + (obj['key2'] || 0)/8 
    + (obj['key3'] || 0)/4
    + (obj['key4'] || 0)/2
    + (obj['key5'] || 0)/1;
  }
}