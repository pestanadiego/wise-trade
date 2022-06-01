import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import NFTCard from './styled/NFTCard';
import Grid from './styled/Grid';
import Tabs from './styled/Tabs';
import { NFTs } from './info';

const AllTabs = [
  {
    Id: 1,
    Title: 'Collectibles',
    Content: (
      <Grid>
        {NFTs.map((nft) => {
          return <NFTCard key={nft.Id} item={nft} />;
        })}
      </Grid>
    ),
  },
  {
    Id: 2,
    Title: 'Pending',
    Content: (
      <Grid>
        <p>See Pending Offers</p>
      </Grid>
    ),
  },
  {
    Id: 3,
    Title: 'Create',
    Content: (
      <Grid>
        <p>Create the Lists of NFTs</p>
      </Grid>
    ),
  },
  {
    Id: 4,
    Title: 'Edit',
    Content: (
      <Grid>
        <p>Edit the Lists of NFTs</p>
      </Grid>
    ),
  },
  {
    Id: 5,
    Title: 'Sold',
    Content: (
      <Grid>
        <p>See sold</p>
      </Grid>
    ),
  },
];

export default function MyList() {
  const { address } = useContext(UserContext);
  return (
    <section>
      {!address ? (
        <div>Connect your wallet to see your Listings</div>
      ) : (
        <div>
          <h1>My Listings</h1>
          <Tabs data={AllTabs} />
        </div>
      )}
    </section>
  );
}
