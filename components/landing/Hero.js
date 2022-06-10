import Image from 'next/image';
import Link from 'next/link';
import hero from '../../public/hero.svg';

export default function Hero() {
  return (
    <section>
      <div className="container flex flex-col-reverse lg:flex-row items-center gap-12 mt-14 lg:mt-28">
        <div className="flex flex-1 flex-col items-center lg:items-start">
          <h2 className="heading md:text-4 lg:text-5xl md:text-4 lg:text-5xl lg:text-left mb-6">
            Swap NFTs easily.
          </h2>
          <p className="text-wise-grey text-lg text-center lg:text-left mb-6">
            Wise Trade lets you swap your NFTs simply and safely.
          </p>
          <div className="flex justify-center flex-wrap gap-6">
            <button
              type="button"
              className="btn btn-purple hover:bg-wise-white hover:text-black"
            >
              <Link href="/trade">Make A Trade</Link>
            </button>
            <button
              type="button"
              className="btn btn-white hover:bg-wise-purple hover:text-white"
            >
              <Link href="/marketplace">Check Marketplace</Link>
            </button>
          </div>
        </div>
        <div className="flex justify-center flex-1 mb-10 md:mb-16 lg:mb-0">
          <Image
            src={hero}
            className="w-5/6 h-5/6 sm:w-3/4 sm:h-3/4 md:w-full md:h-full"
          />
        </div>
      </div>
    </section>
  );
}
