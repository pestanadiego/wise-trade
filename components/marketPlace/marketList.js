import { useContext } from 'react';
import { NFTs } from '../myListings/info';
import Grid from '../myListings/styled/Grid';
import { UserContext } from '../../context/UserContext';
import NFTCard from '../myListings/styled/NFTCard';

export default function MarketList() {
  const { address } = useContext(UserContext);
  return (
    <section>
      {!address ? (
        <div>Connect your wallet to see the MarketPlace</div>
      ) : (
        <div className="flex flex-col gap-4 items-center p-4">
          <h1>MarketPlace</h1>
          <Grid>
            {NFTs.map((nft) => {
              return (
                <a>
                  <NFTCard item={nft} />
                </a>
              );
            })}
          </Grid>
        </div>
      )}
    </section>
  );
}
