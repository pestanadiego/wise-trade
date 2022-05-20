/* eslint-disable react/style-prop-object */
import { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import utils from '../../utils/utils';

export default function History() {
  const { address } = useContext(UserContext);

  return (
    <section>
      <div className="container flex flex-col-reverse items-center mt-14 lg:mt-28 mb-9">
        <div className="overflow-x-auto">
          <div className="min-w-screen min-h-scree flex overflow-hidden">
            <div className="w-full lg:w-5/6">
              <div className="bg-white shadow-md rounded my-3">
                <table className="min-w-max w-full table-auto">
                  <thead>
                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-left">From</th>
                      <th className="py-3 px-6 text-left">To</th>
                      <th className="py-3 px-6 text-center">Age</th>
                      <th className="py-3 px-6 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm font-light">
                    <tr className="border-b border-gray-200 bg-gray-50 hover:bg-gray-100">
                      <td className="py-3 px-9 text-left whitespace-nowrap">
                        {utils.truncateAddress(address)}
                      </td>
                      <td className="py-3 px-9 text-left">
                        {utils.truncateAddress(address)}
                      </td>
                      <td className="py-3 px-9 text-center" />
                      <td className="py-3 px-9 text-center">
                        <span className="bg-green-200 text-green-600 py-1 px-6 rounded-full text-xs">
                          Completed
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
