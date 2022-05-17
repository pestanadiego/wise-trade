import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context/UserContext';
import client from '../../lib/sanityClient';
import utils from '../../utils/utils';

export default function EditProfile() {
  const [email, setEmail] = useState('');
  const [edit, setEdit] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const { address, user, setUser } = useContext(UserContext);

  const handleDiscard = () => {
    setEdit(false);
    setEmail('');
  };

  const handleEdit = () => {
    setEdit(true);
  };

  const handleSave = async () => {
    setUser({ ...user, email });
    // eslint-disable-next-line no-unused-vars
    const update = await client.patch(address).set({ email }).commit();
    alert('Your email address was modified successfully');
    setEdit(false);
    setEmail('');
  };

  useEffect(() => {
    if (utils.validateEmail(email)) {
      setValidEmail(true);
    } else {
      setValidEmail(false);
    }
  }, [email]);

  return (
    <div className="flex justify-center flex-col items-center">
      <div className="flex justify-center flex-col items-center w-full">
        <p className="text-wise-grey mb-3">Edit your email address</p>
        {edit ? (
          <div className="w-full">
            <input
              className="input w-full"
              type="email"
              placeholder="New email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {validEmail === false && email !== '' && (
              <div className="flex flex-row gap-2 items-baseline">
                <i className="fa fa-circle-exclamation text-red-500 text-sm" />
                <p className="text-red-500 text-sm">
                  Please, insert a valid email
                </p>
              </div>
            )}
          </div>
        ) : (
          <p>{user.email}</p>
        )}
      </div>
      <div className="mt-4">
        {edit ? (
          <div className="flex gap-3">
            <button
              disabled={!validEmail && true}
              className={validEmail ? 'btn btn-purple' : 'btn-disabled'}
              type="button"
              onClick={handleSave}
              title={
                validEmail === false && email !== '' && 'Insert a valid email'
              }
            >
              Save Changes
            </button>
            <button
              className="btn btn-white"
              type="button"
              onClick={handleDiscard}
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
