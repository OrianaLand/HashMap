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
    index = (index * 31) % this.buckets.length;
    return Math.floor(index);
  }

  bucket(key) {
    let index = this.getIndex(key);

    // Initialize if null
    if (this.buckets[index] === null) {
      this.buckets[index] = [];
    }

    return this.buckets[index];
  }

  entry(bucket, key) {
    if (!bucket || !Array.isArray(bucket)) {
      return null;
    }

    for (let e of bucket) {
      if (e.key === key) {
        return e;
      }
    }
    return null;
  }

  set(key, value) {
    let index = this.getIndex(key);
    let bucket = this.bucket(key);
    let entry = this.entry(bucket, key);

    if (entry) {
      entry.value = value;
    } else {
      // Only increment occupied if this is the FIRST entry in a bucket
      if (bucket.length === 0) {
        this.occupiedFlags[index] = true;
      }

      bucket.push({ key, value });
      this.size++;
    }

    //Check if we need to resize
    const occupiedCount = this.occupiedFlags.filter((flag) => flag).length;
    if (occupiedCount / this.capacity > this.loadFactor) {
      this.resize();
    }
  }

  get(key) {
    let bucket = this.bucket(key);
    let entry = this.entry(bucket, key);

    if (entry) {
      return entry.value;
    }
    return null;
  }

  has(key) {
    let bucket = this.bucket(key);
    let entry = this.entry(bucket, key);
    return entry !== null;
  }

  remove(key) {
    let index = this.getIndex(key);
    let bucket = this.bucket(key);

    if (!bucket) return false;

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i].key === key) {
        bucket.splice(i, 1);
        this.size--;

        // If bucket becomes empty, update occupied flag
        if (bucket.length === 0) {
          this.occupiedFlags[index] = false;
        }

        return true;
      }
    }

    return false;
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
        for (let entry of this.buckets[i]) {
          keys.push(entry.key);
        }
      }
    }
    return keys;
  }

  values() {
    const values = [];
    for (let i = 0; i < this.buckets.length; i++) {
      if (this.occupiedFlags[i] && this.buckets[i]) {
        for (let entry of this.buckets[i]) {
          values.push(entry.value);
        }
      }
    }
    return values;
  }

  entries() {
    const entries = [];
    for (let i = 0; i < this.buckets.length; i++) {
      if (this.occupiedFlags[i] && this.buckets[i]) {
        for (let entry of this.buckets[i]) {
          entries.push([entry.key, entry.value]);
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
        for (let entry of oldBuckets[i]) {
          this.set(entry.key, entry.value);
        }
      }
    }

    console.log("Capacity (number of buckets) is now: ", this.capacity);
  }
}

module.exports = HashMap;
