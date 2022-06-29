import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import client from '../../lib/sanityClient';
import toast from 'react-hot-toast';
import utils from '../../utils/utils';

export default function Friends() {
  const { user, setUser, address } = useContext(UserContext);
  const [friendName, setFriendName] = useState('');
  const [friendAddress, setFriendAddress] = useState('');
  const [validName, setValidName] = useState(false);
  const [validAddress, setValidAddress] = useState(false);
  const [alreadyAddress, setAlreadyAddress] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const addFriendToSanity = async () => {
    const friendDoc = {
      friendName,
      friendAddress,
    };

    setIsAdding(true);
    // Se modifica el user en Sanity
    const modifyUserFriends = await client
      .patch(address)
      .setIfMissing({ friends: [] })
      .insert('after', 'friends[-1]', [friendDoc])
      .commit({ autoGenerateArrayKeys: true })
      .then((res) => {
        console.log();
        // Se actualiza el UserContext
        if (user.friends === null) {
          const updatedUser = {
            ...user,
            friends: [res.friends[res.friends.length - 1]],
          };
          setUser(updatedUser);
        } else {
          const updatedFriends = user.friends;
          updatedFriends.push(res.friends[res.friends.length - 1]);
          const updatedUser = { ...user, updatedFriends };
          setUser(updatedUser);
        }
        setIsAdding(false);
      });
  };

  const handleFriendAddition = async () => {
    try {
      await addFriendToSanity().then(() => {
        toast.success('Friend successfully added', {
          position: 'bottom-right',
        });
        setFriendName('');
        setFriendAddress('');
      });
    } catch (error) {
      toast.error('An error occurred while adding the friend', {
        position: 'bottom-right',
      });
      console.log(error);
    }
  };

  const deleteFriendOnSanity = async (friend) => {
    setIsDeleting(true);
    // Se modifica el user en Sanity
    const friendToRemove = [
      `friends[friendAddress=="${friend.friendAddress}"]`,
    ];
    await client
      .patch(address)
      .unset(friendToRemove)
      .commit()
      .then(() => {
        // Se actualiza el userContext
        // Primero se busca el índice del array
        let index;
        for (let i = 0; i < user.friends.length; i++) {
          if (user.friends[i].friendAddress === friend.friendAddress) {
            index = i;
          }
        }
        // Luego se hace la actualización
        const updatedFriends = user.friends;
        updatedFriends.splice(index, 1);
        const updatedUser = { ...user, friends: updatedFriends };
        setUser(updatedUser);
        setIsDeleting(false);
      });
  };

  const handleFriendDeletion = async (friend) => {
    try {
      await deleteFriendOnSanity(friend).then(() => {
        toast.success('Friend successfully deleted', {
          position: 'bottom-right',
        });
      });
    } catch (error) {
      toast.error('An error occurred while deleting the friend', {
        position: 'bottom-right',
      });
      console.log(error);
    }
  };

  useEffect(() => {
    // Validación del nombre
    if (utils.validateName(friendName)) {
      setValidName(true);
    } else {
      setValidName(false);
    }

    // Validación del address
    if (utils.validateAddress(friendAddress)) {
      if (user.friends !== undefined) {
        for (let i = 0; i < user.friends.length; i++) {
          if (user.friends[i].friendAddress === friendAddress) {
            setValidAddress(false);
            setAlreadyAddress(true);
            break;
          }
          setValidAddress(true);
          setAlreadyAddress(false);
        }
      }
    } else {
      setAlreadyAddress(false);
      setValidAddress(false);
    }
  }, [friendName, friendAddress, user]);

  return (
    <div className="mt-12">
      <h2 className="heading md:text-4 lg:text-5xl mb-6">Friends</h2>
      <p className="text-wise-grey sub-heading mb-3">
        Add friends to make trades <span className="font-bold">faster</span>
      </p>
      <div className="flex items-center justify-center flex-col gap-3">
        <div className="flex justify-center items-center flex-col gap-3 mt-6 w-full border rounded-md p-4">
          <div className="w-full">
            <h1 className="title mb-2">Name</h1>
            <input
              className="input w-full"
              type="text"
              placeholder=""
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
            />
            {validName === false && (
              <div className="flex flex-row gap-2 items-baseline">
                <i className="fa fa-circle-exclamation text-red-500 text-sm" />
                <p className="text-red-500 text-sm">Insert a valid name</p>
              </div>
            )}
          </div>
          <div className="w-full mt-2 mb-4">
            <h1 className="title mb-2">Address</h1>
            <input
              className="input w-full"
              type="text"
              placeholder=""
              value={friendAddress}
              onChange={(e) => setFriendAddress(e.target.value)}
            />
            {validAddress === false && (
              <div className="flex flex-row gap-2 items-baseline">
                <i className="fa fa-circle-exclamation text-red-500 text-sm" />
                <p className="text-red-500 text-sm">
                  {alreadyAddress
                    ? 'Address already added'
                    : 'Insert a valid address'}
                </p>
              </div>
            )}
          </div>
          <button
            type="button"
            disabled={!validName || !validAddress || (isAdding && true)}
            className={
              validName && validAddress ? 'btn btn-purple' : 'btn-disabled'
            }
            onClick={handleFriendAddition}
          >
            Add Friend
          </button>
        </div>
      </div>
      <div className="mb-6">
        {user.friends === undefined || user.friends.length === 0 ? (
          <p className="text-wise-grey mt-9 text-center">
            It looks you don't have any friends added
          </p>
        ) : (
          <div className="mt-6 flex flex-col justify-center items-center gap-3">
            <h1 className="title">Friends List</h1>
            <div className="w-full">
              <ul>
                {user.friends.map((friend) => {
                  return (
                    <li className="mb-3">
                      <div className="flex flex-row w-full justify-between items-baseline">
                        <div className="sub-heading flex flex-row gap-3 w-full">
                          <p className="text-left flex-1 w-1/2 truncate">
                            {friend.friendName}
                          </p>
                          <p className="text-left flex-1 w-1/2">
                            {friend.friendAddress !== undefined &&
                              utils.truncateAddress(friend.friendAddress)}
                          </p>
                        </div>
                        <div className="">
                          <button
                            className="btn bg-wise-white hover:bg-gray-300 hover:text-white"
                            onClick={() => handleFriendDeletion(friend)}
                            disabled={isDeleting && true}
                          >
                            <i className="fa fa-x text-red-500" />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
