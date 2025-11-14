import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login"; // ✅ นำเข้า Login page
import MainMenu from "./pages/main-menu";
import Dashboard from "./components/RSPM_module/Dashboard_RSPM";
import Request from "./components/RSPM_module/Request_RSPM";
import Tracking from "./components/RSPM_module/Tracking_RSPM";
import Report from "./components/RSPM_module/Reports_RSPM";
import Export from "./components/RSPM_module/Export_RSPM";
import Api from "./components/RSPM_module/Api_RSPM";
// 👉 ถ้ามีหน้าอื่น เช่น IPMS, SWTS, Admin ให้ import มาด้วย

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* ✅ เมื่อเปิดหน้าเว็บหลัก `/` ให้ redirect ไปหน้า Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ✅ เส้นทางเข้าสู่หน้า Login */}
        <Route path="/login" element={<Login />} />
        
      <Route path="/main-menu" element={<MainMenu />} />
      <Route path="/rspm" element={<Dashboard />} />
      <Route path="/requests" element={<Request />} />
      <Route path="/tracking" element={<Tracking />} />
      <Route path="/reports" element={<Report />} />
            <Route path="/export" element={<Export />} />
            <Route path="/api" element={<Api />} />
      </Routes>
    </Router>
  );
};

export default App;
