# ATM System - Low Level Design (LLD)

## Overview

ATM machine: withdraw, deposit, check balance. State-based flow.

## Requirements

- Insert card, enter PIN
- Withdraw / Deposit / Check balance
- Cash dispenser, receipt printer (simplified)

## Design Patterns

- **State Machine**: NoCard, HasCard, HasPin
- **Chain of Responsibility**: Cash dispenser (optional)

## States

1. **NoCard** → insert card → HasCard
2. **HasCard** → enter PIN → HasPin
3. **HasPin** → withdraw/deposit/balance → HasPin or eject → NoCard
