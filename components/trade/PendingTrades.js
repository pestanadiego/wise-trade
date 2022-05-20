import { ethers } from 'ethers';
import { useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import utils from '../../utils/utils';

export default function PendingTrades() {
  const { address, provider } = useContext(UserContext);
  const contractAddress = '0x0bbD1C5232d927266D4D79274356b967c1b40f10';
  const abi = [
    'event SwapProposed( address indexed from, address indexed to, uint256 indexed swapId, address[] nftAddressInit, uint256[] nftIdsInit, address[] nftAddressescounter, uint256[] nftIdscounter, uint256 etherValue)',
  ];

  const transactions = [
    {
      from: address,
      to: '0x0bbD1C5232d927266D4D79274356b967c1b40f10',
      nftsProposed: [
        '0x6375934fD561448bb1472646459449F77aaC0a08',
        '0x0bbD1C5232d927266D4D79274356b967c1b40f10',
      ],
      nftsRequested: ['0x6375934fD561448bb1472646459449F77aaC0a08'],
    },
    {
      from: '0x6375934fD561448bb1472646459449F77aaC0a08',
      to: address,
      nftsProposed: [
        '0x6375934fD561448bb1472646459449F77aaC0a08',
        '0x0bbD1C5232d927266D4D79274356b967c1b40f10',
      ],
      nftsRequested: ['0x6375934fD561448bb1472646459449F77aaC0a08'],
    },
    {
      from: '0x6375934fD561448bb1472646459449F77aaC0a08',
      to: '0x0bbD1C5232d927266D4D79274356b967c1b40f10',
      nftsProposed: [
        '0x6375934fD561448bb1472646459449F77aaC0a08',
        '0x0bbD1C5232d927266D4D79274356b967c1b40f10',
      ],
      nftsRequested: ['0x6375934fD561448bb1472646459449F77aaC0a08'],
    },
  ];


  const contract = new ethers.Contract(contractAddress, abi, provider);
  const cont = contract.filters.SwapProposed(
    '0x6375934fD561448bb1472646459449F77aaC0a08'
  );
  //"0x98a3e5937d32b0f142498fa84d7a454f36bda700ae5145c27b192309a4f5f463"
  console.log(cont);

  return (
    <section>
      {!address ? (
        <div className="text-wise-grey text-center">
          Connect your wallet to make a trade
        </div>
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
                        <th className="py-3 px-6 text-center">NFTs Proposed</th>
                        <th className="py-3 px-6 text-center">
                          NFTs Requested
                        </th>
                        <th className="py-3 px-6 text-center m-150">Status</th>
                        <th className="py-3 px-6 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                      {transactions.map((transaction) => (
                        <tr className="border-b border-gray-200 bg-gray-50 hover:bg-gray-100">
                          <td className="py-3 px-9 text-left whitespace-nowrap">
                            {utils.truncateAddress(transaction.from)}
                          </td>
                          <td className="py-3 px-9 text-left">
                            {utils.truncateAddress(transaction.to)}
                          </td>
                          <td className="py-3 px-9 text-center">
                            {transaction.nftsProposed.map((nft) => (
                              <span>{utils.truncateAddress(nft)}; </span>
                            ))}
                          </td>
                          <td className="py-3 px-9 text-center">
                            {transaction.nftsRequested.map((nft) => (
                              <span>{utils.truncateAddress(nft)}; </span>
                            ))}
                          </td>
                          <td className="py-3 px-9 text-center">
                            <span className="bg-yellow-200 text-yellow-600 py-1 px-6 rounded-full text-xs">
                              Pending
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
    </section>
  );
}
