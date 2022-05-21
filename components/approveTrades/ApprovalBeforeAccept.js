import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import { ethers } from 'ethers';
import client from '../../lib/sanityClient';
import WiseTradeV1 from '../../smart_contracts/artifacts/contracts/WiseTradeV1.sol/WiseTradeV1.json';
import { use } from 'chai';

export default function ApprovalBeforeAccept({ tokensToApprove, swap }) {
  const { provider, user, setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConfirm, setIsLoadingConfirm] = useState(false);
  const [validApproval, setValidApproval] = useState(false);
  const [success, setSuccess] = useState(
    new Array(tokensToApprove).fill(false)
  );

  const handleApprove = async (token, i) => {
    console.log(token);
    console.log(success);
    // Abi
    const abi = [
      'function approve(address to, uint256 tokenId) public returns (bool success)',
    ];
    const signer = provider.getSigner();
    const contract = new ethers.Contract(token.nftAddress, abi, signer);
    console.log(success);
    // Contract
    await contract
      .approve('0xA37B171aB62EF81F44BFdBDBeE0EA59Fd67D1B96', token.id)
      .then((pre) => {
        console.log(pre);
        setIsLoading(true);
        pre.wait().then((receipt) => {
          if (receipt.confirmations === 1) {
            success[i] = true;
            const updatedSuccess = success.map((bool) => (bool ? true : false));
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
    // Se modifica el swap
    await client.patch(swap._id).set({ status: 'completed' }).commit();

    // Se modifica el swap del Initiator
    const initiator = await client.getDocument(swap.from);
    console.log(initiator);

    for (let i = 0; i < initiator.swaps.length; i++) {
      if (swap.idOfSwap === initiator.swaps[i].idOfSwap) {
        await client
          .patch(initiator.swaps[i]._id)
          .setIfMissing({ status: 'completed' })
          .set({ status: 'completed' })
          .commit()
          .then((pre) => console.log(pre));
      }
    }

    // Se modifica el swap del Counterpart
    const counterpart = await client.getDocument(swap.to);
    console.log(counterpart);

    for (let i = 0; i < counterpart.swaps.length; i++) {
      if (swap.idOfSwap === counterpart.swaps[i].idOfSwap) {
        await client
          .patch(counterpart.swaps[i]._id)
          .setIfMissing({ status: 'completed' })
          .set({ status: 'completed' })
          .commit()
          .then((pre) => console.log(pre));
      }
    }

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
      '0xA37B171aB62EF81F44BFdBDBeE0EA59Fd67D1B96',
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
    <div className="flex flex-col items-center">
      <div className="flex flex-col flex-wrap justify-center items-center gap-3 mb-6">
        <p className="text-wise-grey text-xl mb-6">
          Approve your NFTs to finish the swap
        </p>
        {tokensToApprove.map((token, i) => (
          <div className="flex flex-col border-2 rounded-md items-center bg-wise-white w-[120px] max-w-[120px] inline-block">
            <Image
              src={token.image_url}
              width={120}
              height={120}
              className="object-fill"
            />
            <p className="my-3 text-center">{token.id}</p>
            <p className="mb-3 text-center">{token.name}</p>
            {isLoading ? (
              <button
                type="button"
                className="btn-disabled mb-3 text-sm"
                disabled
              >
                Waiting...
              </button>
            ) : (
              <button
                type="button"
                className={
                  success[i]
                    ? 'btn-disabled mb-3 text-sm'
                    : 'btn bg-wise-red mb-3 text-sm'
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
      <div className="mt-3">
        <button
          type="button"
          className={validApproval ? 'btn btn-purple' : 'btn-disabled'}
          onClick={handleAcceptSwap}
          disabled={(!validApproval || isLoadingConfirm) && true}
        >
          {isLoading ? 'Waiting...' : 'Confirm Swap'}
        </button>
      </div>
    </div>
  );
}
