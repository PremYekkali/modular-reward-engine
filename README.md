# Modular Reward Engine

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


## Reward Flow

1. An external system reports share changes using `onSharesUpdated`
2. Rewards are funded by transferring tokens to the RewardManager
3. The reporter notifies new rewards using `notifyReward`
4. Users claim accrued rewards using `claim`

The RewardManager does not calculate shares and does not mint tokens.
