import axios from "axios";
import { getStoredToken } from "@/hooks/useAuth";

// Default to production Render API; override in env (e.g., REACT_APP_API_BASE=http://localhost:8000/api)
const API_BASE = process.env.REACT_APP_API_BASE || "https://sbdevstudio-1.onrender.com/api";

export const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const unwrap = (promise) => promise.then((res) => res.data);

// Auth & 2FA
export const adminLogin = (email, password) =>
  unwrap(api.post("/admin/login", { email, password }));

export const verifyAdminOTP = (email, otp_code) =>
  unwrap(api.post("/admin/verify-otp", { email, otp_code }));

export const resendAdminOTP = (email) =>
  unwrap(api.post("/admin/resend-otp", { email }));

export const fetchAdminList = () =>
  unwrap(api.get("/admin/admins"));

export const createAdminUser = (payload) =>
  unwrap(api.post("/admin/create-admin", payload));

export const changeAdminPassword = (payload) =>
  unwrap(api.post("/admin/change-password", payload));

// Stats
export const fetchStats = () => unwrap(api.get("/admin/stats"));

// Projects
export const fetchProjects = () => unwrap(api.get("/projects"));
export const createProject = (payload) => unwrap(api.post("/admin/projects", payload));
export const updateProject = (id, payload) => unwrap(api.put(`/admin/projects/${id}`, payload));
export const deleteProject = (id) => unwrap(api.delete(`/admin/projects/${id}`));

// Testimonials
export const fetchTestimonials = () => unwrap(api.get("/testimonials"));
export const createTestimonial = (payload) => unwrap(api.post("/admin/testimonials", payload));
export const updateTestimonial = (id, payload) => unwrap(api.put(`/admin/testimonials/${id}`, payload));
export const deleteTestimonial = (id) => unwrap(api.delete(`/admin/testimonials/${id}`));

// Contacts
export const fetchContacts = () => unwrap(api.get("/admin/contacts"));
export const updateContactStatus = (id, status) =>
  unwrap(api.put(`/admin/contacts/${id}`, { status }));
export const deleteContact = (id) => unwrap(api.delete(`/admin/contacts/${id}`));

// Public contact submission
export const submitContact = (payload) => unwrap(api.post("/contact", payload));

// File uploads
export const uploadImage = (file, subfolder) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("subfolder", subfolder);
  return unwrap(
    api.post("/admin/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  );
};
