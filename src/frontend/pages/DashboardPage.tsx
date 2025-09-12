import React, { useState } from "react";
import Sidebar from "../components/dashboard/Sidebar.js";
import Header from "../components/dashboard/Header.js";
import KPICard from "../components/dashboard/KpiCard.js";

import {
  FileText,
  CheckCircle,
  Users,
  CreditCard,
  DollarSign,
  TrendingUp,
  Banknote,
  Database,
} from "lucide-react";

function DashboardPage() {
  const [activeItem, setActiveItem] = useState("analytics");
  const [darkMode, setDarkMode] = useState(false);

  // Sample data
  const salesData = [
    { month: "JAN", value: 3200 },
    { month: "FEB", value: 2800 },
    { month: "MAR", value: 3500 },
    { month: "APR", value: 2900 },
    { month: "MAY", value: 4100 },
    { month: "JUN", value: 2400 },
    { month: "JUL", value: 3800 },
    { month: "AUG", value: 3600 },
    { month: "SEP", value: 2700 },
    { month: "OCT", value: 3300 },
    { month: "NOV", value: 4200 },
    { month: "DEC", value: 3900 },
  ];

  const userActivityData = [
    { month: "JAN", value: 1600 },
    { month: "FEB", value: 1800 },
    { month: "MAR", value: 1200 },
    { month: "APR", value: 1500 },
    { month: "MAY", value: 1400 },
    { month: "JUN", value: 1100 },
    { month: "JUL", value: 1300 },
    { month: "AUG", value: 1000 },
    { month: "SEP", value: 1700 },
    { month: "OCT", value: 2200 },
    { month: "NOV", value: 3200 },
    { month: "DEC", value: 4000 },
  ];

  const userTypeData = [
    { name: "User Type 1", value: 45, color: "#f59e0b" },
    { name: "User Type 2", value: 30, color: "#fbbf24" },
    { name: "User Type 3", value: 25, color: "#fde047" },
  ];

  const subscriptionTypeData = [
    { name: "User Type 1", value: 60, color: "#3b82f6" },
    { name: "User Type 2", value: 40, color: "#93c5fd" },
  ];

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
        <Header   darkMode={darkMode} onDarkModeToggle={() => setDarkMode(!darkMode)}
        />

        <div className="p-8">
          {/* Top KPI Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPICard
              title="Order"
              value="201"
              subtitle="$ 2.5"
              icon={FileText}
              iconColor="text-blue-500"
              trendColor="text-green-500"
            />
          </div>

        
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
