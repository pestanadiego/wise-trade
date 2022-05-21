import { useContext, useState, useEffect } from 'react';
import Image from 'next/image';
import { UserContext } from '../../context/UserContext';
import utils from '../../utils/utils';
import ApprovalBeforeAccept from './ApprovalBeforeAccept';

export default function PendingTrades() {
  const { user, address } = useContext(UserContext);
  const [acceptTransaction, setAcceptTransaction] = useState(null);
  const [accept, setAccept] = useState(false);
  const [decline, setDecline] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const swapsToApprove = () => {
    if (user.swaps == null) {
      return [];
    }
    const swaps = user.swaps;
    console.log(swaps);

    const pendingApprovals = [];
    for (let i = 0; i < swaps.length; i++) {
      if (swaps[i].to === address) {
        pendingApprovals.push(swaps[i]);
      }
    }
    return pendingApprovals;
  };

  useEffect(() => {
    if (user !== null) {
      const swapsToAccept = swapsToApprove();
      setTransactions(swapsToAccept);
    }
  }, [user]);

  return (
    <section>
      {!address ? (
        <div className="text-wise-grey text-center">
          Connect your wallet to make a trade
        </div>
      ) : (
        <section>
          {!user ? (
            <h1>Loading...</h1>
          ) : (
            <div className="container flex flex-col-reverse items-center mt-4 lg:mt-8 mb-9">
              {transactions.length !== 0 ? (
                <div>
                  {!accept ? (
                    <table className="min-w-max w-full table-auto bg-white shadow-md border-2 rounded-xl my-10">
                      <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                          <th className="py-3 px-6 text-center">From</th>
                          <th className="py-3 px-6 text-center">To</th>
                          <th className="py-3 px-6 text-center">Date</th>
                          <th className="py-3 px-6 text-center">
                            NFTs Proposed
                          </th>
                          <th className="py-3 px-6 text-center">
                            NFTs Requested
                          </th>
                          <th className="py-3 px-6 text-center">Status</th>
                          <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                      </thead>
                      {transactions.length !== 0 && (
                        <tbody className="text-gray-600 text-sm font-light">
                          {transactions.map((transaction) =>
                            transaction.status === 'pending' &&
                            (transaction.from === address ||
                              transaction.to === address) ? (
                              <tr className="border-b border-gray-200 bg-gray-50 hover:bg-gray-100">
                                <td className="py-3 px-9 text-center whitespace-nowrap">
                                  {utils.truncateAddress(transaction.from)}
                                </td>
                                <td className="py-3 px-9 text-center">
                                  {utils.truncateAddress(transaction.to)}
                                </td>
                                <td className="py-3 px-9 text-center whitespace-nowrap">
                                  {transaction._createdAt.substr(0, 10)}
                                </td>
                                <td className="py-3 px-9 text-center">
                                  {transaction.initiatorNfts.map((nft) => (
                                    <div className="flex flex-col my-2 overflow">
                                      <Image
                                        src={nft.image_url}
                                        className="border-2 rounded-md"
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
                                        className="border-2 rounded-md"
                                        width={90}
                                        height={90}
                                      />
                                    </div>
                                  ))}
                                </td>
                                <td className="py-3 px-9 text-center">
                                  <span className="bg-yellow-200 text-yellow-600 py-1 px-6 rounded-full text-xs">
                                    PENDING
                                  </span>
                                </td>
                                <td className="py-3 px-3 justify-center">
                                  {transaction.from !== address ? (
                                    <div className="container flex justify-center gap-3">
                                      <button
                                        type="button"
                                        className="btn btn-purple"
                                        onClick={() => {
                                          setAccept(true);
                                          setAcceptTransaction(transaction);
                                        }}
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
                                        onClick={() => {
                                          setDecline(true);
                                        }}
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
                  ) : (
                    <ApprovalBeforeAccept
                      tokensToApprove={acceptTransaction.counterpartNfts}
                      swap={acceptTransaction}
                    />
                  )}
                </div>
              ) : (
                <h1 className="text-wise-grey text-center text-lg font-light">
                  There are not trades to be approved
                </h1>
              )}
            </div>
          )}
        </section>
      )}
    </section>
  );
}
