"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayMath = void 0;
class ArrayMath {
    static sum(arr) {
        let sum = 0;
        for (let i in arr) {
            sum += arr[i];
        }
        return parseFloat(sum.toFixed(6));
    }
}
exports.ArrayMath = ArrayMath;
