import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../../context/UserContext';
import Modal from '../../ui/Modal';
import TradeOptions from '../../trade/TradeOptions';
import Multiselect from 'multiselect-react-dropdown';
import NftsSelection from './NftsSelection';
import client from '../../../lib/sanityClient';

export default function CreateList() {
  const [title, setTitle] = useState('');
  const [description, setdescription] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [tags, setTags] = useState([]);
  const [nftTags, setNftTags] = useState([]);
  const [nftsSelection, setNftsSelection] = useState([]);
  const { address } = useContext(UserContext);
  console.log(client);

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
      <form>
        {!openModal ? (
          <div className="container flex flex-col items-center gap-3 w-screen mb-24">
            <div className="w-1/2">
              <h1 className="title mb-2">Title</h1>
              <input
                type="text"
                className="input w-full"
                placeholder="NFTs List Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="w-1/2">
              <h1 className="title mb-2">Description</h1>
              <textarea
                type="text"
                className="input resize-y w-full"
                placeholder="Description"
                value={description}
                onChange={(e) => setdescription(e.target.value)}
              />
            </div>
            <NftsSelection
              setNftsSelection={setNftsSelection}
              nftsSelection={nftsSelection}
              setOpenModal={setOpenModal}
            />

            <div className="w-1/2">
              <h1 className="title mb-2">
                Select the NFTs collections of your interest
              </h1>
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
          </div>
        ) : (
          <>
            <Modal setOpenModal={setOpenModal}>
              <TradeOptions
                address={address}
                setTokensToTransfer={setNftsSelection}
                setOpenModal={setOpenModal}
              />
            </Modal>
          </>
        )}
      </form>
    </section>
  );
}
