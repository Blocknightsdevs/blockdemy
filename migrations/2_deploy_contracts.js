const BlockdemyCourse = artifacts.require("BlockdemyCourse");

module.exports = function (deployer) {
  deployer.deploy(BlockdemyCourse);
};
