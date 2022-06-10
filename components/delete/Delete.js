import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import { useRouter } from 'next/router';
import client from '../../lib/sanityClient';
import toast from 'react-hot-toast';
import utils from '../../utils/utils';

export default function Delete({ item, setOpenModal }) {
  const router = useRouter();
  const { address, user, setUser } = useContext(UserContext);

  const deletingListingOnSanity = async () => {
    // Se elimina en Sanity y se elimina en el user
    const deleteListing = await client.delete(item._id).then(async () => {
      // Se elimina en el user
      const listingToRemove = [`listings[_id=="${item._id}"]`];
      await client
        .patch(address)
        .unset(listingToRemove)
        .commit()
        .then((res) => console.log(res));

      // Se actualiza el UserContext
      // Primero, se busca el índice en el array
      let index;
      for (let i = 0; i < user.listings.length; i++) {
        if (user.listings[i]._id === item._id) {
          index = i;
        }
      }

      // Luego se hace la actualización
      const updatedListings = user.listings;
      updatedListings.splice(index, 1);
      const updatedUser = { ...user, listings: updatedListings };
      setUser(updatedUser);
    });
  };

  const handleDeletionOfListing = async () => {
    try {
      await deletingListingOnSanity().then(() => {
        toast.success('The listing was successfully deleted', {
          position: 'bottom-right',
        });
        router.push('/myListings');
      });
    } catch (err) {
      console.log(err);
      toast.error('An error occurred while deleting the listing', {
        position: 'bottom-right',
      });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="title">Are you sure you want to delete this listing?</h1>
      <div className="flex flex-row gap-3 my-3">
        <button className="btn btn-purple" onClick={handleDeletionOfListing}>
          Yes
        </button>
        <button className="btn btn-white" onClick={() => setOpenModal(false)}>
          No
        </button>
      </div>
    </div>
  );
}
