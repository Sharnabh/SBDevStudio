import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
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
} from "@/lib/api";

const gradientCard = "border-cyan-500/20 bg-gradient-to-br from-[#0b1a2f] via-[#0c223f] to-[#0b1a2f] text-white shadow-xl shadow-cyan-500/10";

const AdminDashboard = () => {
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
    technologiesText: "React, FastAPI, MongoDB",
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

  const categoryOptions = useMemo(() => [
    "Web Development",
    "Mobile Apps",
    "AI/ML",
    "Automation",
    "Design",
    "All",
  ], []);

  useEffect(() => {
    const load = async () => {
      if (!token) {
        navigate("/admin/login", { replace: true });
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
        navigate("/admin/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token, toast, logout, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
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
        toast({ title: "Project updated" });
      } else {
        const created = await createProject(payload);
        setProjects((prev) => [created, ...prev]);
        toast({ title: "Project created" });
      }
      setProjectForm({ title: "", description: "", category: "Web Development", technologiesText: "React, FastAPI, MongoDB", image: "", link: "" });
      setEditingProject(null);
    } catch (error) {
      const detail = error?.response?.data?.detail || "Save failed";
      toast({ title: "Project error", description: detail });
    }
  };

  const handleProjectEdit = (project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title,
      description: project.description,
      category: project.category,
      technologiesText: project.technologies.join(", "),
      image: project.image,
      link: project.link,
    });
  };

  const handleProjectDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      toast({ title: "Project deleted" });
    } catch (error) {
      toast({ title: "Delete failed", description: "Could not delete project" });
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
        toast({ title: "Testimonial created" });
      }
      setTestimonialForm({ name: "", role: "", content: "", rating: 5, avatar: "" });
      setEditingTestimonial(null);
    } catch (error) {
      const detail = error?.response?.data?.detail || "Save failed";
      toast({ title: "Testimonial error", description: detail });
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
    if (!window.confirm("Delete this testimonial?")) return;
    try {
      await deleteTestimonial(id);
      setTestimonials((prev) => prev.filter((t) => t.id !== id));
      toast({ title: "Testimonial deleted" });
    } catch (error) {
      toast({ title: "Delete failed", description: "Could not delete testimonial" });
    }
  };

  const handleContactStatus = async (id, status) => {
    try {
      const updated = await updateContactStatus(id, status);
      setContacts((prev) => prev.map((c) => (c.id === id ? updated : c)));
      toast({ title: "Status updated" });
    } catch (error) {
      toast({ title: "Update failed", description: "Could not update contact" });
    }
  };

  const handleContactDelete = async (id) => {
    if (!window.confirm("Delete this contact?")) return;
    try {
      await deleteContact(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
      toast({ title: "Contact deleted" });
    } catch (error) {
      toast({ title: "Delete failed", description: "Could not delete contact" });
    }
  };

  const handleUpload = async (file, subfolder, onDone) => {
    if (!file) return;
    try {
      const res = await uploadImage(file, subfolder);
      onDone(res.url);
      toast({ title: "Uploaded", description: file.name });
    } catch (error) {
      const detail = error?.response?.data?.detail || "Upload failed";
      toast({ title: "Upload error", description: detail });
    }
  };

  const statItems = stats
    ? [
        { label: "Projects", value: stats.total_projects },
        { label: "Testimonials", value: stats.total_testimonials },
        { label: "Contacts", value: stats.total_contacts },
        { label: "New Contacts", value: stats.new_contacts },
      ]
    : [];

  return (
    <div className="min-h-screen bg-[#050b17] text-white px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-cyan-300/80">SB Dev Studio Admin</p>
            <h1 className="text-3xl font-semibold">Control Center</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-cyan-400/40 text-cyan-200" onClick={() => window.open("http://localhost:3000", "_blank")}>View site</Button>
            <Button variant="secondary" className="bg-white/10 border border-cyan-400/40" onClick={handleLogout}>Sign out</Button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {statItems.map((item) => (
            <Card key={item.label} className={`${gradientCard} border border-cyan-500/30`}>
              <CardHeader className="pb-2">
                <CardDescription className="text-slate-300">{item.label}</CardDescription>
                <CardTitle className="text-2xl text-white">{loading ? "--" : item.value}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className={gradientCard}>
            <CardHeader>
              <CardTitle>{editingProject ? "Edit Project" : "Create Project"}</CardTitle>
              <CardDescription className="text-slate-300">Showcase your work with visuals and stack.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-3" onSubmit={handleProjectSubmit}>
                <Input
                  placeholder="Title"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm((f) => ({ ...f, title: e.target.value }))}
                  className="bg-white/5 border-cyan-500/20 text-white"
                />
                <Textarea
                  placeholder="Description"
                  value={projectForm.description}
                  onChange={(e) => setProjectForm((f) => ({ ...f, description: e.target.value }))}
                  className="bg-white/5 border-cyan-500/20 text-white"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Category"
                    list="project-categories"
                    value={projectForm.category}
                    onChange={(e) => setProjectForm((f) => ({ ...f, category: e.target.value }))}
                    className="bg-white/5 border-cyan-500/20 text-white"
                  />
                  <Input
                    placeholder="Technologies (comma separated)"
                    value={projectForm.technologiesText}
                    onChange={(e) => setProjectForm((f) => ({ ...f, technologiesText: e.target.value }))}
                    className="bg-white/5 border-cyan-500/20 text-white"
                  />
                </div>
                <datalist id="project-categories">
                  {categoryOptions.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Image URL"
                    value={projectForm.image}
                    onChange={(e) => setProjectForm((f) => ({ ...f, image: e.target.value }))}
                    className="bg-white/5 border-cyan-500/20 text-white"
                  />
                  <Input
                    placeholder="Live link"
                    value={projectForm.link}
                    onChange={(e) => setProjectForm((f) => ({ ...f, link: e.target.value }))}
                    className="bg-white/5 border-cyan-500/20 text-white"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUpload(e.target.files?.[0], "projects", (url) => setProjectForm((f) => ({ ...f, image: url })))}
                    className="text-slate-200 text-sm"
                  />
                  {projectForm.image && <span className="text-xs text-cyan-300">Image ready ✓</span>}
                </div>
                <div className="flex items-center gap-3">
                  {editingProject && (
                    <Button type="button" variant="ghost" className="text-slate-300" onClick={() => setEditingProject(null)}>
                      Cancel edit
                    </Button>
                  )}
                  <Button type="submit" className="bg-gradient-to-r from-cyan-500 via-blue-500 to-fuchsia-500 text-white">
                    {editingProject ? "Update project" : "Create project"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className={gradientCard}>
            <CardHeader>
              <CardTitle>{editingTestimonial ? "Edit Testimonial" : "Create Testimonial"}</CardTitle>
              <CardDescription className="text-slate-300">Add social proof from happy clients.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-3" onSubmit={handleTestimonialSubmit}>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="Name"
                    value={testimonialForm.name}
                    onChange={(e) => setTestimonialForm((f) => ({ ...f, name: e.target.value }))}
                    className="bg-white/5 border-cyan-500/20 text-white"
                  />
                  <Input
                    placeholder="Role"
                    value={testimonialForm.role}
                    onChange={(e) => setTestimonialForm((f) => ({ ...f, role: e.target.value }))}
                    className="bg-white/5 border-cyan-500/20 text-white"
                  />
                </div>
                <Textarea
                  placeholder="What did they say?"
                  value={testimonialForm.content}
                  onChange={(e) => setTestimonialForm((f) => ({ ...f, content: e.target.value }))}
                  className="bg-white/5 border-cyan-500/20 text-white"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    placeholder="Rating (1-5)"
                    value={testimonialForm.rating}
                    onChange={(e) => setTestimonialForm((f) => ({ ...f, rating: e.target.value }))}
                    className="bg-white/5 border-cyan-500/20 text-white"
                  />
                  <Input
                    placeholder="Avatar URL"
                    value={testimonialForm.avatar}
                    onChange={(e) => setTestimonialForm((f) => ({ ...f, avatar: e.target.value }))}
                    className="bg-white/5 border-cyan-500/20 text-white"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleUpload(e.target.files?.[0], "testimonials", (url) => setTestimonialForm((f) => ({ ...f, avatar: url })))}
                    className="text-slate-200 text-sm"
                  />
                  {testimonialForm.avatar && <span className="text-xs text-cyan-300">Avatar ready ✓</span>}
                </div>
                <div className="flex items-center gap-3">
                  {editingTestimonial && (
                    <Button type="button" variant="ghost" className="text-slate-300" onClick={() => setEditingTestimonial(null)}>
                      Cancel edit
                    </Button>
                  )}
                  <Button type="submit" className="bg-gradient-to-r from-cyan-500 via-blue-500 to-fuchsia-500 text-white">
                    {editingTestimonial ? "Update testimonial" : "Create testimonial"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className={gradientCard}>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription className="text-slate-300">Manage portfolio entries.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {projects.length === 0 && <p className="text-slate-400 text-sm">No projects yet.</p>}
              {projects.map((project) => (
                <div key={project.id} className="border border-cyan-500/20 rounded-lg p-4 bg-white/5">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <p className="text-lg font-semibold text-white">{project.title}</p>
                      <p className="text-sm text-slate-300">{project.description}</p>
                      <p className="text-xs text-cyan-200 mt-1">{project.category}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.technologies.map((tech) => (
                          <span key={tech} className="text-xs px-2 py-1 bg-cyan-500/10 text-cyan-200 rounded-full border border-cyan-500/30">{tech}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="secondary" className="bg-white/10" onClick={() => handleProjectEdit(project)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleProjectDelete(project.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className={gradientCard}>
            <CardHeader>
              <CardTitle>Testimonials</CardTitle>
              <CardDescription className="text-slate-300">Edit social proof.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {testimonials.length === 0 && <p className="text-slate-400 text-sm">No testimonials yet.</p>}
              {testimonials.map((t) => (
                <div key={t.id} className="border border-cyan-500/20 rounded-lg p-4 bg-white/5">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <p className="text-lg font-semibold text-white">{t.name}</p>
                      <p className="text-sm text-slate-300">{t.role}</p>
                      <p className="text-sm text-slate-200 mt-2">“{t.content}”</p>
                      <p className="text-xs text-cyan-200 mt-1">Rating: {t.rating}/5</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button size="sm" variant="secondary" className="bg-white/10" onClick={() => handleTestimonialEdit(t)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleTestimonialDelete(t.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className={gradientCard}>
          <CardHeader>
            <CardTitle>Contacts</CardTitle>
            <CardDescription className="text-slate-300">Respond, update status, or clean up.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {contacts.length === 0 && <p className="text-slate-400 text-sm">No contacts yet.</p>}
            {contacts.map((c) => (
              <div key={c.id} className="border border-cyan-500/20 rounded-lg p-4 bg-white/5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-white font-semibold">{c.name} · <span className="text-cyan-200">{c.email}</span></p>
                    <p className="text-slate-300 text-sm">{c.subject}</p>
                    <p className="text-slate-200 text-sm">{c.message}</p>
                    <p className="text-xs text-cyan-200">Status: {c.status}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={c.status}
                      onChange={(e) => handleContactStatus(c.id, e.target.value)}
                      className="bg-white/5 border border-cyan-500/30 rounded-md px-2 py-1 text-sm text-white"
                    >
                      <option value="new">new</option>
                      <option value="read">read</option>
                      <option value="replied">replied</option>
                    </select>
                    <Button size="sm" variant="destructive" onClick={() => handleContactDelete(c.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
