"use client";

import { useState, useMemo } from "react";
import { Users, Calendar, DollarSign, UserPlus, Settings, BarChart3, Plus, Phone, Mail, Clock } from "lucide-react";

type Staff = {
  id: number;
  name: string;
  experience: string;
  contact: string;
  email?: string;
  specialization?: string;
};

type Service = {
  id: number;
  name: string;
  description: string;
  staffIds: number[]; // Changed from staffId to staffIds
  price: number;
  duration: number; // in minutes
};

type Client = {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalBookings: number;
  lastVisit?: string;
};

type Booking = {
  id: number;
  clientId: number;
  serviceId: number;
  staffId: number;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  totalAmount: number;
};

export default function EnhancedAdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [staffList, setStaffList] = useState<Staff[]>([
    {
      id: 1,
      name: "Dr. Sarah Wilson",
      experience: "8 years",
      contact: "+91 98765 43210",
      email: "sarah@clinic.com",
      specialization: "Dermatology",
    },
    {
      id: 2,
      name: "John Miller",
      experience: "5 years",
      contact: "+91 98765 43211",
      email: "john@clinic.com",
      specialization: "Physiotherapy",
    },
  ]);

  const [services, setServices] = useState<Service[]>([
    {
      id: 1,
      name: "Skin Consultation",
      description: "Complete skin health checkup",
      staffIds: [1], // Updated to array
      price: 1500,
      duration: 45,
    },
    {
      id: 2,
      name: "Physical Therapy",
      description: "Rehabilitation and muscle therapy",
      staffIds: [2], // Updated to array
      price: 1200,
      duration: 60,
    },
  ]);

  const [clients, setClients] = useState<Client[]>([
    {
      id: 1,
      name: "Rajesh Patel",
      email: "rajesh@gmail.com",
      phone: "+91 99999 11111",
      totalBookings: 5,
      lastVisit: "2025-06-01",
    },
    {
      id: 2,
      name: "Priya Shah",
      email: "priya@gmail.com",
      phone: "+91 99999 22222",
      totalBookings: 3,
      lastVisit: "2025-06-03",
    },
    {
      id: 3,
      name: "Amit Kumar",
      email: "amit@gmail.com",
      phone: "+91 99999 33333",
      totalBookings: 8,
      lastVisit: "2025-06-05",
    },
  ]);

  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 1,
      clientId: 1,
      serviceId: 1,
      staffId: 1,
      date: "2025-06-06",
      time: "10:00",
      status: "confirmed",
      totalAmount: 1500,
    },
    {
      id: 2,
      clientId: 2,
      serviceId: 2,
      staffId: 2,
      date: "2025-06-06",
      time: "14:00",
      status: "confirmed",
      totalAmount: 1200,
    },
    {
      id: 3,
      clientId: 3,
      serviceId: 1,
      staffId: 1,
      date: "2025-06-07",
      time: "11:00",
      status: "pending",
      totalAmount: 1500,
    },
    {
      id: 4,
      clientId: 1,
      serviceId: 2,
      staffId: 2,
      date: "2025-06-07",
      time: "15:00",
      status: "confirmed",
      totalAmount: 1200,
    },
  ]);

  const [staffForm, setStaffForm] = useState({
    name: "",
    experience: "",
    contact: "",
    email: "",
    specialization: "",
  });

  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    staffIds: [] as string[], // Changed to array
    price: "",
    duration: "",
  });

  const [clientForm, setClientForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Calculate statistics
  const todayBookings = bookings.filter((b) => b.date === getCurrentDate());
  const monthlyRevenue = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + b.totalAmount, 0);
  const totalClients = clients.length;

  // Memoize client booking counts
  const clientBookingCounts = useMemo(() => {
    const counts: { [key: number]: number } = {};
    clients.forEach((client) => {
      counts[client.id] = bookings.filter((b) => b.clientId === client.id).length;
    });
    return counts;
  }, [bookings, clients]);

  const getClientBookings = (clientId: number) => {
    return clientBookingCounts[clientId] || 0;
  };

  // Handle form submissions with validation
  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    if (!staffForm.name || !staffForm.experience || !staffForm.contact) {
      setFormError("Please fill in all required fields.");
      return;
    }
    setStaffList([
      ...staffList,
      {
        id: Date.now(),
        name: staffForm.name,
        experience: staffForm.experience,
        contact: staffForm.contact,
        email: staffForm.email,
        specialization: staffForm.specialization,
      },
    ]);
    setStaffForm({ name: "", experience: "", contact: "", email: "", specialization: "" });
    setFormSuccess("Staff member added successfully!");
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    if (
      !serviceForm.name ||
      !serviceForm.description ||
      serviceForm.staffIds.length === 0 ||
      !serviceForm.price ||
      !serviceForm.duration ||
      isNaN(Number(serviceForm.price)) ||
      isNaN(Number(serviceForm.duration))
    ) {
      setFormError("Please fill in all required fields with valid values.");
      return;
    }
    setServices([
      ...services,
      {
        id: Date.now(),
        name: serviceForm.name,
        description: serviceForm.description,
        staffIds: serviceForm.staffIds.map(Number),
        price: Number(serviceForm.price),
        duration: Number(serviceForm.duration),
      },
    ]);
    setServiceForm({ name: "", description: "", staffIds: [], price: "", duration: "" });
    setFormSuccess("Service added successfully!");
  };

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    if (!clientForm.name || !clientForm.email || !clientForm.phone) {
      setFormError("Please fill in all required fields.");
      return;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientForm.email)) {
      setFormError("Please enter a valid email address.");
      return;
    }
    // Basic phone validation (e.g., starts with + and followed by digits)
    const phoneRegex = /^\+\d{10,}$/;
    if (!phoneRegex.test(clientForm.phone)) {
      setFormError("Please enter a valid phone number (e.g., +919999911111).");
      return;
    }
    setClients([
      ...clients,
      {
        id: Date.now(),
        name: clientForm.name,
        email: clientForm.email,
        phone: clientForm.phone,
        totalBookings: 0,
      },
    ]);
    setClientForm({ name: "", email: "", phone: "" });
    setFormSuccess("Client added successfully!");
  };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "clients", label: "Clients", icon: Users },
    { id: "staff", label: "Staff", icon: UserPlus },
    { id: "services", label: "Services", icon: Settings },
    { id: "bookings", label: "Bookings", icon: Calendar },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Today's Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">{todayBookings.length}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Clients</p>
                    <p className="text-2xl font-bold text-gray-900">{totalClients}</p>
                  </div>
                  <Users className="h-8 w-8 text-green-500" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Monthly Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">₹{monthlyRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-purple-500" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Staff</p>
                    <p className="text-2xl font-bold text-gray-900">{staffList.length}</p>
                  </div>
                  <UserPlus className="h-8 w-8 text-orange-500" />
                </div>
              </div>
            </div>

            {/* Client Booking Summary */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">Client Booking Summary</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {clients.map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-gray-500">{client.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{getClientBookings(client.id)} bookings</p>
                        <p className="text-sm text-gray-500">Last visit: {client.lastVisit || "Never"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">Recent Bookings</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {bookings.slice(0, 5).map((booking) => {
                    const client = clients.find((c) => c.id === booking.clientId);
                    const service = services.find((s) => s.id === booking.serviceId);
                    const staff = staffList.find((s) => s.id === booking.staffId);

                    return (
                      <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{client?.name}</p>
                          <p className="text-sm text-gray-500">
                            {service?.name} with {staff?.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">
                            {booking.date} at {booking.time}
                          </p>
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full ${
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : booking.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : booking.status === "completed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      case "clients":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Client Management</h2>
            </div>

            {/* Add Client Form */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Add New Client</h3>
              {formError && <p className="text-red-500 mb-4">{formError}</p>}
              {formSuccess && <p className="text-green-500 mb-4">{formSuccess}</p>}
              <form onSubmit={handleAddClient} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={clientForm.name}
                    onChange={(e) => setClientForm({ ...clientForm, name: e.target.value })}
                    required
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={clientForm.email}
                    onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
                    required
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      placeholder="Phone Number (e.g., +919999911111)"
                      value={clientForm.phone}
                      onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                      required
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Clients List */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">All Clients ({clients.length})</h3>
              </div>
              <div className="p-6">
                <div className="grid gap-4">
                  {clients.map((client) => (
                    <div
                      key={client.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{client.name}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Mail className="h-4 w-4" />
                              {client.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              {client.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{getClientBookings(client.id)} bookings</p>
                        <p className="text-sm text-gray-500">Last: {client.lastVisit || "Never"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "staff":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Staff Management</h2>
            </div>

            {/* Add Staff Form */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Add New Staff Member</h3>
              {formError && <p className="text-red-500 mb-4">{formError}</p>}
              {formSuccess && <p className="text-green-500 mb-4">{formSuccess}</p>}
              <form onSubmit={handleAddStaff} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={staffForm.name}
                    onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                    required
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Experience (e.g., 5 years)"
                    value={staffForm.experience}
                    onChange={(e) => setStaffForm({ ...staffForm, experience: e.target.value })}
                    required
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="tel"
                    placeholder="Contact Number (e.g., +919999911111)"
                    value={staffForm.contact}
                    onChange={(e) => setStaffForm({ ...staffForm, contact: e.target.value })}
                    required
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={staffForm.email}
                    onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Specialization"
                    value={staffForm.specialization}
                    onChange={(e) => setStaffForm({ ...staffForm, specialization: e.target.value })}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Staff
                  </button>
                </div>
              </form>
            </div>

            {/* Staff List */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">All Staff Members ({staffList.length})</h3>
              </div>
              <div className="p-6">
                <div className="grid gap-4">
                  {staffList.map((staff) => (
                    <div key={staff.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <UserPlus className="h-6 w-6 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{staff.name}</h4>
                            <p className="text-sm text-gray-500">{staff.specialization}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Experience: {staff.experience}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                            <Phone className="h-4 w-4" />
                            <span>{staff.contact}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "services":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Service Management</h2>
            </div>

            {/* Add Service Form */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Add New Service</h3>
              {formError && <p className="text-red-500 mb-4">{formError}</p>}
              {formSuccess && <p className="text-green-500 mb-4">{formSuccess}</p>}
              <form onSubmit={handleAddService} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Service Name"
                    value={serviceForm.name}
                    onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                    required
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    multiple
                    value={serviceForm.staffIds}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        staffIds: Array.from(e.target.selectedOptions, (option) => option.value),
                      })
                    }
                    required
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                  >
                    {staffList.map((staff) => (
                      <option key={staff.id} value={staff.id}>
                        {staff.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Price (₹)"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                    required
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Duration (minutes)"
                    value={serviceForm.duration}
                    onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                    required
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <textarea
                  placeholder="Service Description"
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Service
                </button>
              </form>
            </div>

            {/* Services List */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">All Services ({services.length})</h3>
              </div>
              <div className="p-6">
                <div className="grid gap-4">
                  {services.map((service) => {
                    const staffNames = service.staffIds
                      .map((id) => staffList.find((s) => s.id === id)?.name)
                      .filter(Boolean)
                      .join(", ");
                    return (
                      <div key={service.id} className="p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{service.name}</h4>
                            <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                            <p className="text-sm text-gray-500 mt-1">Staff: {staffNames || "N/A"}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">₹{service.price}</p>
                            <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                              <Clock className="h-4 w-4" />
                              <span>{service.duration} min</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      case "bookings":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Booking Management</h2>
            </div>

            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">All Bookings ({bookings.length})</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {bookings.map((booking) => {
                    const client = clients.find((c) => c.id === booking.clientId);
                    const service = services.find((s) => s.id === booking.serviceId);
                    const staff = staffList.find((s) => s.id === booking.staffId);

                    return (
                      <div key={booking.id} className="p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{client?.name}</h4>
                            <p className="text-sm text-gray-600">{service?.name}</p>
                            <p className="text-sm text-gray-500">with {staff?.name}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {booking.date} at {booking.time}
                            </p>
                            <p className="text-sm text-gray-600">₹{booking.totalAmount}</p>
                            <span
                              className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                                booking.status === "confirmed"
                                  ? "bg-green-100 text-green-800"
                                  : booking.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : booking.status === "completed"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r">
        <div className="p-6">
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Business Management</p>
        </div>

        <nav className="mt-6">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
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

      {/* Main Content */}
      <div className="flex-1 p-8">{renderContent()}</div>
    </div>
  );
}