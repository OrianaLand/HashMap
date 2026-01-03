const murmur3 = require("murmurhash3");

class Node {
  constructor(key, next = null) {
    this.key = key;
    this.next = next;
  }
}

class HashSet {
  constructor() {
    this.buckets = new Array(16).fill(null);
    this.loadFactor = 0.75;
    this.capacity = this.buckets.length;
    this.occupiedFlags = new Array(16);
    this.size = 0;
  }

  hash(key) {
    return murmur3.murmur32Sync(key);
  }

  getIndex(key) {
    let hash = this.hash(key);
    let index = Math.abs(hash) % this.buckets.length;
    return Math.floor(index);
  }

  set(key) {
    let index = this.getIndex(key);
    if (this.buckets[index] === null) {
      //Create first nide in bucket
      this.buckets[index] = new Node(key);
      this.occupiedFlags[index] = true;
      this.size++;
    } else {
      //traverse linked list
      let current = this.buckets[index];
      let prev = null;

      while (current) {
        if (current.key === key) {
          //if key already exists, no-op
          return;
        }
        prev = current;
        current = current.next;
      }
      // Add new node at end
      prev.next = new Node(key);
      this.size++;
    }

    //Check if we need to resize
    const occupiedCount = this.occupiedFlags.filter((flag) => flag).length;
    if (occupiedCount / this.capacity > this.loadFactor) {
      this.resize();
    }
  }

  has(key) {
    let index = this.getIndex(key);
    let current = this.buckets[index];

    while (current) {
      if (current.key == key) {
        return true;
      }
      current = current.next;
    }
    return false;
  }

  remove(key) {
    let index = this.getIndex(key);
    let current = this.buckets[index];
    let prev = null;

    while (current) {
      if (current.key === key) {
        if (prev === null) {
          //Removing first node in bucket
          this.buckets[index] = current.next;
        } else {
          prev.next = current.next;
        }
        this.size--;

        //update occupied flag if bucket becomes empty
        if (this.buckets[index] === null) {
          this.occupiedFlags[index] = false;
        }
        return true; // Key found and removed
      }

      //Move to next node in the linked list
      prev = current;
      current = current.next;
    }
    return false; //Key not found
  }

  length() {
    return this.size;
  }

  keys() {
    const keys = [];
    for (let i = 0; i < this.buckets.length; i++) {
      if (this.occupiedFlags[i] && this.buckets[i]) {
        let current = this.buckets[i];
        while (current) {
          keys.push(current.key);
          current = current.next;
        }
      }
    }
    return keys;
  }

  resize() {
    const oldBuckets = this.buckets;
    const oldOccupiedFlags = this.occupiedFlags;

    // Double the capacity
    this.capacity *= 2;
    this.buckets = new Array(this.capacity).fill(null);
    this.occupiedFlags = new Array(this.capacity).fill(false);
    this.size = 0;

    // Rehash all entries
    for (let i = 0; i < oldBuckets.length; i++) {
      if (oldOccupiedFlags[i] && oldBuckets[i]) {
        let current = oldBuckets[i];
        while (current) {
          this.set(current.key);
          current = current.next;
        }
      }
    }

    console.log("Capacity (number of buckets) is now: ", this.capacity);
  }

  clear() {
    this.buckets = new Array(16).fill(null);
    this.capacity = this.buckets.length;
    this.occupiedFlags = new Array(this.capacity).fill(false);
    this.size = 0;
  }
}

const hashSet = new HashSet();
hashSet.set("Anna");
hashSet.set("Bob");
hashSet.set("Carlos");
hashSet.set("Diana");
hashSet.set("Fergie");
hashSet.set("Grett");
hashSet.set("Helen");
hashSet.set("Inna");
hashSet.set("Jane");
hashSet.set("Kayle");
hashSet.set("Luna");
hashSet.set("Maria");
hashSet.set("Nancy");
hashSet.set("Oriana");
hashSet.set("Patricia");
hashSet.set("Quantavia");
hashSet.set("Rita");
hashSet.set("Sarah");
hashSet.set("Tania");
hashSet.set("Umma");
hashSet.set("Victoria");
hashSet.set("Wanda");
hashSet.set("Xena");
hashSet.set("Zoe");

/*---TEST---*/
console.log("TESTING HASHSET");
console.log("Total keys: ", hashSet.length());
console.log("Has 'Bob': ", hashSet.has("Bob"));
console.log("Has 'Carlos': ", hashSet.has("Carlos"));
hashSet.remove("Carlos");
console.log("Remove 'Carlos'");
console.log("Has 'Carlos': ", hashSet.has("Carlos"));
console.log("Total keys: ", hashSet.length());
console.log("KEYS:");
console.log(hashSet.keys());
hashSet.clear();
console.log("CLEAR ALL KEYS");
console.log("KEYS:");
console.log(hashSet.keys());
console.log("Total keys: ", hashSet.length());
