"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

type Staff = {
  id: number;
  name: string;
  experience: string;
  contact: string;
};

type Service = {
  id: number;
  name: string;
  description: string;
  staffId: number;
};

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [staffForm, setStaffForm] = useState({
    name: "",
    experience: "",
    contact: "",
  });
  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    staffId: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (user?.role !== "admin") {
      router.push("/dashboard");
    }
  }, [isAuthenticated, user, router]);

  // Add staff
  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    setStaffList([
      ...staffList,
      {
        id: Date.now(),
        name: staffForm.name,
        experience: staffForm.experience,
        contact: staffForm.contact,
      },
    ]);
    setStaffForm({ name: "", experience: "", contact: "" });
  };

  // Add service
  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    setServices([
      ...services,
      {
        id: Date.now(),
        name: serviceForm.name,
        description: serviceForm.description,
        staffId: Number(serviceForm.staffId),
      },
    ]);
    setServiceForm({ name: "", description: "", staffId: "" });
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name}!
          </h1>
          <p className="mt-2 text-gray-600">Business Dashboard</p>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Stats Cards */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="rounded-md bg-blue-500 p-3">
                      {/* Calendar Icon */}
                      <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Today's Appointments
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">0</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="rounded-md bg-green-500 p-3">
                      {/* Users Icon */}
                      <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Clients
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">0</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="rounded-md bg-indigo-500 p-3">
                      {/* Chart Icon */}
                      <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Monthly Revenue
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">$0</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Recent Activity
                </h3>
              </div>
              <div className="border-t border-gray-200">
                <div className="px-4 py-5 sm:p-6">
                  <p className="text-gray-500">No recent activity</p>
                </div>
              </div>
            </div>
          </div>

          {/* Staff Management */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-2">Add Staff</h2>
            <form
              onSubmit={handleAddStaff}
              className="mb-4 flex flex-col gap-2"
            >
              <input
                type="text"
                placeholder="Name"
                value={staffForm.name}
                onChange={(e) =>
                  setStaffForm({ ...staffForm, name: e.target.value })
                }
                required
                className="border p-2"
              />
              <input
                type="text"
                placeholder="Experience"
                value={staffForm.experience}
                onChange={(e) =>
                  setStaffForm({ ...staffForm, experience: e.target.value })
                }
                required
                className="border p-2"
              />
              <input
                type="text"
                placeholder="Contact"
                value={staffForm.contact}
                onChange={(e) =>
                  setStaffForm({ ...staffForm, contact: e.target.value })
                }
                required
                className="border p-2"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Add Staff
              </button>
            </form>
            <ul>
              {staffList.map((staff) => (
                <li key={staff.id} className="mb-2">
                  <strong>{staff.name}</strong> - {staff.experience} -{" "}
                  {staff.contact}
                </li>
              ))}
            </ul>
          </section>

          {/* Service Management */}
          <section>
            <h2 className="text-xl font-semibold mb-2">Add Service</h2>
            <form
              onSubmit={handleAddService}
              className="mb-4 flex flex-col gap-2"
            >
              <input
                type="text"
                placeholder="Service Name"
                value={serviceForm.name}
                onChange={(e) =>
                  setServiceForm({ ...serviceForm, name: e.target.value })
                }
                required
                className="border p-2"
              />
              <input
                type="text"
                placeholder="Description"
                value={serviceForm.description}
                onChange={(e) =>
                  setServiceForm({ ...serviceForm, description: e.target.value })
                }
                required
                className="border p-2"
              />
              <select
                value={serviceForm.staffId}
                onChange={(e) =>
                  setServiceForm({ ...serviceForm, staffId: e.target.value })
                }
                required
                className="border p-2"
              >
                <option value="">Select Staff</option>
                {staffList.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Add Service
              </button>
            </form>
            <ul>
              {services.map((service) => {
                const staff = staffList.find((s) => s.id === service.staffId);
                return (
                  <li key={service.id} className="mb-2">
                    <strong>{service.name}</strong> - {service.description} (Staff:{" "}
                    {staff?.name || "N/A"})
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}