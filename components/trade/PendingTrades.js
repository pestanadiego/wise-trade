import Image from 'next/image';
import { ethers } from 'ethers';
import { useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import utils from '../../utils/utils';

export default function PendingTrades() {
  const { user, address, provider } = useContext(UserContext);
  const contractAddress = '0x0bbD1C5232d927266D4D79274356b967c1b40f10';

  return (
    <section>
      {!address ? (
        <div className="text-wise-grey text-center">
          Connect your wallet to make a trade
        </div>
      ) : (
        <div>
          {user.swaps === null ? (
            <p>You don't have any trade to accept</p>
          ) : (
            <div className="container flex flex-col-reverse items-center mt-14 lg:mt-28 mb-9">
              <div className="overflow-x-auto">
                <div className="min-w-screen min-h-scree flex overflow-hidden">
                  <div className="w-full lg:w-5/6">
                    <div className="bg-white shadow-md rounded my-3">
                      <table className="min-w-max w-full table-auto">
                        <thead>
                          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">From</th>
                            <th className="py-3 px-6 text-left">To</th>
                            <th className="py-3 px-6 text-center">
                              NFTs Proposed
                            </th>
                            <th className="py-3 px-6 text-center">
                              NFTs Requested
                            </th>
                            <th className="py-3 px-6 text-center m-150">
                              Status
                            </th>
                            <th className="py-3 px-6 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                          {user.swaps.map((swap) => (
                            <tr className="border-b border-gray-200 bg-gray-50 hover:bg-gray-100">
                              <td className="py-3 px-9 text-left whitespace-nowrap">
                                {utils.truncateAddress(swap.from)}
                              </td>
                              <td className="py-3 px-9 text-left">
                                {utils.truncateAddress(swap.to)}
                              </td>
                              <td className="py-3 px-9 text-center">
                                {swap.initiatorNfts.map((nft) => (
                                  <Image
                                    src={nft.image_url}
                                    width="10"
                                    height="10"
                                  />
                                ))}
                              </td>
                              <td className="py-3 px-9 text-center">
                                {swap.counterpartNfts.map((nft) => (
                                  <Image
                                    src={nft.image_url}
                                    width="10"
                                    height="10"
                                  />
                                ))}
                              </td>
                              <td className="py-3 px-9 text-center">
                                <span className="bg-yellow-200 text-yellow-600 py-1 px-6 rounded-full text-xs">
                                  {swap.status.toUpperCase()}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
