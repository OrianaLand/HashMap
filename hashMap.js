const murmur3 = require("murmurhash3");
const Node = require("./node");

class HashMap {
  constructor() {
    this.buckets = new Array(16).fill(null);
    this.loadFactor = 0.75;
    this.capacity = this.buckets.length;
    this.occupiedFlags = new Array(16).fill(false); // Track occupancy per bucket
    this.size = 0; // Track number of key-value pairs
  }

  hash(key) {
    return murmur3.murmur32Sync(key);
  }

  getIndex(key) {
    let hash = this.hash(key);
    let index = Math.abs(hash) % this.buckets.length;
    return Math.floor(index);
  }

  set(key, value) {
    let index = this.getIndex(key);

    if (this.buckets[index] === null) {
      //Create first nide in bucket
      this.buckets[index] = new Node(key, value);
      this.occupiedFlags[index] = true;
      this.size++;
    } else {
      //traverse linked list
      let current = this.buckets[index];
      let prev = null;

      while (current) {
        if (current.key === key) {
          //update existing node
          current.value = value;
          return;
        }
        prev = current;
        current = current.next;
      }

      prev.next = new Node(key, value);
      this.size++;
    }

    //Check if we need to resize
    const occupiedCount = this.occupiedFlags.filter((flag) => flag).length;
    if (occupiedCount / this.capacity > this.loadFactor) {
      this.resize();
    }
  }

  get(key) {
    let index = this.getIndex(key);
    let current = this.buckets[index];

    while (current) {
      if (current.key === key) {
        return current.value;
      }
      current = current.next;
    }
    return null;
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

        return true; //Key found. Key/pair removed
      }
      prev = current;
      current = current.next;
    }
    return false; //key not found
  }

  length() {
    return this.size;
  }

  clear() {
    this.buckets = new Array(16).fill(null);
    this.capacity = this.buckets.length;
    this.occupiedFlags = new Array(this.capacity).fill(false);
    this.size = 0;
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

  values() {
    const values = [];
    for (let i = 0; i < this.buckets.length; i++) {
      if (this.occupiedFlags[i] && this.buckets[i]) {
        let current = this.buckets[i];
        while (current) {
          values.push(current.value);
          current = current.next;
        }
      }
    }
    return values;
  }

  entries() {
    const entries = [];
    for (let i = 0; i < this.buckets.length; i++) {
      if (this.occupiedFlags[i] && this.buckets[i]) {
        let current = this.buckets[i];
        while (current) {
          entries.push([current.key, current.value]);
          current = current.next;
        }
      }
    }
    return entries;
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
          this.set(current.key, current.value);
          current = current.next;
        }
      }
    }

    console.log("Capacity (number of buckets) is now: ", this.capacity);
  }
}

module.exports = HashMap;
