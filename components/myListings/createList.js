import { useState } from 'react';
import Modal from '../ui/Modal';

export default function CreateList() {
  const [title, setTitle] = useState('');
  const [openModal, setOpenModal] = useState(false);

  return (
    <section>
      <div className="flex center">
        <form>
          {!openModal ? (
            <div className="flex flex-col gap-3">
              <input
                type="text"
                className="input"
                placeholder="NFTs List Name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setOpenModal(true)}
              >
                hola
              </button>
            </div>
          ) : (
            <>
              <Modal setOpenModal={setOpenModal}>
                <p>hoaalaa</p>
              </Modal>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
