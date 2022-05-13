import Image from 'next/image';
import security from '../../public/security.svg';
import simplicity from '../../public/simplicity.svg';
import transparency from '../../public/transparency.svg';

export default function Features() {
  return (
    <section className="bg-wise-white py-20 mt-20 lg:mt-60">
      {/* HEADING */}
      <div className="sm:w-3/4 lg:w-5/12 mx-auto px-2">
        <h1 className="text-3xl text-center text-wise-blue">Why Us</h1>
        <p className="text-center text-wise-grey mt-4">
          Wise Trade offers you:
        </p>
      </div>
      {/* FEATURE */}
      <div className="mt-14 lg:mt-18 flex flex-col lg:flex-row">
        <div className="container flex flex-col items-center justify-center gap-x-24">
          {/* IMAGEN */}
          <div className="flex flex-1 justify-center mb-10 lg:mb-0">
            <Image
              src={security}
              className="w-5/6 h-5/6 sm:w-3/4 sm:h-3/4 md:w-full md:h-full"
            />
          </div>
          {/* CONTENIDO */}
          <div className="flex flex-1 flex-col items-center">
            <h1 className="mt-3 text-3xl text-wise-blue">Security</h1>
            <p className="text-wise-grey my-4 text-center sm:w-3/4 lg:w-full">
              Fully secured trades. Nullify if necessary
            </p>
          </div>
        </div>
        <div className="container flex flex-col items-center justify-center gap-x-24">
          {/* IMAGEN */}
          <div className="flex flex-1 justify-center mb-10 lg:mb-0">
            <Image
              src={simplicity}
              className="w-5/6 h-5/6 sm:w-3/4 sm:h-3/4 md:w-full md:h-full"
            />
          </div>
          {/* CONTENIDO */}
          <div className="flex flex-1 flex-col items-center">
            <h1 className="mt-3 text-3xl text-wise-blue">Simplicity</h1>
            <p className="text-wise-grey my-4 text-center sm:w-3/4 lg:w-full">
              Only one step to create a trade
            </p>
          </div>
        </div>
        <div className="container flex flex-col items-center justify-center gap-x-24">
          {/* IMAGEN */}
          <div className="flex flex-1 justify-center mb-10 lg:mb-0">
            <Image
              src={transparency}
              className="w-5/6 h-5/6 sm:w-3/4 sm:h-3/4 md:w-full md:h-full"
            />
          </div>
          {/* CONTENIDO */}
          <div className="flex flex-1 flex-col items-center">
            <h1 className="mt-3 text-3xl text-wise-blue">Transparency</h1>
            <p className="text-wise-grey my-4 text-center sm:w-3/4 lg:w-full">
              Everything is stored on the Ethereum blockchain
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
