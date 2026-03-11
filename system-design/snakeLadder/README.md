# Snake & Ladder - Low Level Design (LLD)

## Overview

Multiplayer Snake and Ladder board game.

## Requirements

- N×N board
- Snakes (head → tail, go down)
- Ladders (start → end, go up)
- Players take turns, roll dice
- Win: reach last cell

## Core Components

- **Board**: cells, special entities (Snake/Ladder)
- **Snake/Ladder**: Template Method (SpecialEntity)
- **Dice**: random 1-6
- **Player**: position, name
- **Game**: orchestrates turns

## Design Patterns

- **Template Method**: SpecialEntity (Snake/Ladder)
- **Composition**: Board has SpecialEntities

## Usage

```javascript
const game = new SnakeLadderGame(10);
game.addSnake(14, 7);
game.addLadder(4, 25);
game.addPlayer('Alice');
game.addPlayer('Bob');
game.play();
```
