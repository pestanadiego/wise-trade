import { useContext, useState } from 'react';
import Image from 'next/image';
import AssetApproval from './AssetApproval';
import { UserContext } from '../../context/UserContext';
import utils from '../../utils/utils';

export default function PendingTrades() {
  const { address, provider } = useContext(UserContext);
  const [validApproval, setValidApproval] = useState(false);
  const [accept, setAccept] = useState(false);
  const [nftsToValid, setNftsToValid] = useState([]);
  // const contractAddress = '0x0bbD1C5232d927266D4D79274356b967c1b40f10';
  // const abi = [
  //   'event SwapProposed( address indexed from, address indexed to, uint256 indexed swapId, address[] nftAddressInit, uint256[] nftIdsInit, address[] nftAddressescounter, uint256[] nftIdscounter, uint256 etherValue)',
  // ];

  const transactions = [
    {
      date: '12',
      from: address,
      to: '0x0bbD1C5232d927266D4D79274356b967c1b40f10',
      Id: 1,
      initiatorNfts: [
        'https://cdn.pixabay.com/photo/2022/03/01/02/51/galaxy-7040416_960_720.png',
        'https://cdn.pixabay.com/photo/2022/03/01/02/51/galaxy-7040416_960_720.png',
        'https://cdn.pixabay.com/photo/2022/03/01/02/51/galaxy-7040416_960_720.png',
      ],
      counterPartNfts: {
        image_url: [
          'https://cdn.pixabay.com/photo/2022/01/17/17/20/bored-6945309_960_720.png',
          'https://cdn.pixabay.com/photo/2022/01/17/17/20/bored-6945309_960_720.png',
          'https://cdn.pixabay.com/photo/2022/01/17/17/20/bored-6945309_960_720.png',
          'https://cdn.pixabay.com/photo/2022/01/17/17/20/bored-6945309_960_720.png',
        ],
        xd: '',
      },
      status: 'pending',
    },
    {
      date: '',
      from: '0x0bbD1C5232d927266D4D79274356b967c1b40f10',
      to: address,
      Id: 2,
      initiatorNfts: [
        'https://cdn.pixabay.com/photo/2022/03/01/02/51/galaxy-7040416_960_720.png',
        'https://cdn.pixabay.com/photo/2022/03/01/02/51/galaxy-7040416_960_720.png',
        'https://cdn.pixabay.com/photo/2022/03/01/02/51/galaxy-7040416_960_720.png',
      ],
      counterPartNfts: {
        image_url: [
          'https://cdn.pixabay.com/photo/2022/01/17/17/20/bored-6945309_960_720.png',
        ],
        xd: '',
      },
      status: 'pending',
    },
    {
      date: '',
      from: '0x6375934fD561448bb1472646459449F77aaC0a08',
      to: '0x0bbD1C5232d927266D4D79274356b967c1b40f10',
      Id: 3,
      initiatorNfts: [
        'https://cdn.pixabay.com/photo/2022/03/01/02/51/galaxy-7040416_960_720.png',
        'https://cdn.pixabay.com/photo/2022/03/01/02/51/galaxy-7040416_960_720.png',
        'https://cdn.pixabay.com/photo/2022/03/01/02/51/galaxy-7040416_960_720.png',
      ],
      counterPartNfts: {
        image_url: [
          'https://cdn.pixabay.com/photo/2022/01/17/17/20/bored-6945309_960_720.png',
        ],
        xd: '',
      },
      status: 'pending',
    },
  ];

  // const contract = new ethers.Contract(contractAddress, abi, provider);
  // const cont = contract.filters.SwapProposed(
  //   '0x6375934fD561448bb1472646459449F77aaC0a08'
  // );

  console.log('Acepta', accept);

  const handleOnClick = (transaction) => {
    setAccept(true);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < transaction.counterPartNfts.length; i++) {
      nftsToValid.push(transaction.counterPartNfts[i]);
    }
  };
  console.log('Acepta', accept);

  return (
    <section>
      {!address ? (
        <div className="text-wise-grey text-center">
          Connect your wallet to make a trade
        </div>
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
              <tbody className="text-gray-600 text-sm font-light">
                {transactions.map((transaction) =>
                  transaction.status === 'pending' ? (
                    <tr className="border-b border-gray-200 bg-gray-50 hover:bg-gray-100">
                      <td className="py-3 px-9 text-left whitespace-nowrap">
                        {utils.truncateAddress(transaction.date)}
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
                              src={nft}
                              className="object-fill border-2 rounded-md"
                              width={60}
                              height={60}
                            />
                          </div>
                        ))}
                      </td>
                      <td className="py-3 px-9 text-center">
                        {transaction.counterPartNfts.image_url.map((nft) => (
                          <div className="flex flex-col my-2 overflow">
                            <Image
                              src={nft}
                              className="object-fill border-2 rounded-md"
                              width={60}
                              height={60}
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
                            <button type="button" className="btn btn-gray">
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
  );
}
