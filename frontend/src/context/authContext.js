import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    const res = await axios.post("/api/login", inputs, {
      withCredentials: true,
    });
    setCurrentUser(res.data.user);
    // Optionally store JWT if backend returns it
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }
  };

  const logout = async () => {
    // If you have a backend logout endpoint, call it here
    // await axios.post("/api/login/logout", {}, { withCredentials: true });
    setCurrentUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("user");
    }
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
