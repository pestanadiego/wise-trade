/* eslint-disable jsx-a11y/alt-text */
import { useRouter } from 'next/router';
import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Loader from '../ui/Loader';
import MyListAsset from '../myListing/MyListAsset';
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
    if (id != undefined) {
      const query = `*[_id == "${id}"]`;
      const response = await client.fetch(query);
      if (response.length > 0) {
        const res = response[0];

        if (res.address === address && edit) {
          setIsListOwner(true);
        }
        setAsset(res);
      } else {
        setAsset(null);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAsset();
  }, [id, user]);

  return (
    <section>
      {
        <>
          {isLoading ? (
            <div className="flex justify-center items-center">
              <Loader />
            </div>
          ) : (
            <>
              {asset == null ? (
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
            </>
          )}
        </>
      }
    </section>
  );
}
