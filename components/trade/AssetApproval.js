import Image from 'next/image';
import { ethers } from 'ethers';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';

export default function AssetApproval({ tokensToTransfer, setValidApproval }) {
  const { provider } = useContext(UserContext);
  const [counter, setCounter] = useState(0);
  const [allSuccessful, setAllSuccessful] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    for (let i = 0; i < tokensToTransfer.length; i++) {
      // Abi
      const abi = [
        'function approve(address to, uint256 tokenId) public returns (bool success)',
      ];
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        tokensToTransfer[i].nftAddress,
        abi,
        signer
      );
      // Contract
      await contract
        .approve(
          '0x4849A0D150556Aa910Bf9155D1BBA21c960FC291',
          tokensToTransfer[i].id
        )
        .then((pre) => {
          setIsLoading(true);
          console.log(pre);
          pre.wait().then((receipt) => {
            if (receipt.confirmations === 1 || receipt.confirmations === 0) {
              setCounter(counter++);
              console.log(counter);
              console.log(receipt);
              if (tokensToTransfer.length === counter) {
                setIsLoading(false);
                setAllSuccessful(true);
                setValidApproval(true);
              }
            } else {
              console.log('Error');
            }
          });
          console.log(pre);
        })
        .catch((error) => {
          console.log(error);
          alert('You have to approve all the NFTs.');
          setIsLoading(false);
          setCounter(0);
        });
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-center items-center gap-3 mb-6">
        <div className="flex flex-row flex-wrap justify-center items-center gap-3 mb-3">
          {tokensToTransfer.map((token) => (
            <div className="flex flex-col border-2 rounded-md items-center bg-wise-white w-[120px] max-w-[120px] inline-block">
              <Image
                src={token.image_url}
                width={120}
                height={120}
                className="object-fill"
              />
              <p className="my-3 text-center">{token.id}</p>
              <p className="mb-3 text-center">{token.name}</p>
            </div>
          ))}
        </div>
        <div>
          {isLoading ? (
            <button
              type="button"
              className="btn-disabled mb-3 text-sm"
              disabled
            >
              Waiting...
            </button>
          ) : (
            <button
              type="button"
              className={
                allSuccessful
                  ? 'btn-disabled mb-3 text-sm'
                  : 'btn bg-wise-red mb-3 text-sm text-wise-blue'
              }
              disabled={allSuccessful && true}
              onClick={handleApprove}
            >
              {allSuccessful ? 'Approved' : 'Approve'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
