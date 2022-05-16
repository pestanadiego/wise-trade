export default function ProgressBar({ progress }) {
  const showProgress = (prog) => {
    if (prog === 1) {
      return 'w-1/3';
    }
    if (prog === 2) {
      return 'w-2/3';
    }
    return 'w-full';
  };

  return (
    <div className="w-full mb-6">
      <div
        className={`bg-wise-purple h-full rounded-md inline-block ${showProgress(
          progress
        )}`}
      >
        &nbsp;
      </div>
    </div>
  );
}
