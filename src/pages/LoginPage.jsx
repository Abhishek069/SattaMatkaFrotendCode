// src/components/LoginPage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import navigate
import {api} from '../lib/api';

const LoginPage = () => {
  const [formData, setFormData] = useState({ mobile: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate(); // ✅ Hook to navigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const { mobile, password } = formData;

    const data = await api("/user/authorize", {
            method: "POST",
            body: JSON.stringify({ mobile, password}),
          });
    
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("userRole", data.role);

    if (!mobile || !password) {
      setError("Both fields are required.");
      return;
    }
    if (data.success){
        navigate("/"); // ✅ Redirect to HomePage
    }
    // ✅ Dummy login logic
    // if (email === "admin@example.com" && password === "1234") {
    //   // alert("Login successful!");
    // } else {
    //   setError("Invalid email or password.");
    // }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100 shadow rounded overflow-hidden" style={{ maxWidth: "900px" }}>
        {/* Left Side (Visible only on large screens) */}
        <div className="col-lg-6 d-none d-lg-flex bg-primary text-white flex-column align-items-center justify-content-center p-5">
          <h2 className="fw-bold mb-3">Welcome Back!</h2>
          <p className="text-center">Trade smarter with our real-time trading platform</p>
        </div>

        {/* Right Side (Login Form) */}
        <div className="col-12 col-lg-6 bg-white p-5">
          <h2 className="mb-2 text-center">Satta Matka Aajj Tak</h2>
          <h3 className="mb-4 text-center">Login to Your Account</h3>

          {error && (
            <div className="alert alert-danger text-center py-2">{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-medium">
                Mobile No
              </label>
              <input
                type="text"
                className="form-control"
                id="mobile"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Mobile No"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-medium">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Sign In
              </button>
            </div>
          </form>

          <p className="text-center text-muted mt-4">
            Don’t have an account?{" "}
            Please connect to the below email or no xxxxx@xxx.com 3453334455
            {/* <a href="#" className="text-primary">
              Sign up
            </a> */}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
