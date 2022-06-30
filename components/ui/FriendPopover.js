import { useContext, useEffect, useState } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { UserContext } from '../../context/UserContext';
import utils from '../../utils/utils';
import client from '../../lib/sanityClient';
import toast from 'react-hot-toast';

export default function FriendPopover({ children, friendAddress, setFriend }) {
  const { address, user, setUser } = useContext(UserContext);
  const [friendName, setFriendName] = useState('');
  const [validName, setValidName] = useState(false);
  const [alreadyName, setAlreadyName] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

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
        setFriend(res.friends[res.friends.length - 1]);
        // Se actualiza el UserContext
        if (user.friends === null || user.friends === undefined) {
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
      });
    } catch (error) {
      toast.error('An error occurred while adding the friend', {
        position: 'bottom-right',
      });
      console.log(error);
    }
  };

  useEffect(() => {
    // Validación del nombre
    if (utils.validateName(friendName)) {
      // Se chequea si el nombre ya existe
      if (user.friends !== undefined) {
        for (let i = 0; i < user.friends.length; i++) {
          if (
            user.friends[i].friendName.toLowerCase() ===
            friendName.toLowerCase()
          ) {
            setValidName(false);
            setAlreadyName(true);
            break;
          }
          setValidName(true);
          setAlreadyName(false);
        }
      } else {
        setValidName(true);
        setAlreadyName(false);
      }
    } else {
      setAlreadyName(false);
      setValidName(false);
    }
  }, [friendName]);

  return (
    <Popover className="relative">
      <Popover.Button>{children}</Popover.Button>

      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Popover.Panel className="absolute z-10 mt-3 w-screen max-w-sm translate-x-1 transform px-4 sm:px-0 ">
          {({ close }) => (
            <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="relative flex flex-col gap-1 bg-white p-7">
                <div className="flex justify-start items-baseline sm:flex-row gap-3 flex-col ">
                  <div className="w-full">
                    <input
                      className="input w-full"
                      type="text"
                      placeholder="Add a name"
                      value={friendName}
                      onChange={(e) => setFriendName(e.target.value)}
                    />
                  </div>

                  <button
                    type="button"
                    disabled={!validName || (isAdding && true)}
                    className={validName ? 'btn btn-purple' : 'btn-disabled'}
                    onClick={() => {
                      handleFriendAddition();
                      close();
                    }}
                  >
                    Add
                  </button>
                </div>
                {validName === false && (
                  <div className="flex flex-row gap-2 items-baseline">
                    <i className="fa fa-circle-exclamation text-red-500 text-sm" />
                    <p className="text-red-500 text-sm">
                      {alreadyName
                        ? 'Name already in used'
                        : 'Insert a valid name'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}
