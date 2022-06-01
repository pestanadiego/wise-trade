import { NFTs } from './info';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import brokeape from '../../public/brokeape.svg';
import NftCard from './nftCard';

export default function MyList1() {
  const { address } = useContext(UserContext);
  console.log(NFTs);
  return (
    <section>
      {!address ? (
        <div>Connect your wallet to see your Listings</div>
      ) : (
        <div>
          <div className="container">
            <h1>tabs</h1>
          </div>
          <div className="flex">
            {NFTs.map((nft) => {
              return (
                <NftCard
                  list="List 1"
                  listName={nft.Title}
                  img="https://cdn.pixabay.com/photo/2022/03/01/02/51/galaxy-7040416_1280.png"
                  cosa={() => {
                    return nft.Stock.toString + ' NFTs';
                  }}
                />
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
