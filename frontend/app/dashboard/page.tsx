"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { BarChart3, Calendar, User, LogOut, Plus } from "lucide-react";

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
  const { user, logout } = useAuth(); // Assume logout is provided by AuthContext
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile toggle

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (user.role === "admin") {
      router.push("/admin/dashboard");
      return;
    }
    fetchServices();
    fetchUpcomingAppointments();
  }, [user, router]);

  const fetchServices = async () => {
    try {
      const response = await fetch("http://localhost:8095/api/v1/services");
      if (!response.ok) throw new Error("Failed to fetch services");
      const data = await response.json();
      console.log("Fetched services:", data);
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
      setFormError("Failed to load services. Please try again.");
    }
  };

  const fetchUpcomingAppointments = async () => {
    try {
      const response = await fetch("http://localhost:8095/api/v1/appointments/upcoming", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch appointments");
      const data = await response.json();
      console.log("Fetched appointments:", data);
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setFormError("Failed to load appointments. Please try again.");
    }
  };

  const handleDateChange = async (date: string) => {
    setSelectedDate(date);
    setSelectedTime(""); // Reset time when date changes
    try {
      const response = await fetch(`http://localhost:8095/api/v1/appointments/available-slots?date=${date}`);
      if (!response.ok) throw new Error("Failed to fetch slots");
      const slots = await response.json();
      console.log("Available slots:", slots);
      setAvailableSlots(slots);
    } catch (error) {
      console.error("Error fetching available slots:", error);
      setFormError("Failed to load available time slots. Please try again.");
    }
  };

  const handleBookAppointment = async () => {
    setFormError(null);
    setFormSuccess(null);
    if (!selectedService || !selectedDate || !selectedTime) {
      setFormError("Please select a service, date, and time.");
      return;
    }

    try {
      const dateTime = `${selectedDate}T${selectedTime}`;
      const response = await fetch("http://localhost:8095/api/v1/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          serviceId: selectedService,
          dateTime: dateTime,
        }),
      });

      if (response.ok) {
        setFormSuccess("Appointment booked successfully!");
        fetchUpcomingAppointments();
        console.log("Appointment booked:", { serviceId: selectedService, dateTime });
        setSelectedDate("");
        setSelectedTime("");
        setSelectedService(null);
        setAvailableSlots([]);
      } else {
        const error = await response.json();
        setFormError(error.message || "Failed to book appointment.");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      setFormError("Failed to book appointment. Please try again.");
    }
  };

  const handleLogout = () => {
    logout(); // Clear auth state
    localStorage.removeItem("token"); // Clear token
    router.push("/login");
  };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "book", label: "Book Appointment", icon: Plus },
    { id: "appointments", label: "My Appointments", icon: Calendar },
    { id: "profile", label: "Profile", icon: User },
    { id: "logout", label: "Logout", icon: LogOut, onClick: handleLogout },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name || "User"}!</h2>
              <p className="text-gray-600">Book your next appointment or view your upcoming schedule below.</p>
            </div>

            {/* Services Overview */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Available Services</h2>
              {services.length === 0 ? (
                <p className="text-gray-500">No services available at the moment.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.map((service) => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <h3 className="font-medium text-lg">{service.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-sm text-gray-500">{service.duration} mins</span>
                        <span className="font-semibold text-green-600">${service.price}</span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedService(service.id);
                          setActiveTab("book");
                        }}
                        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                      >
                        Book Now
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case "book":
        return (
          <div className="space-y-8">
            {/* Book New Appointment Section */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Book New Appointment</h2>
              {formError && <p className="text-red-500 mb-4">{formError}</p>}
              {formSuccess && <p className="text-green-500 mb-4">{formSuccess}</p>}

              {/* Service Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Service</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={selectedService || ""}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              {/* Time Slot Selection */}
              {selectedDate && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                  >
                    <option value="">Choose a time...</option>
                    {availableSlots.length === 0 ? (
                      <option value="" disabled>
                        No slots available
                      </option>
                    ) : (
                      availableSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))
                    )}
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
          </div>
        );

      case "appointments":
        return (
          <div className="space-y-8">
            {/* Upcoming Appointments Section */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">My Appointments</h2>
              {appointments.length === 0 ? (
                <p className="text-gray-500">No upcoming appointments.</p>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="border border-gray-200 rounded-md p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{appointment.serviceName}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(appointment.dateTime).toLocaleString()}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            appointment.status === "SCHEDULED"
                              ? "bg-green-100 text-green-800"
                              : appointment.status === "CANCELLED"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="space-y-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Profile</h2>
              <p className="text-gray-600">Profile management coming soon.</p>
              <div className="mt-4">
                <p className="text-sm text-gray-700">
                  <strong>Name:</strong> {user?.name || "N/A"}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Email:</strong> {user?.email || "N/A"}
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!user || user.role === "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-sm border-r transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-900">Client Dashboard</h1>
          <p className="text-sm text-gray-500">Manage your appointments</p>
        </div>
        <nav className="mt-6">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.onClick) {
                    item.onClick();
                  } else {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false); // Close sidebar on mobile
                  }
                }}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-50 transition-colors ${
                  activeTab === item.id ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700" : "text-gray-700"
                }`}
                aria-label={`Navigate to ${item.label}`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Sidebar Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 p-6">
        <div className="max-w-7xl mx-auto">{renderContent()}</div>
      </div>
    </div>
  );
}