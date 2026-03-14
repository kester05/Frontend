import React, { useState, useEffect } from "react";
import * as api from "../services/api";
import "./ComponentStyles.css";

function ManageInventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: "",
    maxQuantity: "",
    unit: "unit",
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await api.getAllItems();
      setItems(response.data);
    } catch (error) {
      showMessage("Failed to load items", "error");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  const openAddModal = () => {
    setModalMode("add");
    setSelectedItem(null);
    setFormData({
      name: "",
      description: "",
      quantity: "",
      maxQuantity: "",
      unit: "unit",
    });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setModalMode("edit");
    setSelectedItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      quantity: item.quantity,
      maxQuantity: item.maxQuantity,
      unit: item.unit,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setFormData({
      name: "",
      description: "",
      quantity: "",
      maxQuantity: "",
      unit: "unit",
    });
  };

  const handleSubmit = async () => {
    try {
      if (modalMode === "add") {
        await api.createItem({
          name: formData.name,
          description: formData.description,
          quantity: parseInt(formData.quantity),
          maxQuantity: parseInt(formData.maxQuantity),
          unit: formData.unit,
        });
        showMessage("Item created successfully!", "success");
      } else {
        await api.updateItem(selectedItem._id, {
          name: formData.name,
          description: formData.description,
          quantity: parseInt(formData.quantity),
          maxQuantity: parseInt(formData.maxQuantity),
          unit: formData.unit,
        });
        showMessage("Item updated successfully!", "success");
      }
      closeModal();
      fetchItems();
    } catch (error) {
      showMessage(error.response?.data?.message || "Operation failed", "error");
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      await api.deleteItem(itemId);
      showMessage("Item deleted successfully!", "success");
      fetchItems();
    } catch (error) {
      showMessage(error.response?.data?.message || "Failed to delete item", "error");
    }
  };

  if (loading) {
    return <div className="component-container">Loading...</div>;
  }

  return (
    <div className="component-container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0 }}>Manage Inventory</h2>
        <button className="btn-submit" onClick={openAddModal}>
          Add New Item
        </button>
      </div>

      {message && <div className={`alert alert-${messageType}`}>{message}</div>}

      {items.length === 0 ? (
        <p>No items in inventory. Add one to get started!</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Current Quantity</th>
              <th>Unit</th>
              <th>Max Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.description || "-"}</td>
                <td>{item.quantity}</td>
                <td>{item.unit}</td>
                <td>{item.maxQuantity}</td>
                <td>
                  <button
                    className="btn-action btn-approve"
                    onClick={() => openEditModal(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-action btn-delete"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className={`modal ${showModal ? "active" : ""}`}>
          <div className="modal-content">
            <div className="modal-header">
              <h3>{modalMode === "add" ? "Add New Item" : "Edit Item"}</h3>
              <button className="close-btn" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Item Name*</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter item name"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter item description"
                  rows="3"
                ></textarea>
              </div>
              <div className="form-group">
                <label>Current Quantity*</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  min="0"
                  placeholder="Enter current quantity"
                />
              </div>
              <div className="form-group">
                <label>Maximum Quantity*</label>
                <input
                  type="number"
                  value={formData.maxQuantity}
                  onChange={(e) =>
                    setFormData({ ...formData, maxQuantity: e.target.value })
                  }
                  min="1"
                  placeholder="Enter maximum quantity"
                />
              </div>
              <div className="form-group">
                <label>Unit*</label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData({ ...formData, unit: e.target.value })
                  }
                  placeholder="e.g., unit, boxes, pieces"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSubmit}>
                {modalMode === "add" ? "Create Item" : "Update Item"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageInventory;
