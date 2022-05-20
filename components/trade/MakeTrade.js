import { ethers } from 'ethers';
import { useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import ProgressBar from './ProgressBar';
import AssetSelection from './AssetSelection';
import AssetApproval from './AssetApproval';
// eslint-disable-next-line import/no-relative-packages
import WiseTradeV1 from '../../smart_contracts/artifacts/contracts/WiseTradeV1.sol/WiseTradeV1.json';

export default function MakeTrade() {
  const { address, provider } = useContext(UserContext);
  const [progress, setProgress] = useState(1);
  const [validSwap, setValidSwap] = useState(false);
  const [validApproval, setValidApproval] = useState(false);
  const [tokensToTransfer, setTokensToTransfer] = useState([]);
  const [tokensToReceive, setTokensToReceive] = useState([]);
  const [counterpartyAddress, setCounterpartyAddress] = useState('');

  const handleNext = () => {
    setProgress(progress + 1);
    console.log('joa');
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
      '0xA37B171aB62EF81F44BFdBDBeE0EA59Fd67D1B96',
      WiseTradeV1.abi,
      signer
    );
    await contract.proposeSwap(
      counterpartyAddress,
      nftAddressesInit,
      nftIdsInit,
      nftAddressesCounter,
      nftIdsCounter
    );

    /*
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
      */
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
                  <div className="container m-3">
                    <p>asdasd</p>
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
                    <button
                      type="button"
                      className={
                        validApproval ? 'btn btn-purple' : 'btn-disabled'
                      }
                      onClick={handleProposal}
                      disabled={!validApproval && true}
                    >
                      Next
                    </button>
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
