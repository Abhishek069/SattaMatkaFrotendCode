import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";// 👉 install: npm install jwt-decode

export default function SessionWrapper({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const checkExpiry = () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const decoded = jwtDecode(token); // { exp: 123456789, iat: ... }
        const now = Date.now() / 1000; // in seconds

        if (decoded.exp < now) {
          // Token expired → clear session
          localStorage.removeItem("authToken");
          localStorage.removeItem("userRole");
          localStorage.removeItem("loginTime");

          navigate("/login", { replace: true });
        }
      } catch (err) {
        console.error("Error checking session expiry:", err);
        // fallback → force logout
        localStorage.clear();
        navigate("/login", { replace: true });
      }
    };

    // Run immediately
    checkExpiry();

    // Check every 10s (since expiry is short: 1 min)
    const interval = setInterval(checkExpiry, 10 * 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  return <>{children}</>;
}
