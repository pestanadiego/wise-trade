/* eslint-disable jsx-a11y/alt-text */
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import utils from '../../utils/utils';
import Loader from '../ui/Loader';
import MyListAsset from '../myListings/MyListAsset';
import MarketplaceAsset from './MarketplaceAsset';
import client from '../../lib/sanityClient';

export default function Assets({ edit = false }) {
  const { user, address } = useContext(UserContext);
  const router = useRouter();
  const { id } = router.query;
  const [isListOwner, setIsListOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [asset, setAsset] = useState({
    address: '',
    listNfts: [],
  });

  const getAsset = async () => {
    console.log('id', id);
    if (id != undefined) {
      const query = `*[_id == "${id}"]`;
      const response = await client.fetch(query);
      const res = response[0];

      if (res.address === address && edit) {
        console.log('entre');
        setIsListOwner(true);
      }
      setAsset(res);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAsset();
  }, [id, user]);

  return (
    <section>
      {!address ? (
        <div className="text-center text-wise-grey">
          Connect your wallet to see this page
        </div>
      ) : (
        <>
          {isLoading ? (
            <div className="flex justify-center items-center">
              <Loader />
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
                  {edit ? (
                    <>
                      {isListOwner ? (
                        <MyListAsset asset={asset} />
                      ) : (
                        <h1 className="text-center text-wise-grey">
                          Only the owner can view this listing
                        </h1>
                      )}
                    </>
                  ) : (
                    <MarketplaceAsset asset={asset} />
                  )}
                </>
              )}
              )
            </>
          )}
        </>
      )}
    </section>
  );
}
