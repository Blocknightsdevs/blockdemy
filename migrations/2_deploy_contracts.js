const BlockdemyCourse = artifacts.require("BlockdemyCourse");
const BlockdemyToken = artifacts.require("BlockdemyToken");
const Blockdemy = artifacts.require("Blockdemy");

module.exports = async function (deployer, networks, accounts) {
  var adapter = Blockdemy.interfaceAdapter;
  const web3 = adapter.web3;

  await deployer.deploy(BlockdemyCourse);
  await deployer.deploy(BlockdemyToken, { from: accounts[0] });

  const blockdemyCourse = await BlockdemyCourse.deployed();
  const blockdemyToken = await BlockdemyToken.deployed();
  const blockdemy = await deployer.deploy(
    Blockdemy,
    [accounts[0], accounts[1]],
    blockdemyCourse.address,
    blockdemyToken.address
  );

  let totalSupply = "100000000000000000000000000000"; //100BN TOKENS blockdemyToken
  blockdemyToken.mintTokens(blockdemy.address, web3.utils.toBN(totalSupply), {
    from: accounts[0],
  });
};
