# Modular Reward Engine

A generic and extensible reward distribution system for Ethereum based protocols.

## Problem Statement

Reward logic is often tightly coupled with protocol specific contracts.
This increases complexity, duplication, and audit surface.

## Goal

Provide a reusable reward accounting engine that can be integrated into
protocols which track user shares externally.

The reward engine is responsible only for:
- accounting reward accrual
- distributing funded reward tokens
- maintaining per user reward correctness

## Non Goals

- Governance frameworks
- Token issuance logic
- Frontend integrations

This repository focuses strictly on reward accounting and distribution.

## Reward Flow

1. An external system reports share changes using `onSharesUpdated`
2. Rewards are funded by transferring tokens to the RewardManager
3. The reporter notifies new rewards using `notifyReward`
4. Users claim accrued rewards using `claim`

The RewardManager does not calculate shares and does not mint tokens.
