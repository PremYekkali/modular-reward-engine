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

        uint256 internal constant PRECISION = 1e18;

    function _updateRewards(uint256 rewardAmount) internal {
        if (totalStaked == 0) {
            return;
        }

        rewardData.accRewardPerShare +=
            (rewardAmount * PRECISION) / totalStaked;

        rewardData.totalDistributed += rewardAmount;
        rewardData.lastUpdateTime = block.timestamp;
    }

    function _pendingReward(address user) internal view returns (uint256) {
        uint256 accumulated =
            (balanceOf[user] * rewardData.accRewardPerShare) / PRECISION;

        return accumulated - userRewardDebt[user];
    }

}

