import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { adminLogin } from "@/lib/api";

const AdminLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { token, login } = useAuth();

  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      navigate(location.state?.from?.pathname || "/admin", { replace: true });
    }
  }, [token, navigate, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      toast({ title: "Missing fields", description: "Enter username and password." });
      return;
    }
    setLoading(true);
    try {
      const data = await adminLogin(form.username, form.password);
      login(data.access_token);
      toast({ title: "Welcome", description: "You are now signed in." });
      navigate("/admin", { replace: true });
    } catch (error) {
      const message = error?.response?.data?.detail || "Login failed";
      toast({ title: "Login error", description: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050b17] flex items-center justify-center px-4">
      <Card className="w-full max-w-md border-cyan-500/20 bg-gradient-to-br from-[#0b1a2f] via-[#0c223f] to-[#0b1a2f] text-white shadow-2xl shadow-cyan-500/10">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-white">Admin Portal</CardTitle>
          <CardDescription className="text-slate-300">
            Sign in to manage projects, testimonials, and contacts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm text-slate-200">Username</label>
              <Input
                value={form.username}
                onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                placeholder="admin"
                className="bg-white/5 border-cyan-500/20 text-white placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-200">Password</label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                className="bg-white/5 border-cyan-500/20 text-white placeholder:text-slate-400"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-fuchsia-500 text-white hover:opacity-90"
            >
              {loading ? "Signing in..." : "Sign in"}
            </Button>
            <p className="text-xs text-slate-400 text-center">
              Default credentials on first run: admin / Admin@123
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
