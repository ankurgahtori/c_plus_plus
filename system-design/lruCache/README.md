# LRU Cache - Low Level Design (LLD)

## Overview

Least Recently Used (LRU) cache with O(1) get and put operations. Evicts least recently used item when capacity is exceeded.

## Requirements

- `get(key)` → value or -1
- `put(key, value)` → evict LRU if full
- O(1) time for both operations

## Design

- **HashMap**: key → Node (for O(1) lookup)
- **Doubly Linked List**: maintains access order (head = most recent, tail = LRU)
- On get: move node to head
- On put: add to head; if full, remove tail

## Usage

```javascript
const cache = new LRUCache(2);
cache.put(1, 1);
cache.put(2, 2);
cache.get(1);  // 1
cache.put(3, 3);  // evicts 2
cache.get(2);  // -1
```
