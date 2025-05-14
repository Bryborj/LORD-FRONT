// components/DashboardLayout.js
import React from "react";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children, onLogout }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onLogout={onLogout} />
      <div className="flex-1 p-6 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
