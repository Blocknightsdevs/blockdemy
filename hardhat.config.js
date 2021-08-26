require("@nomiclabs/hardhat-waffle");
require('hardhat-contract-sizer');
//const fs = require('fs');

//const secrets = JSON.parse(fs.readFileSync('.secrets.json').toString().trim());

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "hardhat",
  paths: {
    artifacts: '../blockdemy_frontend/src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    /*
    arbitrum_rinkeby:{
      url: `https://arb-rinkeby.g.alchemy.com/v2/SECRET`,
      accounts: ['SECRETPRIVKEY'] //deployer key 501b from metamask
    },
    kovan: {
      url: `https://eth-kovan.alchemyapi.io/v2/SECRET`,
      accounts: ['SECRETPRIVKEY'] //deployer key 501b from metamask
    },
    bsc_testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: {mnemonic: secrets.mnemonic}
    }
    bsc_testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: {mnemonic: mnemonic}
    },
    bsc_mainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      gasPrice: 20000000000,
      accounts: {mnemonic: mnemonic}
    }*/
  },
  solidity: "0.8.0",
  settings: {
    optimizer: {
      enabled: true,
      runs: 2000,
    },
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  }
};
