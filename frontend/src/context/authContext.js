import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    const res = await axios.post("http://localhost:8800/api/login", inputs, {
      withCredentials: true, // Allow credentials (cookies)
    });
    setCurrentUser(res.data); // Set the user state with the response data
  };

  const logout = async () => {
    await axios.post("/api/login/logout", {}, {
      withCredentials: true, // Ensure credentials (cookies) are sent
    });
    setCurrentUser(null); // Clear the user state
  };

  useEffect(() => {
    // Save currentUser to localStorage whenever it changes
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
