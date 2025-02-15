const { expect } = require("chai");
const { ethers } = require("hardhat");
const { deployRewardSystem } = require("./helpers/setup");

describe("RewardManager edge cases", function () {
    it("reverts when non reporter notifies reward", async function () {
        const { user, rewardManager } = await deployRewardSystem();

        await expect(
            rewardManager.connect(user).notifyReward(1)
        ).to.be.reverted;
    });

    it("reverts on zero reward notification", async function () {
        const { reporter, rewardManager } = await deployRewardSystem();

        await expect(
            rewardManager.connect(reporter).notifyReward(0)
        ).to.be.reverted;
    });

    it("reverts when claiming with no rewards", async function () {
        const { user, rewardManager } = await deployRewardSystem();

        await expect(
            rewardManager.claim(user.address)
        ).to.be.reverted;
    });

    it("pays pending rewards before share decrease", async function () {
        const { reporter, user, token, rewardManager } =
            await deployRewardSystem();

        await token.mint(
            rewardManager.target,
            ethers.parseEther("50")
        );

        await rewardManager
            .connect(reporter)
            .onSharesUpdated(user.address, 0, 100);

        await rewardManager
            .connect(reporter)
            .notifyReward(ethers.parseEther("10"));

        // share decrease should trigger payout of pending rewards
        await rewardManager
            .connect(reporter)
            .onSharesUpdated(user.address, 100, 50);

        const balance = await token.balanceOf(user.address);
        expect(balance).to.equal(ethers.parseEther("10"));

        // nothing left to claim
        await expect(
            rewardManager.connect(user).claim(user.address)
        ).to.be.reverted;
    });


    it("reverts when notified reward exceeds available balance", async function () {
        const { reporter, rewardManager } = await deployRewardSystem();

        await expect(
            rewardManager
                .connect(reporter)
                .notifyReward(1)
        ).to.be.reverted;
    });
    it("reverts when non reporter updates shares", async function () {
        const { user, rewardManager } = await deployRewardSystem();

        await expect(
            rewardManager
                .connect(user)
                .onSharesUpdated(user.address, 0, 10)
        ).to.be.reverted;
    });
    it("emits RewardClaimed event on claim", async function () {
        const { reporter, user, token, rewardManager } =
            await deployRewardSystem();

        await token.mint(
            rewardManager.target,
            ethers.parseEther("10")
        );

        await rewardManager
            .connect(reporter)
            .onSharesUpdated(user.address, 0, 100);

        await rewardManager
            .connect(reporter)
            .notifyReward(ethers.parseEther("10"));

        await expect(
            rewardManager.connect(user).claim(user.address)
        ).to.emit(rewardManager, "RewardClaimed");
    });


});
