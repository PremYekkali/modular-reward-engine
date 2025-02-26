// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @notice Thrown when a zero value is provided where a non zero value is required
error ZeroAmount();

/// @notice Thrown when a caller is not authorized to perform the action
/// @dev
/// Used to protect reporter only functions and critical reward flows.
error Unauthorized();

/// @notice Thrown when an invalid or unsupported configuration is detected
/// @dev
/// This error signals incorrect integration rather than runtime failure.
error InvalidStrategy();

/// @notice Thrown when a user attempts to claim rewards but none are available
error NoRewardsAvailable();
