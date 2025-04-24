import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Logo from "../img/logo.png";
import axios from "axios";

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("/blogCategory");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleLogout = () => {
    logout().catch((err) => {
      console.error("Logout failed:", err);
    });
  };

  return (
    <div className="navbar">
      <div className="container">
        <div className="logo">
          <Link to="/">
            <img src={Logo} alt="PlumeTrail Logo" />
          </Link>
        </div>
        <div className="links">
          {categories.map((cat) => (
            <Link className="link" to={`/?cat=${cat.bc_title}`} key={cat.bc_id}>
              <h6>{cat.bc_title.toUpperCase()}</h6>
            </Link>
          ))}

          {currentUser ? (
            <>
              <span>{currentUser.username}</span>
              <span onClick={handleLogout} style={{ cursor: "pointer" }}>Logout</span>
              <span className="write">
                <Link className="link" to="/write">Write</Link>
              </span>
            </>
          ) : (
            <Link className="link" to="/login">Login</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
