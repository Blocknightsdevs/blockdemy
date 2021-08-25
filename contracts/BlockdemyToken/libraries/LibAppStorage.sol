// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {LibMeta} from "../../shared/libraries/LibMeta.sol";
import "hardhat/console.sol";

struct AppStorage {

    //BLOCKDEMYTOKEN
    uint256 totalSupply;
    string name;
    string symbol; 
    mapping(address => mapping(address => uint256)) allowances;
    mapping(address => uint256) balances;
    address[] approvedContracts;
    mapping(address => uint256) approvedContractIndexes;
    bytes32[1000] emptyMapSlots;
}

library LibAppStorage {
    function diamondStorage() internal pure returns (AppStorage storage ds) {
        assembly {
            ds.slot := 0
        }
    }

    function abs(int256 x) internal pure returns (uint256) {
        return uint256(x >= 0 ? x : -x);
    }
}