// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../interfaces/IRewardStrategy.sol";

contract LinearEmissionStrategy is IRewardStrategy {
    uint256 public immutable ratePerSecond;

    constructor(uint256 _ratePerSecond) {
        ratePerSecond = _ratePerSecond;
    }

    function rewardAmount(
        uint256 lastUpdate,
        uint256 currentTime
    ) external view returns (uint256) {
        if (currentTime <= lastUpdate) {
            return 0;
        }
        return (currentTime - lastUpdate) * ratePerSecond;
    }
}
