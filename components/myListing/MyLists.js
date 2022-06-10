import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import Link from 'next/link';
import NFTCard from '../ui/NFTCard';

export default function MyList() {
  const [openModal, setOpenModal] = useState(false);
  const [hasTraded, setHasTraded] = useState(false);
  const [option, setOption] = useState('Current');
  const { user } = useContext(UserContext);

  useEffect(() => {
    for (let i = 0; i < user.listings.length; i++) {
      if (user.listings[i].status === 'traded') {
        setHasTraded(true);
        break;
      }
    }
  }, []);

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
                  option === 'Traded' && 'underline underline-offset-8'
                }`}
                onClick={() => setOption('Traded')}
              >
                Traded
              </p>
            </div>
            <Link href="/create">
              <button className="btn btn-purple">
                <i className="fa fa-plus" />
              </button>
            </Link>
          </div>
        </div>
        {!user || user.listings == null || user.listings === [] ? (
          <h1 className="mt-2 text-center text-wise-grey">No Listings Found</h1>
        ) : (
          <>
            {option === 'Current' ? (
              <div className="flex flex-wrap md:flex-row items-center justify-start gap-10 mt-6">
                {user.listings.map((nft) => {
                  if (nft.status === 'pending' || nft.status !== 'traded') {
                    return <NFTCard key={nft.Id} item={nft} edit={true} />;
                  }
                })}
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center justify-between gap-3 mt-6">
                {!hasTraded ? (
                  <h1 className="mt-2 text-center text-wise-grey">
                    No traded listings found
                  </h1>
                ) : (
                  <>
                    <div className="flex flex-wrap md:flex-row items-center justify-start gap-10 mt-6">
                      {user.listings.map((nft) => {
                        if (nft.status === 'traded') {
                          return (
                            <NFTCard key={nft.Id} item={nft} edit={true} />
                          );
                        }
                      })}
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
