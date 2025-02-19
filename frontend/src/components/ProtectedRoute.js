import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  console.log("Token:", token);  // Debugging: log the token
  console.log("Role:", role);    // Debugging: log the role

  // If there's no token, redirect to login page
  if (!token) {
    console.log("No token found. Redirecting to login...");
    return <Navigate to="/login" />;
  }

  // If the role doesn't match the requiredRole, redirect to home or default page
  if (requiredRole && requiredRole !== role) {
    console.log(`Role mismatch: expected ${requiredRole}, but got ${role}. Redirecting to home...`);
    return <Navigate to="/" />;
  }

  return children;  // Allow access if token and role are valid
};

export default ProtectedRoute;
