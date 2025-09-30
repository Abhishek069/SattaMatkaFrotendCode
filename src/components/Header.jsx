import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // check token on mount
    const token = localStorage.getItem("authToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    navigate("/login"); // redirect after logout
  };

  return (
    <header
      className="m-1 border border-white py-3"
      style={{ backgroundColor: "#ffcc99" }}
    >
      <div
        className="d-flex align-items-center justify-content-between"
        style={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}
      >
        {/* Empty div to help center title */}
        <div style={{ flex: 1 }}></div>

        {/* Centered Title */}
        <h1
          className="m-0 text-danger fw-bold text-center"
          style={{ fontFamily: "revert", fontSize: "2rem" }}
        >
          <span className="text-pink">Satta Matka </span>Aajj Tak
        </h1>

        {/* Login / Logout Button */}
        <div style={{ flex: 1, textAlign: "right" }}>
          {!isLoggedIn ? (
            <button
              className="btn btn-primary"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          ) : (
            <button className="btn btn-info" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
