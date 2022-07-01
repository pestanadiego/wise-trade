import Image from 'next/image';
import Link from 'next/link';
import { useState, useContext } from 'react';
import AssetApproval from '../trade/AssetApproval';
import { ethers } from 'ethers';
import WiseTradeV1 from '../../smart_contracts/artifacts/contracts/WiseTradeV1.sol/WiseTradeV1.json';
import { UserContext } from '../../context/UserContext';
import Loader from '../ui/Loader';
import emailjs from 'emailjs-com';
import utils from '../../utils/utils';
import templates from '../../utils/templates';
import client from '../../lib/sanityClient';
import { tuple } from 'rsuite/esm/@types/utils';

export default function AcceptOffer({
  counterpartyAddress,
  tokensToTransfer,
  tokensToReceive,
  i,
  asset,
}) {
  const [validApproval, setValidApproval] = useState(false);
  const [confirmedSwap, setConfirmedSwap] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { provider, address, user, setUser } = useContext(UserContext);
  console.log('tokens to receive', tokensToReceive);
  console.log('counterpartyAddress', counterpartyAddress);

  // Envio de correo
  const sendEmail = async (templateParams) => {
    emailjs
      .send(
        `${process.env.NEXT_PUBLIC_SERVICE_ID}`,
        `${process.env.NEXT_PUBLIC_TEMPLATE_OFFER_ACTION_ID}`,
        templateParams,
        `${process.env.NEXT_PUBLIC_PUBLIC_KEY}`
      )
      .then(
        (res) => {
          console.log(res);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  const handleProposal = async () => {
    // Arrays for Initiator
    const nftAddressesInit = [];
    const nftIdsInit = [];
    for (let i = 0; i < tokensToTransfer.length; i++) {
      const nftAddress = tokensToTransfer[i].nftAddress;
      const nftId = tokensToTransfer[i].id;
      nftAddressesInit.push(nftAddress);
      nftIdsInit.push(nftId);
    }
    console.log('nftAddressesInit', nftAddressesInit);
    console.log('nftIdsInit', nftIdsInit);
    // Arrays for Counterpart
    const nftAddressesCounter = [];
    const nftIdsCounter = [];
    for (let i = 0; i < tokensToReceive.length; i++) {
      const nftAddress = tokensToReceive[i].nftAddress;
      const nftId = tokensToReceive[i].id;
      nftAddressesCounter.push(nftAddress);
      nftIdsCounter.push(nftId);
    }

    console.log('nftAddressesCounter', nftAddressesCounter);
    console.log('nftIdsInit', nftIdsInit);

    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      '0xB7dBbA436f5c4873B27C90De74eEFCDA0812C65a',
      WiseTradeV1.abi,
      signer
    );

    //ReadCounter
    const counter = await contract.ReadCounter();
    console.log(counter);

    // proposeSwap
    await contract
      .proposeSwap(
        [
          address,
          nftAddressesInit,
          nftIdsInit,
          0,
          counterpartyAddress,
          nftAddressesCounter,
          nftIdsCounter,
          0,
        ],
        ethers.utils.parseEther('0.005'),
        { value: ethers.utils.parseEther('0.005') }
      )
      .then((pre) => {
        setIsLoading(true);
        pre.wait().then(async (receipt) => {
          console.log(receipt);
          if (receipt.confirmations === 1) {
            console.log(receipt);
            setConfirmedSwap(true);
            await addSwapToSanity(counter).then(async () => {
              // Se notifica al usuario que hizo la oferta que fue aceptada
              await client
                .getDocument(asset.listOffers[i].offerAddress)
                .then(async (res) => {
                  if (res.email || res.email !== '') {
                    await sendEmail(
                      templates.offerAcceptedTemplate(
                        res.email,
                        asset.listTitle
                      )
                    );
                  } else {
                    console.log(res);
                  }
                  await deleteOfferOnSanity();
                });
            });
          }
          setIsLoading(false);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteOfferOnSanity = async () => {
    // Se elimina la oferta del listing
    const offerToRemove = [`listOffers[${i}]`];
    await client
      .patch(asset._id)
      .unset(offerToRemove)
      .commit()
      .then(async () => {
        // Se busca el índice del listing
        let index;
        for (let n = 0; n < user.listings.length; n++) {
          if (user.listings[n]._id === asset._id) {
            index = n;
          }
        }
        // Se elimina la oferta del listing en el users
        const updatedListing = asset;
        updatedListing.listOffers.splice(i, 1);
        await client
          .patch(address)
          .insert('replace', `listings[${index}]`, [updatedListing])
          .commit({ autoGenerateArrayKeys: true });
        // Se actualiza en el UserContext
        const newListings = user.listings;
        newListings[index] = updatedListing;
        const updatedUser = { ...user, listings: newListings };
        setUser(updatedUser);
      });
  };

  const addSwapToSanity = async (counter) => {
    const swapId = parseInt(counter._hex, 16) + 1;
    console.log(swapId);

    // Create a document for the counterparty
    const createCounterpart = await client.createIfNotExists({
      _type: 'user',
      _id: counterpartyAddress,
      email: '',
      walletAddress: counterpartyAddress,
    });

    const initiatorNftsMapped = tokensToTransfer.map((token) => {
      return { ...token, id: parseInt(token.id), _key: utils.makeKey() };
    });

    console.log(initiatorNftsMapped);

    const counterpartNftsMapped = tokensToReceive.map((token) => {
      return { ...token, id: parseInt(token.id), _key: utils.makeKey() };
    });

    console.log(counterpartNftsMapped);

    // Finally, add the swap into the collection and link with users
    const swapDoc = {
      _type: 'swap',
      _id: swapId,
      from: address,
      to: counterpartyAddress,
      idOfSwap: swapId,
      initiatorNfts: initiatorNftsMapped,
      counterpartNfts: counterpartNftsMapped,
      status: 'pending',
      isListing: true,
      listingId: asset._id,
    };

    const createSwap = await client.create(swapDoc).then(async (res) => {
      const modifyCounterpart = await client
        .patch(counterpartyAddress)
        .setIfMissing({ swaps: [] })
        .insert('after', 'swaps[-1]', [res])
        .commit({ autoGenerateArrayKeys: true });

      const modifyInitiator = await client
        .patch(address)
        .setIfMissing({ swaps: [] })
        .insert('after', 'swaps[-1]', [res])
        .commit({ autoGenerateArrayKeys: true });

      // Se actualiza el UserContext
      if (user.swaps == null) {
        const updatedUser = { ...user, swaps: [res] };
        console.log(updatedUser);
        setUser(updatedUser);
      } else {
        const updatedSwaps = user.swaps;
        updatedSwaps.push(res);
        const updatedUser = { ...user, updatedSwaps };
        console.log(updatedUser);
        setUser(updatedUser);
      }
    });
  };

  return (
    <section>
      {!confirmedSwap ? (
        <>
          <div className="container flex flex-col-reverse items-center mt-14 lg:mt-28 mb-9">
            <div className="flex flex-col items-center w-full">
              <h2 className="heading md:text-4 lg:text-5xl">
                Approve Your NFTs
              </h2>
              <div className="flex flex-col items-center w-full mb-6 mt-4">
                <h1 className="text-center text-wise-grey">
                  Approve the NFTs you are going to trade
                </h1>
              </div>
              <AssetApproval
                tokensToTransfer={tokensToTransfer}
                setValidApproval={setValidApproval}
              />
              <div className="flex gap-3">
                {isLoading ? (
                  <button
                    type="button"
                    className="btn-disabled mb-3 text-sm"
                    disabled
                  >
                    <Loader isButton isDisabled />
                  </button>
                ) : (
                  <button
                    type="button"
                    className={
                      validApproval ? 'btn btn-purple' : 'btn-disabled'
                    }
                    onClick={handleProposal}
                    disabled={(!validApproval || isLoading) && true}
                  >
                    {isLoading ? (
                      <Loader isButton isDisabled />
                    ) : (
                      'Confirm Swap'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-14 lg:mt-28 mb-9 flex justify-center flex-col items-center">
          <p className="heading md:text-4 lg:text-5xl">Almost Done</p>
          <p className="sub-heading mb-8">Wait for the counterpart approval</p>
          <div className="container m-3 flex flex-col">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <div className="border-2 rounded-xl w-full md:w-1/2">
                <div className="flex flex-col justify-center items-center m-4">
                  <p className="title">NFTs you'd let go</p>
                  <div className="flex flex-row gap-5 justify-end my-3">
                    {tokensToTransfer.map((token) => (
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
            <div className="flex flex-col md:flex-row items-center gap-5 justify-center mt-5">
              <div className="w-1/2 text-center">
                <button className="btn btn-purple w-[170px]">
                  <Link href="/approveTrades">Pending Trades</Link>
                </button>
                <p className="text-wise-grey font-thin text-sm mt-3">
                  Go to <span className="font-bold">Pending Trades</span> if you
                  want to cancel the trade
                </p>
              </div>
              <div className="w-1/2 text-center">
                <button className="btn btn-purple w-[170px]">
                  <Link href="/history">Trade History</Link>
                </button>
                <p className="text-wise-grey font-thin text-sm mt-3">
                  Go to <span className="font-bold">Trade History </span>
                  for more information of your trades
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
