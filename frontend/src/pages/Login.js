import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import "./Login.css";

const Login = () => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [err, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login(inputs);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || err.response?.data?.error || "Login failed. Please try again."
      );
      console.error("[Login] Login failed:", err);
    }
  };

  return (
    <div className="login-page-bg">
      <div className="login-box">
        <div className="login-title">Login</div>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            required
            type="text"
            placeholder="username"
            name="username"
            value={inputs.username}
            onChange={handleChange}
            className="login-input"
            autoComplete="username"
          />
          <input
            required
            type="password"
            placeholder="password"
            name="password"
            value={inputs.password}
            onChange={handleChange}
            className="login-input"
            autoComplete="current-password"
          />
          <button type="submit" className="login-btn">Login</button>
          {err && <div className="login-error">{err}</div>}
        </form>
        <div className="login-extra">
          New here?{' '}
          <Link to="/register">Register now</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
