// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./BlockdemyCourse.sol";
import "./BlockdemyToken.sol";
import "hardhat/console.sol";

contract Blockdemy is Ownable {
    //there will be 2 owners of blockdemy
    address payable[] owners;
    //pointers to nft and erc20
    BlockdemyCourse blockdemycourse;
    BlockdemyToken blockdemyToken;

    constructor(
        address payable[] memory _owners,
        address _blockdemycourse_address,
        address _blockdemyToken_address
    ) {
        owners = _owners;
        blockdemycourse = BlockdemyCourse(_blockdemycourse_address);
        blockdemyToken = BlockdemyToken(_blockdemyToken_address);
    }

    //i put this here because maybe we can take 0.1% of royalties or 
    //something like that, should think about it,
    //also bdemycourse is an erc721 so it does not handle payments
    function buyCourse(uint256 tokenId) external payable {
        require(blockdemycourse.getCoursePrice(tokenId) <= msg.value,'not enough funds');
        uint256 fees = 0;
        if (
            blockdemycourse.getCreator(tokenId) !=
            blockdemycourse.ownerOf(tokenId)
        ) {
            fees = blockdemycourse.getCourseFees(tokenId);
            payable(blockdemycourse.getCreator(tokenId)).transfer(fees);
        }

        payable(blockdemycourse.ownerOf(tokenId)).transfer(msg.value - fees);
        blockdemyToken.transfer(msg.sender, 10000*(10**18)); //10k (random amount)
        blockdemycourse.transferCourse(tokenId,msg.sender);
        //who buys the course receives some blockdemy tokens, i put a random number but should see how many
    }

    function increaseVisibility(uint256 tokenId,uint256 amount) external payable{
        //console.log(amount,msg.sender);
        //transfer tokens
        blockdemyToken.transferFrom(msg.sender, address(this), amount);
        //increase visibility
        blockdemycourse.increaseCourseVisibility(tokenId,amount);
    }
}
