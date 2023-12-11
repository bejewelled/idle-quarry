import {buttonUpgradeLevels, miningUpgradeLevels, keyUpgradeLevels,
keyCraftAmount, keyCraftMastery, beaconLevels, challengeActive, wallet, 
ascensionLevels, ascensionStats, automationItemsUnlocked, masteryItemLevels, 
slurryToggles, layer, settings, enchantUpgradeLevels, deity} from '../data/player';
import { beaconBonuses } from '../data/beacons';
import {keyUpgrades, keyCrafts} from '../data/keys'
import { get } from 'svelte/store';
import ref from './ref';
import { allMultipliers } from '../data/artifacts';
import { buttonUpgrades } from '../data/button';
import { miningUpgrades } from '../data/mining';
import { antimatterBonusAscensionReqs, ascFormula } from '../data/ascension';
import { enchantUpgrades } from '../data/fame';
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
    
    static polySum2(n: number, multi: number = 1) {
      return multi * (n * (n + 1) * (2 * n + 1) / 6);
    }

    static polySum3(n: number, multi: number = 1) {
      return multi * ((n**2)*((n+1)**2)/4);
    }

    static maxNumPoly2(n: number, multi: number = 1) {
      if (multi === 0) multi = 1;
      return Math.sqrt(n / multi);
    }

    static sumFinitePoly2(start: number, end: number, multi: number = 1) {
      return multi * (end**3 - start**3) / 3
    }

    static maxFinitePoly2(n: number, p: number, nums: object, e: string, log: boolean = false) {
      const print = (e == 'antimatter' ? true : false)
      let left = n, q = p;
      if (print) console.log('left: ' + left + ' start: ' + q);
      while (left > 0) {
        if (e == 'antimatter') left -= (nums['const'] + nums['multi']*(q**2));
        else left -= (nums['const'][e] + nums['multi'][e]*(q**2));
        q++;
        if (log) console.log('left: ' + left + ' q: ' + q);
      }
      return q-1;
    }

    static maxFinitePoly3(n: number, p: number, nums: object, e: string, log: boolean = false) {
      //@ts-nocheck
      let left = n, q = p;
      while (left > 0) {
        q++;
        left -= (nums['const'][e] + nums['multi'][e]*(q**3));
      }
      return q;
    }

    static sumEssence() {
      let sum = 0;
      for (let i of Object.keys(get(wallet))) {
        if (i.startsWith('e') && i !== 'energy') {
          sum += (get(wallet)[i] || 0);
        }  
      }
      return sum;
    }

    static calcAntimatterGain() {
      return this.sumEssence()
      * get(beaconBonuses)[9]
      * get(allMultipliers)['antimatter']['formula'](get(wallet)['artifacts'] || 0);
    }

    static calcEssenceXPGain(e: string) {
      if (e == 'antimatter') return this.sumEssence();
      return get(wallet)['e'+e] || 0;
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

    static sumObject(obj: object) {
      return Object.values(obj).reduce((sum, value) => sum + value, 0);
    }
    
    static calcFameGainKeys(array: Array<number>) { 
        const keyArray = [1,1,1,1,1];
        keyArray[0] = 
        (array[0] < 1 ? 1 : 
        array[0] < 10 ? 1.25 + array[0] * 0.075 :
        array[0] < 1000 ? 2 + (array[0]-10) * 0.004 :
        6.8 + Math.pow(array[0] - 1000, 0.4));

        2 + 2*10000 + Math.pow(10000*((array[0] - 10000) / 1000), 0.4)
        for (let i = 1; i < array.length; i++) {
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
      return (Math.log10(n+1)**Math.min(1.25, 1+Math.log10(n+1)*0.0075))
    }

    static calcFameLayerMulti() {
      const l = get(layer)['layer'];
      return (l > 10000 ? 300 + Math.pow(l-10000, 0.75)*0.035
      : l * 0.03)
    }

    static calcFameGainBeacons(n: number) {
      return (n > 1e6 ? 51 + Math.pow((n - 1e6) / 1e6, 0.75)  : 
              n > 150 ? 1 + (n - 150) / 2e4 :
              n / 150)
    }

    static getButtonDistanceVals() {
      const distanceMulti = get(buttonUpgrades)[0]['formula'](get(buttonUpgradeLevels)[0]);

      return {
        good: Math.floor(10 * distanceMulti * window.devicePixelRatio),
        great: Math.floor(7 + distanceMulti * window.devicePixelRatio),
        excellent: Math.floor(3 + distanceMulti * window.devicePixelRatio),
        incredible: Math.floor(2 + distanceMulti * window.devicePixelRatio),
        perfect: Math.floor(1 + distanceMulti * window.devicePixelRatio),
      };
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

    // static calcButtonStreakBonus(n: number) {
    //   if (get(buttonUpgradeLevels)[1] < 1) return 1;
    //   return 1 + Math.pow(n,0.7)/600;
    // }

    static calcButtonRewardBonus() {
      //@ts-ignore
      const y = get(allMultipliers)['radium']['formula'](get(wallet)['radium'] || 0)
      return 1
      * get(buttonUpgrades)[1]['formula'](get(buttonUpgradeLevels)[1])
      * get(miningUpgrades)[23]['formula'](get(miningUpgradeLevels)[23])
      * (isNaN(y) ? 1 : y);
    }
    
    static calcHardenedGemBonus(obj: { [x: string]: number; }) {
      if (get(miningUpgradeLevels)[20] < 1) return 1;
        return (1 + (0.33*get(miningUpgradeLevels)[20])
        * (0.04 * (Math.log(obj['good']+9) / Math.log(9))
          + 0.06 * (Math.log(obj['great']+7) / Math.log(7))
          + 0.08* (Math.log(obj['excellent']+5) / Math.log(5))
          + 0.12 * (Math.log(obj['incredible']+3) / Math.log(3)) 
          + 0.16 * (Math.log(obj['perfect']+2) / Math.log(2))));
    }
    static dispCalcHardenedGemBonus(obj: { [x: string]: number;}, m: number) {
      if (m < 1) return 1;
        return (1 + (0.33*m)
        * (0.04 * (Math.log(obj['good']+9) / Math.log(9))
          + 0.06 * (Math.log(obj['great']+7) / Math.log(7))
          + 0.08* (Math.log(obj['excellent']+5) / Math.log(5))
          + 0.12 * (Math.log(obj['incredible']+3) / Math.log(3)) 
          + 0.16 * (Math.log(obj['perfect']+2) / Math.log(2))));
  }

  static calcMasteryNextReq() {
    const y = get(wallet)['totalTrophies'] || 0;
    const c = 1.1 + (Math.pow(y, 0.34)*0.01)
    return 1160 * (y**2) * Math.pow(c, y);
  }

  static calcKeySlurryGain(obj: { [x: string]: number; }) {
    const vals = ref.slurryGainFromKeys;
    const y = vals.reduce((sum: number, value: number, i: number) => 
    sum + (get(slurryToggles)['key'+(i+1).toString()] ? 
    value*(obj['key'+(i+1)] || 0) : 0), 0) * formula.getAntimatterBonusAtAscensionNumber(5); // get antimatter bonus if # of ascensions is 3 or more
    if (isNaN(y)) {
      alert('note: this feature is bugged, please report this on Discord - reduced slurry gained (using "safe" formula)')
      return obj['key1'] / 8e5;
    }
    return y * get(keyUpgrades)[1]['formula'](get(keyUpgradeLevels)[1]);
  
  }

  static calcCraftMasteryNextReq(lv: number) {
    return 35*(lv+1) + ((lv+1)**3)
  }

  static calcCraftMasterySpeedBonus(lv: number) {
    const y = 1 + (lv)*0.3 + ((lv)**2)*0.004 + ((lv)**3)*3e-6;
    console.log(y)
    if (isNaN(y)) return 1
    else return y
  }

  static calcBeaconPowerMulti(lv: number) {
    return (lv > 10000 ? Math.log10(lv) - 3 : 1)
  }
  
  static calcFragmentGain(t: number, amt: number) {
    return Math.pow(amt / (Math.pow(10, 6-t)), 1.1);
  }

  static calcKeySigilGain(sl: number) {
    if (sl < 1000 || get(keyUpgradeLevels)[3] == 0) return 0;
    else return sl / 1e7;
  }

  static calcKeyCraftAmountGained(i: string) {
    const min = get(keyCrafts)[i]['min'] * this.getKeyCraftBonuses()
    const max = get(keyCrafts)[i]['max'] * this.getKeyCraftBonuses()
    return Math.floor(min + Math.random()*(max-min));
  }
  static calcMinMaxCraftAmount(i: string) {
    const min = get(keyCrafts)[i]['min']
    const max = get(keyCrafts)[i]['max']
    return [min*this.getKeyCraftBonuses(), max*this.getKeyCraftBonuses()];
  }

  static getKeyCraftBonuses() {
    const y = 1 * get(beaconBonuses)[6]
    * get(keyUpgrades)[2]['formula'](get(keyUpgradeLevels)[2]);
    console.log(y)
    
    return y;
  }

  static calcmistGainFromMastery() {
    const y = (get(wallet)['totalTrophies'] || 0)
    * ascFormula.getVal('water');;
    return 0.25*y + 0.00067*y**2;
  }


  static getMineXPPerCycle() {
    const artifactMulti = get(allMultipliers)['mineXP']['formula'](get(wallet)['artifacts'] || 0)
    const y = 1 
    * (isNaN(artifactMulti) ? 1 : artifactMulti)
    * Math.max(1, Math.log((get(wallet)['totalFame'] || 0) / 6 + 1))
    if (isNaN(y)) return 1; 
    else return y;
  }

  static getLayersPerCycle() {
    const miningLevels = this.sumArray(get(miningUpgradeLevels));
    const enchantLevels = this.sumArray(get(enchantUpgradeLevels)) * 3.5;
    const buttonLevels = this.sumArray(get(buttonUpgradeLevels)) * 1.75;
    const keyLevels = this.sumArray(get(keyUpgradeLevels)) * 2.25;
    const sum = miningLevels + enchantLevels + buttonLevels + keyLevels;
    const base = 
    1 + (sum / 150)
    + get(miningUpgrades)[23]['formula'](get(miningUpgradeLevels)[23])
    + get(buttonUpgrades)[4]['formula'](get(buttonUpgradeLevels)[4]);
    return base;
  }

  static getMineSize() {
    return get(enchantUpgrades)[0]['formula'](get(enchantUpgradeLevels)[0]);
  }

  static getMineQuality() {
    return get(enchantUpgrades)[1]['formula'](get(enchantUpgradeLevels)[1]);
  }

  static getEnchantFormulaValue(i: number) {
    return get(enchantUpgrades)[i]['extFormula'](
      get(enchantUpgradeLevels)[i],
      this.getMineSize(),
      this.getMineQuality());
  }

  static getMiningUpgradeValue(i: number) {
    return get(miningUpgrades)[i]['formula'](get(miningUpgradeLevels)[i]);
  }

  static calcMiningDropSoftcapIncrease(base: number) {
    let y = 1;
    if (get(automationItemsUnlocked)['irreversible greed']) {
      y *= (1 + get(miningUpgrades)[2]['formula'](get(miningUpgradeLevels)[2]) * 0.065);
    }
    return y;
  }

  static calcDeityPower() {
    const y = (get(deity)['mistInvested'] || 0);
    const basePower = Math.log((y/1e6)+1) * 0.1;
    return basePower;
  }

  static getDeityNextReq(i: number) {
    const vals = [1000, 1e6, 1e9, 5e11, 1.5e13, 6e14, 1.8e16, 3.6e17, 6.4e18, 9.6e19]
    return vals[i];
  }

  static calcFaithGain() {
    const y = Math.pow(get(deity)['level'], 3) * Math.pow(2, get(deity)['level']-1);
    return Math.max(0, y);
  }

  static calcStarProgressGain() {
    let y = get(buttonUpgrades)[5]['formula'](get(buttonUpgradeLevels)[5]);
    return y;
  }
  static calcStarGainWhenComplete() {
    return 1;
  }

  static calcAscensionEssenceRequirement(c: number) {

    const firstTen = [30, 150, 300, 1200, 3500, 9000, 15000, 30000, 50000, 80000]

    if (c < 10) return firstTen[c];
    else return firstTen[9] + (firstTen[9]/2.5 * (c-9)) * Math.pow(1.1, c-10);
  }

  static calcRadioactivityGain() {
    const l = get(layer)['layer'];
    let y;
    if (l <= 100) y = 1;
    else if (l <= 1e5) (y = 1 + 1.2*((l-100) * (0.0125-(l/3e7))));
    else y = 1100 + Math.pow(l, 0.75)*0.075;
    y = y
    * get(buttonUpgrades)[1]['formula'](get(buttonUpgradeLevels)[1])
    * get(allMultipliers)['radium']['formula'](get(wallet)['artifacts'] || 0)
    * this.getAntimatterBonusAtAscensionNumber(3);
    return y;
  }

  static calcRadiumGainWhenComplete() {
    return Math.max(1,1 * get(buttonUpgrades)[3]['formula'](get(buttonUpgradeLevels)[3]));
  }

  // gives radioactivity
  static calcThoriumDepositGain() {
    const min = 25000;
    const max = 90000 * get(buttonUpgrades)[2]['formula'](get(buttonUpgradeLevels)[2]);
    return Math.floor(min + Math.random()*(max-min))
  }

  // PER SECOND
  static calcCrystalGainFromRadium() {
    const y = (get(wallet)['radium'] || 0);
    if (y == 0) return 0;
    if (isNaN(y)) return 0;

    const base = (y < 1000 ? 
      y + ((y/8)**2) :
      256 + (((y-1000)/32)**2) + (y-1000)*2.75)

    const multi = get(miningUpgrades)[29]['formula'](get(miningUpgradeLevels)[29])
    * ascFormula.getVal('earth')

    return base * multi;
  }

  static getAntimatterBonusAtAscensionNumber(i: number) {
    const array = get(antimatterBonusAscensionReqs);
    if (!array.includes(i)) {
      console.error("ERROR - The ascension number " + i + " is not in the array of ascension numbers that give antimatter bonuses.");
    }
    if (get(ascensionStats)["ascensionCount"] >= i) {
      return get(ascFormula)['antimatter'](get(ascensionLevels)['antimatter'][0]);
    }
    else return 1;      
  }

  static calcEnchantProgressGain(n: number) {
    return n * ascFormula.getVal('magic');
  }

  static calcMiningCostRatio(n: number) {
    return Math.max(1.025, 
      1 + ((n-1) * this.calcMiningCostRatioMulti()))
  }

  static calcMiningCostRatioMulti() {
    return 1 * (get(miningUpgrades)[32]['formula'](get(miningUpgradeLevels)[32]))
    * (get(miningUpgrades)[33]['formula'](get(miningUpgradeLevels)[33]))
    * (get(miningUpgrades)[34]['formula'](get(miningUpgradeLevels)[34]))
    * (get(miningUpgrades)[35]['formula'](get(miningUpgradeLevels)[35]))
  }

  static calcKeyFinderAbundanceBonus(t: number) {
    if (!get(automationItemsUnlocked)['abundance']) return 1;
    const bonuses = [4096, 16, 2, 1, 1]
    return bonuses[t-1];
  }

  static calcMasteryGainPerTick() {
    const lvs = get(masteryItemLevels)
    let y = 1, i: any;
    for (i of Object.values(lvs)) {
      y *= this.calcMasteryGainMulti(i)
    }
    y *= get(allMultipliers)['mastery']['formula'](get(wallet)['artifacts'] || 0)
    console.log(y)
    return y
  }

  static calcMasteryGainMulti(lv: number) {
    return Math.pow(lv+1, 0.68)
  }
}