import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!user || user.role !== 'admin') {
    // If not admin, redirect to home or a restricted page
    alert('Access Denied: Admin role required');
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
