import Image from 'next/image';
import Link from 'next/link';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import { useState } from 'react';
import Modal from '../ui/Modal';
import Delete from '../delete/Delete';

export default function NFTCard({ item, edit = false }) {
  const [openModal, setOpenModal] = useState(false);
  const { listNfts } = item;

  console.log('edit', edit);

  return (
    <>
      <div className="relative flex flex-col shadow-md rounded-md cursor-pointer w-[15rem] h-[30rem] mb-4 z-0">
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
                {listNfts.length} NFTs
              </p>
            </div>
            <h1 className="text-2xl">{item.listTitle}</h1>
            {/* <div classname="">
              {(item.listTags.length>0) ? (
                <>
                  <p className="text-wise-grey absolute bottom-20 text-[0.9rem]">Prefered Collection: {item.listTags[0]}</p>
                </>
              ) : (
                	<p className="text-wise-grey absolute bottom-20 text-[0.9rem]">Prefered Collection: None</p>
              )}
            </div> */}
            {/* TIPO */}
            <div className="flex content-end justify-end mt-4 gap-2 absolute bottom-5 right-5 sm:right-2 lg:right-5">
              {edit ? (
                <>
                  <Link href="/myListings/[id]" as={`/myListings/${item._id}`}>
                    <button
                      type="button"
                      className="shadow-md px-4 py-3 lg:px-6 rounded-md transition duration-300 hover:bg-wise-white hover:text-black active:scale-95 btn-purple"
                    >
                      <i className="fa fa-eye text-sm" />
                    </button>
                  </Link>
                  <Link
                    href="/myListings/edit/[id]"
                    as={`/myListings/edit/${item._id}`}
                  >
                    <button
                      type="button"
                      className="shadow-md px-4 py-3 lg:px-6 rounded-md transition duration-300 hover:bg-wise-white hover:text-black active:scale-95  btn-white"
                    >
                      <i className="fa fa-pencil text-sm" />
                    </button>
                  </Link>
                  <button
                    onClick={() => setOpenModal(true)}
                    type="button"
                    className="shadow-md px-4 py-3 lg:px-6 rounded-md transition duration-300 hover:bg-wise-white hover:text-black active:scale-95  btn-white"
                  >
                    <i className="fa fa-trash-can text-sm" />
                  </button>
                </>
              ) : (
                <Link href="/marketplace/[id]" as={`/marketplace/${item._id}`}>
                  <button type="button" className="btn btn-purple">
                    <i className="fa fa-eye text-sm" />
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      {openModal && (
        <div className="relative z-10">
          <Modal setOpenModal={setOpenModal}>
            <Delete item={item} setOpenModal={setOpenModal} />
          </Modal>
        </div>
      )}
    </>
  );
}
