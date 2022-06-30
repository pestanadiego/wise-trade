import Multiselect from 'multiselect-react-dropdown';
import { useState, useEffect } from 'react';
import client from '../../lib/sanityClient';
import toast from 'react-hot-toast';

export default function MarketplaceFilter({
  setIsFiltered,
  setIsLoading,
  setFilterBy,
  filterBy,
  setFilterFinished,
}) {
  const [tags, setTags] = useState([]);

  const filterListings = () => {
    setIsLoading(true);
    setIsFiltered(true);
    setFilterFinished(false);
  };

  const getCollections = async () => {
    try {
      /*
      const response = await fetch(
        'https://testnets-api.opensea.io/api/v1/collections?offset=0&limit=20',
        { method: 'GET' }
      ).then((res) => res.json());
      const collection = response.collections.map(
        (resCollection) => resCollection.name
      );
      */
      const collection = [];
      collection.push('Lame Cats');
      collection.push('Crypto Cunts');
      collection.push('Broke Ape Boat Club');
      collection.push('Wonderpals');
      collection.push('NFT Multifaucet');
      setTags(collection);
      return collection;
    } catch {
      toast.error('Unable to connect to OpenSea. Try again or use VPN.');
    }
  };

  useEffect(() => {
    getCollections();
  }, []);

  return (
    <section className="w-full">
      <div>
        <h1 className="text-wise-grey">
          NFTs Collections that you want to trade
        </h1>
        <div className="flex gap-8">
          <div>
            <Multiselect
              id="multiselect-custom"
              closeIcon="cancel"
              placeholder="Select the collections"
              isObject={false}
              selectedValues={filterBy}
              onKeyPressFn={function noRefCheck() {}}
              onRemove={(remove) => {
                setFilterBy(remove);
              }}
              onSearch={function noRefCheck() {}}
              onSelect={(selected) => {
                setFilterBy(selected);
              }}
              options={tags}
              style={{
                chips: { background: '#5F5CEA' },
                searchBox: {
                  'border-width': '1px',
                  'border-color': '#e5e7eb',
                  'border-radius': '0.375rem',
                  padding: '0.75rem 1rem ',
                },
                option: {
                  color: '#9194A2',
                },
              }}
            />
          </div>
          <button
            type="button"
            className="btn btn-purple"
            onClick={filterListings}
          >
            Search
          </button>
        </div>
      </div>
    </section>
  );
}
