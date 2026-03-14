import React, { useState, useEffect } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import CreateRequest from "../components/CreateRequest";
import MyRequests from "../components/MyRequests";
import InventoryView from "../components/InventoryView";
import "./Dashboard.css";

function StaffDashboard({ onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("create-request");

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <Navbar role="staff" onLogout={handleLogout} />
      <div className="dashboard-container">
        <div className="sidebar">
          <div className="sidebar-menu">
            <button
              className={`menu-item ${activeTab === "create-request" ? "active" : ""}`}
              onClick={() => setActiveTab("create-request")}
            >
              Create Request
            </button>
            <button
              className={`menu-item ${activeTab === "my-requests" ? "active" : ""}`}
              onClick={() => setActiveTab("my-requests")}
            >
              My Requests
            </button>
            <button
              className={`menu-item ${activeTab === "inventory" ? "active" : ""}`}
              onClick={() => setActiveTab("inventory")}
            >
              View Inventory
            </button>
          </div>
        </div>

        <div className="main-content">
          {activeTab === "create-request" && <CreateRequest />}
          {activeTab === "my-requests" && <MyRequests />}
          {activeTab === "inventory" && <InventoryView />}
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;
