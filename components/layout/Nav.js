import { useContext, Fragment, useState } from 'react';
import Link from 'next/link';
import { UserContext } from '../../context/UserContext';
import utils from '../../utils/utils';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';

export default function Nav() {
  const { address, connectWallet, disconnectWallet } = useContext(UserContext);
  const [navbarOpen, setNavbarOpen] = useState(false);

  return (
    <>
      <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 mb-3">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full py-4 relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <Link href="/">
              <p className="text-transparent bg-clip-text bg-wise-blue font-bold text-3xl pb-6 cursor-pointer">
                Wise
                <span className="text-transparent bg-clip-text bg-wise-purple">
                  Trade
                </span>
              </p>
            </Link>
            <div>
              <button
                className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
                type="button"
                onClick={() => setNavbarOpen(!navbarOpen)}
              >
                <i className="fas fa-bars text-wise-purple"></i>
              </button>
            </div>
          </div>
          <div
            className={
              'lg:flex flex-grow items-center' +
              (navbarOpen ? ' flex' : ' hidden')
            }
            id="example-navbar-danger"
          >
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto text-wise-blue uppercase text-xs">
              <li className="nav-item px-4 py-3">
                <Link href="/trade">Make a trade</Link>
              </li>
              <li className="nav-item px-4 py-3">
                <Link href="/marketPlace">Marketplace</Link>
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
                  <Menu as="div" className="relative inline-block text-left">
                    <div>
                      <Menu.Button className="inline-flex rounded-md btn btn-white hover:bg-wise-purple hover:text-white">
                        {utils.truncateAddress(address)}
                        <ChevronDownIcon
                          className="ml-2 -mr-1 h-5 w-5 text-violet-400 hover:text-violet-100"
                          aria-hidden="true"
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute z-20 right--5 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="px-1 py-1 ">
                          <Link href="/profile">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  className={`${
                                    active
                                      ? 'bg-wise-purple text-white'
                                      : 'text-gray-900'
                                  } group flex w-full items-center rounded-md px-2 py-2 text-xs`}
                                >
                                  {active ? (
                                    <i className="fas fa-user-alt px-2 text-white" />
                                  ) : (
                                    <i className="fas fa-user-alt px-2 text-wise-purple" />
                                  )}
                                  PROFILE
                                </button>
                              )}
                            </Menu.Item>
                          </Link>
                          <Link href="/myListings">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  className={`${
                                    active
                                      ? 'bg-wise-purple text-white'
                                      : 'text-gray-900'
                                  } group flex w-full items-center rounded-md px-2 py-2 text-xs`}
                                >
                                  {active ? (
                                    <i className="far fa-clipboard px-2 text-white" />
                                  ) : (
                                    <i className="far fa-clipboard px-2 text-wise-purple" />
                                  )}
                                  MY LISTINGS
                                </button>
                              )}
                            </Menu.Item>
                          </Link>
                        </div>
                        <div className="px-1 py-1">
                          <Link href="/approveTrades">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  className={`${
                                    active
                                      ? 'bg-wise-purple text-white'
                                      : 'text-gray-900'
                                  } group flex w-full items-center rounded-md px-2 py-2 text-xs`}
                                >
                                  {active ? (
                                    <i className="fas fa-hourglass-half px-2 text-white" />
                                  ) : (
                                    <i className="fas fa-hourglass-half px-2 text-wise-purple" />
                                  )}
                                  PENDING TRADES
                                </button>
                              )}
                            </Menu.Item>
                          </Link>
                          <Link href="/history">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  className={`${
                                    active
                                      ? 'bg-wise-purple text-white'
                                      : 'text-gray-900'
                                  } group flex w-full items-center rounded-md px-2 py-2 text-xs`}
                                >
                                  {active ? (
                                    <i className="fas fa-history px-2 text-white" />
                                  ) : (
                                    <i className="fas fa-history px-2 text-wise-purple" />
                                  )}
                                  TRADE HISTORY
                                </button>
                              )}
                            </Menu.Item>
                          </Link>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
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
