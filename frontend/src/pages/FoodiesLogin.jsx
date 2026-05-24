import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useFoodiesAuth } from "@/hooks/useFoodiesAuth";
import { getAdminRoute } from "@/lib/routes";

/* ────────────────────────────────────────────
   Foodies POS Login
   Authenticates against the Foodies NestJS
   backend on port 3001 using email + password.
   ──────────────────────────────────────────── */

const FOODIE_API = process.env.REACT_APP_FOODIE_API || "https://api.foodies.sbdevstudio.in";

export default function FoodiesLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useFoodiesAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast({ title: "Missing fields", description: "Enter your email and password." });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${FOODIE_API}/auth/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Foodies returns { session: { access_token: "..." }, user: {...} }
      const token = data.session?.access_token || data.access_token;
      if (!token) throw new Error("No token in response");

      login(token);
      toast({ title: "Welcome to Foodies POS 🍽️", description: "Signed in successfully." });
      navigate(getAdminRoute("/foodies"), { replace: true });
    } catch (err) {
      toast({ title: "Login failed", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0500] flex flex-col items-center justify-center px-4">
      {/* Back link */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 text-sm text-slate-500 hover:text-slate-300 flex items-center gap-1.5 transition-colors"
      >
        ← Back to products
      </button>

      <div className="w-full max-w-sm">
        {/* Logo + heading */}
        <div className="flex flex-col items-center mb-10">
          <img
            src="/assets/foodies_logo.png"
            alt="Foodies POS"
            className="w-20 h-20 object-contain mb-5"
          />
          <h1 className="text-2xl font-black text-white tracking-tight">Foodies POS</h1>
          <p className="text-sm text-orange-400/70 mt-1 uppercase tracking-widest font-bold">Admin Login</p>
        </div>

        {/* Form card */}
        <div className="bg-gradient-to-br from-[#1a0800] to-[#220e00] border border-orange-500/20 rounded-3xl p-8 shadow-2xl shadow-orange-500/10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-orange-300/70 uppercase tracking-widest">
                Email
              </label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="admin@restaurant.com"
                className="bg-white/5 border-orange-500/20 text-white placeholder:text-slate-500 focus:border-orange-500/50 focus:ring-orange-500/20 h-11 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-orange-300/70 uppercase tracking-widest">
                Password
              </label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                className="bg-white/5 border-orange-500/20 text-white placeholder:text-slate-500 focus:border-orange-500/50 focus:ring-orange-500/20 h-11 rounded-xl"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-orange-500 to-rose-600 text-white font-black rounded-xl hover:opacity-90 disabled:opacity-50 transition-all text-sm mt-2"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-xs text-slate-600 text-center mt-6">
          Foodies POS · Admin Access Only
        </p>
      </div>
    </div>
  );
}
