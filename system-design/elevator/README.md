# Elevator System - Low Level Design (LLD)

## Overview

Elevator control system: request floor, move up/down, open/close doors.

## Requirements

- Multiple elevators
- Request from floor (up/down)
- Elevator moves to requested floor
- Door open/close states

## Design Patterns

- **State Machine**: Idle, MovingUp, MovingDown, DoorOpen
- **Strategy**: Elevator selection (nearest, least busy)

## Core Components

- **Elevator**: current floor, direction, state
- **ElevatorController**: manages elevators, assigns requests
- **Request**: floor, direction
