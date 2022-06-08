import NFTCard from '../ui/NFTCard';
import { NFTs } from '../myListings/Info';

export default function MarketplaceList() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-6">
      {NFTs.map((nft) => {
        return <NFTCard key={nft.Id} item={nft} />;
      })}
    </div>
  );
}
