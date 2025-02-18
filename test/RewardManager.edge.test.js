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
    it("reverts when reporter address is zero", async function () {
        const { ethers } = require("hardhat");

        const Token = await ethers.getContractFactory("MockERC20");
        const token = await Token.deploy();

        const RewardManager = await ethers.getContractFactory("RewardManager");

        await expect(
            RewardManager.deploy(
                ethers.ZeroAddress,
                token.target
            )
        ).to.be.reverted;
    });
    it("reverts when reward token address is zero", async function () {
        const { ethers } = require("hardhat");
        const [ , reporter ] = await ethers.getSigners();

        const RewardManager = await ethers.getContractFactory("RewardManager");

        await expect(
            RewardManager.deploy(
                reporter.address,
                ethers.ZeroAddress
            )
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
    it("handles reward notification when no shares exist", async function () {
        const { reporter, token, rewardManager } =
            await deployRewardSystem();

        await token.mint(
            rewardManager.target,
            ethers.parseEther("10")
        );

        // notify reward with zero shares
        await rewardManager
            .connect(reporter)
            .notifyReward(ethers.parseEther("5"));

        // no revert and no state corruption
        const totalShares = await rewardManager.totalShares();
        expect(totalShares).to.equal(0);
    });
    it("returns zero pending reward when debt exceeds accumulation", async function () {
        const { reporter, user, rewardManager } =
            await deployRewardSystem();

        // initial shares
        await rewardManager
            .connect(reporter)
            .onSharesUpdated(user.address, 0, 100);

        // reduce shares without rewards
        await rewardManager
            .connect(reporter)
            .onSharesUpdated(user.address, 100, 10);

        const pending = await rewardManager.pendingReward(user.address);
        expect(pending).to.equal(0);
    });
    it("reverts when reward token transfer fails during payout", async function () {
        const { ethers } = require("hardhat");
        const [ , reporter, user ] = await ethers.getSigners();

        const Token = await ethers.getContractFactory("FailingERC20");
        const token = await Token.deploy();

        const RewardManager = await ethers.getContractFactory("RewardManager");
        const rewardManager = await RewardManager.deploy(
            reporter.address,
            token.target
        );

        // report shares so rewards can accrue
        await rewardManager
            .connect(reporter)
            .onSharesUpdated(user.address, 0, 100);

        // notify reward (accounting only)
        await rewardManager
            .connect(reporter)
            .notifyReward(1);

        // payout happens here -> transfer returns false -> revert
        await expect(
            rewardManager.connect(user).claim(user.address)
        ).to.be.reverted;
    });


});
