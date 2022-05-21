import Image from 'next/image';
import { ethers } from 'ethers';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';

export default function AssetApproval({ tokensToTransfer, setValidApproval }) {
  const { provider } = useContext(UserContext);
  const [success, setSuccess] = useState(() => {
    const arr = [];
    for (let i = 0; i < tokensToTransfer.length; i++) {
      arr.push(false);
    }
    return arr;
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async (token, i) => {
    console.log(success);
    // Abi
    const abi = [
      'function approve(address to, uint256 tokenId) public returns (bool success)',
    ];
    const signer = provider.getSigner();
    const contract = new ethers.Contract(token.nftAddress, abi, signer);
    console.log(success);
    // Contract
    await contract
      .approve('0x3376C58a9ca4fBD7E6b96B7866322152C14F9375', token.id)
      .then((pre) => {
        console.log(pre);
        setIsLoading(true);
        pre.wait().then((receipt) => {
          if (receipt.confirmations === 1) {
            success[i] = true;
            const updatedSuccess = success.map((bool) => (bool ? true : false));
            setSuccess(updatedSuccess);
            console.log(receipt);
            console.log(success);
          } else {
            console.log('Error');
            console.log(receipt);
          }
          setIsLoading(false);
        });
        console.log(pre);
        console.log(success);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    for (let i = 0; i < success.length; i++) {
      if (success[i] === false) {
        setValidApproval(false);
        break;
      }
      setValidApproval(true);
    }
  }, [success]);

  return (
    <div>
      <div className="flex flex-row flex-wrap justify-center gap-3 mb-6">
        {tokensToTransfer.map((token, i) => (
          <div className="flex flex-col border-2 rounded-md items-center bg-wise-white w-[120px] max-w-[120px] inline-block">
            <Image
              src={token.image_url}
              width={120}
              height={120}
              className="object-fill"
            />
            <p className="my-3 text-center">{token.id}</p>
            <p className="mb-3 text-center">{token.name}</p>
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
                  success[i]
                    ? 'btn-disabled mb-3 text-sm'
                    : 'btn bg-wise-red mb-3 text-sm'
                }
                disabled={success[i] && true}
                onClick={() => handleApprove(token, i)}
              >
                {success[i] ? 'Approved' : 'Approve'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
