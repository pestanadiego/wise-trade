import Image from 'next/image';
import Link from 'next/link';
import { useState, useContext } from 'react';
import AssetApproval from '../trade/AssetApproval';
import { ethers } from 'ethers';
import WiseTradeV1 from '../../smart_contracts/artifacts/contracts/WiseTradeV1.sol/WiseTradeV1.json';
import { UserContext } from '../../context/UserContext';
import Loader from '../ui/Loader';
import utils from '../../utils/utils';
import client from '../../lib/sanityClient';

export default function AcceptOffer({
  counterpartyAddress,
  tokensToTransfer,
  tokensToReceive,
}) {
  const [validApproval, setValidApproval] = useState(false);
  const [confirmedSwap, setConfirmedSwap] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { provider, address, user, setUser } = useContext(UserContext);
  console.log('tokens to receive', tokensToReceive);
  console.log('counterpartyAddress', counterpartyAddress);

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
      '0x4849A0D150556Aa910Bf9155D1BBA21c960FC291',
      WiseTradeV1.abi,
      signer
    );

    //ReadCounter
    const counter = await contract.ReadCounter();
    console.log(counter);

    // proposeSwap
    await contract
      .proposeSwap(
        counterpartyAddress,
        nftAddressesInit,
        nftIdsInit,
        nftAddressesCounter,
        nftIdsCounter
      )
      .then((pre) => {
        setIsLoading(true);
        pre.wait().then(async (receipt) => {
          console.log(receipt);
          if (receipt.confirmations === 1) {
            console.log(receipt);
            setConfirmedSwap(true);
            await addSwapToSanity(counter);
          }
          setIsLoading(false);
        });
      })
      .catch((error) => {
        console.log(error);
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
                    <Loader />
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
                    {isLoading ? <Loader /> : 'Confirm Swap'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
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
                  <Link href="approveTrades">Pending Trades</Link>
                </button>
                <p className="text-wise-grey font-thin text-sm mt-3">
                  Go to <span className="font-bold">Pending Trades</span> if you
                  want to cancel the trade
                </p>
              </div>
              <div className="w-1/2 text-center">
                <button className="btn btn-purple w-[170px]">
                  <Link href="history">Trade History</Link>
                </button>
                <p className="text-wise-grey font-thin text-sm mt-3">
                  Go to <span className="font-bold">Trade History </span>
                  for more information of your trades
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
