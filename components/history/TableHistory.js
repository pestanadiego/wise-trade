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
                <div className="bg-white shadow-md rounded-md my-3">
                  <table className="min-w-max w-full table-auto">
                    <thead>
                      <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-center">From</th>
                        <th className="py-3 px-6 text-center">To</th>
                        <th className="py-3 px-6 text-center">Date</th>
                        <th className="py-3 px-6 text-center">NFTs Proposed</th>
                        <th className="py-3 px-6 text-center">
                          NFTs Requested
                        </th>
                        <th className="py-3 px-6 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                      {user.swaps.map((swap) => (
                        <tr className="border-b border-gray-200 bg-gray-50 hover:bg-gray-100">
                          <td className="py-3 px-9 text-center whitespace-nowrap">
                            {utils.truncateAddress(swap.from)}
                          </td>
                          <td className="py-3 px-9 text-center">
                            {utils.truncateAddress(swap.to)}
                          </td>
                          <td className="py-3 px-9 text-center">
                            {swap._createdAt.substr(0, 10)}
                          </td>
                          <td className="py-3 px-9 text-center">
                            {swap.initiatorNfts.map((nft) => (
                              <Image
                                className="rounded-sm"
                                src={nft.image_url}
                                width="32"
                                height="32"
                              />
                            ))}
                          </td>
                          <td className="py-3 px-9 text-center">
                            {swap.counterpartNfts.map((nft) => (
                              <Image
                                className="rounded-sm"
                                src={nft.image_url}
                                width="32"
                                height="32"
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
  );
}
