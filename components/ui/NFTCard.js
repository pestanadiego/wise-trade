import Image from 'next/image';
import Link from 'next/link';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import brokeape from './../../public/brokeape.svg';

export default function NFTCard({ item, edit = false }) {
  const { Id, Badge, Stock, Title, Price } = item;
  return (
    <div className="relative flex flex-col items-center shadow-md rounded-md cursor-pointer">
      <div className="overflow-hidden rounded-xl bg-white relative flex flex-col">
        <div className="absolute bg-wise-purple text-md text-white p-0.5 z-10 mt-2 ml-4 rounded-lg">
          {Badge}
        </div>
        <div>
          <Carousel>
            <Image src={brokeape} width="1024" height="1025" />
            <Image src={brokeape} width="1024" height="1025" />
          </Carousel>
        </div>
        <div className="flex flex-col p-4 gap-2">
          <div className="flex justify-between">
            <p className="font-medium">List:{Id}</p>
            <p className="text-indigo-600 font-semibold">{Stock} Nfts</p>
          </div>
          <p className="text-2xl">{Title}</p>
          <p>{Price}</p>
          {/* TIPO */}
          <div className="flex justify-end mt-4 gap-2">
            {/* OPCIONES DE VISTA --- TO DO*/}
            <Link href="/assets" passHref>
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
