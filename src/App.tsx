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
import Population from "./components/RSPM_module/Population_RSPM";
import Household from "./components/RSPM_module/household_RSPM";
import Agencies from "./components/RSPM_module/Agencies_RSPM";
import InternalAgencies from "./components/RSPM_module/internalagencies_RSPM";// 👉 ถ้ามีหน้าอื่น เช่น IPMS, SWTS, Admin ให้ import มาด้วย
import Servicetypes from "./components/RSPM_module/ServiceTypes_RSPM";
import WorkLevels from "./components/RSPM_module/WorkLevels_RSPM";
import AccessRights from "./components/RSPM_module/AccessRights_RSPM";
import SystemUsage from "./components/RSPM_module/SystemUsage_RSPM";
import Areas from "./components/RSPM_module/Areas_RSPM";

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
        <Route path="/Population" element={<Population />} />
        <Route path="/household" element={<Household />} />
        <Route path="/agencies" element={<Agencies />} />
        <Route path="/internal-agencies" element={<InternalAgencies />} />
        <Route path="/service-types" element={<Servicetypes />} />
        <Route path="/work-levels" element={<WorkLevels />} />
        <Route path="/access-rights" element={<AccessRights />} />
        <Route path="/system-usage" element={<SystemUsage />} />
        <Route path="/areas" element={<Areas />} />
      </Routes>
    </Router>
  );
};

export default App;
