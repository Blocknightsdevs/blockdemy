// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {IERC20} from "../../shared/interfaces/IERC20.sol";
import {LibAppStorage, AppStorage} from "./LibAppStorage.sol";
import {LibERC20} from "../../shared/libraries/LibERC20.sol";
import {LibMeta} from "../../shared/libraries/LibMeta.sol";
import {IERC721} from "../../shared/interfaces/IERC721.sol";
import {LibERC721} from "../../shared/libraries/LibERC721.sol";

import "hardhat/console.sol";

struct VideoProps {
    uint256 id_course;
    string uri;
    string title;
}

struct CourseProps {
    uint256 id;
    address owner;
    address creator;
    uint256 price;
    string title;
    string description;
    string videos_preview;
    bool onSale;
    uint256 visibility;
    uint256 royalty;
}

library LibBlockdemyCourse {
    function incrementCourseId() internal {
        AppStorage storage s = LibAppStorage.diamondStorage();
        s.courseIdCounter += 1;
    }
    function mint(
        address _to,
        string memory _title,
        string memory _description,
        string memory _uri,
        uint256 _price,
        uint256 _royalty
    ) internal {
        AppStorage storage s = LibAppStorage.diamondStorage();
        incrementCourseId();
        uint256 tokenId = s.courseIdCounter;
        require(_to != address(0), "ERC721: mint to the zero address");
        require(!(s._courseOwners[tokenId] != address(0)), "ERC721: token already minted");

        //erc721
        s._courseOwnerIds[_to].push(tokenId);
        s._coursesOwnerIdIndexes[_to][tokenId] = 0;
        s._courseOwners[tokenId] = _to;
        s.courseIds.push(tokenId);
        //course data (shall we store metadata in ipfs??)
        s._coursePrices[tokenId] = _price;
        s._courseUris[tokenId].push(_uri);
        s._videoTitles[tokenId].push("preview");
        s._courseOnSale[tokenId] = false;
        s._courseTitles[tokenId] = _title;
        s._courseDescriptions[tokenId] = _description;
        s._courseCreators[tokenId] = LibMeta.msgSender();
        s._courseRoyalties[tokenId] = _royalty;
        s._coursesOwned[LibMeta.msgSender()].push(tokenId);

        emit LibERC721.Transfer(address(0), _to, tokenId);
    }

    function approve(address _approved, uint256 _tokenId) internal {
        AppStorage storage s = LibAppStorage.diamondStorage();
        address owner = s._courseOwners[_tokenId];
        require(owner == LibMeta.msgSender() || s.operators[owner][LibMeta.msgSender()], "ERC721: Not owner or operator of token.");
        s.approved[_tokenId] = _approved;
        emit LibERC721.Approval(owner, _approved, _tokenId);
    }

    function inTokensOwned(address _owner, uint256 _courseId) internal view returns (bool) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        for (uint256 i = 0; i < s._coursesOwned[_owner].length; i++) {
            if (_courseId == s._coursesOwned[_owner][i]) {
                return true;
            }
        }
        return false;
    }

    function getVideosOfCourse(uint256 _courseId) internal view returns (VideoProps[] memory) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        VideoProps[] memory tokens = new VideoProps[](s._courseUris[_courseId].length);
        uint256 counter = 0;

        for (uint256 i = 0; i < s._courseUris[_courseId].length; i++) {
            VideoProps memory token = VideoProps(_courseId, s._courseUris[_courseId][i], s._videoTitles[_courseId][i]);
            tokens[counter] = token;
            counter++;
        }

        return tokens;
    }

    function getCourse(uint256 _courseId) internal view returns (CourseProps memory course_) {
        AppStorage storage s = LibAppStorage.diamondStorage();
        require(_courseId > 0 && _courseId <= s.courseIdCounter, "Course Index out of bounds");
        course_.id = _courseId;
        course_.owner = s._courseOwners[_courseId];
        course_.creator = s._courseCreators[_courseId];
        course_.title = s._courseTitles[_courseId];
        course_.description = s._courseDescriptions[_courseId];
        course_.videos_preview = s._courseUris[_courseId][0];
        course_.onSale = s._courseOnSale[_courseId];
        course_.price = s._coursePrices[_courseId];
        course_.visibility = s._courseVisibility[_courseId];
        course_.royalty = s._courseRoyalties[_courseId];
    }

    function getVideoIndexByHash(string memory _hash,string[] storage _videosUris)
        internal
        pure
        returns (uint256)
    {
        string[] memory uris = _videosUris;
        for (uint256 i = 0; i < uris.length; i++) {    
            if (compareStrings(uris[i], _hash)) {
                return i;
            }
        }

        revert("non existent hash");
    }
    
    function compareStrings(string memory a, string memory b)
    internal
    pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }
    

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal {}

    function transfer(
        address _from,
        address _to,
        uint256 _tokenId
    ) internal {
        AppStorage storage s = LibAppStorage.diamondStorage();
        // remove

        //get the index of the token to remove (to transfer)
        uint256 index = s._coursesOwnerIdIndexes[_from][_tokenId];
        //get the last index Of tokenIds
        uint256 lastIndex = s._courseOwnerIds[_from].length - 1;
        if (index != lastIndex) {
            //get the last tokenId (since its not the one to removw)
            uint256 lastTokenId = s._courseOwnerIds[_from][lastIndex];
            //replace the id in the index to remove with the last tokenID
            s._courseOwnerIds[_from][index] = lastTokenId;
            //replace the last index Of tokenId=>my Index with
            //the index to remove (it was shifted to that position above)
            s._coursesOwnerIdIndexes[_from][lastTokenId] = index;
        }
        //pop last element of id (we already copy the value if its not last)
        s._courseOwnerIds[_from].pop();
        //delete the index of Id, we aready out that last tokenId=index
        delete s._coursesOwnerIdIndexes[_from][_tokenId];

        if (s.approved[_tokenId] != address(0)) {
            delete s.approved[_tokenId];
            emit LibERC721.Approval(_from, address(0), _tokenId);
        }
        // add
        s._courseOwners[_tokenId] = _to;
        s._coursesOwnerIdIndexes[_to][_tokenId] = s._courseOwnerIds[_to].length;
        s._courseOwnerIds[_to].push(_tokenId);
        if(!inTokensOwned(_to, _tokenId)) 
        s._coursesOwned[_to].push(_tokenId);
        s._courseOnSale[_tokenId] = false;

        emit LibERC721.Transfer(_from, _to, _tokenId);
    }

    function msgSender() internal view returns(address){
        AppStorage storage s = LibAppStorage.diamondStorage();
        if(msg.sender==s.blockdemy){
            return s.blockdemy;
        }
        else{
            return LibMeta.msgSender();
        }
    }
}
