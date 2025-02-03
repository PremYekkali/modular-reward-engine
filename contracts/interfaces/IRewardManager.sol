// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title IRewardManager
/// @notice Interface for reward distribution contracts
interface IRewardManager {
    function onStakeUpdate(
        address user,
        uint256 newBalance
    ) external;

    function claim(address user) external;
}
