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
  
  const BlockdemyCourse = await hre.ethers.getContractFactory("BlockdemyCourse");
  const BlockdemyToken = await hre.ethers.getContractFactory("BlockdemyToken");
  const Blockdemy = await hre.ethers.getContractFactory("Blockdemy");

  const blockdemyCourse = await BlockdemyCourse.deploy();
  const blockdemyToken = await BlockdemyToken.deploy();

  await blockdemyCourse.deployed();
  await blockdemyToken.deployed();

  const blockdemy = await Blockdemy.deploy([deployer.address],blockdemyCourse.address,blockdemyToken.address);

  let totalSupply = "100000000000000000000000000000"; //100BN TOKENS blockdemyToken
  let totalSupplyBN = ethers.BigNumber.from(totalSupply);
  await blockdemyToken.mintTokens(blockdemy.address, totalSupplyBN, {
    from: deployer.address,
  });

  await blockdemy.deployed();

  console.log("BlockdemyCourse deployed to:", blockdemyCourse.address);
  console.log("BlockdemyToken deployed to:", blockdemyToken.address);
  console.log("Blockdemy deployed to:", blockdemy.address);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
