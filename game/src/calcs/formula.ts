import {buttonUpgradeLevels, miningUpgradeLevels, keyUpgradeLevels,
keyCraftAmount, keyCraftMastery, beaconLevels, challengeActive} from '../data/player';
import { beaconBonuses } from '../data/beacons';
import {keyUpgrades, keyCrafts} from '../data/keys'
import { get } from 'svelte/store';
import ref from './ref';
export default class formula {

    // returns a normally random value
    static rNorm(mean=0, stdev=1) {
        const u = 1 - Math.random(); // Converting [0,1) to (0,1]
        const v = Math.random();
        const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
        // Transform to the desired mean and standard deviation:
        return z * stdev + mean;
    }

    static rNormTest() {
      console.log('rNorm Bias Test started')
      const test = Array(400).fill(0);
      const testA = Array(400).fill(0);
      const testB = Array(5).fill(0);
      for (let i = 0; i < testA.length; i++) {
          for (let j = 0; j < test.length; j++) {
            for (let k = 0; k < testB.length; k++) {
              test[k] = this.rNorm();
            }
          testA[j] = formula.sumArray(test) / 1000;
          }
          testB[i] = formula.sumArray(testA) / 400;
      }
      return formula.sumArray(testB) / 5;
    }

    static gSum(a: number, r: number, n: number) {
        // calculate the sum using the formula
        const sum = a * (1 - Math.pow(r, n)) / (1 - r);
      
        return sum;
      }
    static maxNumGeom(amt: number, base: number, r: number) {
        const n = Math.floor(Math.log((amt/base) * (r - 1) + 1) / Math.log(r));
        const actualPrice = base * Math.pow(r, n);
        return n;
      }
    static calculateMaxBuy(initialPrice: number, incrementPercentage: number, totalMoney: number) {
        const r = 1 + incrementPercentage / 100;
      
        // Calculate the maximum buy amount using the geometric sum formula
        const maxBuy = initialPrice * (Math.pow(r, totalMoney / initialPrice) - 1) / (r - 1);
      
        return maxBuy.toFixed(2); // Round the result to 2 decimal places
      }
    static sumArray(array: Array<number>) {
        return array.reduce((sum, value) => sum + value, 0);
      }

    static productArray(array: Array<number>) {
        return array.reduce((sum, value) => sum * value, 1);
      }
    
    static calcFameGainKeys(array: Array<number>) { 
        const keyArray = [1,1,1,1,1];
        for (let i = 0; i < array.length; i++) {
          if (array[i] < 1) continue;
          else if (array[i] < 10) {
            keyArray[i] = 1.25 + array[i] * 0.075;
          } else if (array[i] < 10000) {
            keyArray[i] = 2 + array[i] * ((i+1)**2) / 5000;
          } else {
            keyArray[i] = 2 + 2*((i+1)**2) + Math.pow((i+1)*((array[i] - 10000) / 1000), 0.4);
          } 
        }
        return keyArray;
    }

    static calcFameGemMulti(n: number) {
      return (Math.log10(n+1))
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
    let amount = (Math.pow(obj['key1'], 0.7) || 0)*0.025
    + (Math.pow(obj['key2'], 0.8) || 0)*0.2
    + (Math.pow(obj['key3'], 0.9) || 0)*2
    + (Math.pow(obj['key4'], 0.93) || 0)*35
    + (Math.pow(obj['key5'], 0.97) || 0)*400;
    if (isNaN(amount)) {
      alert('note: this feature is bugged, please report this on Discord - reduced slurry gained (using "safe" formula)')
      return obj['key1'] / 800;
    }
    return amount * get(keyUpgrades)[1]['formula'](get(keyUpgradeLevels)[1]);
  }

  static calcKeyCraftAmountGained(i: string) {
    return get(keyCrafts)[i]['baseAmount']
    * Math.pow(1.1, get(keyCraftMastery)['energizedCrystal'][0]-1)
    * get(beaconBonuses)[6];
}
  static calcChallengePointGain(n: number, type: string) {
    
    //@ts-nocheck
    const nEff = (type === 'gems'? Math.log10(n) : Math.pow(n, 0.5));
    //@ts-nocheck
    const y = nEff * ref.challengePointValues[type] || 0;
    if (get(challengeActive) == 4) return Math.pow(y/1000, 1.5)
    else return y;
  }
}