import { useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import Modal from '../ui/Modal';
import TradeOptions from './TradeOptions';

export default function AssetSelection() {
  const { address } = useContext(UserContext);
  const [counterpartyAddress, setCounterpartyAddress] = useState(null);
  const [validCounterparty, setValidCounterparty] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleAdd = () => {
    setValidCounterparty(true);
  };

  const handleTrash = () => {
    setValidCounterparty(false);
    setCounterpartyAddress(null);
  };

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
        <div className="border-t-2 container">
          <h1 className="text-wise-blue text-xl mt-3 ml-3">
            Counterparty Wallet
          </h1>
          {!validCounterparty ? (
            <div className="flex justify-start items-center flex-row gap-3 mb-3">
              <input
                className="mt-3 ml-3 input"
                type="text"
                placeholder="Counterparty Address"
                value={counterpartyAddress}
                onChange={(e) => setCounterpartyAddress(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-white hover:bg-wise-white hover:text-black"
                onClick={handleAdd}
              >
                Add
              </button>
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
