import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useFoodiesAuth } from "@/hooks/useFoodiesAuth";
import { getAdminRoute } from "@/lib/routes";
import SEOHead from "@/components/SEOHead";
import { UtensilsCrossed, Mail, Lock, ArrowLeft } from "lucide-react";

/* ────────────────────────────────────────────
   Foodies POS Login
   Authenticates against Foodies backend
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
      toast({ title: "Missing fields", description: "Enter both your email and password." });
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
        throw new Error(data.message || "Authentication failed");
      }

      const token = data.session?.access_token || data.access_token;
      if (!token) throw new Error("No authorization token received in response");

      login(token);
      toast({ title: "Welcome to Foodies POS", description: "Authenticated successfully." });
      navigate(getAdminRoute("/foodies"), { replace: true });
    } catch (err) {
      toast({ title: "Authentication Failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-[#e9edf3] flex flex-col justify-center items-center px-4 py-12 font-sans selection:bg-[#f59e0b]/20 selection:text-[#f59e0b]">
      <SEOHead
        title="Foodies POS Admin Sign In"
        description="Administrative management sign in for Foodies POS."
        robots="noindex, nofollow"
      />

      <div className="w-full max-w-md">
        {/* Header / Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#131824] border border-[#232b3e] text-[#f59e0b] mb-4">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Foodies POS Admin</h1>
          <p className="text-xs sm:text-sm text-[#8891a1] mt-2 font-mono">
            Restaurant Management & Control Gateway
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-[#131824] border border-[#232b3e] p-6 sm:p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="foodies-email"
                className="block text-xs font-mono uppercase tracking-wider text-[#8891a1] mb-2"
              >
                Manager Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8891a1] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="foodies-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="admin@restaurant.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0d111c] border border-[#232b3e] text-sm text-white placeholder-[#454e5f] focus:outline-none focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="foodies-password"
                className="block text-xs font-mono uppercase tracking-wider text-[#8891a1] mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8891a1] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="foodies-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0d111c] border border-[#232b3e] text-sm text-white placeholder-[#454e5f] focus:outline-none focus:border-[#f59e0b] focus:ring-1 focus:ring-[#f59e0b] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-[#f59e0b] hover:bg-[#d97706] text-black font-semibold text-sm transition-all shadow-md active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Sign In to POS"}
            </button>
          </form>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => navigate(getAdminRoute("/"))}
            className="text-xs font-mono text-[#8891a1] hover:text-white flex items-center justify-center space-x-1.5 mx-auto transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Workspace Selection</span>
          </button>
        </div>
      </div>
    </div>
  );
}
