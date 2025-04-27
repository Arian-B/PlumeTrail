import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: ""
  });
  const [err, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      console.log('[Register] Registration payload:', inputs);
      await axios.post("/api/users/register", inputs);
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message || err.response?.data?.error || "Registration failed. Please try again.");
      console.error("[Register] Registration failed:", err);
    }
  };

  return (
    <div className="register-page-bg">
      <div className="register-box">
        <div className="register-title">Register</div>
        <form className="register-form" onSubmit={handleSubmit}>
          <input
            required
            type="text"
            placeholder="username"
            name="username"
            value={inputs.username}
            onChange={handleChange}
            className="register-input"
            autoComplete="username"
          />
          <input
            required
            type="password"
            placeholder="password"
            name="password"
            value={inputs.password}
            onChange={handleChange}
            className="register-input"
            autoComplete="new-password"
          />
          <button type="submit" className="register-btn">Register</button>
          {err && <div className="register-error">{err}</div>}
        </form>
        <div className="register-extra">
          Already an user?{' '}
          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
