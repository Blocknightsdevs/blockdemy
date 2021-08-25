// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {LibBlockdemyCourse, CourseProps} from "../libraries/LibBlockdemyCourse.sol";

import { AppStorage,Modifiers } from "../libraries/LibAppStorage.sol";
// import "hardhat/console.sol";
import {LibMeta} from "../../shared/libraries/LibMeta.sol";
import {LibERC721} from "../../shared/libraries/LibERC721.sol";
import {LibDiamond} from "../../shared/libraries/LibDiamond.sol";
import "hardhat/console.sol";

contract BlockdemyCourseFacet is Modifiers{

    function totalSupply() external view returns (uint256 totalSupply_) {
        totalSupply_ = s.courseIds.length;
    }

    function getCreator(uint256 _courseId) external view returns (address)
    {
        return s._courseCreators[_courseId];
    }

    function getCourseFees(uint256 _courseId) external view returns (uint256)
    {
        return (s._coursePrices[_courseId] * s._courseRoyalties[_courseId]) / 100;
    }

    function getCoursePrice(uint256 _courseId) external view returns (uint256)
    {
        return s._coursePrices[_courseId];
    }

    function setBlockdemy(address blockdemy) external{
        LibDiamond.enforceIsContractOwner();
        s.blockdemy = blockdemy;
    }


    function mint(
        address _to,
        string memory _title,
        string memory _description,
        string memory _uri,
        uint256 _price,
        uint256 _royalty
    ) external returns(uint256) {
        LibBlockdemyCourse.mint(_to,_title, _description, _uri, _price, _royalty);
        return s.courseIdCounter;
    }


    function balanceOf(address _owner) external view returns (uint256 balance_) {
        require(_owner != address(0), "BlockDemyCourseFacet: _owner can't be address(0");
        balance_ = s._courseOwnerIds[_owner].length;
    }

    function getCourseById(uint256 _tokenId) external view returns (CourseProps memory course_) {
        course_ = LibBlockdemyCourse.getCourse(_tokenId);
    }


    function tokenByIndex(uint256 _index) external view returns (uint256 tokenId_) {
        require(_index < s.courseIds.length, "BlockDemyCourseFacet: index beyond supply");
        tokenId_ = s.courseIds[_index];
    }


    function tokenOfOwnerByIndex(address _owner, uint256 _index) external view returns (uint256 tokenId_) {
        require(_index < s._courseOwnerIds[_owner].length, "BlockDemyCourseFacet: index beyond owner balance");
        tokenId_ = s._courseOwnerIds[_owner][_index];
    }

    function tokenIdsOfOwner(address _owner) external view returns (uint256[] memory tokenIds_) {
        tokenIds_ = s._courseOwnerIds[_owner];
    }

    function getAllCourses() external view returns (CourseProps[] memory course_) {
        uint256 length = s.courseIds.length;
        course_ = new CourseProps[](length);
        for (uint256 i=1; i <= length; i++) {
            course_[i-1] = LibBlockdemyCourse.getCourse(i);
        }
    }

    function getMyCourses() external view returns (CourseProps[] memory course_) {
        uint256 length = s._coursesOwned[LibMeta.msgSender()].length;
        course_ = new CourseProps[](length);
        for (uint256 i; i < length; i++) {
            course_[i] = LibBlockdemyCourse.getCourse(s._coursesOwned[LibMeta.msgSender()][i]);
        }
    }

    function transferCourse(uint256 _courseId, address _to) external
    {
        safeTransferFrom(LibMeta.msgSender(), _to, _courseId);
    }

    function ownerOf(uint256 _tokenId) external view returns (address owner_) {
        owner_ = s._courseOwners[_tokenId];
        require(owner_ != address(0), "BlockDemyCourseFacet: invalid _tokenId");
    }

    function getApproved(uint256 _tokenId) external view returns (address approved_) {
        require(_tokenId < s.courseIds.length, "BlockDemyCourseFacet: tokenId is invalid");
        approved_ = s.approved[_tokenId];
    }

    function isApprovedForAll(address _owner, address _operator) external view returns (bool approved_) {
        approved_ = s.operators[_owner][_operator];
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId,
        bytes calldata _data
    ) public {
        address sender = LibBlockdemyCourse.msgSender();
        internalTransferFrom(sender, _from, _to, _tokenId);
        LibERC721.checkOnERC721Received(sender, _from, _to, _tokenId, _data);
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) public {
        address sender = LibBlockdemyCourse.msgSender();
        internalTransferFrom(sender, _from, _to, _tokenId);
        LibERC721.checkOnERC721Received(sender, _from, _to, _tokenId, "");
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _tokenId
    ) external {
        internalTransferFrom(LibBlockdemyCourse.msgSender(), _from, _to, _tokenId);
    }

    function internalTransferFrom(
        address _sender,
        address _from,
        address _to,
        uint256 _tokenId
    ) internal {
        require(_to != address(0), "BlockDemyCourseFacet: Can't transfer to 0 address");
        require(_from != address(0), "BlockDemyCourseFacet: _from can't be 0 address");
        require(_from == s._courseOwners[_tokenId], "BlockDemyCourseFacet: _from is not owner, transfer failed");
        require(
            _sender == _from || s.operators[_from][_sender] || _sender == s.approved[_tokenId],
            "BlockDemyCourseFacet: Not owner or approved to transfer"
        );
        LibBlockdemyCourse.transfer(_from, _to, _tokenId);
    }

    function approve(address _approved, uint256 _tokenId) public {
        LibBlockdemyCourse.approve(_approved,_tokenId);
    }

    function setApprovalForAll(address _operator, bool _approved) external {
        s.operators[LibMeta.msgSender()][_operator] = _approved;
        emit LibERC721.ApprovalForAll(LibMeta.msgSender(), _operator, _approved);
    }

    function name() external view returns (string memory) {
        return s.name;
    }

    function symbol() external view returns (string memory) {
        return s.symbol;
    }

    function tokenURI() external pure returns (string memory) {
        return "No URI"; //Here is your URL! //The URI may point to a JSON file that conforms to the "ERC721
    }
}
