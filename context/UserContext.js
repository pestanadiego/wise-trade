import { createContext, useMemo, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import providerOptions from '../utils/providerOptions';
import toast from 'react-hot-toast';
import client from '../lib/sanityClient';

export const UserContext = createContext(null);

export default function UserContextProvider({ children }) {
  const [address, setAddress] = useState(null);
  const [user, setUser] = useState(null);
  const [provider, setProvider] = useState(null);
  const [error, setError] = useState(null);

  const connectWallet = async () => {
    try {
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
    } catch {
      setError(
        toast.error(
          'Please check your metamask plugin (User Rejected/Pending)',
          {
            position: 'bottom-center',
          }
        )
      );
    }
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
      error,
      setError,
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
      error,
      setError,
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
