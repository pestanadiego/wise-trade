// eslint-disable-next-line import/no-unresolved
import CreateListing from '../components/create/CreateListing';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

export default function Create() {
  const { address } = useContext(UserContext);

  return (
    <div className="container">
      {!address ? (
        <h1 className="text-center text-wise-grey">
          Connect your wallet to create a listing
        </h1>
      ) : (
        <div className="mt-14 lg:mt-28 mb-9">
          {/* HEADING */}
          <div className="mb-8">
            <h2 className="heading md:text-4 lg:text-5xl mb-6">
              Create A Listing
            </h2>
            <p className="text-wise-grey sub-heading mb-6">
              Fill the inputs correctly to successfully create a listing
            </p>
          </div>
          <CreateListing />
        </div>
      )}
    </div>
  );
}
