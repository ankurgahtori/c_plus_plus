# Parking Lot - Low Level Design (LLD)

## Overview

A parking lot management system that handles vehicle parking, spot allocation, and payment processing.

---

## Requirements

### Functional
- Park different vehicle types (Car, Motorcycle, Truck)
- Unpark vehicle and collect payment
- Find available parking spot based on vehicle type
- Support multiple floors with multiple spots per floor
- Generate parking ticket on entry
- Process payment on exit

### Non-Functional
- Extensible for new vehicle types
- Support different parking strategies
- Thread-safe for concurrent operations (conceptually)

---

## Core Components

### 1. Vehicle (Abstract)
- **Car** → needs COMPACT or LARGE spot
- **Motorcycle** → needs MOTORCYCLE, COMPACT, or LARGE spot
- **Truck** → needs LARGE spot only

### 2. ParkingSpot
- Has unique ID, type (SpotType), availability status
- `park(vehicle)` / `unpark()`

### 3. ParkingLot (Singleton)
- Manages all floors
- `park(vehicle)` → returns Ticket or null
- `unpark(ticketId)` → returns Payment info
- Uses **ParkingStrategy** (Strategy pattern)

### 4. Ticket & Payment
- Ticket: ticketId, vehicle, spot, entryTime
- Payment: amount, type (CASH, CARD, UPI)

---

## Design Patterns
- **Singleton**: ParkingLot
- **Strategy**: ParkingStrategy (FirstAvailableStrategy)
- **Template Method**: Vehicle (getCompatibleSpotTypes)
- **Factory**: Vehicle subclasses

---

## Usage

```javascript
const lot = ParkingLot.getInstance();
lot.initialize(2, 10);
const car = new Car("ABC-1234");
const ticket = lot.park(car);
const payment = lot.unpark(ticket.ticketId);
```
