import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import Loader from '../ui/Loader';
import emailjs from 'emailjs-com';
import { UserContext } from '../../context/UserContext';
import utils from '../../utils/utils';
import templates from '../../utils/templates';
import client from '../../lib/sanityClient';
import AcceptOffer from './AcceptOffer';
import toast from 'react-hot-toast';

export default function Offers({ asset }) {
  const { setUser, user, address } = useContext(UserContext);
  const [acceptTransaction, setAcceptTransaction] = useState([]);
  const [isLoadingReject, setIsLoadingReject] = useState(false);
  const [accept, setAccept] = useState(false);
  const [offers, setOffers] = useState([]);
  const router = useRouter();
  const { id } = router.query;

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

  const deleteOfferOnSanity = async (i) => {
    // Se elimina la oferta del listing
    console.log(i);
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

  const handleRejectOffer = async (i) => {
    try {
      // Se le notifica al usuario que realizó la oferta que fue rechazada
      await client
        .getDocument(asset.listOffers[i].offerAddress)
        .then(async (res) => {
          if (res.email || res.email !== '') {
            await sendEmail(
              templates.offerRejectedTemplate(res.email, asset.listTitle)
            );
          } else {
            console.log(res);
          }
          await deleteOfferOnSanity(i).then(() => {
            toast.success('The offer was successfully rejected', {
              position: 'bottom-right',
            });
          });
        });
    } catch (error) {
      console.log(error);
      toast.error(
        'The offer could not be rejected. Check your connection and try again',
        {
          position: 'bottom-right',
        }
      );
    }
  };

  useEffect(() => {
    if (asset.listOffers != undefined && asset.listOffers != null) {
      setOffers(asset.listOffers);
    }
  }, [user, acceptTransaction, accept, offers]);

  return (
    <section>
      {!address ? (
        <div className="text-wise-grey text-center">
          Connect your wallet to see pending trades
        </div>
      ) : (
        <section>
          {!user ? (
            <div className="flex justify-center">
              <Loader />
            </div>
          ) : (
            <div className="container flex flex-col-reverse items-center mt-4 lg:mt-8 mb-9">
              {offers.length !== 0 ? (
                <div>
                  {!accept && (
                    <table className="min-w-max w-full table-auto bg-white shadow-md border-2 rounded-xl">
                      <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                          <th className="py-3 px-6 text-center">From</th>
                          <th className="py-3 px-6 text-center">Date</th>
                          <th className="py-3 px-6 text-center">Offered</th>
                          <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                      </thead>
                      {offers.length !== 0 && (
                        <tbody className="text-gray-600 text-sm font-light">
                          {offers
                            .slice(0)
                            .reverse()
                            .map((offer) => (
                              <tr className="border-b border-gray-200 bg-gray-50 hover:bg-gray-100">
                                <td className="py-3 px-9 text-center whitespace-nowrap">
                                  {utils.truncateAddress(offer.offerAddress)}
                                </td>
                                <td className="py-3 px-9 text-center whitespace-nowrap">
                                  {offer.createdAt.substr(0, 10)}
                                </td>
                                <td className="py-3 px-9 text-center">
                                  {offer.offerNfts.map((nft) => (
                                    <div className="flex flex-col my-2 overflow">
                                      <Image
                                        src={nft.image_url}
                                        className="border-2 rounded-md"
                                        width={90}
                                        height={90}
                                      />
                                    </div>
                                  ))}
                                </td>
                                <td className="py-3 px-3 justify-center">
                                  <div className="container flex justify-center gap-3">
                                    <Link
                                      href={'[id]/acceptOffer/[offerId]'}
                                      as={`${id}/acceptOffer/${offers.indexOf(
                                        offer
                                      )}`}
                                    >
                                      <button
                                        type="button"
                                        className="btn btn-purple"
                                        onClick={() => {
                                          setAccept(true);
                                          setAcceptTransaction(asset);
                                        }}
                                      >
                                        Accept
                                      </button>
                                    </Link>
                                    <button
                                      type="button"
                                      className={
                                        isLoadingReject
                                          ? 'btn-disabled'
                                          : 'btn btn-purple'
                                      }
                                      disabled={isLoadingReject}
                                      onClick={() => {
                                        handleRejectOffer(
                                          offers.indexOf(offer)
                                        );
                                      }}
                                    >
                                      {isLoadingReject ? <Loader /> : 'Reject'}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          {}
                        </tbody>
                      )}
                    </table>
                  )}
                </div>
              ) : (
                <h1 className="text-wise-grey text-center text-lg font-light">
                  There are no offers
                </h1>
              )}
            </div>
          )}
        </section>
      )}
    </section>
  );
}
