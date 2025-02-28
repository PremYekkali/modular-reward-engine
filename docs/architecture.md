# Architecture Overview

The Modular Reward Engine is designed as a standalone reward accounting
component that can be integrated into a variety of onchain protocols.

The system intentionally separates reward logic from protocol specific
state such as staking balances or vault positions.

---

## Core Components

### RewardManager

The `RewardManager` contract is the core accounting engine.

Responsibilities:
- Track global reward distribution state
- Track per user reward accrual
- Distribute pre funded ERC20 reward tokens

Non responsibilities:
- Calculating user shares
- Minting reward tokens
- Managing protocol specific user funds
- Governance or access control beyond a trusted reporter

---

### External Share Reporter

An external system is responsible for:
- Calculating user ownership as shares
- Calling `onSharesUpdated` whenever shares change
- Ensuring share updates are accurate and consistent

The reward engine assumes this reporter is trusted.

---

### Reward Funding Source

Reward tokens must be transferred into the `RewardManager` contract
before rewards can be distributed.

The engine does not:
- Mint tokens
- Enforce funding schedules
- Verify funding sources

Insufficient funding will cause reward payouts to fail.

---

## Interaction Flow

1. External system updates user shares via `onSharesUpdated`
2. Reward accounting is refreshed
3. Pending rewards are settled if applicable
4. Reward tokens are transferred when claimed or during share updates

---

## Trust Assumptions

The correctness of the reward engine depends on:
- Accurate share reporting by the reporter
- Proper reward funding before notification

Violating these assumptions may result in incorrect reward distribution.
