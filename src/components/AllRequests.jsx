import React, { useState, useEffect } from "react";
import * as api from "../services/api";
import "./ComponentStyles.css";

function AllRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const [formData, setFormData] = useState({
    approvedQuantity: "",
    adminComment: "",
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await api.getAllRequests();
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

  const openModal = (request, action) => {
    setSelectedRequest(request);
    setModalAction(action);
    if (action === "approve") {
      setFormData({
        approvedQuantity: request.requestedQuantity,
        adminComment: "",
      });
    } else {
      setFormData({
        approvedQuantity: "",
        adminComment: "",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
    setModalAction("");
    setFormData({ approvedQuantity: "", adminComment: "" });
  };

  const handleApprove = async () => {
    try {
      await api.approveRequest(selectedRequest._id, {
        approvedQuantity: parseInt(formData.approvedQuantity),
        adminComment: formData.adminComment,
      });
      showMessage("Request approved successfully!", "success");
      closeModal();
      fetchRequests();
    } catch (error) {
      showMessage(error.response?.data?.message || "Failed to approve request", "error");
    }
  };

  const handleReject = async () => {
    try {
      await api.rejectRequest(selectedRequest._id, {
        adminComment: formData.adminComment,
      });
      showMessage("Request rejected successfully!", "success");
      closeModal();
      fetchRequests();
    } catch (error) {
      showMessage(error.response?.data?.message || "Failed to reject request", "error");
    }
  };

  const handleFulfill = async (requestId) => {
    try {
      await api.fulfillRequest(requestId);
      showMessage("Request fulfilled successfully!", "success");
      fetchRequests();
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Failed to fulfill request",
        "error"
      );
    }
  };

  const getStatusClass = (status) => `status-${status}`;

  if (loading) {
    return <div className="component-container">Loading...</div>;
  }

  return (
    <div className="component-container">
      <h2>Manage Requests</h2>
      {message && <div className={`alert alert-${messageType}`}>{message}</div>}

      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Staff Member</th>
              <th>Item</th>
              <th>Qty Requested</th>
              <th>Qty Approved</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id}>
                <td>{request.staffId?.name || "N/A"}</td>
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
                  {request.status === "pending" && (
                    <>
                      <button
                        className="btn-action btn-approve"
                        onClick={() => openModal(request, "approve")}
                      >
                        Approve
                      </button>
                      <button
                        className="btn-action btn-reject"
                        onClick={() => openModal(request, "reject")}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {request.status === "approved" && (
                    <button
                      className="btn-action btn-fulfill"
                      onClick={() => handleFulfill(request._id)}
                    >
                      Fulfill
                    </button>
                  )}
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
              <h3>
                {modalAction === "approve"
                  ? "Approve Request"
                  : "Reject Request"}
              </h3>
              <button className="close-btn" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <p>
                  <strong>Item:</strong> {selectedRequest?.itemId?.name}
                </p>
                <p>
                  <strong>Requested Quantity:</strong>{" "}
                  {selectedRequest?.requestedQuantity}
                </p>
              </div>

              {modalAction === "approve" && (
                <div className="form-group">
                  <label>Approved Quantity*</label>
                  <input
                    type="number"
                    value={formData.approvedQuantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        approvedQuantity: e.target.value,
                      })
                    }
                    min="1"
                    max={selectedRequest?.requestedQuantity}
                    placeholder="Enter approved quantity"
                  />
                </div>
              )}

              <div className="form-group">
                <label>
                  {modalAction === "approve"
                    ? "Approval Comment"
                    : "Rejection Reason"}
                </label>
                <textarea
                  value={formData.adminComment}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      adminComment: e.target.value,
                    })
                  }
                  rows="4"
                  placeholder="Enter your comment"
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button
                className={`btn-primary ${modalAction === "approve" ? "btn-approve" : "btn-reject"}`}
                onClick={modalAction === "approve" ? handleApprove : handleReject}
              >
                {modalAction === "approve" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllRequests;
