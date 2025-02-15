# Reward Funding Model

The reward engine does not mint reward tokens.

Reward tokens must be transferred into the RewardManager contract
before distribution occurs.

If the contract balance is insufficient, reward payouts will fail.

## Reward Notification

Funding reward tokens alone does not trigger distribution.

The reporter must explicitly notify the reward engine using `notifyReward`
to make newly funded rewards available for claiming.