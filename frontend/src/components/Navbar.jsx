import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Logo from "../img/logo.png";

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);

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
          {["art", "science", "technology", "cinema", "design", "food"].map((cat) => (
            <Link className="link" to={`/?cat=${cat}`} key={cat}>
              <h6>{cat.toUpperCase()}</h6>
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
