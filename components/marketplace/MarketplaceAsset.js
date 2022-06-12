import Image from 'next/image';
import Link from 'next/link';
import { Carousel } from 'react-responsive-carousel';
import { useState, useContext, useEffect, useRef } from 'react';
import { UserContext } from '../../context/UserContext';
import { animateScroll as scroll } from 'react-scroll';
import NftsSelection from '../create/NftsSelection';
import utils from '../../utils/utils';
import client from '../../lib/sanityClient';
import Modal from '../ui/Modal';
import TradeOptions from '../trade/TradeOptions';
import toast from 'react-hot-toast';
import emailjs from 'emailjs-com';
import templates from '../../utils/templates';

export default function MarketplaceAsset({ asset }) {
  const scrollToRef = useRef();
  const [openModal, setOpenModal] = useState(false);
  const [nftsSelection, setNftsSelection] = useState([]);
  const [validSelection, setValidSelection] = useState(false);
  const { address, user } = useContext(UserContext);
  const [isOpen, setOpen] = useState(false);

  // Envio de correo
  const sendEmail = async (templateParams) => {
    emailjs
      .send(
        'service_d58pjr8',
        'template_944ppm3',
        templateParams,
        '4wZHVd3VM5CaULioQ'
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

  const creatingOfferOnSanity = async () => {
    // Se crea el documento del offer
    const offerNfts = nftsSelection.map((selection) => {
      return {
        nid: parseInt(selection.id),
        image_url: selection.image_url,
        name: selection.name,
        nftAddress: selection.nftAddress,
      };
    });

    const offerDoc = {
      _type: 'offer',
      createdAt: new Date().toString(),
      offerAddress: address,
      offerNfts,
    };

    const offerDocWithKey = offerDoc;
    // Se modifica el listado y luego el user que creó el listado
    const modifyListingOffers = await client
      .patch(asset._id)
      .setIfMissing({ listOffers: [] })
      .insert('after', 'listOffers[-1]', [offerDoc])
      .commit({ autoGenerateArrayKeys: true })
      .then(async (res) => {
        const offerDocWithKey2 = res;
        offerDocWithKey = res.listOffers[res.listOffers.length - 1];
        // Se busca el user que hizo el listado
        await client.getDocument(asset.address).then(async (res) => {
          // Se busca el índice del listing
          let index;
          for (let i = 0; i < res.listings.length; i++) {
            if (res.listings[i]._id === asset._id) {
              index = i;
            }
          }
          // Se modifica el listOffers del listado
          const updatedListing = asset;
          if (!updatedListing.hasOwnProperty('listOffers')) {
            updatedListing = { ...updatedListing, listOffers: [] };
          }
          updatedListing.listOffers.push(offerDocWithKey);
          await client
            .patch(asset.address)
            .insert('replace', `listings[${index}]`, [updatedListing])
            .commit({ autoGenerateArrayKeys: true });
        });
      });
  };

  const handleOffer = async () => {
    try {
      await creatingOfferOnSanity().then(async () => {
        // Notificación de éxito
        toast.success('The offer was successfully created', {
          position: 'bottom-right',
        });
        // Notificación de correo
        if (user.email == '') {
          toast.custom(
            (t) => (
              <div
                className={`${
                  t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-wise-blue ring-opacity-5`}
              >
                <div className="flex-1 w-0 p-4">
                  <div className="flex items-start">
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-wise-blue">
                        No email detected!
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Set up your email to receive notifications
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex border-l border-gray-200">
                  <Link href="/profile">
                    <button
                      onClick={() => toast.dismiss(t.id)}
                      className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Setup
                    </button>
                  </Link>
                </div>
                <div className="flex border-l border-gray-200">
                  <button
                    onClick={() => toast.remove(t.id)}
                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Close
                  </button>
                </div>
              </div>
            ),
            {
              duration: 20000,
            }
          );
        }
        // Se envía correo al dueño del listing
        await client.getDocument(asset.address).then(async (res) => {
          if (res.email) {
            await sendEmail(templates.offerTemplate(res.email));
          } else {
            console.log(res);
          }
        });
        // Cambios
        setOpen(false);
      });
    } catch (err) {
      console.log(err);
      toast.error('An error occurred while creating the offer', {
        position: 'bottom-right',
      });
    }
  };

  useEffect(() => {
    if (nftsSelection.length === 0) {
      setValidSelection(false);
    } else {
      setValidSelection(true);
    }
  }, [nftsSelection]);

  return (
    <>
      <div className="relative bg-white text-wise-blue mt-14 lg:mt-28 mb-3 flex items-center flex-col z-0 w-full px-5 lg:mx-0">
        <div className="flex flex-col gap-0 md:gap-8 md:flex-row flex-wrap mb-6 md:mb-0">
          <div className="flex flex-col">
            <div className="flex overflow-hidden justify-center">
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
            <span className="flex flex-row">
              <p className="text-wise-blue font-bold text-3xl tracking-tight mb-4 mr-4">
                {asset.listTitle}
              </p>
            </span>
            <div className="my-1 border-wise-purple border-2 rounded-full py-2 w-[160px] text-center">
              <p className="text-md text-wise-purple">Accepting Trades</p>
            </div>
            <div className="flex my-3">
              <span className="flex flex-col gap-1">
                <p className="title text-sm">Owner</p>
                <p className="sub-heading">
                  {utils.truncateAddress(asset.address)}
                </p>
              </span>
            </div>
            <div className="flex my-6 gap-2">
              <span className="flex flex-col gap-1">
                <p className="title text-sm">Description</p>
                <p className="text-lg text-left font-medium text-wise-grey">
                  {asset.listDescription}
                </p>
              </span>
            </div>
            <div classname="my-6">
              <p className="title text-sm">Prefered Collections:</p>
              {asset.listTags.length > 0 ? (
                <>
                  {asset.listTags.map((tag) => (
                    <p className="text-wise-grey">
                      -{'>'} {tag}
                    </p>
                  ))}
                </>
              ) : (
                <p className="text-wise-grey">None</p>
              )}
            </div>
            <div className="">
              <Link href={'/marketplace'}>
                <div className="flex cursor-pointer mb-3items- mt-5">
                  <button className="btn btn-white">
                    <i className="fa fa-arrow-left" />
                  </button>
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex gap-3 justify-center">
          {address !== asset.address && (
            <div className="flex items-center mb-1 gap-2 cursor-pointer">
              <button
                className={isOpen ? 'btn btn-white' : 'btn btn-purple'}
                onClick={() => {
                  toggleOffer();
                  scroll.scrollToBottom();
                }}
              >
                {isOpen ? 'Cancel' : 'Make Offer'}
              </button>
            </div>
          )}
        </div>
      </div>
      {/* SELECCIÓN */}
      {address && (
        <div ref={scrollToRef}>
          {isOpen && (
            <div className="flex flex-col items-center">
              <div className="w-full sm:w-2/3 lg:w-1/2 mb-2">
                <h1 className="title mt-6 mb-3 text-center">
                  Select the NFTs you want to offer in exchange
                </h1>
                <NftsSelection
                  setNftsSelection={setNftsSelection}
                  nftsSelection={nftsSelection}
                  setOpenModal={setOpenModal}
                  address={address}
                  offer={true}
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
              <button
                className={
                  validSelection
                    ? 'mt-4 mb-8 btn btn-purple'
                    : 'mt-4 mb-8 btn-disabled'
                }
                onClick={handleOffer}
              >
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
