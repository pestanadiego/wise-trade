import Image from 'next/image';
import Link from 'next/link';
import { Carousel } from 'react-responsive-carousel';
import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import NftsSelection from '../create/NftsSelection';
import utils from '../../utils/utils';
import Modal from '../ui/Modal';
import TradeOptions from '../trade/TradeOptions';
import toast from 'react-hot-toast';

export default function MarketplaceAsset({ asset }) {
  const [openModal, setOpenModal] = useState(false);
  const [nftsSelection, setNftsSelection] = useState([]);
  const [validSelection, setValidSelection] = useState(false);
  const { address, user } = useContext(UserContext);
  const [isOpen, setOpen] = useState(false);

  //Toggle make offer
  const toggleOffer = () => {
    try {
      !user
        ? toast.error('Connect your wallet to make an offer', {
            position: 'bottom-right',
          })
        : setOpen(!isOpen);
    } catch (error) {
      toast.error('An error happened trying to connect', {
        position: 'bottom-right',
      });
    }
  };

  // handle make offer a sanity
  const handleOfferClick = async () => {
    try {
      console.log('start');
    } catch {
      toast.error('An error happened trying to make an offer', {
        position: 'bottom-right',
      });
    }
  };

  useEffect(() => {
    // Mensaje de error para la selección

    if (nftsSelection.length === 0) {
      setValidSelection(false);
    } else {
      setValidSelection(true);
    }
  }, [nftsSelection]);

  return (
    <>
      <div className="relative bg-white text-gray-900 p-10 mt-0 flex items-center flex-col z-0">
        <div className="flex gap-8 flex-row flex-wrap">
          <div className="flex flex-col gap-8">
            <div className="flex overflow-hidden">
              <Carousel className="max-w-md">
                {asset.listNfts.map((nft) => (
                  <Image
                    src={nft.image_url}
                    className="rounded-xl"
                    width="450"
                    height="450"
                  />
                ))}
              </Carousel>
            </div>
          </div>
          <div className="flex-1 gap-8 flex-col">
            <Link href={'/marketplace'}>
              <div className="flex cursor-pointer mb-3 items-center">
                <button className="btn btn-white">Back</button>
              </div>
            </Link>
            <div className="flex  mb-3 gap-2">
              <span className="flex flex-col gap-1">
                <p className="text-gray-500 text-sm">Owner</p>
                <p>{utils.truncateAddress(asset.address)}</p>
              </span>
            </div>
            <span className="flex flex-row">
              <p className="text-3xl inline-block mt-3 mr-4">
                {asset.listTitle}
              </p>
            </span>
            <br />
            <p className="text-xl font-medium mb-3 text-gray-500">
              Accepting Trades
            </p>
            <p className="whitespace-pre-wrap mb-3 max-w-md">
              {asset.listDescription}
            </p>
            <div className="flex gap-4 items-end">
              <div className="flex items-center mb-3 gap-2 cursor-pointer">
                <button
                  className={isOpen ? 'btn btn-white' : 'btn btn-purple'}
                  onClick={toggleOffer}
                >
                  {isOpen ? 'Cancel' : 'Make Offer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* SELECCIÓN */}
      {!address ? (
        <div className="text-wise-grey text-center"></div>
      ) : (
        <div>
          {isOpen && (
            <div className="flex flex-col items-center">
              <div className="w-full sm:w-2/3 lg:w-1/2 mb-2">
                <h1 className="title mb-2">NFTs</h1>
                <NftsSelection
                  setNftsSelection={setNftsSelection}
                  nftsSelection={nftsSelection}
                  setOpenModal={setOpenModal}
                  address={address}
                />
                {validSelection === false && (
                  <div className="flex flex-row gap-2 items-baseline">
                    <i className="fa fa-circle-exclamation text-red-500 text-sm" />
                    <p className="text-red-500 text-sm">
                      You have to select at least one NFT
                    </p>
                  </div>
                )}
              </div>
              <button className="btn btn-purple" onClick={handleOfferClick}>
                Send Offer
              </button>
            </div>
          )}

          {openModal && (
            <div className="relative z-1">
              <Modal setOpenModal={setOpenModal}>
                <TradeOptions
                  address={address}
                  setTokensToTransfer={setNftsSelection}
                  setOpenModal={setOpenModal}
                />
              </Modal>
            </div>
          )}
        </div>
      )}
    </>
  );
}
