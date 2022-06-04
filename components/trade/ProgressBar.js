export default function ProgressBar({ progress }) {
  if (progress === 1) {
    return (
      <div className="flex flex-col items-center w-full mb-6">
        <h1 className="title mt-4 mb-2">Step 1</h1>
        <h1 className="text-center text-wise-grey">
          Select the NFTs you want to swap
        </h1>
      </div>
    );
  }
  if (progress === 2) {
    return (
      <div className="flex flex-col items-center w-full mb-6">
        <h1 className="title mt-4 mb-2">Step 2</h1>
        <h1 className="text-center text-wise-grey">
          Approve the NFTs you are going to trade
        </h1>
      </div>
    );
  }
  if (progress === 3) {
    return (
      <div className="flex flex-col items-center w-full mb-6">
        <h1 className="title mt-4 mb-2">Step 3</h1>
        <h1 className="text-center text-wise-grey">
          Congratulations! Now wait for the counterpart approval
        </h1>
      </div>
    );
  }
}
