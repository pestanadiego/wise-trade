import { useContext, useState, useEffect } from 'react';
import Image from 'next/image';
import { ethers } from 'ethers';
import AssetApproval from './AssetApproval';
import { UserContext } from '../../context/UserContext';
import utils from '../../utils/utils';
import client from '../../lib/sanityClient';
import WiseTradeV1 from '../../smart_contracts/artifacts/contracts/WiseTradeV1.sol/WiseTradeV1.json';

export default function PendingTrades() {
  const { address, provider } = useContext(UserContext);
  const [validApproval, setValidApproval] = useState(false);
  const [accept, setAccept] = useState(false);
  const [nftsToValid, setNftsToValid] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [swapId, setSwapId] = useState(null);
  // const contractAddress = '0x0bbD1C5232d927266D4D79274356b967c1b40f10';
  // const abi = [
  //   'event SwapProposed( address indexed from, address indexed to, uint256 indexed swapId, address[] nftAddressInit, uint256[] nftIdsInit, address[] nftAddressescounter, uint256[] nftIdscounter, uint256 etherValue)',
  // ];
  const getUser = async () => {
    setLoading(true);
    const user = await client.getDocument(address);
    if (!dataLoaded) {
      setDataLoaded(true);
      getData(user);
    }
    console.log('user', user);
    setLoading(false);
    console.log('transactions', transactions);
  };
  
  const getData = (user) => {
    for (let i = 0; i < user.swaps.length; i++) {
      transactions.push(user.swaps[i]);
    }
  };

  const getDate = (stringDate) => {
    const date = stringDate.substring(0, 10);
    console.log(date);
    return date;
  };

  // const contract = new ethers.Contract(contractAddress, abi, provider);
  // const cont = contract.filters.SwapProposed(
  //   '0x6375934fD561448bb1472646459449F77aaC0a08'
  // );

  const handleOnClick = (transaction) => {
    setAccept(true);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < transaction.counterPartNfts.length; i++) {
      nftsToValid.push(transaction.counterPartNfts[i]);
    }
    setSwapId();
    console.log('Acepta', accept);
  };
  useEffect(() => {
    if (!dataLoaded) {
      getUser();
    }
  }, [transactions]);

  return (
    <section>
      {!address ? (
        <div className="text-wise-grey text-center">
          Connect your wallet to make a trade
        </div>
      ) : (
        <section>
          {loading ? (
            <h1>Loading...</h1>
          ) : (
            <div className="container">
              {!accept && (
                <table className="min-w-max w-full table-auto bg-white shadow-md border-2 rounded-xl my-10">
                  <thead>
                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-left">Date</th>
                      <th className="py-3 px-6 text-left">From</th>
                      <th className="py-3 px-6 text-left">To</th>
                      <th className="py-3 px-6 text-center">NFTs Proposed</th>
                      <th className="py-3 px-6 text-center">NFTs Requested</th>
                      <th className="py-3 px-6 text-center">Status</th>
                      <th className="py-3 px-6 text-center" />
                    </tr>
                  </thead>
                  {transactions.length !== 0 && (
                    <tbody className="text-gray-600 text-sm font-light">
                      {transactions.map((transaction) =>
                        transaction.status === 'pending' &&
                        (transaction.from === address ||
                          transaction.to === address) ? (
                          <tr className="border-b border-gray-200 bg-gray-50 hover:bg-gray-100">
                            <td className="py-3 px-9 text-left whitespace-nowrap">
                              {getDate(transaction._createdAt)}
                            </td>
                            <td className="py-3 px-9 text-left whitespace-nowrap">
                              {utils.truncateAddress(transaction.from)}
                            </td>
                            <td className="py-3 px-9 text-left">
                              {utils.truncateAddress(transaction.to)}
                            </td>
                            <td className="py-3 px-9 text-center">
                              {transaction.initiatorNfts.map((nft) => (
                                <div className="flex flex-col my-2 overflow">
                                  <Image
                                    src={nft.image_url}
                                    className="object-fill border-2 rounded-md"
                                    width={90}
                                    height={90}
                                  />
                                </div>
                              ))}
                            </td>
                            <td className="py-3 px-9 text-center">
                              {transaction.counterpartNfts.map((nft) => (
                                <div className="flex flex-col my-2 overflow">
                                  <Image
                                    src={nft.image_url}
                                    className="object-fill border-2 rounded-md"
                                    width={90}
                                    height={90}
                                  />
                                </div>
                              ))}
                            </td>
                            <td className="py-3 px-9 text-center">
                              <span className="bg-yellow-200 text-yellow-600 py-1 px-6 rounded-full text-xs">
                                Pending
                              </span>
                            </td>
                            <td className="py-3 pl-20 pr-9 justify-center">
                              {transaction.from !== address ? (
                                <div className="container flex justify-center space-x-10">
                                  <button
                                    type="button"
                                    className="btn btn-purple"
                                    // onClick={handleOnClick(transaction)}
                                  >
                                    Accept
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-gray"
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <div className="flex justify-center space-x-10">
                                  <button
                                    type="button"
                                    className="btn btn-purple"
                                    // onClick={handleOnClick(transaction)}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ) : (
                          ''
                        )
                      )}
                    </tbody>
                  )}
                </table>
              )}
              {accept && (
                <div className="container">
                  <AssetApproval
                    tokensToTransfer={nftsToValid}
                    setValidApproval={setValidApproval}
                  />
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </section>
  );
}
