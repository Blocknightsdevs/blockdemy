// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {LibBlockdemyCourse, CourseProps} from "../libraries/LibBlockdemyCourse.sol";

import {AppStorage, Modifiers} from "../libraries/LibAppStorage.sol";
// import "hardhat/console.sol";
import {LibMeta} from "../../shared/libraries/LibMeta.sol";
import {LibERC721} from "../../shared/libraries/LibERC721.sol";
import { SafeMath } from "../../shared/libraries/SafeMath.sol";

contract BlockdemyCourseEditFacet is Modifiers{


    function increaseCourseVisibility(uint256 tokenId, uint256 _amount)
        public IsBlockDemy()
    {
        (,uint256 amount ) = SafeMath.tryDiv(_amount,10**18);
        s._courseVisibility[tokenId] += amount;
    }

    function setOnSale(
        uint256 courseId,
        uint256 amount,
        bool sale
    ) external IsOwner(courseId) {
        s._courseOnSale[courseId] = sale;
        if (sale) {
            s._coursePrices[courseId] = amount;
            LibBlockdemyCourse.approve(s.blockdemy,courseId);
        } else {
            LibBlockdemyCourse.approve(address(0),courseId);
        }
    }

    function editCourse(
        string memory _title,
        string memory _description,
        uint256 _price,
        string[] memory _uris,
        uint256 _royalty,
        uint256 courseId
    ) public IsOwner(courseId)  returns (uint256) {
        require(_price > 0);
        if (_uris.length > 0) s._coursePreviews[courseId] = _uris[0];
        s._coursePrices[courseId] = _price;
        s._courseTitles[courseId] = _title;
        s._courseDescriptions[courseId] = _description;
        if (LibMeta.msgSender() == s._courseCreators[courseId])
            s._courseRoyalties[courseId] = _royalty;

        return courseId;
    }

    
}
