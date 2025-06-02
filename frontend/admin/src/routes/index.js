import { Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';
import BookAppointment from '../pages/appointments/BookAppointment';
import UpcomingAppointments from '../pages/appointments/UpcomingAppointments';
import Services from '../pages/services/Services';
import NotFound from '../pages/NotFound';

// Protected Route wrapper component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Layout>{children}</Layout>;
};

// Public Route wrapper component (accessible only when not logged in)
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

const routes = [
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    )
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    )
  },
  {
    path: '/appointments/book',
    element: (
      <ProtectedRoute>
        <BookAppointment />
      </ProtectedRoute>
    )
  },
  {
    path: '/appointments/upcoming',
    element: (
      <ProtectedRoute>
        <UpcomingAppointments />
      </ProtectedRoute>
    )
  },
  {
    path: '/services',
    element: (
      <ProtectedRoute>
        <Services />
      </ProtectedRoute>
    )
  },
  {
    path: '*',
    element: <NotFound />
  }
];

export default routes; 