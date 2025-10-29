import React, { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar.js";
import Header from "../components/dashboard/Header.js";

function DashboardPage() {
  const [activeItem, setActiveItem] = useState("analytics");
  const [darkMode, setDarkMode] = useState(false);

  if (activeItem !== "analytics") {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {activeItem.charAt(0).toUpperCase() + activeItem.slice(1)}
            </h2>
            <p className="text-gray-600">This page is coming soon...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />

      <div className="flex-1 overflow-auto">
        <Header darkMode={darkMode} onDarkModeToggle={() => setDarkMode(!darkMode)} />
        <div className="p-8">
          {/* Top Team Row */}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
