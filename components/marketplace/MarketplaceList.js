import { useState, useEffect } from 'react';
import NFTCard from '../ui/NFTCard';
import client from '../../lib/sanityClient';
import Loader from '../ui/Loader';
import MarketplaceFilter from './MarketplaceFilter';

export default function MarketplaceList() {
  const [listings, setListings] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getListings = () => {
    const query = '*[_type == "listing"] | order(_createdAt asc)';

    client.fetch(query).then((response) => {
      console.log('response', response);
      setListings(response);
      setIsLoading(false);
    });
  };

  const filterListings = () => {
    const arr = ['Lame Cats', 'Broke Ape Boat Club'];
    let query = '*[_type == "listing" && ';
    for (let i = 0; i < arr.length; i++) {
      query += '"' + arr[i] + '"' + ' in listTags';
      if (i < arr.length - 1) {
        query += ' || ';
      } else {
        query += ']';
      }
    }
    console.log('query', query);
    // const query =
    //   '*[_type == "listing" && "Lame Cats" in listTags || "Broke Ape Boat Club" in listTags]';
    client.fetch(query).then((response) => {
      setListings(response);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    console.log('blibli', isFiltered);
    if (!isFiltered) {
      getListings();
    } else {
      filterListings();
    }
  }, [listings]);

  return (
    <div>
      {isLoading || listings == [] ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : (
        <div className="flex">
          <div className="container">
            <MarketplaceFilter
              setListings={setListings}
              setIsFiltered={setIsFiltered}
              setIsLoading={setIsLoading}
            />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 md:flex-row mt-6">
            {listings.map((nft) => {
              if (nft.status === 'pending') {
                return <NFTCard key={nft._Id} item={nft} />;
              }
            })}
          </div>
        </div>
      )}
    </div>
  );
}
