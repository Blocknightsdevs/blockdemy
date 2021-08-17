// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract BlockdemyToken is ERC20 {

    address owner;

    constructor() ERC20("Blockdemy", "BDEMY") {
        owner = msg.sender;
    }

    function mintTokens(address _to,uint _amount) external onlyOwner(){
        _mint(_to,_amount);
    }

    modifier onlyOwner{
        require(owner==msg.sender);
        _;
    }
}
