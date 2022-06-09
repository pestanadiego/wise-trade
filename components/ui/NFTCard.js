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

  return (
    <>
      <div className="relative flex flex-col items-center shadow-md rounded-md cursor-pointer -z-5">
        <div className="overflow-hidden rounded-xl bg-white relative flex flex-col">
          <div>
            <Carousel>
              {listNfts.map((nft) => (
                <Image src={nft.image_url} width="1024" height="1025" />
              ))}
            </Carousel>
          </div>
          <div className="flex flex-col p-4 gap-2">
            <div className="flex justify-between">
              <p className="text-indigo-600 font-semibold">
                {listNfts.length} NFTs
              </p>
            </div>
            <p className="text-2xl">{item.listTitle}</p>
            {/* TIPO */}
            <div className="flex justify-end mt-4 gap-2">
              {/* OPCIONES DE VISTA --- TO DO*/}
              <Link href="/myListings/[id]" as={`/myListings/${item._id}`}>
                <button type="button" className="btn btn-purple">
                  <i className="fa fa-eye text-sm" />
                </button>
              </Link>
              {edit && (
                <>
                  <Link
                    href="/myListings/edit/[id]"
                    as={`/myListings/edit/${item._id}`}
                  >
                    <button type="button" className="btn btn-white">
                      <i className="fa fa-pencil text-sm" />
                    </button>
                  </Link>
                  <button
                    onClick={() => setOpenModal(true)}
                    type="button"
                    className="btn btn-white"
                  >
                    <i className="fa fa-trash-can text-sm" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {openModal && (
        <Modal setOpenModal={setOpenModal}>
          <Delete item={item} setOpenModal={setOpenModal} />
        </Modal>
      )}
    </>
  );
}
