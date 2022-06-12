/* eslint-disable no-unused-vars */
import Image from 'next/image';
import { ethers } from 'ethers';
import { useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import Loader from '../ui/Loader';
import ProgressBar from './ProgressBar';
import AssetSelection from './AssetSelection';
import AssetApproval from './AssetApproval';
import Link from 'next/link';
// eslint-disable-next-line import/no-relative-packages
import WiseTradeV1 from '../../smart_contracts/artifacts/contracts/WiseTradeV1.sol/WiseTradeV1.json';
// eslint-disable-next-line import/extensions
import client from '../../lib/sanityClient';
import utils from '../../utils/utils';

export default function MakeTrade() {
  const { user, setUser, address, provider } = useContext(UserContext);
  const [progress, setProgress] = useState(1);
  const [validSwap, setValidSwap] = useState(false);
  const [validApproval, setValidApproval] = useState(false);
  const [tokensToTransfer, setTokensToTransfer] = useState([]);
  const [tokensToReceive, setTokensToReceive] = useState([]);
  const [counterpartyAddress, setCounterpartyAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    setProgress(progress + 1);
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
      isListing: false,
      listingId: '',
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

    // Arrays for Counterpart
    const nftAddressesCounter = [];
    const nftIdsCounter = [];
    for (let i = 0; i < tokensToReceive.length; i++) {
      const nftAddress = tokensToReceive[i].nftAddress;
      const nftId = tokensToReceive[i].id;
      nftAddressesCounter.push(nftAddress);
      nftIdsCounter.push(nftId);
    }

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
            setProgress(3);
            await addSwapToSanity(counter);
          }
          setIsLoading(false);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <section>
      {!address ? (
        <div className="text-wise-grey text-center">
          Connect your wallet to make a trade
        </div>
      ) : (
        <div className="container flex flex-col-reverse items-center mt-14 lg:mt-28 mb-9">
          <div className="flex flex-col items-center w-full">
            <h2 className="heading md:text-4 lg:text-5xl">Make A Trade</h2>
            <div className="w-full">
              <div>
                <p className="text-wise-grey sub-heading mb-6">
                  Follow each one of the steps to complete a trade
                </p>
                <ProgressBar progress={progress} />
              </div>
              <div className="flex justify-center items-center flex-col gap-3">
                {/* PASOS */}
                {progress === 1 && (
                  <AssetSelection
                    setValidSwap={setValidSwap}
                    tokensToTransfer={tokensToTransfer}
                    setTokensToTransfer={setTokensToTransfer}
                    tokensToReceive={tokensToReceive}
                    setTokensToReceive={setTokensToReceive}
                    counterpartyAddress={counterpartyAddress}
                    setCounterpartyAddress={setCounterpartyAddress}
                  />
                )}
                {progress === 2 && (
                  <div className="container m-3">
                    <AssetApproval
                      tokensToTransfer={tokensToTransfer}
                      setValidApproval={setValidApproval}
                    />
                  </div>
                )}
                {progress === 3 && (
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
                          Go to{' '}
                          <span className="font-bold">Pending Trades</span> if
                          you want to cancel the trade
                        </p>
                      </div>
                      <div className="w-1/2 text-center">
                        <button className="btn btn-purple w-[170px]">
                          <Link href="history">Trade History</Link>
                        </button>
                        <p className="text-wise-grey font-thin text-sm mt-3">
                          Go to{' '}
                          <span className="font-bold">Trade History </span>
                          for more information of your trades
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* BOTONES */}
                {progress === 1 && (
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className={
                        validSwap ? 'btn btn-purple' : 'btn-disabled -z-20'
                      }
                      onClick={handleNext}
                      disabled={!validSwap && true}
                    >
                      Next
                    </button>
                  </div>
                )}
                {progress === 2 && (
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
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
