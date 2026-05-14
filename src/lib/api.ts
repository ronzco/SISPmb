import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export default api;

export interface APIError {
  error: string;
}

export const authApi = {
  login: (credentials: any) => api.post("/auth/login", credentials),
  register: (userData: any) => api.post("/auth/register", userData),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me"),
};

export const dataApi = {
  getAnnouncements: () => api.get("/announcements"),
  getMyApplications: () => api.get("/applications/my"),
  createApplication: (data: any) => api.post("/applications", data),
  updateApplication: (id: string, data: any) => api.patch(`/applications/${id}`, data),
  getFees: () => api.get("/fees"),
  
  // Admin Content Management
  createAnnouncement: (data: any) => api.post("/admin/announcements", data),
  deleteAnnouncement: (id: string) => api.delete(`/admin/announcements/${id}`),
  updateFee: (data: any) => api.post("/admin/fees", data),
  deleteFee: (id: string) => api.delete(`/admin/fees/${id}`),

  // Admin App Management
  getAdminApplications: () => api.get("/admin/applications"),
  updateApplicationStatus: (id: string, data: any) => api.patch(`/admin/applications/${id}/status`, data),
  
  // Logs & Docs
  getLogs: () => api.get("/admin/logs"),
  getUserDocuments: (userId: string) => api.get(`/admin/documents/${userId}`),
  updateDocumentStatus: (docId: string, status: string) => api.patch(`/admin/documents/${docId}/status`, { status }),
  updatePaymentStatus: (id: string, status: string) => api.patch(`/admin/payments/${id}/status`, { status }),
};
