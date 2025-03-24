import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaCheck, FaTimes, FaInfoCircle } from "react-icons/fa";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(true);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;
    
    const parts = email.split("@");
    if (parts.length !== 2) return false;
    
    const domainParts = parts[1].split(".");
    return domainParts.length === 2;
  };

  const checkPasswordStrength = (password) => {
    if (!password) return "";
    const lengthScore = Math.min(password.length / 12, 1) * 0.4;
    let complexityScore = 0;
    if (/[A-Z]/.test(password)) complexityScore += 0.15;
    if (/[a-z]/.test(password)) complexityScore += 0.15;
    if (/[0-9]/.test(password)) complexityScore += 0.15;
    if (/[^A-Za-z0-9]/.test(password)) complexityScore += 0.15;
    
    const totalScore = lengthScore + complexityScore;
    
    if (totalScore < 0.3) return "Weak";
    if (totalScore < 0.6) return "Moderate";
    return "Strong";
  };

  const getPasswordRequirements = () => {
    const requirements = [
      { text: "At least 6 characters", met: password.length >= 6 },
      { text: "Contains uppercase letter", met: /[A-Z]/.test(password) },
      { text: "Contains lowercase letter", met: /[a-z]/.test(password) },
      { text: "Contains number", met: /[0-9]/.test(password) },
      { text: "Contains special character", met: /[^A-Za-z0-9]/.test(password) }
    ];
    
    return requirements;
  };

  const checkUsernameAvailability = (username) => {
    const existingUsers = JSON.parse(localStorage.getItem("allUsers")) || [];
    return !existingUsers.some(user => user.username === username);
  };

  const handleUsernameChange = (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    
    if (newUsername.length > 2) {
      setUsernameAvailable(checkUsernameAvailability(newUsername));
    }
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    if (!username || !email || !firstName || !lastName || !birthdate || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setEmailValid(false);
      return;
    } else {
      setEmailValid(true);
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setPasswordsMatch(false);
      return;
    } else {
      setPasswordsMatch(true);
    }
    
    if (passwordStrength === "Weak") {
      setError("Please choose a stronger password.");
      return;
    }
    
    if (!usernameAvailable) {
      setError("Username is already taken.");
      return;
    }

    const today = new Date();
    const birthDate = new Date(birthdate);
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 13) {
      setError("You must be at least 13 years old to register.");
      return;
    }

    const userData = {
      username,
      email,
      firstName,
      lastName,
      birthdate,
      password,
      registrationDate: new Date().toISOString(),
    };
    
    localStorage.setItem("userData", JSON.stringify(userData));
    const allUsers = JSON.parse(localStorage.getItem("allUsers")) || [];
    allUsers.push(userData);
    localStorage.setItem("allUsers", JSON.stringify(allUsers));
    setError("");
    alert("Account created successfully!");
    navigate("/");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordStrength(checkPasswordStrength(e.target.value));
    
    if (confirmPassword) {
      setPasswordsMatch(e.target.value === confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordsMatch(e.target.value === password);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailValid(validateEmail(e.target.value) || e.target.value === "");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="signup-container">
      <h2>Create Your Account</h2>
      <form onSubmit={handleSignup}>
        <div className="input-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            className={username && !usernameAvailable ? "input-error" : ""}
            required
          />
          {username && !usernameAvailable && (
            <div className="error-message">
              <FaTimes /> Username is already taken
            </div>
          )}
          {username && usernameAvailable && username.length > 2 && (
            <div className="success-message">
              <FaCheck /> Username is available
            </div>
          )}
        </div>
        
        <div className="input-group">
          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            className={email && !emailValid ? "input-error" : ""}
            required
          />
          {email && !emailValid && (
            <div className="error-message">
              <FaTimes /> Email must contain exactly 2 dots (e.g., example1.example2@edu.ph)
            </div>
          )}
        </div>
        
        <div className="input-row">
          <div className="input-group">
            <label>First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="input-group">
          <label>Birthdate</label>
          <input
            type="date"
            value={birthdate}
            onChange={(e) => setBirthdate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            required
          />
        </div>
        
        <div className="input-group">
          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={handlePasswordChange}
              className={formSubmitted && passwordStrength === "Weak" ? "input-error" : ""}
              required
            />
            <span className="eye-icon" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          
          {password && (
            <div className="password-requirements">
              <div className={`password-strength ${passwordStrength.toLowerCase()}`}>
                <span>Password Strength: </span>
                <span className="strength-text">{passwordStrength}</span>
              </div>
              
              <div className="requirements-list">
                {getPasswordRequirements().map((req, index) => (
                  <div key={index} className={`requirement ${req.met ? 'met' : 'not-met'}`}>
                    {req.met ? <FaCheck /> : <FaTimes />} {req.text}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="input-group">
          <label>Confirm Password</label>
          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className={confirmPassword && !passwordsMatch ? "input-error" : ""}
              required
            />
            <span className="eye-icon" onClick={toggleConfirmPasswordVisibility}>
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {confirmPassword && !passwordsMatch && (
            <div className="error-message">
              <FaTimes /> Passwords do not match
            </div>
          )}
          {confirmPassword && passwordsMatch && confirmPassword.length > 0 && (
            <div className="success-message">
              <FaCheck /> Passwords match
            </div>
          )}
        </div>
        
        {error && (
          <div className="error-message main-error">
            <FaInfoCircle /> {error}
          </div>
        )}
        
        <button type="submit" className="signup-btn">
          Create Account
        </button>
      </form>
      
      <p className="login-link">
        Already have an account?{" "}
        <span onClick={() => navigate("/")} style={{ cursor: "pointer", color: "var(--accent-red)" }}>
          Login
        </span>
      </p>
    </div>
  );
};

export default Signup;
