import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import utils from '../../utils/utils';
import Modal from '../ui/Modal';
import TradeOptions from './TradeOptions';

export default function AssetSelection() {
  const { address } = useContext(UserContext);
  const [counterpartyAddress, setCounterpartyAddress] = useState('');
  const [validCounterparty, setValidCounterparty] = useState(false);
  const [selection, setSelection] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleAdd = () => {
    setSelection(true);
  };

  const handleTrash = () => {
    setValidCounterparty(false);
    setSelection(false);
    setCounterpartyAddress('');
  };

  useEffect(() => {
    if (utils.validateAddress(counterpartyAddress)) {
      setValidCounterparty(true);
    } else {
      setValidCounterparty(false);
    }
  }, [counterpartyAddress]);

  return (
    <>
      <div className="flex flex-col justify-center align-center w-full border-2 rounded-md">
        {/* TRADER */}
        <div className="container">
          <h1 className="text-wise-blue text-xl mt-3 ml-3">My Wallet</h1>
          <p className="text-wise-grey m-3 overflow-hidden">{address}</p>
        </div>
        <div
          className="flex flex-col justify-center items-center my-20 cursor-pointer"
          onClick={() => setOpenModal(true)}
        >
          <i className="fa fa-plus text-wise-grey text-5xl mb-3" />
          <p className="text-wise-grey">Add Your NFTs, ERC20 or Ethereum</p>
        </div>
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
                  {counterpartyAddress}
                </p>
                <i
                  className="fa fa-trash text-wise-grey cursor-pointer"
                  onClick={handleTrash}
                />
              </div>
              <div className="flex flex-col justify-center items-center my-20 cursor-pointer">
                <i className="fa fa-plus text-wise-grey text-5xl mb-3" />
                <p className="text-wise-grey">
                  Add Your NFTs, ERC20 or Ethereum
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {openModal && (
        <Modal setOpenModal={setOpenModal}>
          <TradeOptions />
        </Modal>
      )}
    </>
  );
}
