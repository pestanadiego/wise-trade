import { ethers } from 'ethers';
import { useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';

export default function PendingTrades() {
  const { address, provider } = useContext(UserContext);
  const signer = provider.getSigner();
  const contractAddress = '0xA37B171aB62EF81F44BFdBDBeE0EA59Fd67D1B96';
  const abi = [
    'event SwapProposed( address indexed from, address indexed to, uint256 indexed swapId, address[] nftAddressInit, uint256[] nftIdsInit, address[] nftAddressescounter, uint256[] nftIdscounter, uint256 etherValue)',
  ];

  const contract = new ethers.Contract(contractAddress, abi, signer);

  console.log(
    contract.filters.Transfer('0x6375934fD561448bb1472646459449F77aaC0a08')
  );

  return (
    <section>
      {!address ? (
        <div className="text-wise-grey text-center">
          Connect your wallet to make a trade
        </div>
      ) : (
        <div className="container">
          <h1> test</h1>
        </div>
      )}
    </section>
  );
}
