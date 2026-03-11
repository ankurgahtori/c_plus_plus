# System Design - Low Level Design (LLD) Collection

Collection of **10 most common LLD interview questions** with JavaScript implementations.

---

## LLD Problems Index

| # | Problem | Folder | Design Patterns |
|---|---------|--------|-----------------|
| 1 | [Parking Lot](parkingLot/) | `parkingLot/` | Singleton, Strategy, Template Method, Factory |
| 2 | [LRU Cache](lruCache/) | `lruCache/` | Data Structures (HashMap + Doubly Linked List) |
| 3 | [Tic-Tac-Toe](ticTacToe/) | `ticTacToe/` | Game State, Strategy |
| 4 | [Vending Machine](vendingMachine/) | `vendingMachine/` | State Machine, Factory |
| 5 | [Snake & Ladder](snakeLadder/) | `snakeLadder/` | Template Method, Composition |
| 6 | [Movie Ticket Booking](movieTicketBooking/) | `movieTicketBooking/` | Observer, Factory |
| 7 | [Elevator System](elevator/) | `elevator/` | State Machine, Strategy |
| 8 | [Library Management](libraryManagement/) | `libraryManagement/` | Factory, Composition |
| 9 | [ATM System](atm/) | `atm/` | State Machine, Chain of Responsibility |
| 10 | [Shopping Cart](shoppingCart/) | `shoppingCart/` | Composite, Strategy |

---

## Run Any LLD

```bash
node system-design/parkingLot/parkingLot.js
node system-design/lruCache/lruCache.js
# ... etc
```

---

## Common Design Patterns Reference

Design patterns are grouped into three categories: **Creational** (object creation), **Structural** (object composition), and **Behavioral** (object interaction and responsibility).

| Creational | Structural | Behavioral |
|------------|------------|------------|
| Singleton | Adapter | Strategy |
| Factory | Decorator | Template Method |
| Builder | Composite | Observer |
| | | State Machine |
| | | Command |
| | | Chain of Responsibility |
| | | Memento |

---

### Creational

Patterns that deal with object creation mechanisms.

#### Singleton

**Purpose:** Ensure a class has only one instance and provide a global access point to it.

**When to use:** When exactly one instance of a class is needed to coordinate actions across the system (e.g., database connection, configuration manager, logging service).

**Benefits:** Controlled access to the sole instance; avoids global variables; lazy initialization possible.

**Use cases:** Connection pools, thread pools, caching, application config, parking lot manager.

```javascript
class Database {
  static _instance = null;
  static getInstance() {
    if (!Database._instance) Database._instance = new Database();
    return Database._instance;
  }
}
```

*Example:* A parking lot manager—only one instance coordinates all floors and spots. Same `getInstance()` used from entry gate, exit gate, and admin dashboard.

---

#### Factory (Simple Factory)

**Purpose:** Centralize object creation logic. Clients request objects without knowing the concrete class; the factory decides which class to instantiate based on input.

**When to use:** When object creation involves branching logic, or when the exact type depends on runtime conditions. Hides creation complexity from the client.

**Benefits:** Loose coupling—client depends on abstraction, not concrete classes; single place to add new types; easier to mock in tests.

**Use cases:** Creating vehicles (Car, Truck, Motorcycle), UI components, database connections, notification channels (Email, SMS, Push).

```javascript
function createVehicle(type, plate) {
  switch (type) {
    case 'car': return new Car(plate);
    case 'truck': return new Truck(plate);
    default: throw new Error('Unknown type');
  }
}
```

*Example:* Parking lot receives `"car"` or `"truck"` from a sensor—factory returns the right vehicle type without the gate logic knowing concrete classes.

---

#### Builder

**Purpose:** Separate the construction of a complex object from its representation. Same construction process can create different representations. Provides a fluent API for step-by-step construction.

**When to use:** When an object has many optional parameters, or when construction involves multiple steps that should be readable and flexible.

**Benefits:** Clear, readable construction; immutable objects possible; optional parameters handled elegantly; validation at build time.

**Use cases:** Query builders, HTTP request builders, configuration objects, test data factories, document builders.

```javascript
class QueryBuilder {
  select(...f) { this.query.select = f; return this; }
  where(c) { this.query.where = c; return this; }
  build() { return this.query; }
}
```

*Example:* Building a search query step-by-step: `.select('id','name').where({status:'active'}).build()`—readable, flexible, no giant constructor.

---

### Structural

Patterns that deal with object composition and relationships.

#### Adapter

**Purpose:** Convert the interface of a class into another interface clients expect. Lets classes work together that couldn't otherwise because of incompatible interfaces. Acts as a wrapper/translator.

**When to use:** When you need to use an existing class whose interface doesn't match what your code expects, or when integrating third-party libraries with different APIs.

**Benefits:** Reuse of existing code; single place for interface translation; follows Open/Closed—add adapters without changing existing code.

**Use cases:** Integrating legacy systems, wrapping external APIs, database drivers, payment gateway integrations, logging libraries.

```javascript
class Adapter {
  constructor(oldAPI) { this.old = oldAPI; }
  fetch() { return { data: this.old.getData() }; }
}
```

*Example:* Legacy payment API returns `{amount, ref}` but your cart expects `{data: {...}}`. Adapter wraps the old API so the cart can call `fetch()` without changes.

---

#### Decorator

**Purpose:** Attach additional responsibilities to an object dynamically. Provides a flexible alternative to subclassing for extending functionality. Wraps the original object and delegates to it while adding behavior.

**When to use:** When you need to add behavior to individual objects at runtime without affecting other objects of the same class. When subclassing would lead to an explosion of classes.

**Benefits:** Single Responsibility—each decorator adds one concern; more flexible than inheritance; can combine decorators in any order.

**Use cases:** Adding logging, caching, encryption to streams; UI components (borders, scrollbars); coffee add-ons; middleware in web frameworks.

```javascript
class MilkDecorator {
  constructor(coffee) { this.coffee = coffee; }
  cost() { return this.coffee.cost() + 2; }
}
```

*Example:* Start with plain coffee (5), wrap with `MilkDecorator` (+2), then `SugarDecorator` (+1)—final cost 8. Add/remove add-ons without changing base class.

---

#### Composite

**Purpose:** Compose objects into tree structures. Lets clients treat individual objects and compositions uniformly. Part-whole hierarchies.

**When to use:** When you have a tree structure of objects and want clients to treat leaves and composites the same way.

**Benefits:** Uniform treatment of single and composite objects; easy to add new kinds of components; simplifies client code.

**Use cases:** Shopping cart with items, file systems (files and folders), UI component trees, organization charts.

*Example:* Shopping cart treats a single `CartItem` and a `ProductBundle` (group of items) the same—both have `getSubtotal()`. Client code doesn't care if it's one item or a bundle.

---

### Behavioral

Patterns that deal with object interaction, communication, and responsibility assignment.

#### Strategy

**Purpose:** Define a family of algorithms, encapsulate each one, and make them interchangeable at runtime. The client delegates to a strategy object instead of implementing the algorithm directly.

**When to use:** When you have multiple ways to perform the same task and want to switch between them without changing client code (e.g., sorting, payment methods, spot-finding in parking lot).

**Benefits:** Open/Closed principle—add new strategies without modifying existing code; eliminates conditional logic; easy to test each strategy in isolation.

**Use cases:** Sorting algorithms, payment processing, discount calculations, parking spot selection, compression algorithms.

```javascript
class SortStrategy { sort(data) { throw new Error('Implement'); } }
class QuickSort extends SortStrategy { sort(data) { return data.sort(); } }
class Sorter { constructor(strategy) { this.strategy = strategy; }
  sort(data) { return this.strategy.sort(data); } }
```

*Example:* Parking lot uses `FirstAvailableStrategy` to find a spot. Swap to `NearestToEntryStrategy` without changing `ParkingLot`—just inject a different strategy.

---

#### Template Method

**Purpose:** Define the skeleton of an algorithm in a base class. Subclasses override specific steps without changing the overall structure. The base class calls the overridden methods.

**When to use:** When multiple classes share the same algorithm structure but differ in some steps (e.g., data processing pipelines, game entities with different behaviors).

**Benefits:** Code reuse; enforces a consistent algorithm flow; subclasses fill in only the varying parts.

**Use cases:** Data import (CSV, JSON, XML with same flow), Snake/Ladder entities, report generation, unit test setup/teardown.

```javascript
class Processor {
  process() { const d = this.fetch(); return this.save(this.transform(d)); }
  fetch() { throw new Error('Implement'); }
  transform(d) { throw new Error('Implement'); }
  save(d) { throw new Error('Implement'); }
}
```

*Example:* Snake and Ladder both extend `SpecialEntity`—same `getActionPosition()` / `getEndPosition()`, but Snake goes down, Ladder goes up. Same board logic, different behavior.

---

#### Observer

**Purpose:** Define a one-to-many dependency. When the subject (publisher) changes state, all observers (subscribers) are notified and updated automatically.

**When to use:** When a change in one object requires updating an unknown number of other objects, or when objects should stay loosely coupled.

**Benefits:** Loose coupling between subject and observers; dynamic relationships—observers can subscribe/unsubscribe at runtime; supports broadcast communication.

**Use cases:** Event systems, MVC (model notifies views), stock tickers, booking notifications, chat applications, reactive UIs.

```javascript
class Subject {
  constructor() { this.observers = []; }
  subscribe(o) { this.observers.push(o); }
  notify(data) { this.observers.forEach(o => o.update(data)); }
}
```

*Example:* Movie ticket booking—when a seat is booked, `Show` notifies all subscribed users (email, SMS). Add new notification types by adding observers, no change to booking logic.

---

#### State Machine (State Pattern)

**Purpose:** Allow an object to alter its behavior when its internal state changes. The object appears to change its class. Each state is a separate class that handles requests for that state.

**When to use:** When an object's behavior depends on its state and has many conditional branches based on that state (e.g., order status, workflow, device modes).

**Benefits:** Eliminates complex conditional logic; each state is a separate class—easier to add new states; state transitions are explicit and clear.

**Use cases:** Vending machines, ATMs, TCP connection states, order lifecycle, elevator states, workflow engines.

```javascript
class VendingMachine {
  setState(state) { this.state = state; }
  insertCoin() { this.state.insertCoin(this); }
  selectProduct() { this.state.selectProduct(this); }
}
```

*Example:* Vending machine: `IdleState` → insert coin → `HasCoinState` → select product → `DispenseState`. Each state handles the same actions differently (e.g., "insert coin" in Idle vs HasCoin).

---

#### Command

**Purpose:** Encapsulate a request as an object. Parameterize clients with different requests, queue or log requests, and support undoable operations. Decouples the invoker from the receiver.

**When to use:** When you need to parameterize objects by an action to perform, queue requests, support undo/redo, or implement callbacks.

**Benefits:** Decouples invoker from receiver; easy to add new commands; supports undo/redo; can batch, queue, or log commands.

**Use cases:** GUI buttons/menus, job queues, undo/redo systems, macro recording, transactional operations.

```javascript
class LightOnCommand {
  constructor(light) { this.light = light; }
  execute() { this.light.on(); }
}
```

*Example:* Remote control stores `LightOnCommand` and `LightOffCommand`. Press button → `execute()`. Commands can be queued for macros or logged for audit.

---

#### Chain of Responsibility

**Purpose:** Pass a request along a chain of handlers. Each handler decides whether to process the request or pass it to the next handler.

**When to use:** When multiple objects can handle a request and the handler isn't known a priori, or when you want to decouple senders from receivers.

**Benefits:** Decouples sender from receiver; flexible—add or reorder handlers; single responsibility per handler.

**Use cases:** ATM cash dispenser, middleware pipelines, event bubbling, validation chains.

*Example:* ATM dispenses cash—request goes to $100 handler, then $50, then $20. Each handler uses what it can and passes the remainder. Add new denominations by adding handlers.

---

#### Memento

**Purpose:** Capture and externalize an object's internal state so it can be restored later—without exposing the object's structure. Enables undo, rollback, or checkpoint/restore.

**When to use:** When you need to save and restore an object's state, support undo/redo, or implement snapshots (e.g., editors, games, configuration).

**Benefits:** Preserves encapsulation—originator doesn't expose internals; easy to add checkpoints; supports multiple undo levels with a history stack.

**Use cases:** Text editor undo, game save/load, form draft recovery, configuration rollback, database transactions.

```javascript
class Memento {
  constructor(state) { this.state = { ...state }; }
  getState() { return this.state; }
}
class Editor {
  constructor() { this.content = ''; }
  write(text) { this.content += text; }
  save() { return new Memento({ content: this.content }); }
  restore(m) { this.content = m.getState().content; }
}
// Usage: history.push(editor.save()); editor.restore(history.pop());
```

*Example:* Text editor—each keystroke can push a `Memento` onto a history stack. Undo pops the memento and restores the editor. Game save writes memento to disk; load reads and restores.

---

## File Structure

```
system-design/
├── README.md                    # This file
├── parkingLot/
│   ├── README.md
│   └── parkingLot.js
├── lruCache/
│   ├── README.md
│   └── lruCache.js
├── ticTacToe/
│   ├── README.md
│   └── ticTacToe.js
├── vendingMachine/
│   ├── README.md
│   └── vendingMachine.js
├── snakeLadder/
│   ├── README.md
│   └── snakeLadder.js
├── movieTicketBooking/
│   ├── README.md
│   └── movieTicketBooking.js
├── elevator/
│   ├── README.md
│   └── elevator.js
├── libraryManagement/
│   ├── README.md
│   └── libraryManagement.js
├── atm/
│   ├── README.md
│   └── atm.js
└── shoppingCart/
    ├── README.md
    └── shoppingCart.js
```
