// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../core/RewardManager.sol";

contract RewardManagerHarness is RewardManager {
    constructor(address reporter, address rewardToken)
        RewardManager(reporter, rewardToken)
    {}

    function exposedUpdateRewards(uint256 amount) external {
        _updateRewards(amount);
    }
}
