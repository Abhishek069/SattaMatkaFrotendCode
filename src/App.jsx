// import {React} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import JodiPanPage from './pages/JodiPanPage';
import PanelPage from './pages/PanelPage'
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path='/JodiPanPage/:id' element={<JodiPanPage />}/>
        <Route path='/PanelPage/:id' element={<PanelPage />}/>
      </Routes>
    </Router>
  );
}