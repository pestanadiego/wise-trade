import { useContext } from 'react';
// eslint-disable-next-line import/named
import { UserContext } from '../context/UserContext';

export default function Trade() {
  const { user } = useContext(UserContext);

  return (
    <div className="container">
      {!user ? (
        <h1 className="text-center">Connect your wallet to make a trade</h1>
      ) : (
        <div>
          <h1>{user}</h1>
        </div>
      )}
    </div>
  );
}
