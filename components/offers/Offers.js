import { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import Loader from '../ui/Loader';
import { UserContext } from '../../context/UserContext';
import utils from '../../utils/utils';
import client from '../../lib/sanityClient';
import AcceptOffer from './AcceptOffer';

export default function Offers({ asset }) {
  const { user, address } = useContext(UserContext);
  const [acceptTransaction, setAcceptTransaction] = useState([]);
  const [isLoadingReject, setIsLoadingReject] = useState(false);
  const [accept, setAccept] = useState(false);
  const [offers, setOffers] = useState([]);
  const router = useRouter();
  const { id } = router.query;
  console.log('aaaa', asset);
  console.log('offers', offers);

  const modifyRejectionInSanity = async (declineTransaction) => {
    // TODO borrar offer de sanity
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
                                  {/* {offer._createdAt.substr(0, 10)} */}
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
                                      onClick={async () => {
                                        setDeclineTransaction(offer);
                                        await handleDecline();
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
