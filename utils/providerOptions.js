import WalletConnectProvider from '@walletconnect/web3-provider';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: `${process.env.PROJECT_ID}`,
    },
  },
  coinbasewallet: {
    package: CoinbaseWalletSDK,
    options: {
      appName: 'wise-trade',
      infuraId: `${process.env.PROJECT_ID}`,
      chainId: 3,
    },
  },
};

export default providerOptions;
