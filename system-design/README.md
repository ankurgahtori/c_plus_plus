# System Design - Low Level Design (LLD) Collection

Collection of **10 most common LLD interview questions** with JavaScript implementations.

**Design patterns** are reusable solutions to recurring problems in software design. If you've written maintainable code for a few years, you've likely used many of these patterns without knowing their names—you faced a problem and arrived at a solution that turns out to be a well-known pattern. This doc helps you **recognize and name** what you've already done, and apply patterns more deliberately.

---

## SOLID Principles (Quick Reference)

These principles underpin most design patterns. Brief examples:

| Principle | One-liner | Example |
|-----------|-----------|---------|
| **S**ingle Responsibility | One class, one reason to change | `UserService` handles auth; `UserRepository` handles DB. Don't mix. |
| **O**pen/Closed | Open for extension, closed for modification | Add `NearestToEntryStrategy` without editing `ParkingLot`—inject it. |
| **L**iskov Substitution | Subtypes must be substitutable for base | `Car` and `Truck` extend `Vehicle`; code using `Vehicle` works with both. |
| **I**nterface Segregation | Many small interfaces > one fat interface | `Flyable` + `Swimmable` instead of `Animal` with 20 methods. |
| **D**ependency Inversion | Depend on abstractions, not concretions | `ParkingLot` takes `ParkingStrategy` (interface), not `FirstAvailableStrategy` (concrete). |

```javascript
// S: Split responsibilities
class UserService { login() {} }      // auth logic
class UserRepository { save() {} }    // persistence

// O: Extend via new classes, not by editing existing
class FirstAvailableStrategy { findSpot() {} }
class NearestToEntryStrategy { findSpot() {} }  // add without touching ParkingLot

// L: Subtypes interchangeable
const v = Math.random() > 0.5 ? new Car() : new Truck();
lot.park(v);  // works for both

// I: Small interfaces
// Bad: class Bird { fly(); swim(); run(); }
// Good: class Sparrow implements Flyable, Runnable {}

// D: Inject abstraction
class ParkingLot {
  constructor(strategy) { this.strategy = strategy; }  // not new FirstAvailableStrategy()
}
```

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

## Which Pattern to Pick? (Decision Table)

Use this in interviews when the interviewer asks "why this pattern?"

| You see this problem... | Pick this pattern | Not this one | Why? |
|------------------------|-------------------|--------------|------|
| Need one shared instance across the app | **Singleton** | Global variable | Controlled access, lazy init, testable |
| Object creation depends on runtime type | **Factory** | `new` with `if/else` | Centralizes creation, Open/Closed |
| Object has 5+ optional params | **Builder** | Telescoping constructor | Readable, step-by-step, validates at build |
| Algorithm varies but structure is same | **Strategy** | `if/else` branches | Swappable at runtime, each testable alone |
| Same algorithm skeleton, steps differ | **Template Method** | Copy-paste with tweaks | Reuse skeleton, override only what varies |
| Multiple things react to one event | **Observer** | Manual callbacks everywhere | Loose coupling, dynamic subscribe/unsubscribe |
| Object behavior changes with state | **State Machine** | Nested `if (state === ...)` | Each state is a class, transitions explicit |
| Need undo/redo or snapshots | **Memento** | Cloning entire object | Preserves encapsulation, stack-based history |
| Need undo/redo with replayable actions | **Command** | Direct method calls | Encapsulate as objects, queue/log/replay |
| Incompatible interface from 3rd party | **Adapter** | Rewrite the 3rd party | Wrap once, no changes to either side |
| Add behavior without subclassing | **Decorator** | Giant inheritance tree | Compose wrappers, add/remove at runtime |
| Tree of items treated uniformly | **Composite** | `instanceof` checks | Leaf and composite share same interface |
| Request handled by unknown handler | **Chain of Responsibility** | Giant `switch` | Each handler decides, flexible ordering |
| Create families of related objects | **Abstract Factory** | Multiple separate factories | One factory per family, swap entire family |
| Control access or add lazy loading | **Proxy** | Modify original class | Transparent wrapper, same interface |

---

## Code Smell → Pattern Cheat Sheet

When reviewing code, these smells point to a pattern:

| Code Smell | Pattern to Consider |
|------------|-------------------|
| Long `switch` on object type | Factory |
| `if/else if/else if` on mode/algorithm | Strategy |
| `if (state === 'x') ... else if (state === 'y')` in every method | State Machine |
| Constructor with 8+ parameters | Builder |
| Copy-pasted method with slight variations | Template Method |
| Manual notification to 5 different services | Observer |
| Multiple `new ClassName()` scattered everywhere | Factory / Singleton |
| Wrapper class that just translates calls | Adapter (you're already doing it) |
| Nested decorators / middleware `.use()` | Decorator / Chain of Responsibility |
| "Save state, do something, maybe rollback" | Memento or Command |

---

## Common Design Patterns Reference

Design patterns are grouped into three categories: **Creational** (object creation), **Structural** (object composition), and **Behavioral** (object interaction and responsibility).

**Suggested order:** Start with Singleton, Factory, Strategy—you've likely used these. Then Observer, State Machine. Structural (Adapter, Decorator, Composite) come up when integrating or composing systems.

| Creational | Structural | Behavioral |
|------------|------------|------------|
| Singleton | Adapter | Strategy |
| Factory | Decorator | Template Method |
| Abstract Factory | Composite | Observer |
| Builder | Proxy | State Machine |
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

**Trade-off:** Essentially a glorified global—hard to mock in unit tests; hides dependencies. Avoid in DI-heavy systems; prefer injecting the instance instead.

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

**Trade-off:** The factory `switch` itself grows with each new type. For large families, consider Abstract Factory or a registry map instead.

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

**Trade-off:** Overkill for objects with 2-3 params. Adds boilerplate (builder class alongside the target class). Use only when construction is genuinely complex.

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

**Trade-off:** Adds indirection. If both interfaces are under your control, refactor instead of wrapping. Best for 3rd-party or legacy code you can't change.

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

**Trade-off:** Deep nesting of decorators is hard to debug. Stack traces become long. Keep decorator chains shallow (2-3 levels).

---

#### Composite

**Purpose:** Compose objects into tree structures. Lets clients treat individual objects and compositions uniformly. Part-whole hierarchies.

**When to use:** When you have a tree structure of objects and want clients to treat leaves and composites the same way.

**Benefits:** Uniform treatment of single and composite objects; easy to add new kinds of components; simplifies client code.

**Use cases:** Shopping cart with items, file systems (files and folders), UI component trees, organization charts.

```javascript
class CartItem { getSubtotal() { return this.price * this.qty; } }
class ProductBundle {
  constructor(items) { this.items = items; }
  getSubtotal() { return this.items.reduce((s, i) => s + i.getSubtotal(), 0); }
}
// Client: item.getSubtotal() works for both single item and bundle
```

*Example:* Shopping cart treats a single `CartItem` and a `ProductBundle` (group of items) the same—both have `getSubtotal()`. Client code doesn't care if it's one item or a bundle.

**Trade-off:** Makes it harder to restrict certain operations to specific types. If leaves and composites have very different behaviors, forcing a uniform interface can feel unnatural.

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

*Problem → Solution:* Without Strategy, you'd have `if (mode === 'first') {...} else if (mode === 'nearest') {...}` inside `ParkingLot`. With Strategy, each algorithm is a class; `ParkingLot` delegates to whichever one is injected. Add new algorithms without touching `ParkingLot` (Open/Closed).

**Trade-off:** Overkill if you'll only ever have one algorithm. Adds a class per algorithm. Use only when you genuinely have (or expect) 2+ interchangeable behaviors.

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

**Trade-off:** Rigid—uses inheritance, which is harder to change than composition. If steps vary a lot, Strategy (composition) is more flexible.

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

**Trade-off:** Can lead to unexpected cascading updates; hard to debug notification order. Memory leaks if observers aren't unsubscribed. Keep observer lists short.

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

*Problem → Solution:* Without State, you'd have `if (this.state === 'idle') { ... } else if (this.state === 'hasCoin') { ... }` in every method. With State, each state is a class; the machine delegates. Add a new state = add a new class, no changes to existing code.

**Trade-off:** Class explosion—each state is a new class. For 2-3 simple states, a plain `switch` might be cleaner. Use when states have meaningfully different behavior.

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

**Trade-off:** Every action becomes a class. Overkill for simple direct method calls. Worth it only when you need undo, queueing, or logging.

---

#### Chain of Responsibility

**Purpose:** Pass a request along a chain of handlers. Each handler decides whether to process the request or pass it to the next handler.

**When to use:** When multiple objects can handle a request and the handler isn't known a priori, or when you want to decouple senders from receivers.

**Benefits:** Decouples sender from receiver; flexible—add or reorder handlers; single responsibility per handler.

**Use cases:** ATM cash dispenser, middleware pipelines, event bubbling, validation chains.

```javascript
class CashHandler {
  constructor(next, denom) { this.next = next; this.denom = denom; }
  dispense(amount) {
    const count = Math.floor(amount / this.denom);
    const remainder = amount % this.denom;
    if (this.next && remainder > 0) this.next.dispense(remainder);
  }
}
// Chain: $100 -> $50 -> $20
```

*Example:* ATM dispenses cash—request goes to $100 handler, then $50, then $20. Each handler uses what it can and passes the remainder. Add new denominations by adding handlers.

**Trade-off:** Request might go unhandled if no handler matches. Debug is tricky—you need to trace the entire chain. Always have a fallback/default handler.

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

**Trade-off:** Memory-heavy if state is large or saved frequently. Cap the history stack or use incremental diffs instead of full snapshots.

---

### Additional Patterns (Interview-Worthy)

#### Abstract Factory (Creational)

**Purpose:** Create families of related objects without specifying concrete classes. One factory per product family; swap the entire family by swapping the factory.

**When to use:** When your system needs to support multiple themes, platforms, or configurations—each with a set of related objects.

**Benefits:** Ensures objects from the same family are used together; swapping families is one-line change; follows Open/Closed.

**Use cases:** UI themes (DarkThemeFactory / LightThemeFactory each produce Button, Input, Modal), cross-platform widgets, database dialects.

```javascript
class DarkThemeFactory {
  createButton() { return new DarkButton(); }
  createInput() { return new DarkInput(); }
}
class LightThemeFactory {
  createButton() { return new LightButton(); }
  createInput() { return new LightInput(); }
}
function buildUI(factory) {
  const btn = factory.createButton();
  const inp = factory.createInput();
}
buildUI(new DarkThemeFactory());
```

*Example:* App supports dark/light themes. `DarkThemeFactory` produces `DarkButton` + `DarkInput`; swap to `LightThemeFactory` and all components change together.

**Trade-off:** Heavy—a new class for every product in every family. Use only when product families are real and swapped as a unit. Overkill for 1-2 objects.

---

#### Proxy (Structural)

**Purpose:** Provide a surrogate or placeholder for another object to control access to it. Same interface as the real object, but adds behavior (lazy loading, access control, logging, caching).

**When to use:** When you want to add a layer in front of an object without changing its interface—for access control, lazy initialization, remote calls, or caching.

**Benefits:** Transparent to client (same interface); separates cross-cutting concerns; can defer expensive operations.

**Use cases:** API rate limiting, image lazy loading, access control proxies, caching proxy, virtual proxy for heavy objects.

```javascript
class HeavyImage {
  constructor(url) { this.data = fetchFromDisk(url); } // expensive
  display() { render(this.data); }
}
class ImageProxy {
  constructor(url) { this.url = url; this.image = null; }
  display() {
    if (!this.image) this.image = new HeavyImage(this.url); // lazy load
    this.image.display();
  }
}
// Client uses ImageProxy exactly like HeavyImage
```

*Example:* Image gallery—`ImageProxy` shows a placeholder until the user scrolls to it, then loads the real `HeavyImage`. Client code calls `display()` on both the same way.

**Trade-off:** Adds indirection and latency on first access. Can be confusing if developers don't realize they're talking to a proxy. Keep proxy logic thin.

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
