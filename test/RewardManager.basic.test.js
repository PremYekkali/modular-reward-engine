const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployRewardSystem } = require("./helpers/setup");

describe("RewardManager basic flow", function () {
    it("distributes rewards based on reported shares", async function () {
        const { reporter, user, token, rewardManager } =
            await deployRewardSystem();

        // fund rewards
        await token.mint(rewardManager.target, ethers.parseEther("100"));

        // report shares
        await rewardManager
            .connect(reporter)
            .onSharesUpdated(user.address, 0, 100);

        // notify reward
        await rewardManager
            .connect(reporter)
            .notifyReward(ethers.parseEther("10"));

        // claim
        await rewardManager.connect(user).claim(user.address);

        const balance = await token.balanceOf(user.address);
        expect(balance).to.equal(ethers.parseEther("10"));
    });
});
