# Modular Reward Engine

![Solidity](https://img.shields.io/badge/Solidity-0.8.20-blue)
![Hardhat](https://img.shields.io/badge/Built%20With-Hardhat-yellow)
![Coverage](https://img.shields.io/badge/Coverage-100%25-brightgreen)

A minimal and reusable reward accounting and distribution engine for
Ethereum based protocols.

---

## Problem Statement

Reward logic is often tightly coupled with protocol specific contracts
such as staking, vaults, or liquidity pools. This coupling increases:

- Code duplication across protocols
- Audit surface and complexity
- Difficulty in reasoning about reward correctness

As protocols evolve, reward logic is frequently modified, making it
hard to reuse, test, and audit in isolation.

---

## Goal

The goal of this project is to provide a **standalone reward layer**
with clear accounting guarantees that can be integrated into a wide
range of protocols.

The reward engine is designed to:

- Track rewards proportionally to externally reported shares
- Distribute pre funded ERC20 reward tokens
- Remain agnostic to how shares are calculated
- Be easy to audit and reason about in isolation

---

## Non Goals

This repository intentionally does **not** include:

- Governance or access control frameworks
- Token minting or emission logic
- Share calculation logic
- Frontend or UI integrations

These concerns are expected to be handled by integrating protocols.

---

## Reward Flow Overview

The reward engine operates using an explicit, event driven model.

### 1. Share Reporting

An external system is responsible for calculating user shares.
Whenever a user’s share balance changes, the system calls:

```

onSharesUpdated(user, previousShares, newShares)

```

This allows the reward engine to:
- Settle pending rewards using the old share balance
- Apply the new share balance
- Maintain correct reward accounting

---

### 2. Reward Funding and Notification

Reward tokens must be transferred to the RewardManager contract
before they can be distributed.

Once funded, the external system notifies the engine by calling:

```

notifyReward(amount)

```

This updates global reward accounting but does not immediately
transfer tokens to users.

---

### 3. Reward Claiming

Users may claim accrued rewards at any time by calling:

```

claim(user)

```

Rewards may also be paid automatically during share updates
if pending rewards exist.

---

This separation between share reporting, reward funding, and
reward claiming keeps the reward logic simple and reusable.

---

## Design Decisions

### Explicit Reward Notification

Rewards are accounted only when explicitly notified. This avoids
implicit assumptions about emission schedules and keeps reward
funding transparent.

---

### External Share Reporting

The reward engine does not calculate shares. This allows it to be
used with staking systems, vaults, liquidity pools, or any other
mechanism that can represent user ownership as shares.

---

### Settlement on Share Updates

Pending rewards are settled using the user’s previous share balance
before applying new shares. This ordering ensures correctness across
all share changes.

---

### Minimal Scope

The engine intentionally avoids features such as governance,
multi token rewards, or emission strategies. These can be layered
on top without complicating the core accounting logic.

---

## Installation

### Clone the repository:

```bash
git clone https://github.com/PremYekkali/modular-reward-engine.git
cd modular-reward-engine
```

### Install dependencies:
```bash
npm install
```

### Compile contracts:
```bash
npm run compile
```
### Local Development
Run the test suite:
```bash
npm run test
```
Generate a coverage report:
```bash
npm run coverage
```

This project uses Hardhat for local development and testing.

---

## Basic Usage

The reward engine is intended to be driven by an external system.

### Notify Rewards

```solidity
rewardManager.notifyReward(amount);
```
This updates global reward accounting. Reward tokens must already be
transferred to the contract before calling.

---

### Update Shares

```solidity
rewardManager.onSharesUpdated(user, previousShares, newShares);
```

This settles pending rewards using the previous share balance and updates accounting.

---

### Claim Rewards

```solidity
rewardManager.claim(user);
```

Transfers accrued rewards to the specified user if available.

---

## Security Considerations

- The reporter address must be trusted to provide accurate share updates.
- Reward tokens must be funded before calling `notifyReward`.
- Incorrect share reporting can affect reward distribution.
- Defensive checks exist to guard against inconsistent accounting state.

---

## Integrator Responsibilities

Integrating protocols are responsible for:

- Calculating user shares correctly
- Calling `onSharesUpdated` when balances change
- Funding reward tokens before notifying rewards
- Monitoring contract balances to avoid payout failures

---

## Testing Philosophy

Tests focus on correctness of reward accounting and defensive behavior.
Some branches are validated using harness contracts or controlled state
manipulation to preserve invariants while achieving full coverage.

---

## Quick Start Example

A minimal integration flow:

```text
Deploy reward token
Deploy RewardManager(reporter, token)
Transfer reward tokens to RewardManager
Call notifyReward(amount)
Call onSharesUpdated(user, oldShares, newShares)
Users call claim(user)
````
---

## Trust Model

The reward engine assumes:

- The reporter provides accurate share updates
- Reward tokens are funded before notification
- Integrators manage access control around reporter permissions

