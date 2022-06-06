/* eslint-disable no-plusplus */
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Loader from '../ui/Loader';

export default function TradeOptions({
  address,
  setTokensToTransfer,
  setOpenModal,
}) {
  const [tokens, setTokens] = useState([]);
  const [selectedTokens, setSelectedTokens] = useState([]);

  const handleOnChange = (position) => {
    const updatedSelectedTokens = selectedTokens.map((item, index) =>
      index === position ? !item : item
    );
    setSelectedTokens(updatedSelectedTokens);
  };

  const handleDone = () => {
    const tokensToTransfer = [];
    const matchSelectionWithTokens = () => {
      for (let i = 0; i < tokens.length; i++) {
        if (selectedTokens[i]) {
          tokensToTransfer.push({
            id: tokens[i].token_id,
            nftAddress: tokens[i].asset_contract.address,
            name: tokens[i].name,
            image_url: tokens[i].image_url,
          });
        }
      }
    };
    matchSelectionWithTokens();
    setTokensToTransfer(tokensToTransfer);
    setOpenModal(false);
    console.log(tokensToTransfer);
  };

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const res = await fetch(
          `https://testnets-api.opensea.io/api/v1/assets?owner=${address}&order_direction=desc&offset=0&limit=20`
        );
        const data = await res.json();
        setTokens(data.assets);
        console.log(data);
      } catch {
        alert('Unable to load NFTs. Check your connection and try again later');
      }
    };
    fetchTokens();
    setSelectedTokens(new Array(tokens.length).fill(false));
  }, []);

  useEffect(() => {
    setSelectedTokens(new Array(tokens.length).fill(false));
  }, [tokens]);

  return (
    <div className="container">
      <div className="flex flex-col items-center">
        <h1 className="text-wise-blue text-lg text-center mb-9">
          Select the <span className="font-bold">NFTs</span>
        </h1>
        <div>
          {tokens.length === 0 ? (
            <div className="flex justify-center items-center mb-9">
              <Loader size={16} />
            </div>
          ) : (
            <div className="flex flex-row flex-wrap justify-center gap-3 mb-9">
              {tokens.map((token, i) => (
                <div
                  className={
                    selectedTokens[i]
                      ? 'flex flex-col border-2 rounded-md  items-center hover:shadow-md hover:shadow-neutral-200 bg-wise-white relative float-left w-[120px] max-w-[120px] inline-block  transition-all'
                      : 'flex flex-col border-2 rounded-md items-center hover:shadow-md hover:shadow-neutral-200 relative float-left w-[120px] max-w-[120px] inline-block transition-all'
                  }
                >
                  <button type="button" onClick={() => handleOnChange(i)}>
                    <Image
                      src={token.image_url}
                      width={120}
                      height={120}
                      className="object-fill"
                    />
                    <p className="my-3 text-center">{token.name}</p>
                    <input
                      type="checkbox"
                      className="absolute top-2 right-2"
                      id={token.id}
                      name={token.name}
                      value={token.name}
                      checked={selectedTokens[i]}
                      onChange={() => handleOnChange(i)}
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          className="btn btn-purple mb-3 w-28"
          onClick={handleDone}
        >
          Done
        </button>
      </div>
    </div>
  );
}
