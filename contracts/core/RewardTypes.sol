// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @notice Shared reward accounting structures
struct RewardData {
    uint256 accRewardPerShare;
    uint256 lastUpdateTime;
    uint256 totalDistributed;
}
