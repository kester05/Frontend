import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import AllRequests from "../components/AllRequests";
import ManageInventory from "../components/ManageInventory";
import "./Dashboard.css";

function AdminDashboard({ onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("manage-requests");

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <Navbar role="admin" onLogout={handleLogout} />
      <div className="dashboard-container">
        <div className="sidebar">
          <div className="sidebar-menu">
            <button
              className={`menu-item ${activeTab === "manage-requests" ? "active" : ""}`}
              onClick={() => setActiveTab("manage-requests")}
            >
              Manage Requests
            </button>
            <button
              className={`menu-item ${activeTab === "manage-inventory" ? "active" : ""}`}
              onClick={() => setActiveTab("manage-inventory")}
            >
              Manage Inventory
            </button>
          </div>
        </div>

        <div className="main-content">
          {activeTab === "manage-requests" && <AllRequests />}
          {activeTab === "manage-inventory" && <ManageInventory />}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
