export default class formula {
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
        console.log(array)
        return array.reduce((sum, value) => sum + value, 0);
      }
    
    static calcFameGainKeys(array: Array<number>) {
        const FINAL = array.map((x,i) => Math.pow(x, 0.25+i*0.03));
        return FINAL;
    }

}