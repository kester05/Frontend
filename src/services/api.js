import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: token ? `Bearer ${token}` : "",
  };
};

// Auth APIs
export const register = (name, email, password, role) =>
  axios.post(`${API_BASE_URL}/auth/register`, { name, email, password, role });

export const login = (email, password) =>
  axios.post(`${API_BASE_URL}/auth/login`, { email, password });

// Item APIs
export const getAllItems = () =>
  axios.get(`${API_BASE_URL}/items`, { headers: getHeaders() });

export const getItemById = (id) =>
  axios.get(`${API_BASE_URL}/items/${id}`, { headers: getHeaders() });

export const createItem = (itemData) =>
  axios.post(`${API_BASE_URL}/items`, itemData, { headers: getHeaders() });

export const updateItem = (id, itemData) =>
  axios.put(`${API_BASE_URL}/items/${id}`, itemData, { headers: getHeaders() });

export const deleteItem = (id) =>
  axios.delete(`${API_BASE_URL}/items/${id}`, { headers: getHeaders() });

// Request APIs
export const createRequest = (requestData) =>
  axios.post(`${API_BASE_URL}/requests`, requestData, { headers: getHeaders() });

export const getStaffRequests = () =>
  axios.get(`${API_BASE_URL}/requests/my-requests`, { headers: getHeaders() });

export const getAllRequests = () =>
  axios.get(`${API_BASE_URL}/requests`, { headers: getHeaders() });

export const approveRequest = (id, approveData) =>
  axios.put(`${API_BASE_URL}/requests/${id}/approve`, approveData, {
    headers: getHeaders(),
  });

export const rejectRequest = (id, rejectData) =>
  axios.put(`${API_BASE_URL}/requests/${id}/reject`, rejectData, {
    headers: getHeaders(),
  });

export const fulfillRequest = (id) =>
  axios.put(`${API_BASE_URL}/requests/${id}/fulfill`, {}, {
    headers: getHeaders(),
  });

export const cancelRequest = (id) =>
  axios.put(`${API_BASE_URL}/requests/${id}/cancel`, {}, {
    headers: getHeaders(),
  });
