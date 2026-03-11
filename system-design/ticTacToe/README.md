# Tic-Tac-Toe - Low Level Design (LLD)

## Overview

Classic 3x3 Tic-Tac-Toe game with two players (X and O).

## Requirements

- 3x3 board
- Two players alternate turns
- Win: 3 in a row (horizontal, vertical, diagonal)
- Draw when board full

## Core Components

- **Board**: 3x3 grid, track moves
- **Player**: X or O
- **Game**: orchestrates turns, checks win/draw

## Usage

```javascript
const game = new TicTacToe();
game.move(0, 0);  // X
game.move(1, 0);  // O
game.move(0, 1);  // X
// ...
game.getWinner();  // 'X' | 'O' | 'DRAW' | null
```
