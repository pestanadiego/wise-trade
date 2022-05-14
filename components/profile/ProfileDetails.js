import Link from 'next/link';
import { useContext, useState } from 'react';
// eslint-disable-next-line import/named
import { UserContext } from '../../context/UserContext';
import client from '../../lib/sanityClient';
import EditProfile from './EditProfile';

export default function ProfileDetails() {
  const { address, user, setUser } = useContext(UserContext);
  const [email, setEmail] = useState('');

  const handleEmail = async () => {
    setUser({ ...user, email });
    // eslint-disable-next-line no-unused-vars
    const update = await client.patch(address).set({ email }).commit();
    alert('Your email address was added successfully');
  };

  return (
    <section>
      {!address ? (
        <div>Connect your wallet to see your profile</div>
      ) : (
        <div className="container flex flex-col-reverse items-center mt-14 lg:mt-28">
          <div className="flex flex-col items-center">
            <h2 className="text-wise-blue text-3xl md:text-4 lg:text-5xl text-center mb-6">
              Profile
            </h2>
            {user.email === '' || user.email === null ? (
              <div>
                <p className="text-wise-grey text-lg text-center mb-6">
                  Insert your email to send you notifications when needed.
                </p>
                <div className="flex justify-center items-center flex-row gap-6">
                  <input
                    className="input"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-purple hover:bg-wise-white hover:text-black"
                    onClick={handleEmail}
                  >
                    <Link href="/">Add Email</Link>
                  </button>
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
