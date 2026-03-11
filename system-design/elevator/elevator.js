/**
 * Elevator System - State Machine, Strategy
 */

const ElevatorState = Object.freeze({
  IDLE: 'IDLE',
  MOVING_UP: 'MOVING_UP',
  MOVING_DOWN: 'MOVING_DOWN',
  DOOR_OPEN: 'DOOR_OPEN',
});

class Elevator {
  constructor(id, totalFloors) {
    this.id = id;
    this.totalFloors = totalFloors;
    this.currentFloor = 0;
    this.state = ElevatorState.IDLE;
    this.requests = [];
  }

  requestFloor(floor) {
    if (!this.requests.includes(floor)) this.requests.push(floor);
    this.requests.sort((a, b) => a - b);
  }

  move() {
    if (this.requests.length === 0) {
      this.state = ElevatorState.IDLE;
      return;
    }
    const next = this.requests[0];
    if (next > this.currentFloor) {
      this.state = ElevatorState.MOVING_UP;
      this.currentFloor++;
    } else if (next < this.currentFloor) {
      this.state = ElevatorState.MOVING_DOWN;
      this.currentFloor--;
    } else {
      this.state = ElevatorState.DOOR_OPEN;
      this.requests.shift();
      console.log(`Elevator ${this.id} opened at floor ${this.currentFloor}`);
    }
  }

  getDistanceTo(floor) {
    return Math.abs(this.currentFloor - floor);
  }
}

class ElevatorController {
  constructor(numElevators, totalFloors) {
    this.elevators = Array.from({ length: numElevators }, (_, i) =>
      new Elevator(i + 1, totalFloors)
    );
    this.totalFloors = totalFloors;
  }

  requestElevator(floor, direction) {
    const idle = this.elevators.filter(e => e.state === ElevatorState.IDLE);
    const best = idle.length > 0
      ? idle.reduce((a, b) => a.getDistanceTo(floor) < b.getDistanceTo(floor) ? a : b)
      : this.elevators.reduce((a, b) => a.getDistanceTo(floor) < b.getDistanceTo(floor) ? a : b);
    best.requestFloor(floor);
    return best.id;
  }

  step() {
    this.elevators.forEach(e => e.move());
  }
}

// Demo
if (require.main === module) {
  const ctrl = new ElevatorController(2, 10);
  ctrl.requestElevator(5, 'up');
  console.log('Request sent to elevator');
  for (let i = 0; i < 6; i++) ctrl.step();
}

module.exports = { Elevator, ElevatorController, ElevatorState };
