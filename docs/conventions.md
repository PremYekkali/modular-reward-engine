# Coding and Safety Conventions

This project follows strict conventions to reduce risk and improve auditability.

## General Rules

- Prefer custom errors over revert strings
- Use explicit visibility for all functions and variables
- Follow checks effects interactions pattern
- Avoid silent rounding and implicit assumptions

## Solidity Practices

- External calls must be isolated
- State updates must occur before token transfers
- Loops over dynamic arrays must be gas bounded

## Testing Expectations

- Edge cases must be explicitly tested
- Failure paths must be covered
- Invariants should hold across all state transitions
