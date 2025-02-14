const { ethers } = require("hardhat");

async function deployRewardSystem() {
    const [owner, reporter, user] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("MockERC20");
    const token = await Token.deploy();

    const RewardManager = await ethers.getContractFactory("RewardManager");
    const rewardManager = await RewardManager.deploy(
        reporter.address,
        token.target
    );

    return { owner, reporter, user, token, rewardManager };
}

module.exports = { deployRewardSystem };
