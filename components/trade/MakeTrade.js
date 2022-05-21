/* eslint-disable no-unused-vars */
import Image from 'next/image';
import { ethers } from 'ethers';
import { useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import ProgressBar from './ProgressBar';
import AssetSelection from './AssetSelection';
import AssetApproval from './AssetApproval';
// eslint-disable-next-line import/no-relative-packages
import WiseTradeV1 from '../../smart_contracts/artifacts/contracts/WiseTradeV1.sol/WiseTradeV1.json';
// eslint-disable-next-line import/extensions
import client from '../../lib/sanityClient';
import utils from '../../utils/utils';

export default function MakeTrade() {
  const { address, provider } = useContext(UserContext);
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

  const addSwapToSanity = async () => {
    // First, increment the counter
    const incSwap = await client
      .patch('b140beb0-f6bf-455f-a4d3-e5de157cda1a')
      .inc({ swapCounter: 1 })
      .commit();

    console.log(incSwap);

    const counterDoc = await client.getDocument(
      'b140beb0-f6bf-455f-a4d3-e5de157cda1a'
    );

    const swapId = counterDoc.swapCounter;

    // Then, create a document for the counterparty
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
      console.log(res);

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
      '0x3376C58a9ca4fBD7E6b96B7866322152C14F9375',
      WiseTradeV1.abi,
      signer
    );
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
            await addSwapToSanity();
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
            <h2 className="text-wise-blue text-3xl md:text-4 lg:text-5xl text-center mb-6">
              Make A Trade
            </h2>
            <div className="w-full">
              <div>
                <p className="text-wise-grey text-lg text-center mb-6">
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
                    <div className="flex flex-col justify-center items-center mb-6">
                      <p classname="text-wise-blue text-2xl">
                        NFTs you'd let go:
                      </p>
                      <div className="flex flex-row gap-5 justify-center my-3">
                        {tokensToTransfer.map((token) => (
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
                    </div>
                  </div>
                )}

                {/* BOTONES */}
                {progress === 1 && (
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className={validSwap ? 'btn btn-purple' : 'btn-disabled'}
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
                        Waiting...
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
                        {isLoading ? 'Waiting...' : 'Confirm Swap'}
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
