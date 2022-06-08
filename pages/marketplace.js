import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import MarketplaceList from '../components/marketplace/MarketplaceList';

export default function Marketplace() {
  const { address } = useContext(UserContext);

  return (
    <div className="container">
      {!address ? (
        <h1 className="text-center text-wise-grey">
          Connect your wallet to see the marketplace
        </h1>
      ) : (
        <div className="mt-14 lg:mt-28 mb-9">
          {/* HEADING */}
          <div>
            <h2 className="heading md:text-4 lg:text-5xl mb-6">Marketplace</h2>
            <p className="text-wise-grey sub-heading mb-6">
              Discover and trade NFTs
            </p>
          </div>
          <MarketplaceList />
        </div>
      )}
    </div>
  );
}
