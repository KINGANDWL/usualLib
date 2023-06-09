export class ArrayMath{
    static sum(arr: number[]): number {
        let sum: number = 0;
        for (let i in arr) {
            sum += arr[i];
        }
        return parseFloat(sum.toFixed(6));
    }
}