// eslint-disable-next-line import/no-unresolved
import MyList from '../../components/myListings/MyList';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';

export default function MyListings() {
  const { address } = useContext(UserContext);

  return (
    <div className="container">
      {!address ? (
        <h1 className="text-center text-wise-grey">
          Connect your wallet to see your listings
        </h1>
      ) : (
        <div className="mt-14 lg:mt-28 mb-9">
          {/* HEADING */}
          <div>
            <h2 className="heading md:text-4 lg:text-5xl mb-6">My Listings</h2>
            <p className="text-wise-grey sub-heading mb-6">
              Add, update or delete listings
            </p>
          </div>
          <MyList />
        </div>
      )}
    </div>
  );
}
