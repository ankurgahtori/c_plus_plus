/**
 * Parking Lot - Low Level Design Implementation
 * Design Patterns: Singleton, Strategy, Template Method, Factory
 */

// ============ Enums ============
const SpotType = Object.freeze({
  MOTORCYCLE: 'MOTORCYCLE',
  COMPACT: 'COMPACT',
  LARGE: 'LARGE',
});

const VehicleType = Object.freeze({
  MOTORCYCLE: 'MOTORCYCLE',
  CAR: 'CAR',
  TRUCK: 'TRUCK',
});

const PaymentType = Object.freeze({
  CASH: 'CASH',
  CARD: 'CARD',
  UPI: 'UPI',
});

// ============ Vehicle (Template Method) ============
class Vehicle {
  constructor(licensePlate, type) {
    this.licensePlate = licensePlate;
    this.type = type;
  }
  getCompatibleSpotTypes() {
    throw new Error('Subclass must implement getCompatibleSpotTypes');
  }
}

class Motorcycle extends Vehicle {
  constructor(licensePlate) {
    super(licensePlate, VehicleType.MOTORCYCLE);
  }
  getCompatibleSpotTypes() {
    return [SpotType.MOTORCYCLE, SpotType.COMPACT, SpotType.LARGE];
  }
}

class Car extends Vehicle {
  constructor(licensePlate) {
    super(licensePlate, VehicleType.CAR);
  }
  getCompatibleSpotTypes() {
    return [SpotType.COMPACT, SpotType.LARGE];
  }
}

class Truck extends Vehicle {
  constructor(licensePlate) {
    super(licensePlate, VehicleType.TRUCK);
  }
  getCompatibleSpotTypes() {
    return [SpotType.LARGE];
  }
}

// ============ Parking Spot ============
class ParkingSpot {
  constructor(id, type, floorNumber) {
    this.id = id;
    this.type = type;
    this.floorNumber = floorNumber;
    this.isAvailable = true;
    this.vehicle = null;
  }
  park(vehicle) {
    if (!this.isAvailable) throw new Error(`Spot ${this.id} is not available`);
    this.vehicle = vehicle;
    this.isAvailable = false;
  }
  unpark() {
    if (this.isAvailable) throw new Error(`Spot ${this.id} is already available`);
    const vehicle = this.vehicle;
    this.vehicle = null;
    this.isAvailable = true;
    return vehicle;
  }
  canFitVehicle(vehicle) {
    return vehicle.getCompatibleSpotTypes().includes(this.type);
  }
}

// ============ Parking Floor ============
class ParkingFloor {
  constructor(floorNumber, spots) {
    this.floorNumber = floorNumber;
    this.spots = spots;
  }
  getAvailableSpot(vehicle) {
    return this.spots.find((s) => s.isAvailable && s.canFitVehicle(vehicle));
  }
}

// ============ Strategy Pattern ============
class ParkingStrategy {
  findSpot(floors, vehicle) {
    throw new Error('Implement findSpot');
  }
}

class FirstAvailableStrategy extends ParkingStrategy {
  findSpot(floors, vehicle) {
    for (const floor of floors) {
      const spot = floor.getAvailableSpot(vehicle);
      if (spot) return spot;
    }
    return null;
  }
}

// ============ Ticket & Payment ============
class Ticket {
  static _idCounter = 1;
  constructor(vehicle, spot) {
    this.ticketId = `TKT-${Ticket._idCounter++}`;
    this.vehicle = vehicle;
    this.spot = spot;
    this.entryTime = new Date();
  }
  getDurationInHours() {
    return (Date.now() - this.entryTime.getTime()) / (1000 * 60 * 60);
  }
}

class Payment {
  constructor(amount, paymentType, ticketId) {
    this.amount = amount;
    this.paymentType = paymentType;
    this.ticketId = ticketId;
  }
}

// ============ Parking Lot (Singleton) ============
class ParkingLot {
  static _instance = null;
  static getInstance() {
    if (!ParkingLot._instance) ParkingLot._instance = new ParkingLot();
    return ParkingLot._instance;
  }
  constructor() {
    this.floors = [];
    this.tickets = new Map();
    this.parkingStrategy = new FirstAvailableStrategy();
    this.hourlyRate = 2;
  }
  initialize(numFloors, spotsPerFloor) {
    this.floors = [];
    let spotId = 1;
    const mc = Math.floor(spotsPerFloor * 0.2);
    const compact = Math.floor(spotsPerFloor * 0.4);
    const large = spotsPerFloor - mc - compact;
    for (let f = 0; f < numFloors; f++) {
      const spots = [];
      for (let i = 0; i < mc; i++) spots.push(new ParkingSpot(spotId++, SpotType.MOTORCYCLE, f + 1));
      for (let i = 0; i < compact; i++) spots.push(new ParkingSpot(spotId++, SpotType.COMPACT, f + 1));
      for (let i = 0; i < large; i++) spots.push(new ParkingSpot(spotId++, SpotType.LARGE, f + 1));
      this.floors.push(new ParkingFloor(f + 1, spots));
    }
  }
  park(vehicle) {
    const spot = this.parkingStrategy.findSpot(this.floors, vehicle);
    if (!spot) return null;
    spot.park(vehicle);
    const ticket = new Ticket(vehicle, spot);
    this.tickets.set(ticket.ticketId, ticket);
    return ticket;
  }
  unpark(ticketId, paymentType = PaymentType.CASH) {
    const ticket = this.tickets.get(ticketId);
    if (!ticket) throw new Error(`Invalid ticket: ${ticketId}`);
    const amount = Math.ceil(ticket.getDurationInHours()) * this.hourlyRate;
    ticket.spot.unpark();
    this.tickets.delete(ticketId);
    return new Payment(amount, paymentType, ticketId);
  }
}

// Demo
if (require.main === module) {
  const lot = ParkingLot.getInstance();
  lot.initialize(2, 10);
  const car = new Car('ABC-1234');
  const ticket = lot.park(car);
  console.log('Parked:', ticket?.ticketId);
  console.log('Unpark:', lot.unpark(ticket.ticketId));
}

module.exports = { ParkingLot, Car, Motorcycle, Truck, SpotType, PaymentType };
