import { useContext, useState } from 'react';
import { UserContext } from '../../context/UserContext';
import client from '../../lib/sanityClient';

export default function EditProfile() {
  const [email, setEmail] = useState('');
  const [edit, setEdit] = useState(false);
  const { address, user, setUser } = useContext(UserContext);

  const handleEdit = () => {
    setEdit(!edit);
  };

  const handleSave = async () => {
    setUser({ ...user, email });
    // eslint-disable-next-line no-unused-vars
    const update = await client.patch(address).set({ email }).commit();
    alert('Your email address was modified successfully');
    setEdit(false);
  };

  return (
    <div className="flex justify-center flex-col items-center">
      <div className="flex justify-center flex-col items-center">
        <p className="text-wise-grey mb-3">Edit your email address</p>
        {edit ? (
          <input
            className="input"
            type="email"
            placeholder="Enter your new email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        ) : (
          <p>{user.email}</p>
        )}
      </div>
      <div className="mt-4">
        {edit ? (
          <div>
            <button
              className="btn btn-purple"
              type="button"
              onClick={handleSave}
            >
              Save Changes
            </button>
            <button
              className="btn btn-white"
              type="button"
              onClick={handleEdit}
            >
              Discard
            </button>
          </div>
        ) : (
          <button className="btn btn-purple" type="button" onClick={handleEdit}>
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
