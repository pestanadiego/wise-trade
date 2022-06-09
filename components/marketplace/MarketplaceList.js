import { useState, useEffect } from 'react';
import NFTCard from '../ui/NFTCard';
import { NFTs } from '../myListings/Info';
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
    <div className="flex justify-center">
      <div className="flex flex-wrap md:flex-row items-center justify-evenly gap-3 mt-6">
        {listings.map((nft) => {
          return <NFTCard key={nft._Id} item={nft} />;
        })}
      </div>
    </div>
  );
}
