require("@nomiclabs/hardhat-waffle");

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${process.env.PROJECT_ID}`,
      account: [process.env.PRIVATE_KEY],
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.PROJECT_ID}`,
      account: [process.env.PRIVATE_KEY],
    },
  },
  solidity: "0.8.4",
};
