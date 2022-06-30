import { useState, useEffect } from 'react';
import NFTCard from '../ui/NFTCard';
import client from '../../lib/sanityClient';
import Loader from '../ui/Loader';
import MarketplaceFilter from './MarketplaceFilter';

export default function MarketplaceList() {
  const [listings, setListings] = useState([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isListingSet, setIsListingSet] = useState(false);
  const [filterFinished, setFilterFinished] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [filterBy, setFilterBy] = useState([]);

  const getListings = () => {
    const query = '*[_type == "listing"] | order(_createdAt asc)';
    client.fetch(query).then((response) => {
      console.log('response', response);
      setListings(response);
      setNoResults(false);
      setIsListingSet(true);
      setIsFiltered(false);
      setIsLoading(false);
    });
  };

  const filterListings = () => {
    console.log('filterBy', filterBy);
    if (filterBy.length == 0) {
      getListings();
    } else {
      let query = '*[_type == "listing" && ';
      for (let i = 0; i < filterBy.length; i++) {
        query += '"' + filterBy[i] + '"' + ' in listTags';
        if (i < filterBy.length - 1) {
          query += ' || ';
        } else {
          query += ']';
        }
      }
      client.fetch(query).then((response) => {
        setListings(response);
        if (response.length == []) {
          setNoResults(true);
          console.log('sin resultados', noResults);
        } else {
          setNoResults(false);
        }

        setIsListingSet(true);
        setIsFiltered(true);
        setFilterFinished(true);
        setIsLoading(false);
      });
    }
  };

  useEffect(() => {
    console.log('blibli', isFiltered);
    if (!isFiltered || !isListingSet) {
      getListings();
    } else {
      filterListings();
    }
  }, [isListingSet, isFiltered, filterFinished]);

  return (
    <section>
      <div className="container justify-items-end">
        <div className="container flex justify">
          <MarketplaceFilter
            setIsFiltered={setIsFiltered}
            setIsLoading={setIsLoading}
            setFilterBy={setFilterBy}
            filterBy={filterBy}
            setFilterFinished={setFilterFinished}
          />
        </div>
        {isLoading || listings == [] ? (
          <div className="flex justify-center mt-20">
            <Loader />
          </div>
        ) : (
          <>
            {noResults ? (
              <div className="mt-20">
                <h1 className="text-center text-wise-grey">
                  {' '}
                  No se han encontrado resultados
                </h1>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-3 md:flex-row mt-6">
                {listings.map((nft) => {
                  if (nft.status === 'pending') {
                    return <NFTCard key={nft._Id} item={nft} />;
                  }
                })}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
