import { ethers } from 'ethers';
import { useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';

export default function PendingTrades() {
  const { address, provider } = useContext(UserContext);
  const signer = provider.getSigner();
  const contractAddress = '0x0bbD1C5232d927266D4D79274356b967c1b40f10';
  const abi = [
    'event SwapProposed( address indexed from, address indexed to, uint256 indexed swapId, address[] nftAddressInit, uint256[] nftIdsInit, address[] nftAddressescounter, uint256[] nftIdscounter, uint256 etherValue)',
  ];

  const contract = new ethers.Contract(contractAddress, abi, signer);
  //"0x98a3e5937d32b0f142498fa84d7a454f36bda700ae5145c27b192309a4f5f463"
  console.log(
    contract.filters.SwapProposed('0x6031841fFcbb99559Aa2a3Cb9EF0bbC1F07AAf13')
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
