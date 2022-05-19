// eslint-disable-next-line import/no-extraneous-dependencies
require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.4',
  networks: {
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/42516aa0a2c34cf59fbf96b88e80ccc5',
      accounts: [
        '83e9754e85522587d11df055bf3ce1f695562df8852cab00f5c8b62796449db1',
      ],
    },
  },
};
