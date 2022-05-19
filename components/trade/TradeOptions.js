/* eslint-disable no-plusplus */
import { useEffect, useState } from 'react';
import Image from 'next/image';

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
      const res = await fetch(
        `https://testnets-api.opensea.io/api/v1/assets?owner=${address}&order_direction=desc&offset=0&limit=20`
      );
      const data = await res.json();
      setTokens(data.assets);
    };
    fetchTokens();
  }, []);

  useEffect(() => {
    setSelectedTokens(new Array(tokens.length).fill(false));
  }, [tokens]);

  return (
    <div className="container">
      {!tokens ? (
        <div>
          <h1 className="text-center">Loading...</h1>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <h1 className="text-wise-blue text-center mb-3">
            Select which NFT you want to trade
          </h1>
          <div className="flex flex-row flex-wrap justify-center gap-3 mb-9">
            {tokens.map((token, i) => (
              <div
                className={
                  selectedTokens[i]
                    ? 'flex flex-col border-2 rounded-md items-center hover:shadow-md bg-wise-white'
                    : 'flex flex-col border-2 rounded-md items-center hover:shadow-md'
                }
              >
                <Image
                  src={token.image_url}
                  width={120}
                  height={120}
                  className="object-fill"
                />
                <p className="my-3">{token.name}</p>
                <input
                  type="checkbox"
                  className="mb-3"
                  id={token.id}
                  name={token.name}
                  value={token.name}
                  checked={selectedTokens[token]}
                  onChange={() => handleOnChange(i)}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            className="btn btn-purple mb-3 w-28"
            onClick={handleDone}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}

/*
<div className="flex flex-col rounded-md border-2 hover:shadow-md cursor-pointer">
<Image
  src={token.image_url}
  width="70"
  height="70"
  className="object-fit"
/>
</div>
*/
