import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContexProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  // ✅ Fix endpoint: your backend route is /api/login, not /auth/login
  const login = async (inputs) => {
    const res = await axios.post("/api/login", inputs, {
      withCredentials: true, // 🔐 for sending cookies with request
    });
    setCurrentUser(res.data);
  };

  const logout = async () => {
    await axios.post("/api/login/logout", {}, {
      withCredentials: true, // 🔐 make sure we send the cookie for clearing
    });
    setCurrentUser(null);
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
