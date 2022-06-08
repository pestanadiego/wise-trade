import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import Modal from '../ui/Modal';
import TradeOptions from '../trade/TradeOptions';
import Multiselect from 'multiselect-react-dropdown';
import NftsSelection from './NftsSelection';
import client from '../../lib/sanityClient';
import utils from '../../utils/utils';

export default function CreateListing() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [tags, setTags] = useState([]);
  const [nftTags, setNftTags] = useState([]);
  const [nftsSelection, setNftsSelection] = useState([]);
  const { address } = useContext(UserContext);
  // Validación
  const [validInputs, setValidInputs] = useState(false);
  const [validTitle, setValidTitle] = useState(false);
  const [validDescription, setValidDescription] = useState(true);
  const [validSelection, setValidSelection] = useState(false);
  const [errorTitle, setErrorTitle] = useState('');
  const [errorDescription, setErrorDescription] = useState('');

  const handleCreationOfListing = () => {
    console.log('hola');
  };

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

  useEffect(() => {
    // Validación del título
    const titleValidation = utils.validateTitle(title);
    if (titleValidation === 'OK') {
      setValidTitle(true);
    } else {
      setErrorTitle(titleValidation);
      setValidTitle(false);
    }

    // Validación de la descripción
    const descriptionValidation = utils.validateDescription(description);
    if (descriptionValidation === 'OK') {
      setValidDescription(true);
    } else {
      setErrorDescription(descriptionValidation);
      setValidInputs(false);
      setValidDescription(false);
    }

    // Validación de la selección
    if (nftsSelection.length === 0) {
      setValidSelection(false);
      setValidInputs(false);
    } else {
      setValidSelection(true);
    }

    // Validación global
    if (validTitle && validDescription && validSelection) {
      setValidInputs(true);
    } else {
      setValidInputs(false);
    }
  }, [title, description, nftsSelection]);

  return (
    <>
      <div className="container flex flex-col justify-center items-center gap-3 mb-24">
        {/* TITULO */}
        <div className="w-full sm:w-2/3 lg:w-1/2">
          <h1 className="title mb-2">Title</h1>
          <input
            type="text"
            className="input w-full"
            placeholder="Insert a title for your listing"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          {validTitle === false && (
            <div className="flex flex-row gap-2 items-baseline">
              <i className="fa fa-circle-exclamation text-red-500 text-sm" />
              <p className="text-red-500 text-sm">{errorTitle}</p>
            </div>
          )}
        </div>
        {/* DESCRIPCION */}
        <div className="w-full sm:w-2/3 lg:w-1/2">
          <h1 className="title mb-2">Description</h1>
          <textarea
            type="text"
            className="input resize-y w-full"
            placeholder="Insert a small description about the NFTs you want to trade"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {validDescription === false && (
            <div className="flex flex-row gap-2 items-baseline">
              <i className="fa fa-circle-exclamation text-red-500 text-sm" />
              <p className="text-red-500 text-sm">{errorDescription}</p>
            </div>
          )}
        </div>
        {/* SELECCIÓN */}
        <div className="w-full sm:w-2/3 lg:w-1/2 mb-2">
          <h1 className="title mb-2">NFTs</h1>
          <NftsSelection
            setNftsSelection={setNftsSelection}
            nftsSelection={nftsSelection}
            setOpenModal={setOpenModal}
            address={address}
          />
          {validSelection === false && (
            <div className="flex flex-row gap-2 items-baseline">
              <i className="fa fa-circle-exclamation text-red-500 text-sm" />
              <p className="text-red-500 text-sm">
                You have to select at least one NFT
              </p>
            </div>
          )}
        </div>

        {/* TAGS */}
        <div className="w-full sm:w-2/3 lg:w-1/2">
          <h1 className="title mb-2">Collections you are interested in</h1>
          <Multiselect
            id="multiselect-custom"
            closeIcon="cancel"
            placeholder="Select as many as you want"
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
            style={{
              chips: { background: '#5F5CEA' },
              searchBox: {
                'border-width': '1px',
                'border-color': '#e5e7eb',
                'border-radius': '0.375rem',
                padding: '0.75rem 1rem ',
              },
              option: {
                color: '#9194A2',
              },
            }}
          />
        </div>
        <button
          className={validInputs ? 'mt-4 btn btn-purple' : 'mt-4 btn-disabled'}
          onClick={handleCreationOfListing}
        >
          Create
        </button>
      </div>
      {openModal && (
        <Modal setOpenModal={setOpenModal}>
          <TradeOptions
            address={address}
            setTokensToTransfer={setNftsSelection}
            setOpenModal={setOpenModal}
          />
        </Modal>
      )}
    </>
  );
}
