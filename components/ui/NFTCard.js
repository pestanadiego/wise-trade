import Image from 'next/image';
import Link from 'next/link';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';

export default function NFTCard({ item, edit = false }) {
  const { listNfts } = item;

  return (
    <div className="relative flex flex-col items-center shadow-md rounded-md cursor-pointer max-w-xs h-[35rem]">
      <div className="overflow-hidden rounded-xl bg-white flex flex-col">
        <div>
          <Carousel>
            {listNfts.map((nft) => (
              <Image src={nft.image_url} width="1000" height="1000" />
            ))}
          </Carousel>
        </div>
        <div className="flex flex-col px-4 gap-2">
          <div className="flex justify-between">
            <p className="text-indigo-600 font-semibold">
              {listNfts.length} Nfts
            </p>
          </div>
          <h1 className="text-2xl">{item.listTitle}</h1>
          {/* TIPO */}
          <div className="flex content-end justify-end mt-4 gap-2">
            {/* OPCIONES DE VISTA --- TO DO*/}
            <Link href="/myListings/[id]" as={`/myListings/${item._id}`}>
              <button type="button" className="btn btn-purple">
                <i className="fa fa-eye text-sm" />
              </button>
            </Link>
            {edit && (
              <>
                <Link href="/assets" passHref>
                  <button type="button" className="btn btn-white">
                    <i className="fa fa-pencil text-sm" />
                  </button>
                </Link>
                <Link href="/assets" passHref>
                  <button type="button" className="btn btn-white">
                    <i className="fa fa-trash-can text-sm" />
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
