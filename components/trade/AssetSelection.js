import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import utils from '../../utils/utils';
import Modal from '../ui/Modal';
import TradeOptions from './TradeOptions';

export default function AssetSelection({
  setValidSwap,
  tokensToTransfer,
  setTokensToTransfer,
}) {
  const { address } = useContext(UserContext);
  const [counterpartyAddress, setCounterpartyAddress] = useState('');
  const [validCounterparty, setValidCounterparty] = useState(false);
  const [selection, setSelection] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModalCounterparty, setOpenModalCounterparty] = useState(false);
  const [tokensToReceive, setTokensToReceive] = useState([]);

  const handleAdd = () => {
    setSelection(true);
  };

  const handleTrash = () => {
    setValidCounterparty(false);
    setSelection(false);
    setCounterpartyAddress('');
    setTokensToReceive([]);
  };

  useEffect(() => {
    if (
      utils.validateAddress(counterpartyAddress) &&
      address !== counterpartyAddress
    ) {
      setValidCounterparty(true);
    } else {
      setValidCounterparty(false);
    }
  }, [counterpartyAddress]);

  useEffect(() => {
    if (tokensToTransfer.length !== 0 && selection) {
      setValidSwap(true);
    } else {
      setValidSwap(false);
    }
  }, [selection]);

  return (
    <>
      <div className="flex flex-col justify-center align-center w-full border-2 rounded-md">
        {/* TRADER */}
        <div className="container">
          <h1 className="text-wise-blue text-xl mt-3 ml-3">My Wallet</h1>
          <p className="text-wise-grey m-3 overflow-hidden">
            {utils.truncateAddress(address)}
          </p>
        </div>
        {tokensToTransfer.length === 0 ? (
          <div
            className="flex flex-col justify-center items-center my-20 cursor-pointer"
            onClick={() => setOpenModal(true)}
          >
            <i className="fa fa-plus text-wise-grey text-5xl mb-3" />
            <p className="text-wise-grey">Add Your NFTs</p>
          </div>
        ) : (
          <div>
            <div className="flex flex-row flex-wrap justify-center gap-3 mb-6">
              {tokensToTransfer.map((token) => (
                <div className="flex flex-col border-2 rounded-md items-center bg-wise-white w-[120px] max-w-[120px] inline-block">
                  <Image
                    src={token.image_url}
                    width={120}
                    height={120}
                    className="object-fill"
                  />
                  <p className="my-3 text-center">{token.name}</p>
                  <p className="my-3 text-center">{token.id}</p>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="btn btn-purple m-4"
              onClick={(e) => setOpenModal(true)}
            >
              Add More
            </button>
            <button
              type="button"
              className="btn btn-purple"
              onClick={(e) => setTokensToTransfer([])}
            >
              Remove All
            </button>
          </div>
        )}
        {/* CONTRAPARTE */}
        <div className="border-t-2 container mb-3">
          <h1 className="text-wise-blue text-xl mt-3 ml-3">
            Counterparty Wallet
          </h1>
          {!selection ? (
            <div className="flex flex-col justify-start ml-3 mb-3">
              <div className="flex justify-start items-baseline flex-row gap-3 mb-1">
                <input
                  className="mt-3 input"
                  type="text"
                  placeholder="Counterparty Address"
                  value={counterpartyAddress}
                  onChange={(e) => setCounterpartyAddress(e.target.value)}
                />
                <button
                  type="button"
                  disabled={!validCounterparty && true}
                  className={
                    validCounterparty
                      ? 'btn btn-white hover:bg-white hover:text-black'
                      : 'btn-disabled'
                  }
                  onClick={handleAdd}
                  title={
                    validCounterparty === false &&
                    counterpartyAddress !== '' &&
                    'Insert a valid address'
                  }
                >
                  Add
                </button>
              </div>
              {validCounterparty === false && counterpartyAddress !== '' && (
                <div className="flex flex-row gap-2 items-baseline">
                  <i className="fa fa-circle-exclamation text-red-500 text-sm" />
                  <p className="text-red-500 text-sm">
                    Please, insert a valid address
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="m-3 flex flex-row gap-3 items-baseline">
                <p className="text-wise-grey overflow-hidden">
                  {utils.truncateAddress(counterpartyAddress)}
                </p>
                <i
                  className="fa fa-trash text-wise-grey cursor-pointer"
                  onClick={handleTrash}
                />
              </div>
              {tokensToReceive.length === 0 ? (
                <div
                  className="flex flex-col justify-center items-center my-20 cursor-pointer"
                  onClick={() => setOpenModalCounterparty(true)}
                >
                  <i className="fa fa-plus text-wise-grey text-5xl mb-3" />
                  <p className="text-wise-grey">Add Your NFTs</p>
                </div>
              ) : (
                <div>
                  <div className="flex flex-row flex-wrap justify-center gap-3 mb-6">
                    {tokensToReceive.map((token) => (
                      <div className="flex flex-col border-2 rounded-md items-center bg-wise-white w-[120px] max-w-[120px] inline-block">
                        <Image
                          src={token.image_url}
                          width={120}
                          height={120}
                          className="object-fill"
                        />
                        <p className="my-3 text-center">{token.name}</p>
                        <p className="my-3 text-center">{token.id}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="btn btn-purple"
                    onClick={(e) => setOpenModalCounterparty(true)}
                  >
                    Add More
                  </button>
                  <button
                    type="button"
                    className="btn btn-purple mx-4"
                    onClick={(e) => setTokensToReceive([])}
                  >
                    Remove All
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {openModal && (
        <Modal setOpenModal={setOpenModal}>
          <TradeOptions
            address={address}
            setTokensToTransfer={setTokensToTransfer}
            setOpenModal={setOpenModal}
          />
        </Modal>
      )}
      {openModalCounterparty && (
        <Modal setOpenModal={setOpenModalCounterparty}>
          <TradeOptions
            address={counterpartyAddress}
            setTokensToTransfer={setTokensToReceive}
            setOpenModal={setOpenModalCounterparty}
          />
        </Modal>
      )}
    </>
  );
}
