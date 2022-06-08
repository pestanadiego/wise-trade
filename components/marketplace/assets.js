/* eslint-disable jsx-a11y/alt-text */
import Image from 'next/image';
import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { AiFillCaretLeft } from 'react-icons/ai';
import { IoMdShareAlt } from 'react-icons/io';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Carousel } from 'react-responsive-carousel';
import brokeape from '../../public/brokeape.svg';

export default function Assets(item) {
  const { user, address } = useContext(UserContext);

  return (
    <section>
      {!address ? (
        <div>Connect your wallet to see this page</div>
      ) : (
        <div className="bg-white text-gray-900 p-10 mt-0 flex flex-col">
          <div className="flex gap-8 flex-row flex-wrap">
            <div className="flex-1 flex-col gap-8 ">
              <div className="overflow-hidden rounded-xl">
                <Carousel>
                  <Image
                    src={brokeape}
                    layout="responsive"
                    width="1000px"
                    height="1000px"
                  />
                </Carousel>
              </div>
            </div>
            <div className="flex-1 gap-8 flex-col">
              <Link href="/marketPlace">
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
                  <p>Address</p>
                </span>
              </div>
              <span className="flex flex-row">
                <p className="text-3xl inline-block mt-3 mr-4">LameCats</p>
                <p className="p-2 text-sm font-medium text-gray-500 mt-3 rounded-2xl border-2 border-gray-500 ">
                  Marketplace
                </p>
              </span>
              <br />
              <p className="text-xl font-medium mb-3 text-gray-500">
                Accepting Trades
              </p>
              <p className="whitespace-pre-wrap mb-3">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
