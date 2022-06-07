import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../../context/UserContext';
import Modal from '../../ui/Modal';
import TradeOptions from '../../trade/TradeOptions';
import Multiselect from 'multiselect-react-dropdown';
import NftsSelection from './NftsSelection';

export default function CreateList() {
  const [title, setTitle] = useState('');
  const [description, setdescription] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [tokenToList, setTokensToList] = useState([]);
  const [tags, setTags] = useState([]);
  const [nftTags, setNftTags] = useState([]);
  const [nftsSelection, setNftsSelection] = useState([]);
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

  useEffect(() => {
    getCollections();
  }, []);

  return (
    <section>
      <div className="flex items-center">
        <form>
          {!openModal ? (
            <div className="flex flex-col gap-3">
              <input
                type="text"
                className="input"
                placeholder="NFTs List Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                type="text"
                className="input resize-y"
                placeholder="Description"
                value={description}
                onChange={(e) => setdescription(e.target.value)}
              />
              <NftsSelection />
              <Multiselect
                isObject={false}
                onKeyPressFn={function noRefCheck() {}}
                onRemove={(remove) => {
                  setNftTags(remove);
                }}
                onSearch={function noRefCheck() {}}
                onSelect={(selected) => {
                  setNftTags(selected);
                }}
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
