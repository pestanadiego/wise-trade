import { useContext } from 'react';
import { NFTs } from '../myListings/info';
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
          <div className="md:flex max-w-md mx-auto bg-white rounded-xl overflow-hidden md:max-w-6xl">
            {NFTs.map((nft) => {
              return (
                <div className="flex space-x-4">
                  <NFTCard item={nft} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
