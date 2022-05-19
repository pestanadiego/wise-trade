require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.4',
  networks: {
    rinkeby: {
      url: 'https://eth-rinkeby.alchemyapi.io/v2/HPQK2JObd8Xy85IjO-E81e_OyxfKGvkI',
      accounts: [
        '83e9754e85522587d11df055bf3ce1f695562df8852cab00f5c8b62796449db1',
      ],
    },
  },
};
