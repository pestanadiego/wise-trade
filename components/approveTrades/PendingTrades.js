import { useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Image from 'next/image';
import { UserContext } from '../../context/UserContext';
import utils from '../../utils/utils';
import client from '../../lib/sanityClient';
import WiseTradeV1 from '../../smart_contracts/artifacts/contracts/WiseTradeV1.sol/WiseTradeV1.json';
import ApprovalBeforeAccept from './ApprovalBeforeAccept';

export default function PendingTrades() {
  const { setUser, user, address, provider } = useContext(UserContext);
  const [acceptTransaction, setAcceptTransaction] = useState(null);
  const [isLoadingReject, setIsLoadingReject] = useState(false);
  const [declineTransaction, setDeclineTransaction] = useState(null);
  const [accept, setAccept] = useState(false);
  const [transactions, setTransactions] = useState([]);

  const swapsToApprove = () => {
    if (user.swaps == null) {
      return [];
    }
    const swaps = user.swaps;
    console.log(swaps);

    const pendingApprovals = [];
    for (let i = 0; i < swaps.length; i++) {
      if (swaps[i].to === address || swaps[i].from === address) {
        pendingApprovals.push(swaps[i]);
      }
    }
    return pendingApprovals;
  };

  const modifyRejectionInSanity = async () => {
    // Se modifica el swap
    await client
      .patch(declineTransaction._id)
      .set({ status: 'cancelled' })
      .commit();

    // Se modifica el swap del Initiator
    const initiator = await client.getDocument(declineTransaction.from);
    console.log(initiator);

    const updatedInitiatorSwaps = [];
    for (let i = 0; i < initiator.swaps.length; i++) {
      if (declineTransaction.idOfSwap === initiator.swaps[i].idOfSwap) {
        initiator.swaps[i] = { ...initiator.swaps[i], status: 'cancelled' };
      }
      updatedInitiatorSwaps.push(initiator.swaps[i]);
    }
    await client
      .patch(declineTransaction.from)
      .set({ swaps: updatedInitiatorSwaps })
      .commit();

    // Se modifica el swap del Counterpart
    const counterpart = await client.getDocument(declineTransaction.to);
    console.log(counterpart);

    const updatedCounterpartSwaps = [];
    for (let i = 0; i < counterpart.swaps.length; i++) {
      if (declineTransaction.idOfSwap === counterpart.swaps[i].idOfSwap) {
        counterpart.swaps[i] = { ...counterpart.swaps[i], status: 'cancelled' };
      }
      updatedCounterpartSwaps.push(counterpart.swaps[i]);
    }
    await client
      .patch(declineTransaction.to)
      .set({ swaps: updatedCounterpartSwaps })
      .commit();

    // Se modifica el userContext
    const updatedSwaps = [];
    for (let i = 0; i < user.swaps.length; i++) {
      if (declineTransaction.idOfSwap == user.swaps[i].idOfSwap) {
        user.swaps[i] = {
          ...user.swaps[i],
          status: 'cancelled',
        };
      }
      updatedSwaps.push(user.swaps[i]);
    }
    setUser({ ...user, swaps: updatedSwaps });
  };

  const handleDecline = async () => {
    if (declineTransaction != null) {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        '0x3376C58a9ca4fBD7E6b96B7866322152C14F9375',
        WiseTradeV1.abi,
        signer
      );
      await contract
        .cancelSwap(declineTransaction.idOfSwap)
        .then((pre) => {
          setIsLoadingReject(true);
          pre.wait().then(async (receipt) => {
            console.log(receipt);
            if (receipt.confirmations === 1) {
              console.log(receipt);
              await modifyRejectionInSanity();
            }
            setIsLoadingReject(false);
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
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
                                        className={
                                          isLoadingReject
                                            ? 'btn-disabled'
                                            : 'btn btn-purple'
                                        }
                                        disabled={isLoadingReject}
                                        onClick={async () => {
                                          setDeclineTransaction(transaction);
                                          await handleDecline();
                                        }}
                                      >
                                        {isLoadingReject
                                          ? 'Waiting...'
                                          : 'Reject'}
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex justify-center space-x-10">
                                      <button
                                        type="button"
                                        className={
                                          isLoadingReject
                                            ? 'btn-disabled'
                                            : 'btn btn-purple'
                                        }
                                        disabled={isLoadingReject}
                                        onClick={async () => {
                                          setDeclineTransaction(transaction);
                                          await handleDecline();
                                        }}
                                      >
                                        {isLoadingReject
                                          ? 'Waiting...'
                                          : 'Reject'}
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
                          {}
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
