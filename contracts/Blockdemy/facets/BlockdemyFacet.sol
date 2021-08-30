// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {AppStorage} from "../libraries/LibAppStorage.sol";
import {LibMeta} from "../../shared/libraries/LibMeta.sol";
import {BlockdemyCourseFacet} from "../../BlockdemyCourses/facets/BlockdemyCourseFacet.sol";
import {BlockdemyCourseEditFacet} from "../../BlockdemyCourses/facets/BlockdemyCourseEditFacet.sol";
import {BlockdemyTokenFacet} from "../../BlockdemyToken/facets/BlockdemyTokenFacet.sol";

contract BlockdemyFacet{
    AppStorage internal s;

    function buyCourse(uint256 tokenId) external payable{
        BlockdemyCourseFacet blockdemyCourse = BlockdemyCourseFacet(s.blockdemyCourseDiamondAddress);
        require(blockdemyCourse.getCoursePrice(tokenId) <= msg.value,'not enough funds');
        
        uint256 fees = 0;
        if (
            blockdemyCourse.getCreator(tokenId) !=
            blockdemyCourse.ownerOf(tokenId)
        ) {
            fees = blockdemyCourse.getCourseFees(tokenId);
            payable(blockdemyCourse.getCreator(tokenId)).transfer(fees);
        }

        payable(blockdemyCourse.ownerOf(tokenId)).transfer(msg.value - fees);

        blockdemyCourse.safeTransferFrom(blockdemyCourse.ownerOf(tokenId),LibMeta.msgSender(),tokenId);
    }

    function increaseVisibility(uint256 tokenId,uint256 amount) external payable{
        BlockdemyCourseEditFacet blockdemyCourse = BlockdemyCourseEditFacet(s.blockdemyCourseDiamondAddress);
        BlockdemyTokenFacet blockdemyToken = BlockdemyTokenFacet(s.blockdemyTokenDiamondAddress);
        //console.log(amount,msg.sender);
        //transfer tokens (must have been approved)
        blockdemyToken.transferFrom(LibMeta.msgSender(), address(this), amount);
        //increase visibility
        blockdemyCourse.increaseCourseVisibility(tokenId,amount);
    }
}