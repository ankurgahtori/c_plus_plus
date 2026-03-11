/**
 * ATM System - State Machine
 */

class ATMState {
  insertCard(atm) { throw new Error('Implement'); }
  enterPin(atm, pin) { throw new Error('Implement'); }
  withdraw(atm, amount) { throw new Error('Implement'); }
  deposit(atm, amount) { throw new Error('Implement'); }
  ejectCard(atm) { throw new Error('Implement'); }
}

class NoCardState extends ATMState {
  insertCard(atm) {
    atm.setState(new HasCardState());
    console.log('Card inserted. Enter PIN.');
  }
  enterPin() { console.log('Insert card first'); }
  withdraw() { console.log('Insert card first'); }
  deposit() { console.log('Insert card first'); }
  ejectCard() { console.log('No card'); }
}

class HasCardState extends ATMState {
  insertCard() { console.log('Card already inserted'); }
  enterPin(atm, pin) {
    if (pin === atm.correctPin) {
      atm.setState(new HasPinState());
      console.log('PIN correct.');
    } else {
      console.log('Wrong PIN');
    }
  }
  withdraw() { console.log('Enter PIN first'); }
  deposit() { console.log('Enter PIN first'); }
  ejectCard(atm) {
    atm.setState(new NoCardState());
    console.log('Card ejected');
  }
}

class HasPinState extends ATMState {
  insertCard() { console.log('Card already in'); }
  enterPin() { console.log('Already authenticated'); }
  withdraw(atm, amount) {
    if (amount <= atm.balance) {
      atm.balance -= amount;
      console.log(`Withdrew $${amount}. Balance: $${atm.balance}`);
    } else {
      console.log('Insufficient balance');
    }
  }
  deposit(atm, amount) {
    atm.balance += amount;
    console.log(`Deposited $${amount}. Balance: $${atm.balance}`);
  }
  ejectCard(atm) {
    atm.setState(new NoCardState());
    console.log('Card ejected');
  }
}

class ATM {
  constructor(correctPin = '1234', initialBalance = 1000) {
    this.state = new NoCardState();
    this.correctPin = correctPin;
    this.balance = initialBalance;
  }

  setState(state) { this.state = state; }
  insertCard() { this.state.insertCard(this); }
  enterPin(pin) { this.state.enterPin(this, pin); }
  withdraw(amount) { this.state.withdraw(this, amount); }
  deposit(amount) { this.state.deposit(this, amount); }
  ejectCard() { this.state.ejectCard(this); }
}

// Demo
if (require.main === module) {
  const atm = new ATM('1234', 500);
  atm.insertCard();
  atm.enterPin('1234');
  atm.withdraw(100);
  atm.ejectCard();
}

module.exports = { ATM };
