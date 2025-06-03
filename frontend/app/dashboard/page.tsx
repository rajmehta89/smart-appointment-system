'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface Service {
  id: number;
  name: string;
  description: string;
  duration: number;
  price: number;
}

interface Appointment {
  id: number;
  serviceId: number;
  serviceName: string;
  dateTime: string;
  status: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchServices();
    fetchUpcomingAppointments();
  }, [user]);

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/services');
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchUpcomingAppointments = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/appointments/upcoming', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handleDateChange = async (date: string) => {
    setSelectedDate(date);
    try {
      const response = await fetch(`http://localhost:8080/api/v1/appointments/available-slots?date=${date}`);
      const slots = await response.json();
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error fetching available slots:', error);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      alert('Please select a service, date, and time');
      return;
    }

    try {
      const dateTime = `${selectedDate}T${selectedTime}`;
      const response = await fetch('http://localhost:8080/api/v1/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          serviceId: selectedService,
          dateTime: dateTime
        })
      });

      if (response.ok) {
        alert('Appointment booked successfully!');
        fetchUpcomingAppointments();
        // Reset form
        setSelectedDate('');
        setSelectedTime('');
        setSelectedService(null);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to book appointment');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        {/* Book New Appointment Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Book New Appointment</h2>
          
          {/* Service Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Service
            </label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={selectedService || ''}
              onChange={(e) => setSelectedService(Number(e.target.value))}
            >
              <option value="">Choose a service...</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name} - ${service.price} ({service.duration} mins)
                </option>
              ))}
            </select>
          </div>

          {/* Date Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Time Slot Selection */}
          {selectedDate && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Time
              </label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              >
                <option value="">Choose a time...</option>
                {availableSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleBookAppointment}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Book Appointment
          </button>
        </div>

        {/* Upcoming Appointments Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
          {appointments.length === 0 ? (
            <p className="text-gray-500">No upcoming appointments</p>
          ) : (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border border-gray-200 rounded-md p-4"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{appointment.serviceName}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(appointment.dateTime).toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      appointment.status === 'SCHEDULED' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 