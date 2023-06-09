export class ListNode<T>{
    constructor(v: T) {
        this.v = v;
    }
    v: T
    pre: ListNode<T> | null = null
    next: ListNode<T> | null = null
    /**
     * 后面插入
     * @param node 
     */
    append(node: ListNode<T>) {
        if (this.next != null) {
            let nextTemp = this.next;
            this.next = node
            node.pre = this;
            node.next = nextTemp;
            nextTemp.pre = node;
        } else {
            this.next = node
            node.pre = this;
        }
    }
    /**
     * 前面插入
     * @param node 
     */
    prepend(node: ListNode<T>) {
        if (this.pre != null) {
            let preTemp = this.pre;
            this.pre = node
            node.next = this;
            node.pre = preTemp;
            preTemp.next = node;
        } else {
            this.pre = node
            node.next = this;
        }
    }
    /**
     * 删除前面
     * @param node 
     */
    removeFront(): ListNode<T> {
        if (this.pre != null) {
            let preTemp = this.pre;
            if (preTemp.pre != null) {
                let prepreTemp = preTemp.pre
                prepreTemp.next = this
                this.pre = prepreTemp;
            } else {
                this.pre = null
            }
            return preTemp
        }
        return null;
    }
    /**
     * 删除后面
     * @param node 
     */
    removeBehind(): ListNode<T> {
        if (this.next != null) {
            let nextTemp = this.next;
            if (nextTemp.next != null) {
                let nextnextTemp = nextTemp.next
                nextnextTemp.pre = this
                this.next = nextnextTemp;
            } else {
                this.next = null
            }
            return nextTemp
        }
        return null;
    }
    /**
     * 断开前面（断开后将丢失前面所有信息）
     * @param node 
     */
    disconnectFront(): ListNode<T> {
        if (this.pre != null) {
            let preTemp = this.pre;

            this.pre = null
            preTemp.next = null;

            return preTemp
        }
        return null;
    }
    /**
     * 断开后面（断开后将丢失后面所有信息）
     * @param node 
     */
    disconnectBehind(): ListNode<T> {
        if (this.next != null) {
            let nextTemp = this.next;

            this.next = null
            nextTemp.pre = null

            return nextTemp
        }
        return null;
    }
}


// 双向链表
export class DoublyLinkedList<T>{
    head: ListNode<T> = null
    tail: ListNode<T> = null
    private length: number = 0
    constructor(arr?: T[]) {
        if (arr != null && arr.length > 0) {
            for (let each of arr) {
                this.push(each)
            }
        }
    }
    copy(): DoublyLinkedList<T> {
        let newList = new DoublyLinkedList<T>()
        let current = this.head;
        while (current != null) {
            newList.push(current.v);
            current = current.next
        }
        return newList
    }
    concat(list: DoublyLinkedList<T>) {
        if (list != null && list.size() > 0) {
            list.forEach((item, index) => {
                this.push(item)
            })
        }
        return this
    }
    splice(startIndex: number, deleteNumber: number, ...items: T[]) {
        if (startIndex < 0) {
            startIndex += this.length
            if (startIndex < 0) {
                startIndex = 0
            }
        };
        if (deleteNumber < 0) deleteNumber = 0;
        if (this.head != null) {
            let startNode = this.head;
            let frontLen = 0;//起始位置前的个数
            let endFrontLen = 0;
            for (let i = 0; i < startIndex; i++) {
                if (startNode.next != null) {
                    startNode = startNode.next;
                    frontLen++;
                }
            }
            endFrontLen = frontLen;

            let endNode = startNode;
            for (let i = 0; i < deleteNumber; i++) {
                if (endNode != null) {
                    endNode = endNode.next;
                    endFrontLen++;
                }
            }

            // 启动删除
            if (endFrontLen != frontLen && startIndex < this.length) {
                // 这里的startIndex < oldLen是由于判断依据是 if (endNode != null)，因此还需要判断是否真正的需要删除 

                this.length = (this.length - (endFrontLen - frontLen) + items.length)
                if (startNode.pre != null) {
                    let startPreNode = startNode.pre;
                    startPreNode.disconnectBehind();

                    for (let eachItem of items) {
                        let temp = new ListNode(eachItem);
                        startPreNode.append(temp)
                        // 逐个往下推进
                        startPreNode = temp;
                    }

                    if (endNode != null) {
                        endNode.disconnectFront()
                        startPreNode.append(endNode)
                    } else {
                        this.tail = startPreNode;
                    }
                    return;
                } else if (endNode != null) {
                    endNode.disconnectFront();
                    for (let i = items.length - 1; i >= 0; i--) {
                        let temp = new ListNode(items[i])
                        endNode.prepend(temp)
                        endNode = temp;
                    }
                    this.head = endNode;
                    return
                } else {
                    // 全删了
                    this.head = null;
                    this.tail = null;
                    this.length = 0;
                }
            }
        }

        // 空元素直接插入
        for (let eachItem of items) {
            this.push(eachItem);
        }
    }
    forEach(fun: (item: T, index: number) => void) {
        let current = this.head;
        let _index: number = 0;
        while (current != null) {
            fun(current.v, _index);
            current = current.next
            _index++;
        }
    }

    size(): number {
        return this.length
    }

    /**
     * 尾插法
     * @param value 
     */
    push(value: T) { //尾插
        let newNode = new ListNode(value);
        if (this.tail == null) { //说明头部尾部都为空
            this.head = newNode
            this.tail = newNode
        } else {
            this.tail.append(newNode);
            this.tail = this.tail.next;
        }
        this.length++;
    }
    /**
     * 尾部弹出
     */
    pop(): T { //尾部出
        if (this.tail != null) {
            let tailTemp = this.tail
            let preTail = this.tail.pre;
            if (preTail == null) {
                this.head = null
                this.tail = null
            } else {
                preTail.removeBehind()
                this.tail = preTail;
            }
            this.length--;
            return tailTemp.v;
        }
        return null;
    }
    /**
     * 头插入
     * @param value 
     */
    unshift(value: T) { //头插
        let newNode = new ListNode(value);
        if (this.head == null) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.head.prepend(newNode)
            this.head = this.head.pre
        }
        this.length++;
    }
    /**
     * 头部弹出
     */
    shift(): T { //头部出
        if (this.head != null) {
            let headTemp = this.head;
            let nextHead = headTemp.next;
            if (nextHead == null) {
                this.head = null
                this.tail = null
            } else {
                nextHead.removeFront()
                this.head = nextHead;
            }
            this.length--;
            return headTemp.v;
        }
        return null;
    }
    /**
     * 更新节点
     * @param index 
     * @param value 
     */
    set(index: number, value: T): boolean {
        if (index < 0) return false
        let newNode = new ListNode(value);
        if (this.head == null) {
            this.head = newNode
            this.tail = newNode
        } else {
            let current = this.head;
            for (let i = 0; i < index; i++) {
                if (current.next != null) {
                    current = current.next;
                } else {
                    // 没找到合适位置
                    return false;
                }
            }
            current.v = value;
            return true
        }
    }
    /**
     * 获取节点
     * @param index 
     */
    get(index: number): T {
        if (index < 0) return null
        if (this.head == null) {
            return null
        } else {
            let current = this.head;
            for (let i = 0; i < index; i++) {
                if (current.next != null) {
                    current = current.next;
                } else {
                    return null
                }
            }
            return current.v;
        }
    }
    /**
     * 删除节点
     * @param index 
     */
    delete(index: number): T {
        if (this.head == null) {
            return null
        } else {
            if (index == 0) {
                return this.shift()
            } else if (index == this.length - 1) {
                return this.pop()
            } else {
                let current = this.head;
                for (let i = 0; i < index; i++) {
                    if (current.next != null) {
                        current = current.next;
                    } else {
                        return null
                    }
                }
                current.pre.removeBehind();
                this.length--;
                return current.v;
            }
        }
    }
    insert(index: number, value: T): boolean {
        if (this.head == null) {
            this.push(value)
            return true;
        } else {
            if (index == 0) {
                this.unshift(value)
                return true;
            } else if (index == this.length) {
                this.push(value)
                return true;
            } else {
                let current = this.head;
                for (let i = 0; i < index; i++) {
                    if (current.next != null) {
                        current = current.next;
                    } else {
                        return false
                    }
                }
                current.prepend(new ListNode(value));
                this.length++;
                return true;
            }
        }
    }
    toArray(): T[] {
        let all = [];
        if (this.head != null) {
            let last = this.head;
            while (last != null) {
                all.push(last.v)
                last = last.next
            }
        }
        return all;
    }
    toString(): string {
        let all = [];
        if (this.head != null) {
            let last = this.head;
            while (last != null) {
                all.push(last.v)
                last = last.next
            }
        }
        return JSON.stringify(all);
    }
}


// let list = new DoublyLinkedList([1,2,3,4]);
// console.log(list.toString(),list.size())
// console.log(list.get(0))
// console.log(list.get(1))
// console.log(list.get(2))
// console.log(list.get(3))
// console.log(list.get(4))

// list.insert(0,88)
// list.insert(list.size(),99)
// list.insert(list.size()-1,999)
// console.log(list.toString(),list.size())

// list.push(4)
// list.push(4)
// console.log(list.toString(),list.size())

// list.pop()
// list.pop()
// console.log(list.toString(),list.size())

// list.unshift(5)
// list.unshift(5)
// console.log(list.toString(),list.size())

// list.shift()
// list.shift()
// console.log(list.toString(),list.size())

// list.delete(0)
// list.delete(0)
// console.log(list.toString(),list.size())

// list.delete(list.size() - 1)
// // list.delete(list.size() - 1)
// console.log(list.toString(),list.size())