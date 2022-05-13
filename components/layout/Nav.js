import { useContext } from 'react';
import Link from 'next/link';
import { UserContext } from '../../context/UserContext';

export default function Nav() {
  const { user, connectWallet, disconnectWallet } = useContext(UserContext);

  return (
    <header>
      <nav className="container flex items-center flex-col sm:flex-row py-4 mt-4 sm:mt-12">
        <div className="py-1">
          <Link href="/">Wise Trade</Link>
        </div>{' '}
        {/* LOGO AQUI */}
        <ul className="sm:flex flex-1 justify-end items-center gap-12 text-wise-blue uppercase text-xs">
          <li className="invisible sm:visible cursor-pointer">
            <Link href="/trade">Make a trade</Link>
          </li>
          <li className="invisible sm:visible cursor-pointer">
            <Link href="/history">Trade History</Link>
          </li>
          {!user ? (
            <button
              type="button"
              className="bg-wise-red text-white rounded-md px-7 py-3 uppercase"
              onClick={connectWallet}
            >
              Connect
            </button>
          ) : (
            <button
              type="button"
              className="bg-wise-red text-white rounded-md px-7 py-3 uppercase"
              onClick={disconnectWallet}
            >
              Disconnect
            </button>
          )}
        </ul>
      </nav>
    </header>
  );
}
