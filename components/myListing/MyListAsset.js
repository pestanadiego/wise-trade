import Image from 'next/image';
import Link from 'next/link';
import { Carousel } from 'react-responsive-carousel';
import { AiFillCaretLeft } from 'react-icons/ai';
import { IoMdShareAlt } from 'react-icons/io';
import utils from '../../utils/utils';
import { useRouter } from 'next/router';
export default function MyListAsset({ asset }) {
  const router = useRouter();
  const { id } = router.query;
  return (
    <div className="bg-white text-gray-900 p-10 mt-0 flex flex-col">
      <div className="flex gap-8 flex-row flex-wrap">
        <div className="flex flex-col gap-8 ">
          <div className="flex overflow-hidden rounded-xl">
            <Carousel>
              {asset.listNfts.map((nft) => (
                <Image src={nft.image_url} width="450" height="450" />
              ))}
            </Carousel>
          </div>
        </div>
        <div className="flex-1 gap-8 flex-col">
          <Link href={'/myListings'}>
            <div className="flex cursor-pointer mb-3 items-center text-wise-purple">
              <AiFillCaretLeft />
              Back
            </div>
          </Link>
          <div className="flex gap-4 items-center">
            <Link href="/trade">
              <div className="flex items-center mb-3 gap-2 cursor-pointer">
                <IoMdShareAlt />
                Make an offer
              </div>
            </Link>
          </div>
          <div className="flex  mb-3 gap-2">
            <span className="flex flex-col gap-1">
              <p className="text-gray-500 text-sm">Owner</p>
              <p>{utils.truncateAddress(asset.address)}</p>
            </span>
          </div>
          <span className="flex flex-row">
            <p className="text-3xl inline-block mt-3 mr-4">{asset.listTitle}</p>
            <p className="p-2 text-sm font-medium text-gray-500 mt-3 rounded-2xl border-2 border-gray-500 ">
              Marketplace
            </p>
          </span>
          <br />
          <p className="text-xl font-medium mb-3 text-gray-500">
            Accepting Trades
          </p>
          <p className="whitespace-pre-wrap mb-3">{asset.listDescription}</p>
        </div>
      </div>
    </div>
  );
}
