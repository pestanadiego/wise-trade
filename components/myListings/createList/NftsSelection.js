import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../../context/UserContext';
import utils from '../../../utils/utils';
import Image from 'next/image';
export default function NftsSelection({
  setNftsSelection,
  nftsSelection,
  setOpenModal,
}) {
  const { address } = useContext(UserContext);
  return (
    <div className="flex flex-col justify-center align-center w-full border-2 rounded-md">
      <div className="container">
        <h1 className="title mt-3 ml-3">My Wallet</h1>
        <p className="text-wise-grey m-3 overflow-hidden">
          {utils.truncateAddress(address)}
        </p>
      </div>
      {nftsSelection.length === 0 ? (
        <div
          className="flex flex-col justify-center items-center my-20 cursor-pointer"
          onClick={() => setOpenModal(true)}
        >
          <i className="fa fa-plus text-wise-grey text-5xl mb-3" />
          <p className="text-wise-grey">
            Add The NFTs To List In The Marketplace
          </p>
        </div>
      ) : (
        <div>
          <div className="flex flex-row flex-wrap justify-center gap-3 mb-6">
            {nftsSelection.map((token) => (
              <div className="flex flex-col border-2 rounded-md items-center bg-wise-white w-[120px] max-w-[120px]">
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
          <div className="flex justify-end">
            <button
              type="button"
              className="btn btn-white my-4"
              onClick={() => setOpenModal(true)}
            >
              Change All
            </button>
            <button
              type="button"
              className="btn btn-white m-4"
              onClick={() => setNftsSelection([])}
            >
              Remove All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
