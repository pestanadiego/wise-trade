import { useState } from 'react';

export default function TradeOptions() {
  const [option, setOption] = useState(0);
  const [amount, setAmount] = useState(null);

  return (
    <div>
      {/* BOTONES */}
      <div className="flex flex-row items-center justify-center">
        <button
          type="button"
          className="btn-options border-2 rounded-l-md text-wise-blue"
          onClick={() => setOption(0)}
        >
          NFTs
        </button>
        <button
          type="button"
          className="btn-options border-2 border-l-0 rounded-r-md text-wise-blue"
          onClick={() => setOption(1)}
        >
          Ethereum
        </button>
      </div>

      {/* OPCIONES */}
      <div className="container mt-8">
        {option === 0 ? (
          <div>
            <h1 className="text-wise-blue text-center mb-3">
              Select which NFT you want to trade
            </h1>
          </div>
        ) : (
          <div>
            <h1 className="text-wise-blue text-center">
              Choose the amount of eth
            </h1>
            <div className="flex justify-center items-center flex-row gap-3 mb-3">
              <input
                className="mt-3 ml-3 input"
                type="text"
                placeholder="Counterparty Address"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-white hover:bg-wise-white hover:text-black"
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
