# HashMap & HashSet Implementation

A custom HashMap and HashSet implementation in JavaScript, created as a solution to The Odin Project's HashMap assignment. This implementation features linked list chaining, automatic resizing, and efficient collision handling.

## Features

### HashMap

- **Key-Value Storage**: Store and retrieve data using string keys
- **Automatic Resizing**: Doubles capacity when load factor exceeds 0.75
- **Collision Resolution**: Uses separate chaining with linked lists
- **Complete API**: Implements all required hash map operations
- **Efficient Hashing**: Uses MurmurHash3 for good distribution

### HashSet (Extra Credit)

- **Unique Key Storage**: Store only unique keys without values
- **Same Core Logic**: Shares the same underlying implementation as HashMap
- **Set Operations**: Basic set operations like add, remove, and check existence

## Installation

1. Clone the repository:

```bash
git clone https://github.com/OrianaLand/HashMap.git
cd HashMap
```

2. Install dependencies:

```bash
npm install
```

## Usage

### importing

```JS
const HashMap = require('./hashMap');
const HashSet = require('./hashSet');
```

### HashMap Examples

```JS
const map = new HashMap();

// Setting values
map.set('apple', 'red');
map.set('banana', 'yellow');
map.set('carrot', 'orange');

// Getting values
console.log(map.get('apple')); // 'red'

// Checking existence
console.log(map.has('banana')); // true

// Removing entries
map.remove('carrot');

// Getting all keys/values/entries
console.log(map.keys());    // ['apple', 'banana']
console.log(map.values());  // ['red', 'yellow']
console.log(map.entries()); // [['apple', 'red'], ['banana', 'yellow']]

// Getting size
console.log(map.length()); // 2

// Clearing the map
map.clear();
```

### HashSet Examples

```JS
const set = new HashSet();

// Adding values
set.set('Alice');
set.set('Bob');
set.set('Charlie');

// Checking existence
console.log(set.has('Bob')); // true

// Removing values
set.remove('Charlie');

// Getting all keys
console.log(set.keys()); // ['Alice', 'Bob']
```

## API Reference

### HashMap Methods

| Method            | Parameters                    | Returns           | Description                        |
| ----------------- | ----------------------------- | ----------------- | ---------------------------------- |
| `set(key, value)` | `key` (string), `value` (any) | `void`            | Stores or updates a key-value pair |
| `get(key)`        | `key` (string)                | `any \| null`     | Retrieves value for given key      |
| `has(key)`        | `key` (string)                | `boolean`         | Checks if key exists               |
| `remove(key)`     | `key` (string)                | `boolean`         | Removes key-value pair             |
| `length()`        | —                             | `number`          | Returns number of stored pairs     |
| `clear()`         | —                             | `void`            | Removes all entries                |
| `keys()`          | —                             | `string[]`        | Returns all keys                   |
| `values()`        | —                             | `any[]`           | Returns all values                 |
| `entries()`       | —                             | `[string, any][]` | Returns all key-value pairs        |

### HashSet Methods

| Method        | Parameters     | Returns    | Description            |
| ------------- | -------------- | ---------- | ---------------------- |
| `set(key)`    | `key` (string) | `void`     | Adds a key to the set  |
| `has(key)`    | `key` (string) | `boolean`  | Checks if key exists   |
| `remove(key)` | `key` (string) | `boolean`  | Removes key from set   |
| `length()`    | —              | `number`   | Returns number of keys |
| `clear()`     | —              | `void`     | Removes all keys       |
| `keys()`      | —              | `string[]` | Returns all keys       |

### Performance Characteristics

| Operation                           | Average Case | Worst Case |
| ----------------------------------- | ------------ | ---------- |
| `set()`                             | O(1)         | O(n)       |
| `get()`                             | O(1)         | O(n)       |
| `has()`                             | O(1)         | O(n)       |
| `remove()`                          | O(1)         | O(n)       |
| `keys()` / `values()` / `entries()` | O(n)         | O(n)       |

## Implementation Details

### Data Structure

- Buckets: Array of linked lists for collision handling

- Nodes: Each bucket contains a linked list of Node objects

- Load Factor: 0.75 — triggers resizing when exceeded

- Initial Capacity: 16 buckets

### Key Features

1. Hashing: Uses the MurmurHash3 algorithm for good key distribution

2. Index Calculation: `Math.abs(hash) % capacity` to fit within the bucket array

3. Collision Resolution: Separate chaining with linked lists

4. Dynamic Resizing: Doubles capacity when load factor threshold is reached

5. Occupancy Tracking: Efficiently tracks which buckets contain data

## Resizing Logic

When the number of occupied buckets exceeds `capacity * loadFactor`:

1. Capacity is doubled
2. All existing entries are rehashed and redistributed
3. Occupancy flags are recalculated
4. Console logs new capacity for debugging

## Testing

Run the included test files:

```bash
node test.js        # Tests HashMap functionality
node hashSet.js     # Tests HashSet functionality
```

The test suite:

- Populates the data structure with multiple entries
- Tests all API methods
- Triggers resizing to verify dynamic capacity adjustment
- Tests edge cases and error conditions

## Project Structure

HashMap/
├── hashMap.js # Main HashMap implementation
├── hashSet.js # HashSet implementation (extra credit)
├── node.js # Node class for linked list
├── test.js # Comprehensive test suite
├── package.json # Dependencies and metadata
├── README.md # This documentation
└── .gitignore # Git ignore file (recommended)

## Design Decisions

1. Linked List Chaining: Chosen over open addressing for simpler implementation and better handling of high load factors

2. MurmurHash3: Provides better distribution than basic multiplicative hashing

3. Occupancy Flags: Separate array for tracking bucket usage improves performance of iteration methods

4. Modular Design: Separated Node class for reusability and clarity

5. Console Logging: Added to resize method for debugging and demonstration

## Edge Cases Handled

- Empty buckets: Properly initializes on first insertion

- Key updates: Overwrites existing values when same key is set

- Key deletion: Updates occupancy flags when buckets become empty

- Non-existent keys: Returns null or false appropriately

- Empty structures: All methods handle empty maps/sets gracefully

## Contributing

This is a learning project from The Odin Project curriculum. While contributions aren't actively sought, feel free to fork and modify for your own learning!

## License

Educational project - free to use for learning purposes.

Created as part of The Odin Project's JavaScript curriculum
