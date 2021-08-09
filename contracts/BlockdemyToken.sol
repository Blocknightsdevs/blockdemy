// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract BlockdemyToken is ERC20 {
    constructor(uint256 totalSupply) ERC20("Blockdemy", "BDEMY") {
        _mint(address(this), totalSupply);
    }
}
