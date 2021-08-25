// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

struct AppStorage {
    //pointers to nft and erc20
    address blockdemyCourseDiamondAddress;
    address blockdemyTokenDiamondAddress;

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