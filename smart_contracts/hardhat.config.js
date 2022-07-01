require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.4',
  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_API_KEY}`,
      accounts: [`${process.env.NEXT_PUBLIC_ACCOUNT}`],
    },
  },
};
