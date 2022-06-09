import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import { useRouter } from 'next/router';
import Modal from '../ui/Modal';
import TradeOptions from '../trade/TradeOptions';
import Multiselect from 'multiselect-react-dropdown';
import NftsSelection from './NftsSelection';
import client from '../../lib/sanityClient';
import toast from 'react-hot-toast';
import utils from '../../utils/utils';

export default function CreateListing() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [nftsSelection, setNftsSelection] = useState([]);
  const { address, setUser, user } = useContext(UserContext);
  // Validación
  const [validInputs, setValidInputs] = useState(false);
  const [validTitle, setValidTitle] = useState(false);
  const [validDescription, setValidDescription] = useState(true);
  const [validSelection, setValidSelection] = useState(false);
  const [validTags, setValidTags] = useState(true);
  const [errorTitle, setErrorTitle] = useState('');
  const [errorDescription, setErrorDescription] = useState('');

  const addListingToSanity = async () => {
    // Se crea el documento del listing
    const listNfts = nftsSelection.map((selection) => {
      return {
        _key: utils.makeKey(),
        nid: parseInt(selection.id),
        image_url: selection.image_url,
        name: selection.name,
        nftAddress: selection.nftAddress,
      };
    });

    const listingDoc = {
      _type: 'listing',
      address,
      listTitle: title,
      listDescription: description,
      listNfts,
      listTags: selectedTags,
    };

    // Se agrega a Sanity y se modifica el user
    const createListing = await client.create(listingDoc).then(async (res) => {
      const modifyUserListings = await client
        .patch(address)
        .setIfMissing({ listings: [] })
        .insert('after', 'listings[-1]', [res])
        .commit({ autoGenerateArrayKeys: true });

      // Se actualiza el UserContext
      if (user.listings == null) {
        const updatedUser = { ...user, listings: [res] };
        setUser(updatedUser);
      } else {
        const updatedListings = user.listings;
        updatedListings.push(res);
        const updatedUser = { ...user, updatedListings };
        setUser(updatedUser);
      }
    });
  };

  const handleCreationOfListing = async () => {
    try {
      await addListingToSanity().then(() => {
        toast.success('The listing was successfully created', {
          position: 'bottom-right',
        });
        router.push('/myListings');
      });
    } catch (err) {
      console.log(err);
      toast.error('An error occurred while creating the listing', {
        position: 'bottom-right',
      });
    }
  };

  const getCollections = async () => {
    const response = await fetch(
      'https://testnets-api.opensea.io/api/v1/collections?offset=0&limit=20',
      { method: 'GET' }
    ).then((res) => res.json());
    const collection = response.collections.map(
      (resCollection) => resCollection.name
    );
    collection.push('Lame Cats');
    collection.push('Crypto Cunts');
    collection.push('Broke Ape Boat Club');
    setTags(collection);
    return collection;
  };

  useEffect(() => {
    getCollections();
  }, []);

  useEffect(() => {
    // Mensaje de error para el título
    const titleValidation = utils.validateTitle(title);
    if (titleValidation !== 'OK') {
      setErrorTitle(titleValidation);
      setValidTitle(false);
    } else {
      setValidTitle(true);
    }

    // Mensaje de error para la descripción
    const titleDescription = utils.validateDescription(description);
    if (titleDescription !== 'OK') {
      setErrorDescription(descriptionValidation);
      setValidDescription(false);
    } else {
      setValidDescription(true);
    }

    // Mensaje de error para la selección
    if (nftsSelection.length === 0) {
      setValidSelection(false);
    } else {
      setValidSelection(true);
    }

    // Validación global
    if (
      titleValidation === 'OK' &&
      titleDescription === 'OK' &&
      nftsSelection.length !== 0 &&
      selectedTags.length <= 4
    ) {
      setValidInputs(true);
    } else {
      setValidInputs(false);
    }
  }, [title, description, nftsSelection, selectedTags.length]);

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
            placeholder="Select a maximum of four"
            isObject={false}
            onKeyPressFn={function noRefCheck() {}}
            onRemove={(remove) => {
              setSelectedTags(remove);
              if (selectedTags.length > 4) {
                setValidTags(false);
              } else {
                setValidTags(true);
              }
            }}
            onSearch={function noRefCheck() {}}
            onSelect={(selected) => {
              setSelectedTags(selected);
              if (selectedTags.length > 4) {
                setValidTags(false);
              } else {
                setValidTags(true);
              }
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
          {validTags === false && (
            <div className="mt-2 flex flex-row gap-2 items-baseline">
              <i className="fa fa-circle-exclamation text-red-500 text-sm" />
              <p className="text-red-500 text-sm">
                You cannot select more than 4 tags
              </p>
            </div>
          )}
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
