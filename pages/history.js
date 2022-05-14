import { useContext } from 'react';
import { UserContext } from '../context/UserContext';

export default function History() {
  const { address } = useContext(UserContext);

  return (
    <div className="container">
      {!address ? (
        <h1 className="text-center">Connect your wallet to make a trade</h1>
      ) : (
        <div>
          <h1>{address}</h1>
        </div>
      )}
    </div>
  );
}
