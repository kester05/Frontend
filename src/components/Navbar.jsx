import React from "react";
import "./Navbar.css";

function Navbar({ role, onLogout }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-title">Inventory Management System</h1>
      </div>
      <div className="navbar-right">
        <span className="user-info">
          {user.name} ({role})
        </span>
        <button onClick={onLogout} className="btn-logout">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
