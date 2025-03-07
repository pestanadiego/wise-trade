import MarketplaceList from '../../components/marketplace/MarketplaceList';

export default function Marketplace() {
  return (
    <div className="container">
      <div className="mt-14 lg:mt-28 mb-9">
        {/* HEADING */}
        <div>
          <h2 className="heading md:text-4 lg:text-5xl mb-6">Marketplace</h2>
          <p className="text-wise-grey sub-heading mb-9">
            Discover and trade NFTs
          </p>
        </div>
        <MarketplaceList />
      </div>
    </div>
  );
}
