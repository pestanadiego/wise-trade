import { useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import ProgressBar from './ProgressBar';
import AssetSelection from './AssetSelection';

export default function MakeTrade() {
  const { address } = useContext(UserContext);
  const [progress, setProgress] = useState(1);

  const handleNext = () => {
    setProgress(progress + 1);
  };

  const handleBack = () => {
    setProgress(progress - 1);
  };

  return (
    <section>
      {!address ? (
        <div className="text-wise-grey text-center">
          Connect your wallet to make a trade
        </div>
      ) : (
        <div className="container flex flex-col-reverse items-center mt-14 lg:mt-28">
          <div className="flex flex-col items-center w-full">
            <h2 className="text-wise-blue text-3xl md:text-4 lg:text-5xl text-center mb-6">
              Make A Trade
            </h2>
            <div className="w-full">
              <div>
                <p className="text-wise-grey text-lg text-center mb-6">
                  Follow each one of the steps to complete a trade
                </p>
                <ProgressBar progress={progress} />
              </div>
              <div className="flex justify-center items-center flex-col gap-3">
                {/* PASOS */}
                {progress === 1 && <AssetSelection />}
                {progress === 2 && (
                  <div className="container m-3">
                    <p>Lorem</p>
                  </div>
                )}
                {progress === 3 && (
                  <div className="container m-3">
                    <p>Ipsum</p>
                  </div>
                )}

                {/* BOTONES */}
                {progress !== 3 && (
                  <div className="flex gap-3">
                    {progress !== 1 && (
                      <button
                        type="button"
                        className="btn btn-purple hover:bg-wise-white hover:text-black"
                        onClick={handleBack}
                      >
                        Back
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn btn-purple hover:bg-wise-white hover:text-black"
                      onClick={handleNext}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
