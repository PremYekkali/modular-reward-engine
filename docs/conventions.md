# Coding and Safety Conventions

This document describes the conventions followed by the Modular Reward Engine.
These rules are intentionally strict to reduce audit surface and ambiguity.

---

## General Principles

- Prefer correctness and clarity over feature richness
- Keep reward logic isolated from protocol specific state
- Avoid implicit assumptions or hidden behavior

---

## Solidity Practices

- Use custom errors instead of revert strings
- Explicitly specify visibility for all functions and variables
- Follow checks-effects-interactions pattern for external calls
- Avoid silent rounding or implicit precision assumptions
- Defensive checks may exist even if unreachable under normal flows

---

## External Calls

- All token transfers must be isolated in a single helper function
- State updates must occur before external token transfers
- External integrations must be treated as trusted but fallible

---

## Testing Expectations

- All meaningful execution paths must be covered
- Defensive branches may be tested via harnesses or corrupted state
- Mock contracts should not be included in coverage metrics
- Tests should never weaken core invariants to satisfy coverage

---

## Documentation

- Public and internal functions must include NatSpec
- Assumptions and trust boundaries must be documented
- Documentation should reflect actual behavior, not future plans
