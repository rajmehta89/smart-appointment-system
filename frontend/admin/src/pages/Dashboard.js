import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch upcoming appointments and services when component mounts
    fetchUpcomingAppointments();
    fetchServices();
  }, []);

  const fetchUpcomingAppointments = async () => {
    try {
      const response = await fetch('http://localhost:8095/api/v1/appointments/upcoming', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUpcomingAppointments(data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:8095/api/v1/services', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name || 'User'}</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Quick Actions */}
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <button
              onClick={() => navigate('/appointments/book')}
              className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900">Book Appointment</h2>
              <p className="mt-2 text-gray-600">Schedule a new appointment</p>
            </button>

            <button
              onClick={() => navigate('/appointments/upcoming')}
              className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Appointments</h2>
              <p className="mt-2 text-gray-600">View your scheduled appointments</p>
            </button>

            <button
              onClick={() => navigate('/services')}
              className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900">Services</h2>
              <p className="mt-2 text-gray-600">Browse available services</p>
            </button>
          </div>
        </div>

        {/* Upcoming Appointments Preview */}
        <div className="mt-8 px-4 sm:px-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Appointments</h2>
          {upcomingAppointments.length > 0 ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {upcomingAppointments.map((appointment) => (
                  <li key={appointment.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-primary-600">{appointment.serviceName}</p>
                        <p className="text-sm text-gray-500">{new Date(appointment.dateTime).toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => navigate(`/appointments/${appointment.id}`)}
                        className="text-sm text-primary-600 hover:text-primary-900"
                      >
                        View Details
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-gray-500">No upcoming appointments</p>
          )}
        </div>

        {/* Services Preview */}
        <div className="mt-8 px-4 sm:px-0">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Services</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white overflow-hidden shadow rounded-lg"
              >
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
                  <p className="mt-1 text-sm text-gray-500">{service.description}</p>
                  <p className="mt-2 text-sm font-semibold text-gray-900">${service.price}</p>
                  <button
                    onClick={() => navigate(`/appointments/book?service=${service.id}`)}
                    className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}