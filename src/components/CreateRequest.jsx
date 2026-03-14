import React, { useState, useEffect } from "react";
import * as api from "../services/api";
import "./ComponentStyles.css";

function CreateRequest() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await api.getAllItems();
      setItems(response.data);
    } catch (error) {
      showMessage("Failed to load items", "error");
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.createRequest({
        itemId: selectedItem,
        requestedQuantity: parseInt(quantity),
        reason,
      });
      showMessage("Request created successfully!", "success");
      setSelectedItem("");
      setQuantity("");
      setReason("");
    } catch (error) {
      showMessage(error.response?.data?.message || "Failed to create request", "error");
    } finally {
      setLoading(false);
    }
  };

  const selectedItemData = items.find((item) => item._id === selectedItem);

  return (
    <div className="component-container">
      <h2>Create Item Request</h2>
      {message && <div className={`alert alert-${messageType}`}>{message}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Select Item*</label>
          <select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            required
          >
            <option value="">Choose an item</option>
            {items.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name} (Available: {item.quantity} {item.unit})
              </option>
            ))}
          </select>
        </div>

        {selectedItemData && (
          <div className="alert alert-info">
            <strong>Item Details:</strong> {selectedItemData.description || "N/A"} | Max
            Quantity: {selectedItemData.maxQuantity}
          </div>
        )}

        <div className="form-group">
          <label>Quantity Requested*</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            min="1"
            max={selectedItemData ? selectedItemData.maxQuantity : undefined}
            placeholder="Enter quantity"
          />
        </div>

        <div className="form-group">
          <label>Reason for Request</label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why you need this item"
            rows="4"
          ></textarea>
        </div>

        <button type="submit" disabled={loading} className="btn-submit">
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}

export default CreateRequest;
