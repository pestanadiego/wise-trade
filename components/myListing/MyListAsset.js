import Image from 'next/image';
import Link from 'next/link';
import { Carousel } from 'react-responsive-carousel';
import utils from '../../utils/utils';
import { useRouter } from 'next/router';
export default function MyListAsset({ asset }) {
  const router = useRouter();
  const { id } = router.query;
  return (
    <div className="bg-white text-gray-900 p-10 mt-0 flex items-center flex-col">
      <div className="flex gap-8 flex-row flex-wrap">
        <div className="flex flex-col gap-8 ">
          <div className="flex overflow-hidden">
            <Carousel className="max-w-md">
              {asset.listNfts.map((nft) => (
                <Image
                  src={nft.image_url}
                  className="rounded-xl"
                  width="450"
                  height="450"
                />
              ))}
            </Carousel>
          </div>
        </div>
        <div className="flex-1 gap-8 flex-col">
          <Link href={'/myListings'}>
            <div className="flex cursor-pointer mb-3 items-center">
              <button className="btn btn-white">Back</button>
            </div>
          </Link>
          <div className="flex  mb-3 gap-2">
            <span className="flex flex-col gap-1">
              <p className="text-gray-500 text-sm">Owner</p>
              <p>{utils.truncateAddress(asset.address)}</p>
            </span>
          </div>
          <span className="flex flex-row">
            <p className="text-3xl inline-block mt-3 mr-4">{asset.listTitle}</p>
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
