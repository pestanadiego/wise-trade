import Image from 'next/image';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import { ethers } from 'ethers';
import erc721abi from '../../smart_contracts/artifacts/contracts/erc721abi.json';
import Loader from '../ui/Loader';
import client from '../../lib/sanityClient';
import WiseTradeV1 from '../../smart_contracts/artifacts/contracts/WiseTradeV1.sol/WiseTradeV1.json';

export default function ApprovalBeforeAccept({
  tokensToReceive,
  tokensToApprove,
  swap,
}) {
  const { provider, user, address, setUser } = useContext(UserContext);
  const [counter, setCounter] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingConfirm, setIsLoadingConfirm] = useState(false);
  const [finishedSwap, setFinishedSwap] = useState(false);
  const [validApproval, setValidApproval] = useState(false);
  const [allSuccessful, setAllSuccessful] = useState(false);

  const handleApprove = async () => {
    for (let i = 0; i < tokensToApprove.length; i++) {
      // Abi
      console.log('nid', tokensToApprove[i].nid);
      console.log('id', tokensToApprove[i].id);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        tokensToApprove[i].nftAddress,
        erc721abi,
        signer
      );

      // Primero se verifica si ya está aprobado.
      const isApproved = await contract
        .getApproved(tokensToApprove[i].id)
        .then(async (res) => {
          console.log(res);
          if (res !== '0xB7dBbA436f5c4873B27C90De74eEFCDA0812C65a') {
            // De lo contrario, se aprueba
            await contract
              .approve(
                '0xB7dBbA436f5c4873B27C90De74eEFCDA0812C65a',
                tokensToApprove[i].id
              )
              .then((pre) => {
                setIsLoading(true);
                console.log(pre);
                pre.wait().then((receipt) => {
                  if (
                    receipt.confirmations === 1 ||
                    receipt.confirmations === 0
                  ) {
                    setCounter(counter++);
                    console.log(counter);
                    console.log(receipt);
                    if (tokensToApprove.length === counter) {
                      setIsLoading(false);
                      setAllSuccessful(true);
                      setValidApproval(true);
                    }
                  } else {
                    console.log('Error');
                  }
                });
                console.log(pre);
              })
              .catch((error) => {
                console.log(error);
                toast.error('You have to approve all the NFTs.', {
                  position: 'bottom-right',
                });
                setIsLoading(false);
              });
          } else {
            setCounter(counter++);
            if (tokensToApprove.length === counter) {
              setIsLoading(false);
              setAllSuccessful(true);
              setValidApproval(true);
            }
          }
        });
    }
  };

  const checkIfSwapIsAnOffer = async () => {
    // Se actualiza el listing
    if (swap.isListing) {
      await client
        .patch(swap.listingId)
        .set({ status: 'traded' })
        .commit()
        .then(async () => {
          // Se actualiza el usuario que hizo el listing
          await client.getDocument(swap.from).then(async (res) => {
            const updatedListings = [];
            for (let i = 0; i < res.listings.length; i++) {
              if (res.listings[i]._id === swap.listingId) {
                res.listings[i] = { ...res.listings[i], status: 'traded' };
              }
              updatedListings.push(res.listings[i]);
            }
            await client
              .patch(swap.from)
              .set({ listings: updatedListings })
              .commit();
          });
        });
    }
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
      '0xB7dBbA436f5c4873B27C90De74eEFCDA0812C65a',
      WiseTradeV1.abi,
      signer
    );
    await contract
      .acceptSwap(swap.idOfSwap, ethers.utils.parseEther('0.001'))
      .then((pre) => {
        setIsLoadingConfirm(true);
        pre.wait().then(async (receipt) => {
          console.log(receipt);
          if (receipt.confirmations === 0 || receipt.confirmations === 1) {
            await modifySwapInSanity().then(async () => {
              await checkIfSwapIsAnOffer();
            });
          }
          setIsLoadingConfirm(false);
          setFinishedSwap(true);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      {!finishedSwap ? (
        <div className="flex flex-col items-center">
          <div className="flex flex-col flex-wrap justify-center items-center gap-3 mb-6">
            <p className="sub-heading mb-6">
              Approve your NFTs to finish the trade
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
                </div>
              ))}
            </div>
          </div>
          <div>
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
                  allSuccessful
                    ? 'btn-disabled mb-3 text-sm'
                    : 'btn bg-wise-purple mb-3 text-sm text-white'
                }
                disabled={allSuccessful && true}
                onClick={handleApprove}
              >
                {allSuccessful ? 'Approved' : 'Approve'}
              </button>
            )}
          </div>
          <div className="mt-3">
            <button
              type="button"
              className={
                validApproval && !isLoadingConfirm // Si no funciona quitar !isLoadingConfirm
                  ? 'btn btn-purple'
                  : 'btn-disabled'
              }
              onClick={handleAcceptSwap}
              disabled={(!validApproval || isLoadingConfirm) && true}
            >
              {isLoadingConfirm ? <Loader /> : 'Confirm Swap'}
            </button>
          </div>
        </div>
      ) : (
        <div className="container m-3 flex flex-col">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="border-2 rounded-xl w-full md:w-1/2">
              <div className="flex flex-col justify-center items-center m-4">
                <p className="title">NFTs you'd let go</p>
                <div className="flex flex-row gap-5 justify-end my-3">
                  {tokensToApprove.map((token) => (
                    <div className="flex flex-col border-2 rounded-md items-center bg-wise-white w-[120px] max-w-[120px] h-[230px] max-h-[230px] inline-block">
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
            </div>
            <div className>
              <i className="fa fa-arrow-down md:-rotate-90 text-xl text-wise-blue" />
            </div>
            <div className="border-2 rounded-xl w-full md:w-1/2">
              <div className="flex flex-col justify-center items-center m-4">
                <p className="title">NFTs you'd get</p>
                <div className="flex flex-row gap-5 justify-end my-3">
                  {tokensToReceive.map((token) => (
                    <div className="flex flex-col border-2 rounded-md items-center bg-wise-white w-[120px] max-w-[120px] h-[230px] max-h-[230px]">
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
            </div>
          </div>
          <div className="flex items-center justify-center mt-5">
            <Link href="/">
              <button className="btn btn-purple">Exit</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
