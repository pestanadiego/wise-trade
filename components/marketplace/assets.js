/* eslint-disable jsx-a11y/alt-text */
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import { AiFillCaretLeft } from 'react-icons/ai';
import { IoMdShareAlt } from 'react-icons/io';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import utils from '../../utils/utils';
import brokeape from '../../public/brokeape.svg';
import { object } from 'underscore';

export default function Assets(item) {
  const { user, address } = useContext(UserContext);
  const router = useRouter();
  const { id } = router.query;
  const [isListOwner, setIsListOwner] = useState(false);
  const [asset, setAsset] = useState({
    address: '',
    listNfts: [],
  });
  const getAsset = () => {
    const userListing = user.listings;
    if (userListing !== null) {
      for (let i = 0; i < userListing.length; i++) {
        if (userListing[i]._id === id) {
          if (userListing[i].address === address) {
            console.log(userListing[i]);
            setIsListOwner(true);
            setAsset(userListing[i]);
            break;
          } else {
          }
        }
      }
    }
  };
  useEffect(() => {
    if (user) {
      getAsset();
    }
  }, [user]);

  return (
    <section>
      {!address ? (
        <div className="text-center text-wise-grey">
          Connect your wallet to see this page
        </div>
      ) : (
        <>
          (
          {!user || user.listings == null ? (
            <h1 className="text-center text-wise-grey">
              This Listing does not exist
            </h1>
          ) : (
            <>
              {isListOwner ? (
                <div className="bg-white text-gray-900 p-10 mt-0 flex flex-col">
                  <div className="flex gap-8 flex-row flex-wrap">
                    <div className="flex-1 flex-col gap-8 ">
                      <div className="overflow-hidden rounded-xl">
                        <Carousel>
                          {asset.listNfts.map((nft) => (
                            <Image
                              src={nft.image_url}
                              width="1000"
                              height="1000"
                            />
                          ))}
                        </Carousel>
                      </div>
                    </div>
                    <div className="flex-1 gap-8 flex-col">
                      <Link href="/marketplace">
                        <div className="flex cursor-pointer mb-3 items-center text-wise-purple">
                          <AiFillCaretLeft />
                          Back
                        </div>
                      </Link>
                      <div className="flex gap-4 items-center">
                        <Link href="/trade">
                          <div className="flex items-center mb-3 gap-2 cursor-pointer">
                            <IoMdShareAlt />
                            Make an offer
                          </div>
                        </Link>
                      </div>
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
                        <p className="p-2 text-sm font-medium text-gray-500 mt-3 rounded-2xl border-2 border-gray-500 ">
                          Marketplace
                        </p>
                      </span>
                      <br />
                      <p className="text-xl font-medium mb-3 text-gray-500">
                        Accepting Trades
                      </p>
                      <p className="whitespace-pre-wrap mb-3">
                        {asset.listDescription}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <h1 className="text-center text-wise-grey">
                  Only the owner can view this listing
                </h1>
              )}
            </>
          )}
          )
        </>
      )}
    </section>
  );
}
