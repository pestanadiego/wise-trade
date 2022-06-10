// eslint-disable-next-line import/no-unresolved
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../../../context/UserContext';
import EditListing from '../../../../components/edit/EditListing';

export default function Edit() {
  const { user, address } = useContext(UserContext);
  const [listing, setListing] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    console.log(user);
    if (listing === null) {
      for (let i = 0; i < user.listings.length; i++) {
        if (user.listings[i]._id === id) {
          setListing(user.listings[i]);
          console.log(user.listings[i].address);
        }
      }
    }
  }, [listing]);

  return (
    <div className="container">
      {!address ? (
        <h1 className="text-center text-wise-grey">
          Connect your wallet to edit a listing
        </h1>
      ) : (
        <>
          {listing !== null ? (
            <div className="mt-14 lg:mt-28 mb-9">
              {/* HEADING */}
              <div className="mb-8">
                <h2 className="heading md:text-4 lg:text-5xl mb-6">
                  Edit A Listing
                </h2>
                <p className="text-wise-grey sub-heading mb-6">
                  Modify the inputs correctly to successfully edit the listing
                </p>
              </div>
              {listing.address === address && <EditListing listing={listing} />}
            </div>
          ) : (
            <h1 className="text-center text-wise-grey">Loading...</h1>
          )}
        </>
      )}
    </div>
  );
}
