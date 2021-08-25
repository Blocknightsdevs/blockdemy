// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import {LibMeta} from "../../shared/libraries/LibMeta.sol";
import "hardhat/console.sol";
import {LibBlockdemyCourse} from "./LibBlockdemyCourse.sol";

struct AppStorage {

    //BLOCKDEMYCOURSE
        mapping(uint256 => string[])  _courseUris;
        mapping(uint256 =>  string[])  _videoTitles;
        mapping(address =>  uint256[])  _coursesOwned;

        mapping(uint256 => uint256)  _coursePrices;
        mapping(uint256 => uint256)  _courseRoyalties;
        mapping(uint256 => bool)  _courseOnSale;
        mapping(uint256 => string)  _courseTitles;
        mapping(uint256 => string)  _courseDescriptions;
        mapping(uint256 => address)  _courseCreators;
        mapping(uint256 => uint256)  _courseVisibility;
        //lib ERC721
        string name;
        string symbol; 
        mapping(uint256 => address) approved;
        mapping(address => mapping(address => bool)) operators;
        uint256[] courseIds;
        mapping(uint256 => address)  _courseOwners;
        mapping(address => mapping(uint256 => uint256)) _coursesOwnerIdIndexes;
        mapping(address => uint256[]) _courseOwnerIds;
        address blockdemy;
        uint256 courseIdCounter;

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



contract Modifiers {
    AppStorage internal s;

    modifier IsBlockDemy(){
        require(s.blockdemy == LibMeta.msgSender(),'ISNBDMY');
        _;
    }

    modifier IsOwner(uint256 tokenId){
        require(s._courseOwners[tokenId] == LibMeta.msgSender(), "CNO");
        _;
    }

    modifier HasOwned(uint256 _courseId) {
         require(
            LibBlockdemyCourse.inTokensOwned(LibMeta.msgSender(),_courseId),
            "CHNBO"
        );
        _;
    }

}