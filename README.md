# Modular Reward Engine

A generic and extensible reward distribution system for Ethereum based protocols.

## Problem Statement

Reward logic is often tightly coupled with protocol specific contracts.
This increases complexity, duplication, and audit surface.

## Goal

Provide a reusable reward layer with clear accounting guarantees that can be integrated
into staking, vault, and protocol designs.

## Non Goals

- Governance frameworks
- Token issuance logic
- Frontend integrations

This repository focuses strictly on reward accounting and distribution.
