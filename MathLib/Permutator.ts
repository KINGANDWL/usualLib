import { BigNumber } from 'bignumber.js';
import { DoublyLinkedList } from '../DataStructure/DoublyLinkedList';



export class Permutator {


    private static arrange<T>(tempArr: DoublyLinkedList<T>, leftArr: DoublyLinkedList<T>, size: number, res: DoublyLinkedList<DoublyLinkedList<T>>) {
        if (tempArr.size() === size) { // 这里就是递归结束的地方
            // res.push(tempArr) // 得到全排列的每个元素都是数组
            res.push(tempArr) // 得到全排列的每个元素都是字符串
        } else {
            leftArr.forEach((item, index) => {
                let temp = leftArr.copy()
                temp.delete(index)
                // 此时，第一个参数是当前分离出的元素所在数组；第二个参数temp是传入的leftArr去掉第一个后的结果
                let t = tempArr.copy()
                t.push(item)
                Permutator.arrange(t, temp, size, res) // 这里使用了递归
            })
        }
    }
    /**
     * 【排列算法】
     * [1,2,3]的3个元素排列为[1,2,3] [1,3,2] [2,1,3] [2,3,1] [3,1,2] [3,2,1]
     * @param list 元素集合
     * @param size 排列个数
     */
    static permutation<T = any>(list: DoublyLinkedList<T>, size: number): DoublyLinkedList<DoublyLinkedList<T>> {
        let res: DoublyLinkedList<DoublyLinkedList<T>> = new DoublyLinkedList() // 所有排列结果
        if (size <= list.size()) {
            Permutator.arrange<T>(new DoublyLinkedList(), list, size, res)
        }
        return res
    }



    /**
     * 索引式（或者叫字典序法）全排列算法获得某次的排列，性能消耗较小。
     * 时间复杂度本来应该是O(n)，由于存在一些原因，时间复杂度是O(n)，空间复杂度是O(n)
     * @param arr 
     * @param index 索引，从0开始，之所以是字符串，是因为他可以计算数据非常大的情况，一般情况下这种是无法通过穷举实现的
     * @returns 如果存在返回any[ ]，不存在返回null
     */
    static permutationByIndex(arr: any[], index: string): any[] | null {
        // let arrTemp = [...arr];
        let arrTemp = new DoublyLinkedList(arr);

        let result: any[] = []
        let args: BigNumber[] = [BigNumber("1")];

        // 生成阶乘系数
        for (let i = 2; i < arrTemp.size(); i++) {
            args.unshift(BigNumber(("" + i)).times(BigNumber(args[0])))
        }

        let number_big = BigNumber(index);
        let zero = BigNumber(0)

        // 遍历系数生成每个系数的变量值
        for (let each of args) {
            let arrIndex = null;

            if (number_big.isEqualTo(zero)) {
                arrIndex = 0;
            } else {
                // 变量值向下取整，这个数字一定是js可识别范围内数字
                let _arrIndex = number_big.div(each).decimalPlaces(0, 1);
                number_big = number_big.minus(_arrIndex.times(each))
                arrIndex = parseInt(_arrIndex.toFixed())
            }

            let selected = arrTemp.get(arrIndex);

            if (selected == null) {
                return null
            }
            result.push(selected);
            arrTemp.delete(arrIndex);
        }
        result.push(arrTemp.get(0))
        return result
    }


    private static backtrack<T>(
        currentCombination: DoublyLinkedList<T>,
        arr: DoublyLinkedList<T>,
        size: number,
        combinations: DoublyLinkedList<DoublyLinkedList<T>>
    ): void {
        if (currentCombination.size() === size) {
            combinations.push(currentCombination);
            return;
        }

        arr.forEach((item, index) => {
            let newList = currentCombination.copy();
            newList.push(item);
            Permutator.backtrack(newList, arr, size, combinations);
        })
    }


    /**
     * 求元素所有的可重复组合 [1,2]结果为[1,1][1,2][2,1][2,2]
     * @param arr 元素集合
     * @param num 分组个数
     */
    static repeatCombination<T = any>(arr: DoublyLinkedList<T>, size: number): DoublyLinkedList<DoublyLinkedList<T>> {
        const combinations: DoublyLinkedList<DoublyLinkedList<T>> = new DoublyLinkedList();
        Permutator.backtrack(new DoublyLinkedList(), arr, size, combinations);
        return combinations;
    }


    private static inlineFun<T=any>(tempList: T[], inputList: T[], size: number, result: T[][]) {
        //t:临时数组 a:目标数组 m：多少个数进行组合
        if (size === 0) {
            result.push(tempList);//相当于push
            return;
        }
        for (let i = 0; i <= inputList.length - size; i++) {
            //从0开始 到n-m

            let b = tempList.slice();//将t赋值给b 不能用=赋值，使用slice会形成新的数组赋值
            b.push(inputList[i])
            Permutator.inlineFun(b, inputList.slice(i + 1), size - 1, result);
        }
    }

    /**
     * [组合算法]
     * [1,2,3,4] 的3个元素组合结果：[ [ 1, 2, 3 ], [ 1, 2, 4 ], [ 1, 3, 4 ], [ 2, 3, 4 ] ]
     * @param arr 元素集合 
     * @param size 组合个数
     */
    static combination<T=any>(arr:T[], size:number) {
        let result:T[][] = [];
        Permutator.inlineFun([], arr, size, result);
        return result;

    }
}
