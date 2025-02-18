// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FailingERC20 {
    function balanceOf(address) external pure returns (uint256) {
        return type(uint256).max;
    }

    function transfer(address, uint256) external pure returns (bool) {
        return false;
    }
}
