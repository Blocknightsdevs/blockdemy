// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {LibBlockdemyCourse, VideoProps} from "../libraries/LibBlockdemyCourse.sol";

import {AppStorage,Modifiers} from "../libraries/LibAppStorage.sol";
// import "hardhat/console.sol";
import {LibMeta} from "../../shared/libraries/LibMeta.sol";
import "hardhat/console.sol";

contract BlockdemyCourseVideosFacet is Modifiers{

    function getVideosOfCourse(uint256 _courseId) HasOwned(_courseId) external view returns (VideoProps[] memory videos_) {
        videos_ = LibBlockdemyCourse.getVideosOfCourse(_courseId);
    }

    function editCourseVideos(
        string[] memory _uris,
        //string[] memory _title,
        uint256 _courseId
    ) public IsOwner(_courseId) returns (uint256) {
        for (uint256 i = 0; i < _uris.length; i++) {
            s._courseUris[_courseId].push(_uris[i]);
            //s._videoTitles[_courseId].push(_title[i]);
        }
        return _courseId;
    }

    function deleteUri(uint256 _courseId, string memory _hash) external IsOwner(_courseId) {
        uint256 index = LibBlockdemyCourse.getVideoIndexByHash(_hash, s._courseUris[_courseId]);
        string[] memory uris = s._courseUris[_courseId];
        //string[] memory titles = s._videoTitles[_courseId];
        for (uint256 i = index; i < uris.length - 1; i++) {
            uris[i] = uris[i + 1];
            //titles[i] = titles[i + 1];
        }
        s._courseUris[_courseId] = uris;
        //s._videoTitles[_courseId] = titles;
        s._courseUris[_courseId].pop();
        //s._videoTitles[_courseId].pop();
    }
}