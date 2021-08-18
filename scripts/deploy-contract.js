// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy

  const [deployer] = await hre.ethers.getSigners();
  

  const BlockdemyCourseLib = await hre.ethers.getContractFactory("BlockdemyCourseLib");
  const blockdemyCourseLib = await BlockdemyCourseLib.deploy();
  await blockdemyCourseLib.deployed();

  const BlockdemyCourse = await hre.ethers.getContractFactory("BlockdemyCourse",{
        libraries: {
          BlockdemyCourseLib: blockdemyCourseLib.address,
        },
      });

  const BlockdemyToken = await hre.ethers.getContractFactory("BlockdemyToken");
  const Blockdemy = await hre.ethers.getContractFactory("Blockdemy");


  const blockdemyCourse = await BlockdemyCourse.deploy();
  const blockdemyToken = await BlockdemyToken.deploy();

  await blockdemyCourse.deployed();
  await blockdemyToken.deployed();

  const blockdemy = await Blockdemy.deploy([deployer.address],blockdemyCourse.address,blockdemyToken.address);

  //mint tokens to blockdemy
  let totalSupply = "100000000000000000000000000000"; //100BN TOKENS blockdemyToken
  let totalSupplyBN = ethers.BigNumber.from(totalSupply);
  await blockdemyToken.mintTokens(blockdemy.address, totalSupplyBN, {
    from: deployer.address,
  });

  //set blockdemy to blockdemycourse
  await blockdemyCourse.setBlockDemy(blockdemy.address);

  await blockdemy.deployed();

  console.log("const blockdemyCourseAddress=\""+blockdemyCourse.address+"\";");
  console.log("const blockdemyTokenAddress=\""+blockdemyToken.address+"\";");
  console.log("const blockdemyAddress=\""+blockdemy.address+"\";");
  console.log("library address "+blockdemyCourseLib.address)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
