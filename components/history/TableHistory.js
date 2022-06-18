/* eslint-disable react/style-prop-object */
import Image from 'next/image';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import utils from '../../utils/utils';

export default function History() {
  const { user } = useContext(UserContext);

  return (
    <div>
      {!user || user.swaps == null ? (
        <p className="text-wise-grey text-lg text-center mb-6">
          You haven't swap anything
        </p>
      ) : (
        <div className="container flex flex-col-reverse items-center mt-4 lg:mt-8 mb-9">
          <div className="overflow-x-auto">
            <div className="min-w-screen min-h-screenflex items-center justify-center font-sans overflow-hidden">
              <div className="w-full lg:w-5/6">
                <div className="my-6 inline-block rounded-lg border-2 shadow-md">
                  <table className="min-w-max w-full table-auto bg-white">
                    <thead>
                      <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-center hidden lg:table-cell">
                          From
                        </th>
                        <th className="py-3 px-6 text-center hidden lg:table-cell">
                          To
                        </th>
                        <th className="py-3 px-6 text-center hidden md:table-cell">
                          Date
                        </th>
                        <th className="py-3 px-3 md:px-6 text-center text-xs md:text-sm">
                          NFTs Proposed
                        </th>
                        <th className="py-3 px-3 md:px-6 text-center text-xs md:text-sm">
                          NFTs Requested
                        </th>
                        <th className="py-3 px-6 text-center text-xs md:text-sm">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                      {user.swaps
                        .slice(0)
                        .reverse()
                        .map((swap) => (
                          <tr className="border-b border-gray-200 bg-gray-50 hover:bg-gray-100">
                            <td className="py-3 px-9 text-center whitespace-nowrap hidden lg:table-cell">
                              {utils.truncateAddress(swap.from)}
                            </td>
                            <td className="py-3 px-9 text-center hidden lg:table-cell">
                              {utils.truncateAddress(swap.to)}
                            </td>
                            <td className="py-3 px-9 text-center hidden md:table-cell">
                              {swap._createdAt.substr(0, 10)}
                            </td>
                            <td className="py-3 px-0 md:px-9 text-center">
                              {swap.initiatorNfts.map((nft) => (
                                <Image
                                  className="rounded-md border-2"
                                  src={nft.image_url}
                                  width="90"
                                  height="90"
                                />
                              ))}
                            </td>
                            <td className="py-3 px-0 md:px-9 text-center">
                              {swap.counterpartNfts.map((nft) => (
                                <Image
                                  className="rounded-md border-2"
                                  src={nft.image_url}
                                  width="90"
                                  height="90"
                                />
                              ))}
                            </td>
                            <td className="py-3 px-0 md:px-9 text-center">
                              {swap.status === 'pending' && (
                                <span className="bg-yellow-200 text-yellow-600 py-1 md:px-6 px-3 rounded-full md:text-xs text-[0.50rem]">
                                  {swap.status.toUpperCase()}
                                </span>
                              )}
                              {swap.status === 'completed' && (
                                <span className="bg-green-200 text-green-600 py-1 md:px-6 px-3 rounded-full md:text-xs text-[0.50rem]">
                                  {swap.status.toUpperCase()}
                                </span>
                              )}
                              {swap.status === 'cancelled' && (
                                <span className="bg-red-200 text-red-600 py-1 md:px-6 px-3 rounded-full md:text-xs text-[0.50rem]">
                                  {swap.status.toUpperCase()}
                                </span>
                              )}
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
  );
}
