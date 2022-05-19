import { createContext, useMemo, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import providerOptions from '../utils/providerOptions';
import client from '../lib/sanityClient';

export const UserContext = createContext(null);

export default function UserContextProvider({ children }) {
  const [address, setAddress] = useState(null);
  const [user, setUser] = useState(null);
  const [provider, setProvider] = useState(null);

  const connectWallet = async () => {
    const web3Modal = new Web3Modal({
      network: 'rinkeby',
      providerOptions,
      cacheProvider: false,
    });
    const instance = await web3Modal.connect();
    const web3Provider = new ethers.providers.Web3Provider(instance);
    const accounts = await web3Provider.listAccounts();
    if (accounts) {
      setAddress(accounts[0]);
    }
    setProvider(web3Provider);
  };

  const disconnectWallet = async () => {
    setAddress(null);
    setUser(null);
  };

  const userInfo = useMemo(
    () => ({
      address,
      setAddress,
      user,
      setUser,
      provider,
      setProvider,
      connectWallet,
      disconnectWallet,
    }),
    [
      address,
      setAddress,
      user,
      setUser,
      provider,
      setProvider,
      connectWallet,
      disconnectWallet,
    ]
  );

  const sanityConnection = async () => {
    if (!address) {
      return null;
    }
    const userExist = await client.getDocument(address);

    if (userExist) {
      setUser(userExist);
    } else {
      const userDoc = {
        _type: 'user',
        _id: address,
        email: '',
        walletAddress: address,
      };

      // eslint-disable-next-line no-unused-vars
      const result = await client.create(userDoc);
      setUser(userDoc);
    }
  };

  useEffect(() => {
    sanityConnection();
  }, [address]);

  return (
    <UserContext.Provider value={userInfo}>{children}</UserContext.Provider>
  );
}
