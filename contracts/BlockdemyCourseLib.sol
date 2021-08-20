// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

library BlockdemyCourseLib{

    function compareStrings(string memory a, string memory b)
        public
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }
    
    function getTokenIndexByHash(string memory _hash,string[] storage _tokenUris)
        public
        pure
        returns (uint256)
    {
        string[] memory uris = _tokenUris;
        for (uint256 i = 0; i < uris.length; i++) {    
            if (compareStrings(uris[i], _hash)) {
                return i;
            }
        }

        revert("non existent hash");
    }
    
    function inTokensOwned(uint256[] storage _tokensOwned,uint256 tokenId) public view returns (bool) {
        for (uint256 i = 0; i < _tokensOwned.length; i++) {
            if(tokenId==_tokensOwned[i]){
                return true;
            }
        }
        return false;
    }

    function addIfNotOwned(uint256[] storage _tokensOwned,uint256 tokenId) public {
        if(!inTokensOwned(_tokensOwned,tokenId)) 
        _tokensOwned.push(tokenId);
    }
}