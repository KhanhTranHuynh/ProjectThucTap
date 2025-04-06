// PrivateRoute.js
import { Navigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";

const PrivateRoute = ({ element }) => {
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
        console.log("first", response.data.role);
        setUserRole(response.data.role);
      } catch (error) {
        console.error("Error fetching role:", error);
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (userRole !== "admin") {
    return <Navigate to="/" />;
  }

  return element;
};

export default PrivateRoute;
