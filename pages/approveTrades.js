import PendingTrades from '../components/approveTrades/PendingTrades';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

export default function MyTrades() {
  const { address } = useContext(UserContext);

  return (
    <div className="container">
      {!address ? (
        <h1 className="text-center text-wise-grey">
          Connect your wallet to see pending trades
        </h1>
      ) : (
        <div className="mt-14 lg:mt-28 mb-9">
          <h2 className="heading md:text-4 lg:text-5xl mb-6">Pending Trades</h2>
          <PendingTrades />
        </div>
      )}
    </div>
  );
}
