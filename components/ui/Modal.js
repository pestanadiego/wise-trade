export default function Modal({ setOpenModal, children }) {
  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 bottom-0 bg-black/70 z-1000"
        onClick={() => {
          setOpenModal(false);
        }}
      />
      <div className="container top-1/2 left-1/2 fixed z-100 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md p-3">
        <div className="flex justify-end">
          <button
            type="button"
            className="text-wise-purple text-2xl p-3"
            onClick={() => {
              setOpenModal(false);
            }}
          >
            x
          </button>
        </div>
        {children}
      </div>
    </>
  );
}
