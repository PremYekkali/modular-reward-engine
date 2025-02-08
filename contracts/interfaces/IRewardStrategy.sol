// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title IRewardStrategy
/// @notice Defines how rewards are released over time
interface IRewardStrategy {
    function rewardAmount(
        uint256 lastUpdateTime,
        uint256 currentTime
    ) external view returns (uint256);
}
