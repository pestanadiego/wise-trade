//Odio los Merges
import { useState, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import Link from 'next/link';
import NFTCard from '../ui/NFTCard';

export default function MyList() {
  const [openModal, setOpenModal] = useState(false);
  const [option, setOption] = useState('Current');
  const [myListings, setMyListings] = useState('');
  const { user } = useContext(UserContext);

  return (
    <>
      <div>
        <div>
          {/* OPTIONS */}
          <div className="flex flex-row items-baseline justify-between">
            <div className="flex flex-row gap-6">
              <p
                className={`title cursor-pointer ${
                  option === 'Current' && 'underline underline-offset-8'
                }`}
                onClick={() => setOption('Current')}
              >
                Current
              </p>
              <p
                className={`title cursor-pointer ${
                  option === 'Sold' && 'underline underline-offset-8'
                }`}
                onClick={() => setOption('Sold')}
              >
                Sold
              </p>
            </div>
            <Link href="/create">
              <button className="btn btn-purple">
                <i className="fa fa-plus" />
              </button>
            </Link>
          </div>
        </div>
        {!user || user.listings == null ? (
          <h1 className="mt-2 text-center text-wise-grey">No Listings Found</h1>
        ) : (
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-6">
            {user.listings.map((nft) => {
              return <NFTCard key={nft.Id} item={nft} edit={true} />;
            })}
          </div>
        )}
      </div>
      {!user || user.listings == null ? (
        <h1 className="text-center text-wise-grey">No Listings Found</h1>
      ) : (
        <div className="flex flex-wrap md:flex-row items-center justify-start gap-10 mt-6">
          {user.listings.map((nft) => {
            return <NFTCard key={nft.Id} item={nft} edit={true} />;
          })}
        </div>
      )}
    </>
  );
}
