// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BlockdemyCourse is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint256 => string[]) private _tokenUris;
    mapping(uint256 => uint256) private _tokenPrices;
    mapping(uint256 => bool) private _tokenOnSale;
    mapping(uint256 => string) private _tokenTitles;
    mapping(uint256 => string) private _tokenDescriptions;

    struct TokenProps {
        uint256 id;
        address owner;
        uint256 price;
        string title;
        string description;
        string[] uris;
        bool onSale;
    }

    constructor() ERC721("BDEMY Course", "BDEMYC") {}

    function setTokenTitle(uint256 tokenId, string memory _title)
        public
        TokenExists(tokenId)
        IsOwner(tokenId)
    {
        _tokenTitles[tokenId] = _title;
    }

    function setTokenDescription(uint256 tokenId, string memory _description)
        public
        TokenExists(tokenId)
        IsOwner(tokenId)
    {
        _tokenDescriptions[tokenId] = _description;
    }

    function setTokenOnSale(uint256 tokenId, bool _sale)
        public
        TokenExists(tokenId)
        IsOwner(tokenId)
    {
        _tokenOnSale[tokenId] = _sale;
    }

    function setTokenPrice(uint256 tokenId, uint256 _price)
        public
        TokenExists(tokenId)
        IsOwner(tokenId)
    {
        _tokenPrices[tokenId] = _price;
    }

    function setTokenUris(uint256 tokenId, string[] memory _uris)
        public
        TokenExists(tokenId)
        IsOwner(tokenId)
    {
        _tokenUris[tokenId] = _uris;
    }



    function addTokenUris(uint256 tokenId, string[] memory _uris)
        public
        TokenExists(tokenId)
        IsOwner(tokenId)
    {
        for(uint i=0;i<_uris.length;i++){
            _tokenUris[tokenId].push(_uris[i]);
        }
    }

    modifier TokenExists(uint256 tokenId) {
        require(_exists(tokenId), "token does not exist");
        _;
    }

    modifier IsOwner(uint256 tokenId) {
        require(ownerOf(tokenId) == msg.sender, "caller is not the owner");
        _;
    }

    function notMoreOnSale(uint256 tokenId) external IsOwner(tokenId) TokenExists(tokenId){
            _tokenOnSale[tokenId] = false;
            approve(address(0), tokenId);
    }

    function setOnSale(uint256 tokenId,uint amount) external IsOwner(tokenId) TokenExists(tokenId){
            _tokenOnSale[tokenId] = true;
            _tokenPrices[tokenId] = amount;
            approve(address(this),tokenId);
    }

    /*
        MINT COURSE DOES A MINT OF THE COURSE WITH ALL THE VIDEOS, IT MUST BE CALLED WHEN THE   
        INSTRUCTOR HAS ALREADY DEFINED THE COURSE IN ITS ENTIRETY (OR AT LEAST THINKS SO), SINCE WE WILL ADD
        OPTIONS TO REMOVE AND POST VIDEOS LATER, BUT REMEMBER THAT EACH INTERACTION COSTS MONEY
    */
    function mintCourse(
        address _owner,
        string memory _title,
        string memory _description,
        string[] memory _uris,
        uint256 _price
    ) public returns (uint256) {
        require(_price > 0);

        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(_owner, newItemId);
        setTokenPrice(newItemId, _price);
        setTokenUris(newItemId, _uris);
        setTokenOnSale(newItemId, false);
        setTokenTitle(newItemId, _title);
        setTokenDescription(newItemId, _description);

        return newItemId;
    }

    function deleteUri(uint256 tokenId, string memory _hash)
        external
        TokenExists(tokenId)
        IsOwner(tokenId)
    {
        uint256 index = getTokenIndexByHash(tokenId, _hash);
        string[] memory uris = _tokenUris[tokenId];
        for (uint256 i = index; i < uris.length - 1; i++) {
            uris[i] = uris[i + 1];
        }
        _tokenUris[tokenId] = uris;
        _tokenUris[tokenId].pop();
    }

    function getTokenIndexByHash(uint256 tokenId, string memory _hash)
        internal
        view
        returns (uint256)
    {
        string[] memory uris = _tokenUris[tokenId];
        for (uint256 i = 0; i < uris.length - 1; i++) {
            if (compareStrings(uris[i], _hash)) {
                return i;
            }
        }

        revert("non existent hash");
    }

    function compareStrings(string memory a, string memory b)
        public
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }

    function getCourseById(uint256 tokenId)
        public
        view
        returns (TokenProps memory)
    {
        require(
            tokenId > 0 && tokenId <= _tokenIds.current(),
            "wrong token id"
        );
        TokenProps memory token = TokenProps(
            tokenId,
            ownerOf(tokenId),
            _tokenPrices[tokenId],
            _tokenTitles[tokenId],
            _tokenDescriptions[tokenId],
            _tokenUris[tokenId],
            _tokenOnSale[tokenId]
        );
        return token;
    }

    function buyCourse(uint tokenId) external payable {
        
        require(_tokenPrices[tokenId] <= msg.value,'not enough funds');
        this.transferFrom(ownerOf(tokenId), msg.sender, tokenId);
        _tokenOnSale[tokenId] = false;

    }

    function getAllCourses() public view returns (TokenProps[] memory) {
        TokenProps[] memory tokens = new TokenProps[](_tokenIds.current());
        uint256 counter = 0;

        for (uint256 i = 1; i < _tokenIds.current() + 1; i++) {
            TokenProps memory token = TokenProps(
                i,
                ownerOf(i),
                _tokenPrices[i],
                _tokenTitles[i],
                _tokenDescriptions[i],
                _tokenUris[i],
                _tokenOnSale[i]
            );
            tokens[counter] = token;
            counter++;
        }

        return tokens;
    }
}
