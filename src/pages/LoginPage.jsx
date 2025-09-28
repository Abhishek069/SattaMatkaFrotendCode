// src/components/LoginPage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({ mobile: "", password: "" });
  // const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { mobile, password } = formData;

    if (!mobile || !password) {
      toast.error("Both fields are required.");
      return;
    }
    const data = await api("/user/authorize", {
        method: "POST",
        body: JSON.stringify({ mobile, password }),
      });

    console.log(data);
    
    
    try {
      const data = await api("/user/authorize", {
        method: "POST",
        body: JSON.stringify({ mobile, password }),
      });
      console.log(data);
      

      if (data.success) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userRole", data.role);

        toast.success("Login successful!");
        setTimeout(() => navigate("/"), 1500); // small delay before redirect
      } else {
        console.log(data.error);
        toast.error(data.error || "Unauthorized: Invalid credentials.");
      }
    } catch (err) {
      console.error("Login request failed:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div
        className="row w-100 shadow rounded overflow-hidden"
        style={{ maxWidth: "900px" }}
      >
        {/* Left Side */}
        <div className="col-lg-6 d-none d-lg-flex bg-primary text-white flex-column align-items-center justify-content-center p-5">
          <h2 className="fw-bold mb-3">Welcome Back!</h2>
          <p className="text-center">
            Trade smarter with our real-time trading platform
          </p>
        </div>

        {/* Right Side */}
        <div className="col-12 col-lg-6 bg-white p-5">
          <h2 className="mb-2 text-center">Satta Matka Aajj Tak</h2>
          <h3 className="mb-4 text-center">Login to Your Account</h3>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="mobile" className="form-label fw-medium">
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
            Don’t have an account? Please connect to xxxxx@xxx.com or call
            3453334455
          </p>
        </div>
      </div>

      {/* ✅ Toast Container */}
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default LoginPage;
