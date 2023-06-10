class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  add(value) {
    const newNode = { data: value, next: null };

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }

    this.length++;
  }

  remove(value) {
    if (!this.head) {
      return false;
    }

    let currentNode = this.head;
    let previousNode = null;

    while (currentNode) {
      if (currentNode.data === value) {
        if (previousNode) {
          previousNode.next = currentNode.next;

          if (currentNode === this.tail) {
            this.tail = previousNode;
          }
        } else {
          this.head = currentNode.next;

          if (currentNode === this.tail) {
            this.tail = null;
          }
        }

        this.length--;
        return true;
      }

      previousNode = currentNode;
      currentNode = currentNode.next;
    }

    return false;
  }

  contains(value) {
    let currentNode = this.head;

    while (currentNode) {
      if (currentNode.data === value) {
        return true;
      }

      currentNode = currentNode.next;
    }

    return false;
  }

  *[Symbol.iterator]() {
    let currentNode = this.head;

    while (currentNode) {
      yield currentNode.data;
      currentNode = currentNode.next;
    }
  }

  clear() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  count() {
    return this.length;
  }

  log() {
    let currentNode = this.head;
    const values = [];

    while (currentNode) {
      values.push(currentNode.data);
      currentNode = currentNode.next;
    }

    console.log(values.join(", "));
  }
}

function createLinkedList(arr) {
  const ll = new LinkedList();

  for (const value of arr) {
    ll.add(value);
  }

  return ll;
}

/*const ll = createLinkedList([100, 1, 2, 3, 100, 4, 5, 100]);
ll.log();
// "100, 1, 2, 3, 100, 4, 5, 100"
while (ll.remove(100));
ll.log();
// "1, 2, 3, 4, 5"
ll.add(10);
ll.log();
// "1, 2, 3, 4, 5, 10"
console.log(ll.contains(10));
// "true"
let sum = 0;
for (const n of ll) {
  sum += n;
}
console.log(sum);
// "25"
ll.clear();
ll.log();
// ""
*/