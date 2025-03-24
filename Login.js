import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    
    const adminEmail = "admin@opium.com";
    const adminPassword = "admin123";
    
    if (email === adminEmail && password === adminPassword) {
      localStorage.setItem("username", "Admin");
      localStorage.setItem("isAdmin", "true");
      navigate("/dashboard");
      return;
    }
    
    const userData = JSON.parse(localStorage.getItem("userData"));

    if (userData && userData.email === email && userData.password === password) {
      localStorage.setItem("username", userData.firstName);
      localStorage.setItem("isAdmin", "false");
      navigate("/dashboard");
    } else {
      setError("Invalid email or password.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="eye-icon" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="login-btn">
          Login
        </button>
      </form>
      <p>
        Don't have an account?{" "}
        <span onClick={() => navigate("/signup")} style={{ cursor: "pointer", color: "var(--accent-red)" }}>
          Sign Up
        </span>
      </p>
    </div>
  );
};

export default Login;
