import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import Modal from '../ui/Modal';
import TradeOptions from '../trade/TradeOptions';
import Multiselect from 'multiselect-react-dropdown';

export default function CreateList() {
  const [title, setTitle] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [tokenToList, setTokensToList] = useState([]);
  const [tags, setTags] = useState([]);
  const [nftTags, setNftTags] = useState([]);
  const { address } = useContext(UserContext);

  const getCollections = async () => {
    const options = { method: 'GET' };

    const response = await fetch(
      'https://testnets-api.opensea.io/api/v1/collections?offset=0&limit=300',
      options
    ).then((res) => res.json());
    const collection = response.collections.map(
      (resCollection) => resCollection.name
    );
    setTags(collection);
    return collection;
  };

  console.log('1', tags);

  useEffect(() => {
    getCollections();
  }, []);

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
              <Multiselect
                isObject={false}
                onKeyPressFn={function noRefCheck() {}}
                onRemove={function noRefCheck() {}}
                onSearch={function noRefCheck() {}}
                onSelect={function noRefCheck() {}}
                options={tags}
              />
            </div>
          ) : (
            <>
              <Modal setOpenModal={setOpenModal}>
                <TradeOptions
                  address={address}
                  setTokensToTransfer={setTokensToList}
                  setOpenModal={setOpenModal}
                />
              </Modal>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
