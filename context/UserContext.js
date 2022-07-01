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
  const [news, setNews] = useState(null);

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
          'Please check your Metamask plugin (User Rejected/Pending)',
          {
            position: 'bottom-right',
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
    try {
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
        setNews(
          toast.custom(
            (t) => (
              <div
                className={`${
                  t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
              >
                <div className="flex-1 w-0 p-4">
                  <div className="flex items-start">
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        <i className="fa fa-info-circle text-wise-blue" /> New
                        user detected!
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Click on guide to see step by step documentation for the
                        website
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex border-l border-gray-200">
                  <a
                    target="_blank"
                    href="https://medium.com/@wise.inc.trade/step-by-step-guide-for-wisetrade-14c7b9ce7d63"
                    onClick={() => toast.dismiss(t.id)}
                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Guide
                  </a>
                </div>
                <div className="flex border-l border-gray-200">
                  <button
                    onClick={() => toast.remove(t.id)}
                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Close
                  </button>
                </div>
              </div>
            ),
            {
              duration: 20000,
            }
          )
        );
      }
    } catch {
      setAddress(null);
      setProvider(null);
      setError(
        toast.error(
          'Unable to load data. Check your connection and try again',
          {
            position: 'bottom-right',
          }
        )
      );
    }
  };

  useEffect(() => {
    sanityConnection();
  }, [address]);

  return (
    <UserContext.Provider value={userInfo}>{children}</UserContext.Provider>
  );
}
