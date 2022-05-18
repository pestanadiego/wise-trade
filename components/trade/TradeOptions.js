import { useEffect, useState } from 'react';
import { Loader } from 'rsuite';
import Image from 'next/image';

export default function TradeOptions({ address }) {
  const [tokens, setTokens] = useState(null);

  useEffect(() => {
    const fetchTokens = async () => {
      const res = await fetch(
        `https://testnets-api.opensea.io/api/v1/assets?owner=${address}&order_direction=desc&offset=0&limit=20`
      );
      const data = await res.json();
      setTokens(data.assets);
      console.log(data);
    };
    fetchTokens();
  }, []);

  return (
    <div className="container">
      {!tokens ? (
        <div>
          <Loader size="md" />
        </div>
      ) : (
        <div>
          <h1 className="text-wise-blue text-center mb-3">
            Select which NFT you want to trade
          </h1>
          <div className="flex flex-row flex-wrap gap-3">
            {tokens.map((token) => (
              <div className="flex flex-col rounded-md shadow-md">
                <Image src={token.image_url} width="70" height="70" />
                <p className="overflow-hidden">{token.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
