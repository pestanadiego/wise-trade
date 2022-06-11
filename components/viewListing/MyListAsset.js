import Image from 'next/image';
import Link from 'next/link';
import { Carousel } from 'react-responsive-carousel';
import { AiFillCaretLeft } from 'react-icons/ai';
import { IoMdShareAlt } from 'react-icons/io';
import utils from '../../utils/utils';
import Offers from '../offers/Offers';

export default function MyListAsset({ asset }) {
  return (
    <section>
      <section>
        <div className="relative bg-white text-wise-blue mt-14 lg:mt-28 md:mb-0 mb-3 flex items-center flex-col z-0 w-full px-5 lg:mx-0">
          <div className="flex flex-col gap-0 md:gap-8 md:flex-row flex-wrap mb-6 md:mb-0">
            <div className="flex flex-col">
              <div className="flex overflow-hidden justify-center">
                <Carousel className="max-w-md">
                  {asset.listNfts.map((nft) => (
                    <Image
                      src={nft.image_url}
                      width="450"
                      height="450"
                      className="rounded-xl"
                    />
                  ))}
                </Carousel>
              </div>
            </div>
            <div className="flex-1 gap-8 flex-col">
              <span className="flex flex-row">
                <p className="text-wise-blue font-bold text-3xl tracking-tight mb-4 mr-4">
                  {asset.listTitle}
                </p>
              </span>
              <div className="my-1 border-wise-purple border-2 rounded-full py-2 w-[160px] text-center">
                <p className="text-md text-wise-purple">Accepting Trades</p>
              </div>
              <div className="flex my-3">
                <span className="flex flex-col gap-1">
                  <p className="title text-sm">Owner</p>
                  <p className="sub-heading">
                    {utils.truncateAddress(asset.address)}
                  </p>
                </span>
              </div>
              <div className="flex my-6 gap-2">
                <span className="flex flex-col gap-1">
                  <p className="title text-sm">Description</p>
                  <p className="text-lg text-left font-medium text-wise-grey">
                    {asset.listDescription}
                  </p>
                </span>
              </div>
              <div classname="my-6">
                <p className="title text-sm">Prefered Collections:</p>
                {asset.listTags.length > 0 ? (
                  <>
                    {asset.listTags.map((tag) => (
                      <p className="text-wise-grey">
                        -{'>'} {tag}
                      </p>
                    ))}
                  </>
                ) : (
                  <p className="text-wise-grey">None</p>
                )}
              </div>
              <div className="">
                <Link href={'/myListings'}>
                  <div className="flex cursor-pointer mb-3items- mt-5">
                    <button className="btn btn-white">
                      <i className="fa fa-arrow-left" />
                    </button>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="flex flex-col justify-center items-center">
        <h1 className="title text-center -mb-3">Offers</h1>
        <Offers asset={asset} />
      </section>
    </section>
  );
}
