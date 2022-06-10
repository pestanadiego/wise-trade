import { useState, useEffect } from 'react';
import NFTCard from '../ui/NFTCard';
import client from '../../lib/sanityClient';
import Loader from '../ui/Loader';

export default function MarketplaceList() {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const getListings = () => {
    const query = '*[_type == "listing"]';
    client.fetch(query).then((response) => {
      setListings(response);
    });
    setIsLoading(false);
  };

  useEffect(() => {
    getListings();
  }, [listings]);

  return (
    <div>
      {isLoading || listings == [] ? (
        <Loader />
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-3 md:flex-row mt-6">
          {listings.map((nft) => {
            return <NFTCard key={nft._Id} item={nft} />;
          })}
        </div>
      )}
    </div>
  );
}
