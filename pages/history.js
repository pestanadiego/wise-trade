/* eslint-disable react/button-has-type */
import { useContext, useState } from 'react';
import TableHistory from '../components/history/TableHistory';
import { UserContext } from '../context/UserContext';

export default function History() {
  const { address } = useContext(UserContext);

  return (
    <div className="container">
      {!address ? (
        <h1 className="text-center text-wise-grey ">
          Connect your wallet to see trade history
        </h1>
      ) : (
        <div className="mt-14 lg:mt-28 mb-9">
          <h2 className="text-wise-blue text-3xl md:text-4 lg:text-5xl text-center mb-6">
            History
          </h2>
          <TableHistory />
        </div>
      )}
    </div>
  );
}
