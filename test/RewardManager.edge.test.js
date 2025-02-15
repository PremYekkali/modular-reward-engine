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

    it("handles share decrease correctly", async function () {
        const { reporter, user, token, rewardManager } =
            await deployRewardSystem();

        await token.mint(rewardManager.target, ethers.parseEther("50"));

        await rewardManager
            .connect(reporter)
            .onSharesUpdated(user.address, 0, 100);

        await rewardManager
            .connect(reporter)
            .notifyReward(ethers.parseEther("10"));

        await rewardManager
            .connect(reporter)
            .onSharesUpdated(user.address, 100, 50);

        await rewardManager.connect(user).claim(user.address);

        const balance = await token.balanceOf(user.address);
        expect(balance).to.equal(ethers.parseEther("10"));
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
    it("returns zero pending reward when debt exceeds accumulation", async function () {
        const { reporter, user, token, rewardManager } =
            await deployRewardSystem();

        await token.mint(
            rewardManager.target,
            ethers.parseEther("10")
        );

        await rewardManager
            .connect(reporter)
            .onSharesUpdated(user.address, 0, 100);

        // notify zero reward to keep accRewardPerShare at zero
        await rewardManager
            .connect(reporter)
            .notifyReward(ethers.parseEther("0"));

        const pending = await rewardManager.pendingReward(user.address);
        expect(pending).to.equal(0);
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
