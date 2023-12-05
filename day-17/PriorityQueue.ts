export class PriorityQueue<T> {
  private heap: T[];
  private compare: (a: T, b: T) => number;

  constructor(compare: (a: T, b: T) => number) {
    this.heap = [];
    this.compare = compare;
  }

  private getParentIndex(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  private getLeftChildIndex(index: number): number {
    return 2 * index + 1;
  }

  private getRightChildIndex(index: number): number {
    return 2 * index + 2;
  }

  private swap(index1: number, index2: number) {
    const temp = this.heap[index1];
    this.heap[index1] = this.heap[index2];
    this.heap[index2] = temp;
  }

  push(item: T): void {
    this.heap.push(item);
    let index = this.heap.length - 1;

    while (index > 0 && this.compare(this.heap[index], this.heap[this.getParentIndex(index)]) < 0) {
      this.swap(index, this.getParentIndex(index));
      index = this.getParentIndex(index);
    }
  }

  pop(): T | undefined {
    if (this.heap.length === 0) {
      return undefined;
    }

    const item = this.heap[0];
    this.heap[0] = this.heap[this.heap.length - 1];
    this.heap.pop();

    let index = 0;
    while (true) {
      const leftChildIndex = this.getLeftChildIndex(index);
      const rightChildIndex = this.getRightChildIndex(index);
      let smallestChildIndex: number;

      if (leftChildIndex < this.heap.length && this.compare(this.heap[leftChildIndex], this.heap[index]) < 0) {
        smallestChildIndex = leftChildIndex;
      } else {
        smallestChildIndex = index;
      }

      if (rightChildIndex < this.heap.length && this.compare(this.heap[rightChildIndex], this.heap[smallestChildIndex]) < 0) {
        smallestChildIndex = rightChildIndex;
      }

      if (smallestChildIndex === index) {
        break;
      }

      this.swap(index, smallestChildIndex);
      index = smallestChildIndex;
    }

    return item;
  }

  size(): number {
    return this.heap.length;
  }
}
