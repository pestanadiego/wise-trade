// eslint-disable-next-line import/no-extraneous-dependencies
require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.4',
  networks: {
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.PROJECT_ID}`,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
  },
};
