/**
 * LRU Cache - O(1) get/put using HashMap + Doubly Linked List
 */

class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map(); // key -> Node
    this.head = new Node(0, 0); // dummy head (most recent)
    this.tail = new Node(0, 0); // dummy tail (LRU)
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  _addToHead(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  _removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  _moveToHead(node) {
    this._removeNode(node);
    this._addToHead(node);
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key);
    this._moveToHead(node);
    return node.value;
  }

  put(key, value) {
    if (this.map.has(key)) {
      const node = this.map.get(key);
      node.value = value;
      this._moveToHead(node);
      return;
    }
    const node = new Node(key, value);
    this.map.set(key, node);
    this._addToHead(node);
    if (this.map.size > this.capacity) {
      const lru = this.tail.prev;
      this._removeNode(lru);
      this.map.delete(lru.key);
    }
  }
}

// Demo
if (require.main === module) {
  const cache = new LRUCache(2);
  cache.put(1, 1);
  cache.put(2, 2);
  console.log('get(1):', cache.get(1)); // 1
  cache.put(3, 3); // evicts 2
  console.log('get(2):', cache.get(2)); // -1
  console.log('get(3):', cache.get(3)); // 3
}

module.exports = { LRUCache };
