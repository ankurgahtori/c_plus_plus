/**
 * Snake & Ladder - Template Method (SpecialEntity), Composition
 */

class SpecialEntity {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
  getActionPosition() { return this.start; }
  getEndPosition() { return this.end; }
}

class Snake extends SpecialEntity {
  constructor(head, tail) {
    super(head, tail); // head > tail
  }
}

class Ladder extends SpecialEntity {
  constructor(bottom, top) {
    super(bottom, top); // bottom < top
  }
}

class Dice {
  constructor(max = 6) { this.max = max; }
  roll() { return Math.floor(Math.random() * this.max) + 1; }
}

class Player {
  constructor(name) {
    this.name = name;
    this.position = 0;
  }
}

class Board {
  constructor(size) {
    this.size = size;
    this.totalCells = size * size;
    this.specialEntities = new Map(); // position -> SpecialEntity
  }
  addSnake(head, tail) { this.specialEntities.set(head, new Snake(head, tail)); }
  addLadder(bottom, top) { this.specialEntities.set(bottom, new Ladder(bottom, top)); }
  getNextPosition(position) {
    return this.specialEntities.has(position)
      ? this.specialEntities.get(position).getEndPosition()
      : position;
  }
}

class SnakeLadderGame {
  constructor(boardSize = 10) {
    this.board = new Board(boardSize);
    this.dice = new Dice();
    this.players = [];
    this.currentPlayerIndex = 0;
  }

  addPlayer(name) { this.players.push(new Player(name)); }
  addSnake(head, tail) { this.board.addSnake(head, tail); }
  addLadder(bottom, top) { this.board.addLadder(bottom, top); }

  playTurn() {
    const player = this.players[this.currentPlayerIndex];
    const roll = this.dice.roll();
    let newPos = Math.min(player.position + roll, this.board.totalCells);
    newPos = this.board.getNextPosition(newPos);
    player.position = newPos;
    console.log(`${player.name} rolled ${roll}, now at ${newPos}`);
    if (newPos >= this.board.totalCells) return player;
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    return null;
  }

  play() {
    this.addSnake(14, 7);
    this.addLadder(4, 25);
    this.addPlayer('Alice');
    this.addPlayer('Bob');
    let winner = null;
    while (!winner) {
      winner = this.playTurn();
    }
    console.log('Winner:', winner.name);
    return winner;
  }
}

// Demo
if (require.main === module) {
  const game = new SnakeLadderGame(10);
  game.play();
}

module.exports = { SnakeLadderGame, Board, Snake, Ladder, Dice, Player };
