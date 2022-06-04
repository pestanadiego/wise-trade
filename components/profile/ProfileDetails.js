import { useContext, useState, useEffect } from 'react';
// eslint-disable-next-line import/named
import { UserContext } from '../../context/UserContext';
import utils from '../../utils/utils';
import client from '../../lib/sanityClient';
import EditProfile from './EditProfile';

export default function ProfileDetails() {
  const { address, user, setUser } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);

  const handleEmail = async () => {
    setUser({ ...user, email });
    // eslint-disable-next-line no-unused-vars
    const update = await client.patch(address).set({ email }).commit();
    alert('Your email address was added successfully');
  };

  useEffect(() => {
    if (utils.validateEmail(email)) {
      setValidEmail(true);
    } else {
      setValidEmail(false);
    }
  }, [email]);

  return (
    <section>
      {!address ? (
        <div className="text-wise-grey text-center">
          Connect your wallet to see your profile
        </div>
      ) : (
        <div className="container flex flex-col-reverse items-center mt-14 lg:mt-28">
          <div className="flex flex-col items-center">
            <h2 className="heading md:text-4 lg:text-5xl mb-6">Profile</h2>
            {user == null || user.email === '' || user.email === null ? (
              <div className="flex flex-col justify-center items-center">
                <p className="text-wise-grey sub-heading mb-6">
                  Insert your email to send you notifications when needed.
                </p>
                <div className="flex flex-col items-start">
                  <div className="flex justify-center items-baseline flex-row gap-6">
                    <input
                      className="input"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
                      type="button"
                      disabled={!validEmail && true}
                      className={validEmail ? 'btn btn-purple' : 'btn-disabled'}
                      onClick={handleEmail}
                      title={
                        validEmail === false &&
                        email !== '' &&
                        'Insert a valid email'
                      }
                    >
                      Add Email
                    </button>
                  </div>
                  {validEmail === false && email !== '' && (
                    <div className="flex flex-row gap-2 items-baseline">
                      <i className="fa fa-circle-exclamation text-red-500 text-sm" />
                      <p className="text-red-500 text-sm">
                        Please, insert a valid email
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <EditProfile />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
