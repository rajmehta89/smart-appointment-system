import { useQuery } from 'react-query';
import {
  CalendarIcon,
  TicketIcon,
  UserGroupIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const stats = [
  { name: 'Total Appointments', value: '120', icon: CalendarIcon },
  { name: 'Active Tokens', value: '15', icon: TicketIcon },
  { name: 'Customers Today', value: '45', icon: UserGroupIcon },
  { name: 'Average Wait Time', value: '12 mins', icon: ClockIcon },
];

const chartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Appointments',
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Weekly Appointments',
    },
  },
};

export default function Dashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon
                  className="h-8 w-8 text-primary-600"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">
                    {stat.name}
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="mt-8">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
        <div className="mt-4 overflow-hidden rounded-lg bg-white shadow">
          <ul role="list" className="divide-y divide-gray-200">
            <li className="px-6 py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <CalendarIcon className="h-6 w-6 text-primary-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    New appointment booked
                  </p>
                  <p className="truncate text-sm text-gray-500">
                    John Doe - Dental Checkup
                  </p>
                </div>
                <div>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    5m ago
                  </span>
                </div>
              </div>
            </li>
            {/* Add more activity items here */}
          </ul>
        </div>
      </div>
    </div>
  );
}