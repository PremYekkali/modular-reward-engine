// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @notice Global reward accounting state
/// @dev
/// accRewardPerShare represents the cumulative rewards earned per share,
/// scaled by PRECISION to avoid precision loss.
///
/// totalDistributed tracks the total amount of reward tokens accounted
/// for distribution by the engine.
///
/// lastUpdateTime is updated whenever reward accounting is refreshed.
struct RewardData {
    uint256 accRewardPerShare;
    uint256 lastUpdateTime;
    uint256 totalDistributed;
}
