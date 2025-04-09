import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await axios.get(
            "http://localhost:55009/api/userRouter/getUser",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          localStorage.setItem("token", token);
          setUser(res.data.user);
        } catch (error) {
          console.error("Không thể lấy dữ liệu user", error);
          setToken(null);
          setUser(null);
          localStorage.removeItem("token");
        }
      }
    };
    fetchUser();
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
