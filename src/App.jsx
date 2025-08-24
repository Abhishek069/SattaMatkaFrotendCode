import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import JodiPanPage from './pages/JodiPanPage';
import PanelPage from './pages/PanelPage';
import SessionWrapper from "./SessionWrapper"; // <-- import wrapper
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  return (
    <Router>
      <SessionWrapper>
        <Routes>
          {/* Default route = HomePage */}
          <Route path="/" element={<HomePage />} />

          {/* Explicit login route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Other pages */}
          <Route path="/JodiPanPage/:id" element={<JodiPanPage />} />
          <Route path="/PanelPage/:id" element={<PanelPage />} />

          {/* Catch-all → redirect unknown routes to Home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </SessionWrapper>
    </Router>
  );
}
