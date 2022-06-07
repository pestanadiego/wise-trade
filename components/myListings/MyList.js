import { useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import NFTCard from './styled/NFTCard';
import Tabs from './styled/Tabs';
import { NFTs } from './Info';
import CreateList from './createList/createList';
import Multiselect from 'multiselect-react-dropdown';

const AllTabs = [
  {
    Id: 1,
    Title: 'Collectibles',
    Content: (
      <div className="md:flex max-w-md mx-auto bg-white rounded-xl overflow-hidden md:max-w-6xl">
        {NFTs.map((nft) => {
          return (
            <div className="flex space-x-4">
              <NFTCard key={nft.Id} item={nft} />
            </div>
          );
        })}
      </div>
    ),
  },
  {
    Id: 2,
    Title: 'Pending',
    Content: (
      <div className="md:flex flex space-x-4">
        <p>See Pending Offers</p>
      </div>
    ),
  },
  {
    Id: 3,
    Title: 'Create',
    Content: (
      <div className="md:flex flex items-center">
        <CreateList></CreateList>
      </div>
    ),
  },
  {
    Id: 4,
    Title: 'Edit',
    Content: (
      <div className="md:flex flex space-x-4">
        <p>Edit the Lists of NFTs</p>
      </div>
    ),
  },
  {
    Id: 5,
    Title: 'Sold',
    Content: (
      <div className="md:flex flex space-x-4">
        <p>See sold</p>
      </div>
    ),
  },
];

export default function MyList() {
  const [tags, setTags] = useState([]);
  const { address } = useContext(UserContext);

  return (
    <section>
      {!address ? (
        <div className="text-wise-grey text-center">
          Connect your wallet to see your Listings
        </div>
      ) : (
        <div className="container flex flex-col mt-14">
          <h2 className="heading md:text-4 lg:text-5xl">My Listings</h2>
          <Tabs data={AllTabs} />
        </div>
      )}
    </section>
  );
}
