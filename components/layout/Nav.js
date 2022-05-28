import { useContext, useState } from 'react';
import Link from 'next/link';
import { UserContext } from '../../context/UserContext';
import utils from '../../utils/utils';

export default function Nav() {
  const [showMenu, setShowMenu] = useState(false);
  const { address, connectWallet, disconnectWallet } = useContext(UserContext);

  const handleMenu = async () => {
    setShowMenu(!showMenu);
  };
  return (
    <header>
      <nav className="container flex items-baseline flex-col sm:flex-row py-4 mt-4 sm:mt-12">
        <div className="py-1">
          <Link href="/">
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-wise-blue to-wise-purple font-bold text-3xl pb-6 cursor-pointer">
              Wise
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-wise-purple to-wise-red">
                Trade
              </span>
            </p>
          </Link>
        </div>{' '}
        {/* LOGO AQUI */}
        <ul className="sm:flex flex-1 justify-end items-center gap-12 text-wise-blue uppercase text-xs">
          <li className="invisible sm:visible cursor-pointer">
            <Link href="/trade">Make a trade</Link>
          </li>
          <li className="invisible sm:visible cursor-pointer">
            <Link href="/approveTrades">Pending Trades</Link>
          </li>
          <li className="invisible sm:visible cursor-pointer">
            <Link href="/history">Trade History</Link>
          </li>
          {!address ? (
            <button
              type="button"
              className="btn btn-purple px-7 py-3 uppercase"
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
      </nav>
    </header>
  );
}
