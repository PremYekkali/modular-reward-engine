// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./RewardTypes.sol";
import "./RewardErrors.sol";

/// @title RewardManager
/// @notice Core contract responsible for reward accounting and distribution
contract RewardManager {
    uint256 public totalStaked;

    mapping(address => uint256) public balanceOf;

    RewardData internal rewardData;

    mapping(address => uint256) internal userRewardDebt;
}
