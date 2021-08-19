// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "hardhat/console.sol";
import "./BlockdemyCourseLib.sol";

contract BlockdemyCourse is ERC721 {
    using Counters for Counters.Counter;
    using SafeMath for uint256;
    Counters.Counter private _tokenIds;

    mapping(uint256 => string[]) private _tokenUris;
    mapping(uint256 => uint256) private _tokenPrices;
    mapping(uint256 => uint256) private _tokenRoyalties;
    mapping(uint256 => bool) private _tokenOnSale;
    mapping(uint256 => string) private _tokenTitles;
    mapping(uint256 => string) private _tokenDescriptions;
    mapping(uint256 => address) private _tokenCreators;
    mapping(address => uint256[]) private _tokensOwned;
    mapping(uint256 => uint256) private _tokenVisibility;
    mapping(uint256 => string[]) private _videoTitles;

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

    struct VideoProps {
        uint256 id_course;
        string uri;
        string title;
    }

    address blockdemy;
    address owner;

    constructor() ERC721("BDEMY Course", "BDEMYC") {
        owner = msg.sender;
    }

    /* writer functions */
    function setBlockDemy(address _blockdemy) external  {
        isOwnerOfContract();
        blockdemy = _blockdemy;
    }

    function increaseCourseVisibility(uint256 tokenId, uint256 amount)
        public
    {
        TokenExists(tokenId);
        IsBlockDemy();
        _tokenVisibility[tokenId] += amount.div(10**18);
    }

    function addTokenUris(
        uint256 tokenId,
        string[] memory _uris,
        string[] memory _titles
    ) public {
        TokenExists(tokenId);
        IsOwner(tokenId);
        for (uint256 i = 0; i < _uris.length; i++) {
            _tokenUris[tokenId].push(_uris[i]);
            _videoTitles[tokenId].push(_titles[i]);
        }
    }

    function setOnSale(
        uint256 tokenId,
        uint256 amount,
        bool sale
    ) external {
        TokenExists(tokenId);
        IsOwner(tokenId);
        _tokenOnSale[tokenId] = sale;
        if (sale) {
            _tokenPrices[tokenId] = amount;
            approve(address(this), tokenId);
        } else {
            approve(address(0), tokenId);
        }
    }

    function mintCourse(
        address _owner,
        string memory _title,
        string memory _description,
        string[] memory _uris,
        uint256 _price,
        uint256 _royalty
    ) public returns (uint256) {
        require(_price > 0, "PNV");
        require(_royalty > 0 && _royalty < 90, "RNV");

        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(_owner, newItemId);

        _tokenPrices[newItemId] = _price;
        _tokenUris[newItemId] = _uris;
        _tokenOnSale[newItemId] = false;
        _tokenTitles[newItemId] = _title;
        _tokenDescriptions[newItemId] = _description;
        _tokenCreators[newItemId] = msg.sender;
        _tokenRoyalties[newItemId] = _royalty;
        _videoTitles[newItemId].push("preview");
        BlockdemyCourseLib.addIfNotOwned(_tokensOwned[msg.sender], newItemId);
        return newItemId;
    }

    function editCourseVideos(
        string[] memory _uris,
        string[] memory _title,
        uint256 tokenId
    ) public  returns (uint256) {
        TokenExists(tokenId);
        IsOwner(tokenId);
        for (uint256 i = 0; i < _uris.length; i++) {
            _tokenUris[tokenId].push(_uris[i]);
            _videoTitles[tokenId].push(_title[i]);
        }
        return tokenId;
    }

    function editCourse(
        string memory _title,
        string memory _description,
        uint256 _price,
        string[] memory _uris,
        uint256 _royalty,
        uint256 tokenId
    ) public  returns (uint256) {
        TokenExists(tokenId);
        IsOwner(tokenId);
        require(_price > 0);
        if (_uris.length > 0) _tokenUris[tokenId][0] = _uris[0];
        _tokenPrices[tokenId] = _price;
        _tokenTitles[tokenId] = _title;
        _tokenDescriptions[tokenId] = _description;
        if (msg.sender == _tokenCreators[tokenId])
            _tokenRoyalties[tokenId] = _royalty;

        return tokenId;
    }

    function deleteUri(uint256 tokenId, string memory _hash)
        external
    {
        TokenExists(tokenId);
        IsOwner(tokenId);
        uint256 index = BlockdemyCourseLib.getTokenIndexByHash(
            _hash,
            _tokenUris[tokenId]
        );
        string[] memory uris = _tokenUris[tokenId];
        string[] memory titles = _videoTitles[tokenId];
        require(uris.length > 1, "CDPV");
        for (uint256 i = index; i < uris.length - 1; i++) {
            uris[i] = uris[i + 1];
            titles[i] = titles[i + 1];
        }
        _tokenUris[tokenId] = uris;
        _videoTitles[tokenId] = titles;
        _tokenUris[tokenId].pop();
        _videoTitles[tokenId].pop();
    }

    function transferCourse(uint256 tokenId, address _to)
        external
  
    {
        TokenExists(tokenId);
        IsBlockDemy();
        this.transferFrom(ownerOf(tokenId), _to, tokenId);
        BlockdemyCourseLib.addIfNotOwned(_tokensOwned[_to], tokenId);
        _tokenOnSale[tokenId] = false;
    }

    /* views */
    function getCourseById(uint256 tokenId)
        public
        view
        returns (CourseProps memory)
    {
        require(tokenId > 0 && tokenId <= _tokenIds.current(), "WTI");
        CourseProps memory token = CourseProps(
            tokenId,
            ownerOf(tokenId),
            _tokenCreators[tokenId],
            _tokenPrices[tokenId],
            _tokenTitles[tokenId],
            _tokenDescriptions[tokenId],
            _tokenUris[tokenId][0],
            _tokenOnSale[tokenId],
            _tokenVisibility[tokenId],
            _tokenRoyalties[tokenId]
        );
        return token;
    }

    function getCreator(uint256 tokenId)
        external
        view
        returns (address)
    {
        TokenExists(tokenId);
        return _tokenCreators[tokenId];
    }

    function getCourseFees(uint256 tokenId)
        external
        view
        returns (uint256)
    {
        TokenExists(tokenId);
        return (_tokenPrices[tokenId] * _tokenRoyalties[tokenId]) / 100;
    }

    function getCoursePrice(uint256 tokenId)
        external
        view
        returns (uint256)
    {
        TokenExists(tokenId);
        return _tokenPrices[tokenId];
    }

    function getVideosOfCourse(uint256 tokenId)
        public
        view
        returns (VideoProps[] memory)
    {
        HasOwned(tokenId);
        VideoProps[] memory tokens = new VideoProps[](
            _tokenUris[tokenId].length
        );
        uint256 counter = 0;

        for (uint256 i = 0; i < _tokenUris[tokenId].length; i++) {
            VideoProps memory token = VideoProps(
                tokenId,
                _tokenUris[tokenId][i],
                _videoTitles[tokenId][i]
            );
            tokens[counter] = token;
            counter++;
        }
        return tokens;
    }

    function getMyCourses() public view returns (CourseProps[] memory) {
        uint256 numberOfTokens = _tokensOwned[msg.sender].length;
        CourseProps[] memory tokens = new CourseProps[](numberOfTokens);
        uint256 counter = 0;

        for (uint256 i = 0; i < numberOfTokens; i++) {
            uint256 tokenId = _tokensOwned[msg.sender][i];
            CourseProps memory token = CourseProps(
                tokenId,
                ownerOf(tokenId),
                _tokenCreators[tokenId],
                _tokenPrices[tokenId],
                _tokenTitles[tokenId],
                _tokenDescriptions[tokenId],
                _tokenUris[tokenId][0],
                _tokenOnSale[tokenId],
                _tokenVisibility[tokenId],
                _tokenRoyalties[tokenId]
            );
            tokens[i] = token;
            counter++;
        }

        //of counter is 0 no course met, we can know the size until we do the for
        if (counter == 0) {
            return new CourseProps[](0);
        }

        return tokens;
    }

    function getAllCourses() public view returns (CourseProps[] memory) {
        CourseProps[] memory tokens = new CourseProps[](_tokenIds.current());
        uint256 counter = 0;

        for (uint256 i = 1; i < _tokenIds.current() + 1; i++) {
            CourseProps memory token = CourseProps(
                i,
                ownerOf(i),
                _tokenCreators[i],
                _tokenPrices[i],
                _tokenTitles[i],
                _tokenDescriptions[i],
                _tokenUris[i][0],
                _tokenOnSale[i],
                _tokenVisibility[i],
                _tokenRoyalties[i]
            );
            tokens[counter] = token;
            counter++;
        }

        return tokens;
    }

    /* control check function */
    function IsOwner(uint256 tokenId) internal view{
        require(ownerOf(tokenId) == msg.sender, "CNO");
    }

    function TokenExists(uint256 tokenId) internal view{
        require(_exists(tokenId), "TNE");
    }

    function isOwnerOfContract() internal view{
        require(owner == msg.sender, "CNOC");
    }

    function HasOwned(uint256 tokenId) internal view{
        require(
            BlockdemyCourseLib.inTokensOwned(_tokensOwned[msg.sender], tokenId),
            "CHNBO"
        );
    }

    function IsBlockDemy() internal view{
        require(blockdemy == msg.sender, "CNB");
    }


}
