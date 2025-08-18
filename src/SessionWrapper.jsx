import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SessionWrapper({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const checkExpiry = () => {
      const loginTime = localStorage.getItem("loginTime");
      if (!loginTime) return;

      const oneHour = 60 * 60 * 1000; // 1 hour
      const now = Date.now();

      if (now - parseInt(loginTime, 10) > oneHour) {
        // Clear expired session
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("loginTime");

        alert("Session expired. Please log in again.");
        navigate("/login");
      }
    };

    // Run immediately
    checkExpiry();

    // Also run every 5 minutes
    const interval = setInterval(checkExpiry, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  return children;
}
