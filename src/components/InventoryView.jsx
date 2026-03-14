import React, { useState, useEffect } from "react";
import * as api from "../services/api";
import "./ComponentStyles.css";

function InventoryView() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await api.getAllItems();
      setItems(response.data);
    } catch (error) {
      console.error("Failed to load items", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="component-container">Loading...</div>;
  }

  const getStockStatus = (quantity, maxQuantity) => {
    const percentage = (quantity / maxQuantity) * 100;
    if (percentage > 50) return "good";
    if (percentage > 20) return "low";
    return "critical";
  };

  return (
    <div className="component-container">
      <h2>Available Inventory</h2>

      {items.length === 0 ? (
        <p>No items in inventory.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Description</th>
              <th>Available Quantity</th>
              <th>Unit</th>
              <th>Max Quantity</th>
              <th>Stock Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const status = getStockStatus(item.quantity, item.maxQuantity);
              return (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.description || "-"}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unit}</td>
                  <td>{item.maxQuantity}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        status === "good"
                          ? "status-approved"
                          : status === "low"
                          ? "status-pending"
                          : "status-rejected"
                      }`}
                    >
                      {status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default InventoryView;
