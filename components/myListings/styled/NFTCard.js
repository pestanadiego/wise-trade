import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { Colors } from '../Theme';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import brokeape from '../../../public/brokeape.svg';

const Bar1 = styled.span`
  width: 93%;
  height: 0.7rem;
  background-color: ${Colors.White};
  border-radius: 0 0 50px 50px;
  box-shadow: inset 0 4px 5px rgb(0 0 0 /10%);
  z-index: 1;
  /* filter: brightness(0.7); */
  transform: translateY(-30%);
`;
const Bar2 = styled(Bar1)`
  width: 88%;
  transform: translateY(-60%);
  /* filter: brightness(0.5); */
  z-index: 0;
`;

export default function NFTCard({ item }) {
  const { Id, Badge, Stock, Title, Price } = item;
  return (
    <div className="relative flex flex-col items-center">
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
          <div className="flex items-center w-full mt-4">
            <Link href="/assets" passHref>
              <button
                type="button"
                className="btn btn-purple px-4 py-3 text-xs"
              >
                View Info
              </button>
            </Link>
          </div>
        </div>
      </div>
      <span className="w-11/12 h-1 bg-white round-xl shadow-md brightness-75 -translate-y-1/3 "></span>
      <span className="w-10/12 h-1 -translate-y-2/3 brightness-90 bg-white round-xl shadow-md"></span>
    </div>
  );
}
