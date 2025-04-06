import { Navigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";

const PrivateRoute = ({ element, requiredRole }) => {
  const { token } = useContext(AuthContext);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/userRouter/getUserRole?token=${encodeURIComponent(
            token
          )}`
        );
        console.log("Role from API:", response.data.role); // Debug role
        setUserRole(response.data.role);
      } catch (error) {
        console.error("Error fetching role:", error);
        setUserRole(null); // Nếu lỗi, không gán role
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [token]);

  if (loading) {
    return <div>Loading...</div>; // Có thể thay bằng spinner
  }

  // Nếu không có token, chuyển hướng về /login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Nếu route yêu cầu vai trò cụ thể (như "admin") và userRole không khớp
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" />;
  }

  // Nếu có token (đã đăng nhập), cho phép truy cập element
  return element;
};

export default PrivateRoute;
