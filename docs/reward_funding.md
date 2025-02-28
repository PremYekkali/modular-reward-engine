# Reward Funding Model

The Modular Reward Engine does not mint reward tokens.
All rewards must be explicitly funded using ERC20 transfers.

---

## Funding Requirements

Before rewards can be distributed:

1. Reward tokens must be transferred to the RewardManager contract
2. The reward amount must be explicitly notified to the engine

The engine does not verify funding sources or enforce funding schedules.

---

## Notification vs Distribution

Notifying rewards updates internal accounting only.
It does not immediately transfer tokens to users.

Token transfers occur when:
- A user claims rewards
- Rewards are settled during share updates

---

## Insufficient Funding

If the RewardManager contract does not hold enough tokens:
- Reward payouts will revert
- Accounting state remains unchanged

It is the integrator’s responsibility to ensure sufficient funding.

---

## Responsibility Summary

Integrators are responsible for:
- Funding reward tokens
- Notifying rewards accurately
- Monitoring contract balances

The reward engine assumes correct funding behavior.
