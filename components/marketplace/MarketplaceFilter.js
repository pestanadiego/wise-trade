import Multiselect from 'multiselect-react-dropdown';
import { useState } from 'react';
import client from '../../lib/sanityClient';

export default function MarketplaceFilter({
  setListings,
  setIsFiltered,
  setIsLoading,
}) {
  const [myInterestTags, setMyInterestTags] = useState([]);
  const [otherInterestsTags, setOtherInterestsTags] = useState([]);

  const filterListings = () => {
    setIsLoading(true);
    setIsFiltered(true);
  };

  return (
    <section>
      <div>
        <div>
          <h1>NFTs you're looking for</h1>
          <Multiselect />
        </div>
        <div>
          <h1>NFTs that other want</h1>
          <Multiselect />
        </div>
      </div>
      <div>
        <button type="button" class="btn btn-purple" onClick={filterListings}>
          Search
        </button>
      </div>
    </section>
  );
}
