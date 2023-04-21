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
    
    static calcFameGainKeys(array: Array<number>) {
        const FINAL = array.map((x,i) => Math.pow(x, 0.25+i*0.03));
        return FINAL;
    }

    static calcFameGemMulti(n: number) {
      return (n > 1e20 ? 20 + Math.pow(Math.log10(n-50),2.5) : Math.log10(n+1))
    }

    static calcFameBeaconMulti(n: number) {
      return (n > 1e10 ? 2000 + Math.pow((n-1e10) / 10000, 0.35): Math.pow(n / 10000, 0.33))
    }

}