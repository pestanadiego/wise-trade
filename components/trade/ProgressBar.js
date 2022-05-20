export default function ProgressBar({ progress }) {
  const showProgress = (prog) => {
    if (prog === 1) {
      return 'Step 1. Select the NFTs you want to swap';
    } else if (prog === 2) {
      return 'Step 2. You are almost done. Approve the NFTs you are going to trade';
    }
    return 'Step 3. Congratulations! Now wait for the counterpart approval';
  };

  return (
    <div className="w-full mb-6">
      <h1 className="text-center text-md text-wise-blue">
        {showProgress(progress)}
      </h1>
    </div>
  );
}
