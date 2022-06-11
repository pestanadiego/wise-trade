import { useRouter } from 'next/router';
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../../../../context/UserContext';
import AcceptOffer from '../../../../../components/offers/AcceptOffer';
import Loader from '../../../../../components/ui/Loader';
import client from '../../../../../lib/sanityClient';

export default function offerAccept() {
  const [isLoading, setIsLoading] = useState(true);
  const [offerExist, setOfferExist] = useState(false);
  const [isListOwner, setIsListOwner] = useState(false);
  const [listOffers, setListOffers] = useState([]);
  const [listNfts, setListNfts] = useState([]);
  const [asset, setAsset] = useState({});
  const [counterpartyAddress, setCounterpartyAddress] = useState('');
  const { user, address } = useContext(UserContext);
  const router = useRouter();
  const { id, offerId } = router.query;

  const getAsset = async () => {
    if (id != undefined && offerId != undefined) {
      const query = `*[_id == "${id}"]`;
      const response = await client.fetch(query);
      if (response.length > 0) {
        const res = response[0];
        console.log('pepe', res);
        const arrListNfts = [];
        const arrListOffers = [];
        res.listNfts.forEach((nft) => {
          arrListNfts.push({
            id: nft.nid,
            image_url: nft.image_url,
            name: nft.name,
            nftAddress: nft.nftAddress,
          });
        });
        console.log(parseInt(offerId) + 1);
        console.log('juan', res.listOffers.length === parseInt(offerId) + 1);
        if (res.listOffers.length >= parseInt(offerId) + 1) {
          console.log('solo la puntica');
          res.listOffers[offerId].offerNfts.forEach((offer) => {
            arrListOffers.push({
              id: offer.nid,
              image_url: offer.image_url,
              name: offer.name,
              nftAddress: offer.nftAddress,
            });
          });
          setOfferExist(true);
          setCounterpartyAddress(res.listOffers[offerId].offerAddress);
          setListNfts(arrListNfts);
          setListOffers(arrListOffers);
          setAsset(res);
        } else {
          setOfferExist(false);
        }

        if (res.address === address) {
          setIsListOwner(true);
        }
      } else {
        setAsset(null);
        setOfferExist(false);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('id', id);
    console.log('offerId', offerId);
    getAsset();
  }, [id, offerId]);

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center">
          <Loader />
        </div>
      ) : (
        <>
          {offerExist ? (
            <>
              {isListOwner ? (
                <AcceptOffer
                  tokensToTransfer={listNfts}
                  tokensToReceive={listOffers}
                  counterpartyAddress={counterpartyAddress}
                  asset={asset}
                  i={offerId}
                />
              ) : (
                <h1 className="text-center text-wise-grey">
                  Only the owner can view this listing
                </h1>
              )}
            </>
          ) : (
            <h1 className="text-center text-wise-grey">
              This offer does not exist
            </h1>
          )}
        </>
      )}
    </>
  );
}
