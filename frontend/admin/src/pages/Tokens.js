import { useQuery } from 'react-query';
import {
  TicketIcon,
  ArrowPathIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function Tokens() {
  const { data: queueStatus, isLoading: isLoadingStatus } = useQuery(
    'queueStatus',
    async () => {
      const response = await fetch('http://localhost/api/v1/tokens/queue', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch queue status');
      }
      return response.json();
    }
  );

  const handleCallNext = async () => {
    try {
      const response = await fetch('http://localhost/api/v1/tokens/next', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to call next token');
      }

      toast.success('Called next token successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleComplete = async (id) => {
    try {
      const response = await fetch(`http://localhost/api/v1/tokens/${id}/complete`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to complete token');
      }

      toast.success('Token completed successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Token Management</h1>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            type="button"
            onClick={handleCallNext}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <ArrowPathIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Call Next
          </button>
        </div>
      </div>

      {/* Queue Status */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TicketIcon className="h-8 w-8 text-primary-600" aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500">
                  Current Token
                </dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                  {isLoadingStatus ? '...' : queueStatus?.currentToken || 'None'}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TicketIcon className="h-8 w-8 text-primary-600" aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500">
                  Waiting Count
                </dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                  {isLoadingStatus ? '...' : queueStatus?.waitingCount || 0}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TicketIcon className="h-8 w-8 text-primary-600" aria-hidden="true" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="truncate text-sm font-medium text-gray-500">
                  Est. Wait Time
                </dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                  {isLoadingStatus ? '...' : `${queueStatus?.estimatedWaitMins || 0} mins`}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Token List */}
      <div className="mt-8">
        <div className="overflow-hidden bg-white shadow sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {/* Example token items - replace with actual data */}
            <li>
              <div className="flex items-center px-4 py-4 sm:px-6">
                <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <div className="flex items-center">
                      <p className="truncate text-sm font-medium text-primary-600">
                        Token #123
                      </p>
                      <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                        Waiting
                      </span>
                    </div>
                    <div className="mt-2 flex">
                      <div className="flex items-center text-sm text-gray-500">
                        <p>John Doe • General Checkup</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex-shrink-0 sm:mt-0">
                    <button
                      type="button"
                      onClick={() => handleComplete('123')}
                      className="inline-flex items-center rounded-md bg-green-50 px-3 py-2 text-sm font-semibold text-green-700 shadow-sm hover:bg-green-100"
                    >
                      <CheckCircleIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                      Complete
                    </button>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 