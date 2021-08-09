pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./BlockdemyCourse.sol";
import "./BlockdemyToken.sol";

contract Blockdemy is Ownable {
    //there will be 2 owners of blockdemy
    address payable[] owners;
    //pointers to nft and erc20
    BlockdemyCourse blockdemycourse;
    BlockdemyToken blockdemyToken;

    constructor(
        address payable[] memory _owners,
        BlockdemyCourse _blockdemycourse,
        BlockdemyToken _blockdemyToken
    ) {
        owners = _owners;
        blockdemycourse = _blockdemycourse;
        blockdemyToken = _blockdemyToken;
    }
}
