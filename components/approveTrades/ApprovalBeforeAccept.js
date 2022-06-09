import Image from 'next/image';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import { ethers } from 'ethers';
import Loader from '../ui/Loader';
import client from '../../lib/sanityClient';
import WiseTradeV1 from '../../smart_contracts/artifacts/contracts/WiseTradeV1.sol/WiseTradeV1.json';

export default function ApprovalBeforeAccept({
  tokensToReceive,
  tokensToApprove,
  swap,
}) {
  const { provider, user, setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [finishedSwap, setFinishedSwap] = useState(false);
  const [isLoadingConfirm, setIsLoadingConfirm] = useState(false);
  const [validApproval, setValidApproval] = useState(false);
  const [success, setSuccess] = useState(() => {
    const arr = [];
    for (let i = 0; i < tokensToApprove.length; i++) {
      arr.push(false);
    }
    return arr;
  });

  const handleApprove = async (token, i) => {
    console.log(token);
    console.log('tokens', tokensToApprove);
    console.log('success antes', success);
    // Abi
    const abi = [
      'function approve(address to, uint256 tokenId) public returns (bool success)',
    ];
    const signer = provider.getSigner();
    const contract = new ethers.Contract(token.nftAddress, abi, signer);
    console.log(success);
    // Contract
    await contract
      .approve('0x4849A0D150556Aa910Bf9155D1BBA21c960FC291', token.id)
      .then((pre) => {
        console.log(pre);
        setIsLoading(true);
        pre.wait().then((receipt) => {
          if (receipt.confirmations === 1) {
            success[i] = true;
            const updatedSuccess = [];
            console.log('antes', success);
            for (let i = 0; i < success.length; i++) {
              updatedSuccess.push(success[i]);
            }
            setSuccess(updatedSuccess);
            console.log(receipt);
            console.log(success);
          } else {
            console.log('Error');
            console.log(receipt);
          }
          setIsLoading(false);
        });
        console.log(pre);
        console.log(success);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const modifySwapInSanity = async () => {
    console.log(swap._id);

    // Se modifica el swap
    await client.patch(swap._id).set({ status: 'completed' }).commit();

    // Se modifica el swap del Initiator
    const initiator = await client.getDocument(swap.from);
    console.log(initiator);

    const updatedInitiatorSwaps = [];
    for (let i = 0; i < initiator.swaps.length; i++) {
      if (swap.idOfSwap === initiator.swaps[i].idOfSwap) {
        initiator.swaps[i] = { ...initiator.swaps[i], status: 'completed' };
      }
      updatedInitiatorSwaps.push(initiator.swaps[i]);
    }
    await client
      .patch(swap.from)
      .set({ swaps: updatedInitiatorSwaps })
      .commit();

    // Se modifica el swap del Counterpart
    const counterpart = await client.getDocument(swap.to);
    console.log(counterpart);

    const updatedCounterpartSwaps = [];
    for (let i = 0; i < counterpart.swaps.length; i++) {
      if (swap.idOfSwap === counterpart.swaps[i].idOfSwap) {
        counterpart.swaps[i] = { ...counterpart.swaps[i], status: 'completed' };
      }
      updatedCounterpartSwaps.push(counterpart.swaps[i]);
    }
    await client
      .patch(swap.to)
      .set({ swaps: updatedCounterpartSwaps })
      .commit();

    // Se modifica el userContext
    const updatedSwaps = [];
    for (let i = 0; i < user.swaps.length; i++) {
      if (swap.idOfSwap == user.swaps[i].idOfSwap) {
        user.swaps[i] = {
          ...user.swaps[i],
          status: 'completed',
        };
      }
      updatedSwaps.push(user.swaps[i]);
    }
    setUser({ ...user, swaps: updatedSwaps });
  };

  const handleAcceptSwap = async () => {
    console.log(swap);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      '0x4849A0D150556Aa910Bf9155D1BBA21c960FC291',
      WiseTradeV1.abi,
      signer
    );
    await contract
      .acceptSwap(swap.idOfSwap)
      .then((pre) => {
        setIsLoadingConfirm(true);
        pre.wait().then(async (receipt) => {
          console.log(receipt);
          if (receipt.confirmations === 1) {
            console.log(receipt);
            await modifySwapInSanity();
          }
          setIsLoadingConfirm(false);
          setFinishedSwap(true);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    for (let i = 0; i < success.length; i++) {
      if (success[i] === false) {
        setValidApproval(false);
        break;
      }
      setValidApproval(true);
    }
  }, [success]);

  return (
    <div>
      {!finishedSwap ? (
        <div className="flex flex-col items-center">
          <div className="flex flex-col flex-wrap justify-center items-center gap-3 mb-6">
            <p className="sub-heading mb-6">
              Approve your NFTs to finish the swap
            </p>
            <div className="flex flex-row gap-5 justify-center">
              {tokensToApprove.map((token, i) => (
                <div className="flex flex-col border-2 rounded-md items-center bg-wise-white w-[120px] max-w-[120px]">
                  <Image
                    src={token.image_url}
                    width={120}
                    height={120}
                    className="object-fill rounded-md"
                  />
                  <p className="my-3 text-center">{token.id}</p>
                  <p className="mb-3 text-center">{token.name}</p>
                  {isLoading ? (
                    <button
                      type="button"
                      className="btn-disabled mb-3 text-sm"
                      disabled
                    >
                      <Loader />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={
                        success[i]
                          ? 'btn-disabled mb-3 text-sm'
                          : 'btn bg-wise-purple mb-3 text-sm'
                      }
                      disabled={success[i] && true}
                      onClick={() => handleApprove(token, i)}
                    >
                      {success[i] ? 'Approved' : 'Approve'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3">
            <button
              type="button"
              className={
                !validApproval || isLoadingConfirm
                  ? 'btn-disabled'
                  : 'btn btn-purple'
              }
              onClick={handleAcceptSwap}
              disabled={(!validApproval || isLoadingConfirm) && true}
            >
              {isLoading || isLoadingConfirm ? <Loader /> : 'Confirm Swap'}
            </button>
          </div>
        </div>
      ) : (
        <div className="container m-3 flex flex-col">
          <div className="flex flex-col justify-center items-center mb-6">
            <h1 className="text-wise-grey text-center text-lg">
              Trade completed
            </h1>
            <p classname="text-wise-blue text-2xl">NFTs you'd let go:</p>
            <div className="flex flex-row gap-5 justify-center my-3">
              {tokensToApprove.map((token) => (
                <div className="flex flex-col border-2 rounded-md items-center bg-wise-white w-[120px] max-w-[120px] inline-block">
                  <Image
                    src={token.image_url}
                    width={120}
                    height={120}
                    className="object-fill"
                  />
                  <p className="my-3 text-center">{token.id}</p>
                  <p className="mb-3 text-center">{token.name}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <p>NFTs you'd get:</p>
            <div className="flex flex-row gap-5 justify-center my-3">
              {tokensToReceive.map((token) => (
                <div className="flex flex-col border-2 rounded-md items-center bg-wise-white w-[120px] max-w-[120px]">
                  <Image
                    src={token.image_url}
                    width={120}
                    height={120}
                    className="object-fill"
                  />
                  <p className="my-3 text-center">{token.id}</p>
                  <p className="mb-3 text-center">{token.name}</p>
                </div>
              ))}
            </div>
            <Link href="/">
              <button type="button" className="btn btn-purple">
                Exit
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
