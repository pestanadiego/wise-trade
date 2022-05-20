/* eslint-disable react/button-has-type */
import { useContext, useState } from 'react';
import TableCanceled from '../components/History/TableCanceled';
import TableCompleted from '../components/History/TableCompleted';
import { UserContext } from '../context/UserContext';

export default function History() {
  const { address } = useContext(UserContext);
  const [showMe, setShowMe] = useState(false);
  const [showMe1, setShowMe1] = useState(false);
  function toggle() {
    setShowMe(!showMe);
  }
  function toggle1() {
    setShowMe1(!showMe1);
  }
  return (
    <div className="container">
      {!address ? (
        <h1 className="text-center">Connect your wallet to make a trade</h1>
      ) : (
        <>
          <h2 className="text-wise-blue text-3xl md:text-4 lg:text-5xl text-left mb-1">
            Trade History
          </h2>
          <button type="button" className="btn btn-purple m-4" onClick={toggle}>
            Show Canceled Swaps
          </button>
          <button
            type="button"
            className="btn btn-purple m-4"
            onClick={toggle1}
          >
            Show Completed
          </button>
          <div className="flex items-center">
            <div style={{ display: showMe ? 'block' : 'none' }}>
              <TableCanceled />
            </div>
            <div style={{ display: showMe1 ? 'block' : 'none' }}>
              <TableCompleted />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
