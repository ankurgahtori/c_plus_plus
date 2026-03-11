/**
 * Tic-Tac-Toe - LLD
 */

const PLAYER = { X: 'X', O: 'O' };

class TicTacToe {
  constructor(size = 3) {
    this.size = size;
    this.board = Array(size).fill(null).map(() => Array(size).fill(null));
    this.currentPlayer = PLAYER.X;
    this.moves = 0;
  }

  move(row, col) {
    if (this.board[row][col]) throw new Error('Cell occupied');
    this.board[row][col] = this.currentPlayer;
    this.moves++;
    const winner = this._checkWin(row, col);
    this.currentPlayer = this.currentPlayer === PLAYER.X ? PLAYER.O : PLAYER.X;
    return winner;
  }

  _checkWin(row, col) {
    const p = this.board[row][col];
    const n = this.size;
    // Row
    if (this.board[row].every(c => c === p)) return p;
    // Col
    if (this.board.every(r => r[col] === p)) return p;
    // Diag
    if (row === col && this.board.every((r, i) => r[i] === p)) return p;
    if (row + col === n - 1 && this.board.every((r, i) => r[n - 1 - i] === p)) return p;
    return this.moves === n * n ? 'DRAW' : null;
  }

  getWinner() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c]) {
          const w = this._checkWin(r, c);
          if (w && w !== 'DRAW') return w;
        }
      }
    }
    return this.moves === this.size * this.size ? 'DRAW' : null;
  }
}

// Demo
if (require.main === module) {
  const g = new TicTacToe();
  g.move(0, 0); g.move(1, 0); g.move(0, 1); g.move(1, 1); g.move(0, 2);
  console.log('Winner:', g.getWinner()); // X
}

module.exports = { TicTacToe, PLAYER };
