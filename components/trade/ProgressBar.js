export default function ProgressBar({ progress }) {
  const showProgress = (prog) => {
    if (prog === 1) {
      return 'Step 1. Select the NFTs you want to swap';
    }
    return 'Step 2. You are almost done. The counterparty has to accept the swap';
  };

  return (
    <div className="w-full mb-6">
      <h1 className="text-center text-md text-wise-blue">
        {showProgress(progress)}
      </h1>
    </div>
  );
}
