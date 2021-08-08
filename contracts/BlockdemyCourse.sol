import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

pragma solidity ^0.8.0;

contract BlockdemyCourse is ERC721URIStorage {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    mapping(uint256 => uint256) private _tokenPrices;
    mapping(uint256 => bool) private _tokenOnSale;

    struct TokenProps {
        uint256 id;
        uint256 price;
        string uri;
    }

    constructor() ERC721("BDEMY Course", "BDEMYC") {}

    /**
     * @dev sets maps token to its price
     * @param tokenId uint256 token ID (token number)
     * @param _price uint256 token price
     *
     * Requirements:
     * `tokenId` must exist
     */
    function setTokenPrice(uint256 tokenId, uint256 _price) public {
        require(
            _exists(tokenId),
            "ERC721Metadata: Price set of nonexistent token"
        );
        require(ownerOf(tokenId)==msg.sender,'only owner can set price');
        _tokenPrices[tokenId] = _price;
    }

    function mintCourse(
        address _owner,
        string memory _tokenURI,
        uint256 _price,
        bool _sale
    ) public returns (uint256) {
        require(_price > 0);

        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(_owner, newItemId);
        _setTokenURI(newItemId, _tokenURI);
        setTokenPrice(newItemId, _price);
        _tokenOnSale[newItemId] = _sale;

        return newItemId;
    }
}
