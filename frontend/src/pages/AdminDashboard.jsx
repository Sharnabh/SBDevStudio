import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdminRoute } from "@/lib/routes";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import SEOHead from "@/components/SEOHead";
import {
  createProject,
  createTestimonial,
  deleteContact,
  deleteProject,
  deleteTestimonial,
  fetchContacts,
  fetchProjects,
  fetchStats,
  fetchTestimonials,
  updateContactStatus,
  updateProject,
  updateTestimonial,
  uploadImage,
  fetchAdminList,
  createAdminUser,
  changeAdminPassword,
} from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  KeyRound,
  UserPlus,
  Shield,
  ExternalLink,
  LogOut,
  FolderPlus,
  MessageSquarePlus,
  Mail,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Layers,
  Star,
  Upload,
} from "lucide-react";

const studioCard = "border border-[#232b3e] bg-[#131824] text-[#e9edf3] rounded-2xl p-6 shadow-md";

export default function AdminDashboard() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [contacts, setContacts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    category: "Web Development",
    technologiesText: "React, FastAPI, Supabase",
    image: "",
    link: "",
  });
  const [editingProject, setEditingProject] = useState(null);

  const [testimonialForm, setTestimonialForm] = useState({
    name: "",
    role: "",
    content: "",
    rating: 5,
    avatar: "",
  });
  const [editingTestimonial, setEditingTestimonial] = useState(null);

  // Admin Management & Password Change State
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminList, setAdminList] = useState([]);
  const [adminListLoading, setAdminListLoading] = useState(false);
  const [newAdminForm, setNewAdminForm] = useState({ username: "", email: "", password: "" });
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current_password: "", new_password: "", confirm_password: "" });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const categoryOptions = useMemo(() => [
    "Web Development",
    "Mobile Apps",
    "AI/ML Engineering",
    "Cloud Architecture",
    "DevOps & Security",
    "Design Systems",
  ], []);

  useEffect(() => {
    const load = async () => {
      if (!token) {
        navigate(getAdminRoute("/sbdevstudio/login"), { replace: true });
        return;
      }
      try {
        setLoading(true);
        const [statsRes, projRes, testRes, contactRes] = await Promise.all([
          fetchStats(),
          fetchProjects(),
          fetchTestimonials(),
          fetchContacts(),
        ]);
        setStats(statsRes);
        setProjects(projRes);
        setTestimonials(testRes);
        setContacts(contactRes);
      } catch (error) {
        const detail = error?.response?.data?.detail || "Session expired";
        toast({ title: "Auth required", description: detail });
        logout();
        navigate(getAdminRoute("/sbdevstudio/login"), { replace: true });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token, toast, logout, navigate]);

  const handleLogout = () => {
    logout();
    navigate(getAdminRoute("/sbdevstudio/login"), { replace: true });
  };

  const techArray = (text) => text.split(",").map((t) => t.trim()).filter(Boolean);

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: projectForm.title,
      description: projectForm.description,
      category: projectForm.category,
      technologies: techArray(projectForm.technologiesText),
      image: projectForm.image,
      link: projectForm.link || "#",
    };
    try {
      if (editingProject) {
        const updated = await updateProject(editingProject.id, payload);
        setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        toast({ title: "Project updated", description: updated.title });
      } else {
        const created = await createProject(payload);
        setProjects((prev) => [created, ...prev]);
        toast({ title: "Project published", description: created.title });
      }
      setProjectForm({ title: "", description: "", category: "Web Development", technologiesText: "React, FastAPI, Supabase", image: "", link: "" });
      setEditingProject(null);
    } catch (error) {
      const detail = error?.response?.data?.detail || "Save failed";
      toast({ title: "Project error", description: detail, variant: "destructive" });
    }
  };

  const handleProjectEdit = (project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      category: project.category,
      technologiesText: (project.technologies || []).join(", "),
      image: project.image,
      link: project.link,
    });
  };

  const handleProjectDelete = async (id) => {
    if (!window.confirm("Permanently delete this project from the portfolio?")) return;
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast({ title: "Project deleted" });
    } catch (error) {
      toast({ title: "Delete failed", description: "Could not delete project", variant: "destructive" });
    }
  };

  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...testimonialForm, rating: Number(testimonialForm.rating) };
    try {
      if (editingTestimonial) {
        const updated = await updateTestimonial(editingTestimonial.id, payload);
        setTestimonials((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        toast({ title: "Testimonial updated" });
      } else {
        const created = await createTestimonial(payload);
        setTestimonials((prev) => [created, ...prev]);
        toast({ title: "Testimonial published" });
      }
      setTestimonialForm({ name: "", role: "", content: "", rating: 5, avatar: "" });
      setEditingTestimonial(null);
    } catch (error) {
      const detail = error?.response?.data?.detail || "Save failed";
      toast({ title: "Testimonial error", description: detail, variant: "destructive" });
    }
  };

  const handleTestimonialEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setTestimonialForm({
      name: testimonial.name,
      role: testimonial.role,
      content: testimonial.content,
      rating: testimonial.rating,
      avatar: testimonial.avatar,
    });
  };

  const handleTestimonialDelete = async (id) => {
    if (!window.confirm("Permanently delete this testimonial?")) return;
    try {
      await deleteTestimonial(id);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      toast({ title: "Testimonial deleted" });
    } catch (error) {
      toast({ title: "Delete failed", description: "Could not delete testimonial", variant: "destructive" });
    }
  };

  const handleContactStatus = async (id, status) => {
    try {
      const updated = await updateContactStatus(id, status);
      setContacts((prev) => prev.map((c) => (c.id === id ? updated : c)));
      toast({ title: "Status updated", description: `Marked as ${status}` });
    } catch (error) {
      toast({ title: "Update failed", description: "Could not update contact status", variant: "destructive" });
    }
  };

  const handleContactDelete = async (id) => {
    if (!window.confirm("Permanently delete this enquiry?")) return;
    try {
      await deleteContact(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
      toast({ title: "Contact deleted" });
    } catch (error) {
      toast({ title: "Delete failed", description: "Could not delete contact", variant: "destructive" });
    }
  };

  const handleUpload = async (file, subfolder, onDone) => {
    if (!file) return;
    try {
      const res = await uploadImage(file, subfolder);
      onDone(res.url);
      toast({ title: "File Uploaded", description: file.name });
    } catch (error) {
      const detail = error?.response?.data?.detail || "Upload failed";
      toast({ title: "Upload error", description: detail, variant: "destructive" });
    }
  };

  const handleOpenAdminModal = async () => {
    setIsAdminModalOpen(true);
    setAdminListLoading(true);
    try {
      const data = await fetchAdminList();
      setAdminList(Array.isArray(data) ? data : []);
    } catch (error) {
      toast({ title: "Error", description: "Could not load admin accounts.", variant: "destructive" });
    } finally {
      setAdminListLoading(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!newAdminForm.username || !newAdminForm.email || !newAdminForm.password) {
      toast({ title: "Missing fields", description: "Please fill out all admin fields." });
      return;
    }
    if (newAdminForm.password.length < 6) {
      toast({ title: "Password too short", description: "Password must be at least 6 characters." });
      return;
    }
    setIsCreatingAdmin(true);
    try {
      const created = await createAdminUser(newAdminForm);
      setAdminList((prev) => [created, ...prev]);
      setNewAdminForm({ username: "", email: "", password: "" });
      toast({ title: "Admin Created", description: `Account '${created.username}' initialized.` });
    } catch (error) {
      const msg = error?.response?.data?.detail || "Could not create admin.";
      toast({ title: "Creation Failed", description: msg, variant: "destructive" });
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwordForm.current_password || !passwordForm.new_password) {
      toast({ title: "Missing fields", description: "Please enter current and new password." });
      return;
    }
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast({ title: "Passwords Mismatch", description: "New password and confirmation do not match.", variant: "destructive" });
      return;
    }
    if (passwordForm.new_password.length < 6) {
      toast({ title: "Password too short", description: "New password must be at least 6 characters." });
      return;
    }
    setIsChangingPassword(true);
    try {
      await changeAdminPassword({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      });
      toast({ title: "Password Updated", description: "Your admin password has been changed." });
      setPasswordForm({ current_password: "", new_password: "", confirm_password: "" });
      setIsPasswordModalOpen(false);
    } catch (error) {
      const msg = error?.response?.data?.detail || "Could not change password.";
      toast({ title: "Change Failed", description: msg, variant: "destructive" });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const statItems = stats
    ? [
        { label: "Total Projects", value: stats.total_projects, sub: "Portfolio showcase" },
        { label: "Client Testimonials", value: stats.total_testimonials, sub: "Verified proof" },
        { label: "Total Contacts", value: stats.total_contacts, sub: "All time enquiries" },
        { label: "New Enquiries", value: stats.new_contacts, sub: "Action required", highlight: true },
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#0a0d14] text-[#e9edf3] font-sans selection:bg-[#5ab9fc]/20 selection:text-[#5ab9fc]">
      <SEOHead
        title="Studio Control Center | SB Dev Studio"
        description="Administrative management dashboard for SB Dev Studio."
        robots="noindex, nofollow"
      />

      {/* Top Studio Bar */}
      <header className="border-b border-[#232b3e] bg-[#0d111c]/90 backdrop-blur-md px-6 sm:px-10 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <img
            src="/assets/SB_DevStudio_Logo.svg"
            alt="SB Dev Studio"
            className="w-7 h-7 object-contain"
          />
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="text-[#8891a1]">studio</span>
            <span className="text-[#454e5f]">/</span>
            <span className="text-[#5ab9fc] font-semibold">control-center</span>
          </div>
        </div>

        {/* Global Action Triggers */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleOpenAdminModal}
            className="btn-secondary text-xs px-3 py-1.5 flex items-center space-x-1.5"
          >
            <Users className="w-3.5 h-3.5 text-[#5ab9fc]" />
            <span>Admins</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPasswordModalOpen(true)}
            className="btn-secondary text-xs px-3 py-1.5 flex items-center space-x-1.5"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#5ab9fc]" />
            <span>Password</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-xs px-3 py-1.5 flex items-center space-x-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Site</span>
          </a>

          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-xs font-mono transition-colors flex items-center space-x-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statItems.map((item) => (
            <div
              key={item.label}
              className={`p-5 rounded-2xl bg-[#131824] border ${
                item.highlight ? "border-[#5ab9fc]/50" : "border-[#232b3e]"
              } shadow-sm flex flex-col justify-between`}
            >
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#8891a1]">
                  {item.label}
                </span>
                <p className="text-3xl font-bold font-mono text-white mt-1">
                  {loading ? "--" : item.value}
                </p>
              </div>
              <span className="text-[11px] text-[#8891a1] mt-3 font-mono flex items-center space-x-1">
                {item.highlight && <span className="w-1.5 h-1.5 rounded-full bg-[#5ab9fc] mr-1"></span>}
                <span>{item.sub}</span>
              </span>
            </div>
          ))}
        </div>

        {/* Form Controls Grid: Project & Testimonial Creation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project Form Card */}
          <div className={studioCard}>
            <div className="flex items-center space-x-2.5 mb-5 pb-4 border-b border-[#232b3e]">
              <FolderPlus className="w-5 h-5 text-[#5ab9fc]" />
              <div>
                <h2 className="text-base font-bold text-white">
                  {editingProject ? "Update Portfolio Project" : "Publish Portfolio Project"}
                </h2>
                <p className="text-xs text-[#8891a1] font-mono">
                  Bespoke work showcase and case study contract
                </p>
              </div>
            </div>

            <form onSubmit={handleProjectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#8891a1] mb-1.5">
                  Project Title
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Nimbus Cloud Orchestration"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0d111c] border border-[#232b3e] text-sm text-white placeholder-[#454e5f] focus:outline-none focus:border-[#5ab9fc] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#8891a1] mb-1.5">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Technical summary, client outcome, and architecture highlights..."
                  value={projectForm.description}
                  onChange={(e) => setProjectForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0d111c] border border-[#232b3e] text-sm text-white placeholder-[#454e5f] focus:outline-none focus:border-[#5ab9fc] transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#8891a1] mb-1.5">
                    Category
                  </label>
                  <input
                    list="category-options-list"
                    value={projectForm.category}
                    onChange={(e) => setProjectForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#0d111c] border border-[#232b3e] text-sm text-white placeholder-[#454e5f] focus:outline-none focus:border-[#5ab9fc] transition-colors"
                  />
                  <datalist id="category-options-list">
                    {categoryOptions.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#8891a1] mb-1.5">
                    Technologies
                  </label>
                  <input
                    value={projectForm.technologiesText}
                    onChange={(e) => setProjectForm((f) => ({ ...f, technologiesText: e.target.value }))}
                    placeholder="React, FastAPI, Docker"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#0d111c] border border-[#232b3e] text-sm text-white placeholder-[#454e5f] focus:outline-none focus:border-[#5ab9fc] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#8891a1] mb-1.5">
                    Image URL
                  </label>
                  <input
                    value={projectForm.image}
                    onChange={(e) => setProjectForm((f) => ({ ...f, image: e.target.value }))}
                    placeholder="https://... or upload below"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#0d111c] border border-[#232b3e] text-sm text-white placeholder-[#454e5f] focus:outline-none focus:border-[#5ab9fc] transition-colors font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#8891a1] mb-1.5">
                    Live Link
                  </label>
                  <input
                    value={projectForm.link}
                    onChange={(e) => setProjectForm((f) => ({ ...f, link: e.target.value }))}
                    placeholder="https://example.com"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#0d111c] border border-[#232b3e] text-sm text-white placeholder-[#454e5f] focus:outline-none focus:border-[#5ab9fc] transition-colors font-mono text-xs"
                  />
                </div>
              </div>

              {/* Upload trigger */}
              <div className="p-3 rounded-lg bg-[#0d111c] border border-[#232b3e] flex items-center justify-between text-xs">
                <label className="flex items-center space-x-2 cursor-pointer text-[#8891a1] hover:text-white transition-colors">
                  <Upload className="w-4 h-4 text-[#5ab9fc]" />
                  <span>Upload screenshot asset</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUpload(e.target.files?.[0], "projects", (url) => setProjectForm((f) => ({ ...f, image: url })))}
                    className="hidden"
                  />
                </label>
                {projectForm.image && (
                  <span className="text-[#5ab9fc] font-mono text-[11px] flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Asset linked</span>
                  </span>
                )}
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-2">
                {editingProject && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProject(null);
                      setProjectForm({ title: "", description: "", category: "Web Development", technologiesText: "React, FastAPI, Supabase", image: "", link: "" });
                    }}
                    className="btn-secondary text-xs px-4 py-2"
                  >
                    Cancel Edit
                  </button>
                )}
                <button type="submit" className="btn-primary text-xs px-5 py-2">
                  {editingProject ? "Update Project" : "Publish Project"}
                </button>
              </div>
            </form>
          </div>

          {/* Testimonial Form Card */}
          <div className={studioCard}>
            <div className="flex items-center space-x-2.5 mb-5 pb-4 border-b border-[#232b3e]">
              <MessageSquarePlus className="w-5 h-5 text-[#5ab9fc]" />
              <div>
                <h2 className="text-base font-bold text-white">
                  {editingTestimonial ? "Update Testimonial" : "Add Verified Testimonial"}
                </h2>
                <p className="text-xs text-[#8891a1] font-mono">
                  Social proof and authentic client reviews
                </p>
              </div>
            </div>

            <form onSubmit={handleTestimonialSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#8891a1] mb-1.5">
                    Client Name
                  </label>
                  <input
                    required
                    value={testimonialForm.name}
                    onChange={(e) => setTestimonialForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Vikramaditya Rao"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#0d111c] border border-[#232b3e] text-sm text-white placeholder-[#454e5f] focus:outline-none focus:border-[#5ab9fc] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#8891a1] mb-1.5">
                    Role / Company
                  </label>
                  <input
                    required
                    value={testimonialForm.role}
                    onChange={(e) => setTestimonialForm((f) => ({ ...f, role: e.target.value }))}
                    placeholder="e.g. VP Engineering, Stratos"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#0d111c] border border-[#232b3e] text-sm text-white placeholder-[#454e5f] focus:outline-none focus:border-[#5ab9fc] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#8891a1] mb-1.5">
                  Review Statement
                </label>
                <textarea
                  required
                  rows={3}
                  value={testimonialForm.content}
                  onChange={(e) => setTestimonialForm((f) => ({ ...f, content: e.target.value }))}
                  placeholder="What was the outcome of working with the studio?"
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0d111c] border border-[#232b3e] text-sm text-white placeholder-[#454e5f] focus:outline-none focus:border-[#5ab9fc] transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#8891a1] mb-1.5">
                    Rating (1 to 5)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={testimonialForm.rating}
                    onChange={(e) => setTestimonialForm((f) => ({ ...f, rating: e.target.value }))}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#0d111c] border border-[#232b3e] text-sm text-white placeholder-[#454e5f] focus:outline-none focus:border-[#5ab9fc] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#8891a1] mb-1.5">
                    Avatar URL
                  </label>
                  <input
                    value={testimonialForm.avatar}
                    onChange={(e) => setTestimonialForm((f) => ({ ...f, avatar: e.target.value }))}
                    placeholder="https://... or upload below"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#0d111c] border border-[#232b3e] text-sm text-white placeholder-[#454e5f] focus:outline-none focus:border-[#5ab9fc] transition-colors font-mono text-xs"
                  />
                </div>
              </div>

              {/* Upload avatar */}
              <div className="p-3 rounded-lg bg-[#0d111c] border border-[#232b3e] flex items-center justify-between text-xs">
                <label className="flex items-center space-x-2 cursor-pointer text-[#8891a1] hover:text-white transition-colors">
                  <Upload className="w-4 h-4 text-[#5ab9fc]" />
                  <span>Upload client avatar</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUpload(e.target.files?.[0], "testimonials", (url) => setTestimonialForm((f) => ({ ...f, avatar: url })))}
                    className="hidden"
                  />
                </label>
                {testimonialForm.avatar && (
                  <span className="text-[#5ab9fc] font-mono text-[11px] flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Avatar ready</span>
                  </span>
                )}
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-2">
                {editingTestimonial && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingTestimonial(null);
                      setTestimonialForm({ name: "", role: "", content: "", rating: 5, avatar: "" });
                    }}
                    className="btn-secondary text-xs px-4 py-2"
                  >
                    Cancel Edit
                  </button>
                )}
                <button type="submit" className="btn-primary text-xs px-5 py-2">
                  {editingTestimonial ? "Update Testimonial" : "Publish Testimonial"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Existing Content Lists: Projects & Testimonials */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Projects List */}
          <div className={studioCard}>
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#232b3e]">
              <div>
                <h3 className="text-base font-bold text-white">Live Portfolio Projects</h3>
                <p className="text-xs text-[#8891a1] font-mono">
                  {projects.length} published case studies
                </p>
              </div>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {projects.length === 0 ? (
                <p className="text-xs text-[#8891a1] py-8 text-center font-mono">
                  No projects in database yet.
                </p>
              ) : (
                projects.map((project) => (
                  <div
                    key={project.id}
                    className="p-4 rounded-xl bg-[#0d111c] border border-[#232b3e] flex flex-col justify-between gap-3 group hover:border-[#5ab9fc]/40 transition-colors"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-white group-hover:text-[#5ab9fc] transition-colors">
                          {project.title}
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#182030] border border-[#232b3e] text-[#5ab9fc]">
                          {project.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#8891a1] mt-1.5 line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {(project.technologies || []).map((t) => (
                          <span
                            key={t}
                            className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#131824] border border-[#232b3e] text-[#8891a1]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#232b3e]/60">
                      <button
                        type="button"
                        onClick={() => handleProjectEdit(project)}
                        className="btn-secondary text-[11px] px-2.5 py-1 flex items-center space-x-1"
                      >
                        <Edit2 className="w-3 h-3 text-[#5ab9fc]" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleProjectDelete(project.id)}
                        className="px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-[11px] font-mono transition-colors flex items-center space-x-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Testimonials List */}
          <div className={studioCard}>
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#232b3e]">
              <div>
                <h3 className="text-base font-bold text-white">Client Testimonials</h3>
                <p className="text-xs text-[#8891a1] font-mono">
                  {testimonials.length} verified reviews
                </p>
              </div>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {testimonials.length === 0 ? (
                <p className="text-xs text-[#8891a1] py-8 text-center font-mono">
                  No testimonials in database yet.
                </p>
              ) : (
                testimonials.map((t) => (
                  <div
                    key={t.id}
                    className="p-4 rounded-xl bg-[#0d111c] border border-[#232b3e] flex flex-col justify-between gap-3 group hover:border-[#5ab9fc]/40 transition-colors"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-white">{t.name}</p>
                          <p className="text-xs text-[#8891a1]">{t.role}</p>
                        </div>
                        <div className="flex items-center space-x-1 text-amber-400">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span className="text-xs font-mono">{t.rating}/5</span>
                        </div>
                      </div>
                      <p className="text-xs text-[#e9edf3] mt-2 italic line-clamp-2">
                        “{t.content}”
                      </p>
                    </div>

                    <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#232b3e]/60">
                      <button
                        type="button"
                        onClick={() => handleTestimonialEdit(t)}
                        className="btn-secondary text-[11px] px-2.5 py-1 flex items-center space-x-1"
                      >
                        <Edit2 className="w-3 h-3 text-[#5ab9fc]" />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTestimonialDelete(t.id)}
                        className="px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 text-[11px] font-mono transition-colors flex items-center space-x-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Inbound Contact Enquiries Section */}
        <div className={studioCard}>
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-[#232b3e]">
            <div className="flex items-center space-x-2.5">
              <Mail className="w-5 h-5 text-[#5ab9fc]" />
              <div>
                <h3 className="text-base font-bold text-white">Inbound Client Enquiries</h3>
                <p className="text-xs text-[#8891a1] font-mono">
                  Messages submitted via the contact form
                </p>
              </div>
            </div>
            <span className="text-xs font-mono text-[#8891a1]">
              {contacts.length} total messages
            </span>
          </div>

          <div className="space-y-3">
            {contacts.length === 0 ? (
              <p className="text-xs text-[#8891a1] py-8 text-center font-mono">
                No client enquiries yet.
              </p>
            ) : (
              contacts.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl bg-[#0d111c] border border-[#232b3e] flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-white">{c.name}</span>
                      <span className="text-xs font-mono text-[#5ab9fc]">{c.email}</span>
                      {c.subject && (
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#182030] text-[#8891a1]">
                          {c.subject}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#e9edf3] leading-relaxed bg-[#131824] p-3 rounded-lg border border-[#232b3e]/60">
                      {c.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 self-end md:self-center">
                    <select
                      value={c.status}
                      onChange={(e) => handleContactStatus(c.id, e.target.value)}
                      className="bg-[#131824] border border-[#232b3e] rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#5ab9fc]"
                    >
                      <option value="new">● new</option>
                      <option value="read">read</option>
                      <option value="replied">replied</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => handleContactDelete(c.id)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                      title="Delete enquiry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Manage Admins Dialog */}
        <Dialog open={isAdminModalOpen} onOpenChange={setIsAdminModalOpen}>
          <DialogContent className="bg-[#131824] border border-[#232b3e] text-[#e9edf3] max-w-xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center space-x-2 text-[#5ab9fc] mb-1">
                <Users className="w-5 h-5" />
                <DialogTitle className="text-xl font-bold text-white">Administrator Accounts</DialogTitle>
              </div>
              <DialogDescription className="text-xs text-[#8891a1] font-mono">
                Manage administrative personnel and credentials for SB Dev Studio.
              </DialogDescription>
            </DialogHeader>

            {/* Create Admin Form */}
            <div className="p-4 rounded-xl bg-[#0d111c] border border-[#232b3e] space-y-3 mt-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#5ab9fc] flex items-center space-x-1.5">
                <UserPlus className="w-3.5 h-3.5" />
                <span>Create New Admin</span>
              </h4>
              <form onSubmit={handleCreateAdmin} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-mono text-[#8891a1] block mb-1">Username</label>
                    <input
                      required
                      placeholder="e.g. johndoe"
                      value={newAdminForm.username}
                      onChange={(e) => setNewAdminForm((f) => ({ ...f, username: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#131824] border border-[#232b3e] text-xs text-white placeholder-[#454e5f] focus:outline-none focus:border-[#5ab9fc]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-mono text-[#8891a1] block mb-1">Admin Email</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. john@sbdevstudio.in"
                      value={newAdminForm.email}
                      onChange={(e) => setNewAdminForm((f) => ({ ...f, email: e.target.value }))}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#131824] border border-[#232b3e] text-xs text-white placeholder-[#454e5f] focus:outline-none focus:border-[#5ab9fc]"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-mono text-[#8891a1] block mb-1">Temporary Password (min 6 chars)</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={newAdminForm.password}
                    onChange={(e) => setNewAdminForm((f) => ({ ...f, password: e.target.value }))}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#131824] border border-[#232b3e] text-xs text-white placeholder-[#454e5f] focus:outline-none focus:border-[#5ab9fc]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isCreatingAdmin}
                  className="w-full btn-primary text-xs py-2 disabled:opacity-50"
                >
                  {isCreatingAdmin ? "Initializing Admin..." : "Add Administrator"}
                </button>
              </form>
            </div>

            {/* Existing Admins List */}
            <div className="space-y-2 mt-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#8891a1]">
                Active Administrators ({adminList.length})
              </h4>
              {adminListLoading ? (
                <p className="text-xs text-[#8891a1] py-2 font-mono">Loading administrators...</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {adminList.map((admin) => (
                    <div
                      key={admin.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-[#0d111c] border border-[#232b3e] text-xs"
                    >
                      <div>
                        <p className="font-semibold text-white">{admin.username}</p>
                        <p className="text-[#8891a1] text-[11px] font-mono">{admin.email}</p>
                      </div>
                      <span className="text-[10px] font-mono text-[#5ab9fc] bg-[#5ab9fc]/10 border border-[#5ab9fc]/20 px-2 py-0.5 rounded-md">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Change Password Dialog */}
        <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
          <DialogContent className="bg-[#131824] border border-[#232b3e] text-[#e9edf3] max-w-md">
            <DialogHeader>
              <div className="flex items-center space-x-2 text-[#5ab9fc] mb-1">
                <KeyRound className="w-5 h-5" />
                <DialogTitle className="text-xl font-bold text-white">Change Password</DialogTitle>
              </div>
              <DialogDescription className="text-xs text-[#8891a1] font-mono">
                Update credentials for your administrator account.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleChangePassword} className="space-y-3.5 mt-2">
              <div>
                <label className="text-xs font-mono text-[#8891a1] block mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={passwordForm.current_password}
                  onChange={(e) => setPasswordForm((f) => ({ ...f, current_password: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-[#0d111c] border border-[#232b3e] text-xs text-white placeholder-[#454e5f] focus:outline-none focus:border-[#5ab9fc]"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#8891a1] block mb-1">New Password (min 6 chars)</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={passwordForm.new_password}
                  onChange={(e) => setPasswordForm((f) => ({ ...f, new_password: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-[#0d111c] border border-[#232b3e] text-xs text-white placeholder-[#454e5f] focus:outline-none focus:border-[#5ab9fc]"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-[#8891a1] block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={passwordForm.confirm_password}
                  onChange={(e) => setPasswordForm((f) => ({ ...f, confirm_password: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-[#0d111c] border border-[#232b3e] text-xs text-white placeholder-[#454e5f] focus:outline-none focus:border-[#5ab9fc]"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  className="btn-secondary text-xs px-3 py-2"
                  onClick={() => setIsPasswordModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="btn-primary text-xs px-4 py-2 disabled:opacity-50"
                >
                  {isChangingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
