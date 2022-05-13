import { createContext, useMemo, useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import providerOptions from '../utils/providerOptions';

export const UserContext = createContext(null);

export default function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);

  const connectWallet = async () => {
    const web3Modal = new Web3Modal({
      network: 'ropsten',
      providerOptions,
      cacheProvider: false,
    });
    const instance = await web3Modal.connect();
    const web3Provider = new ethers.providers.Web3Provider(instance);
    const accounts = await web3Provider.listAccounts();
    if (accounts) {
      setUser(accounts[0]);
    }
  };

  const disconnectWallet = async () => {
    setUser(null);
  };

  const userInfo = useMemo(
    () => ({ user, setUser, connectWallet, disconnectWallet }),
    [user, setUser, connectWallet, disconnectWallet]
  );

  return (
    <UserContext.Provider value={userInfo}>{children}</UserContext.Provider>
  );
}
