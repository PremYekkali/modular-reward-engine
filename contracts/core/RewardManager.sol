// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./RewardTypes.sol";
import "./RewardErrors.sol";
import "./RewardToken.sol";

/// @title RewardManager
/// @notice Generic reward accounting and distribution engine
/// @dev
/// The RewardManager is a pure reward layer. It does not calculate user shares,
/// mint reward tokens, or manage user funds.
///
/// Core responsibilities:
/// - Track reward accrual proportionally to externally reported shares
/// - Distribute funded reward tokens to users
/// - Maintain per user reward accounting correctness
///
/// External assumptions:
/// - An external system is responsible for calculating and reporting user shares
/// - Reward tokens are funded separately and explicitly
/// - A trusted reporter notifies share changes and new rewards
///
/// This contract is intentionally minimal and opinionated to keep reward logic
/// reusable, auditable, and decoupled from protocol specific state.
contract RewardManager {
    uint256 internal constant PRECISION = 1e18;

    /// @notice Total active shares reported to the reward engine
    uint256 public totalShares;

    /// @notice Last known shares per user
    mapping(address => uint256) public userShares;

    /// @notice Reward debt per user
    mapping(address => uint256) internal userRewardDebt;

    /// @notice Global reward accounting data
    RewardData internal rewardData;

    /// @notice Address allowed to report share updates
    address public immutable reporter;

    IERC20Minimal public immutable rewardToken;

    event RewardNotified(uint256 amount);
    event SharesUpdated(address indexed user, uint256 previousShares, uint256 newShares);
    event RewardClaimed(address indexed user, uint256 amount);

    constructor(address _reporter, address _rewardToken) {
        if (_reporter == address(0) || _rewardToken == address(0)) {
            revert Unauthorized();
        }
        reporter = _reporter;
        rewardToken = IERC20Minimal(_rewardToken);
    }


    /*//////////////////////////////////////////////////////////////
                        REWARD ACCOUNTING
    //////////////////////////////////////////////////////////////*/

    function _updateRewards(uint256 rewardAmount) internal {
        if (rewardAmount == 0 || totalShares == 0) {
            rewardData.lastUpdateTime = block.timestamp;
            return;
        }

        rewardData.accRewardPerShare +=
            (rewardAmount * PRECISION) / totalShares;

        rewardData.totalDistributed += rewardAmount;
        rewardData.lastUpdateTime = block.timestamp;
    }


    function pendingReward(address user) public view returns (uint256) {
        uint256 accumulated =
            (userShares[user] * rewardData.accRewardPerShare) / PRECISION;

        if (accumulated < userRewardDebt[user]) {
            return 0;
        }
        return accumulated - userRewardDebt[user];

    }

    function _payout(address user, uint256 amount) internal {
        bool success = rewardToken.transfer(user, amount);
        if (!success) {
            revert Unauthorized();
        }
    }

    function notifyReward(uint256 amount) external {
        if (msg.sender != reporter) {
            revert Unauthorized();
        }
        if (amount == 0) {
            revert ZeroAmount();
        }

        uint256 balance = rewardToken.balanceOf(address(this));
        if (balance < amount) {
            revert Unauthorized();
        }

        _updateRewards(amount);
        emit RewardNotified(amount);
    }



    /*//////////////////////////////////////////////////////////////
                        SHARE UPDATE HOOK
    //////////////////////////////////////////////////////////////*/

    /// @notice Called by an external system reporting share changes
    /// @param user The user whose shares changed
    /// @param previousShares Shares before the update
    /// @param newShares Shares after the update
    function onSharesUpdated(
        address user,
        uint256 previousShares,
        uint256 newShares
    ) external {
        if (msg.sender != reporter) {
            revert Unauthorized();
        }

        uint256 pending = pendingReward(user);

        totalShares = totalShares - previousShares + newShares;
        userShares[user] = newShares;

        userRewardDebt[user] =
            (newShares * rewardData.accRewardPerShare) / PRECISION;

        if (pending > 0) {
            _payout(user, pending);
        }

        emit SharesUpdated(user, previousShares, newShares);
    }

    /*//////////////////////////////////////////////////////////////
                            CLAIMING
    //////////////////////////////////////////////////////////////*/

    function claim(address user) external {
        uint256 reward = pendingReward(user);

        if (reward == 0) {
            revert NoRewardsAvailable();
        }

        userRewardDebt[user] =
            (userShares[user] * rewardData.accRewardPerShare) / PRECISION;

        _payout(user, reward);
        emit RewardClaimed(user, reward);
    }
}
