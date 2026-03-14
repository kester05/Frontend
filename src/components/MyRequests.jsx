import React, { useState, useEffect } from "react";
import * as api from "../services/api";
import "./ComponentStyles.css";

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await api.getStaffRequests();
      setRequests(response.data);
    } catch (error) {
      showMessage("Failed to load requests", "error");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleCancel = async (requestId) => {
    if (!window.confirm("Are you sure you want to cancel this request?")) {
      return;
    }

    try {
      await api.cancelRequest(requestId);
      showMessage("Request cancelled successfully!", "success");
      fetchRequests();
    } catch (error) {
      showMessage(error.response?.data?.message || "Failed to cancel request", "error");
    }
  };

  const getStatusClass = (status) => `status-${status}`;

  if (loading) {
    return <div className="component-container">Loading...</div>;
  }

  return (
    <div className="component-container">
      <h2>My Requests</h2>
      {message && <div className={`alert alert-${messageType}`}>{message}</div>}

      {requests.length === 0 ? (
        <p>No requests found. Create one to get started!</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Quantity Requested</th>
              <th>Approved Quantity</th>
              <th>Status</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id}>
                <td>{request.itemId?.name || "N/A"}</td>
                <td>{request.requestedQuantity}</td>
                <td>{request.approvedQuantity || "-"}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(request.status)}`}>
                    {request.status}
                  </span>
                </td>
                <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                <td>
                  {(request.status === "pending" || request.status === "approved") && (
                    <button
                      className="btn-action btn-cancel"
                      onClick={() => handleCancel(request._id)}
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyRequests;
