import { useContext, useState } from 'react';
import Link from 'next/link';
import { UserContext } from '../../context/UserContext';
import utils from '../../utils/utils';

export default function Nav() {
  const [showMenu, setShowMenu] = useState(false);
  const { address, connectWallet, disconnectWallet } = useContext(UserContext);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const handleMenu = async () => {
    setShowMenu(!showMenu);
  };
  return (
    <>
      <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 mb-3">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full py-4 relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
          <Link href="/">
            <p className="text-gray-800 font-bold text-3xl pb-6 cursor-pointer">
              Wise<span className="text-wise-purple">Trade</span>
            </p>
          </Link>
            <button
              className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <i className="fas fa-bars text-wise-purple"></i>
            </button>
          </div>
          <div
            className={
              "lg:flex flex-grow items-center" +
              (navbarOpen ? " flex" : " hidden")
            }
            id="example-navbar-danger"
          >
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto text-wise-blue uppercase text-xs">
              <li className="nav-item px-4 py-3">
                <Link href="/trade">Make a trade</Link>
              </li>
              <li className="nav-item px-4 py-3">
              <Link href="/approveTrades">Pending Trades</Link>
              </li>
              <li className="nav-item px-4 py-3">
              <Link href="/history">Trade History</Link>
              </li>
              <li className="nav-item px-4 py-3">
              <Link href="/myListings">My Listings</Link>
              </li>
              {!address ? (
            <button
              type="button"
              className="btn btn-purple px-4 py-3 uppercase"
              onClick={connectWallet}
            >
              Connect
            </button>
          ) : (
            <div className="flex gap-3">
              <Link href="/profile">
                <button
                  type="button"
                  className="btn btn-white"
                  onClick={handleMenu}
                >
                  {utils.truncateAddress(address)}
                </button>
              </Link>
              <Link href="/">
                <button
                  type="button"
                  className="btn btn-purple px-4 py-3"
                  onClick={disconnectWallet}
                >
                  <i className="fa fa-power-off" />
                </button>
              </Link>
            </div>
          )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
