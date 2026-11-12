import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getAdminRoute } from "@/lib/routes";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { adminLogin, verifyAdminOTP, resendAdminOTP } from "@/lib/api";
import SEOHead from "@/components/SEOHead";
import { Shield, Lock, Mail, ArrowLeft, RefreshCw, KeyRound, CheckCircle2 } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { token, login } = useAuth();

  const [step, setStep] = useState("credentials"); // "credentials" | "otp"
  const [form, setForm] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [targetEmail, setTargetEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (token) {
      navigate(location.state?.from?.pathname || getAdminRoute("/sbdevstudio"), { replace: true });
    }
  }, [token, navigate, location.state]);

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast({ title: "Missing fields", description: "Please enter both email and password." });
      return;
    }
    setLoading(true);
    try {
      const data = await adminLogin(form.email, form.password);
      if (data.require_otp) {
        setTargetEmail(data.email || form.email);
        setStep("otp");
        toast({
          title: "Verification Code Sent",
          description: `Enter the 6-digit 2FA code dispatched to ${data.email || form.email}.`,
        });
      } else if (data.access_token) {
        login(data.access_token);
        toast({ title: "Authenticated", description: "Studio session initialized successfully." });
        navigate(getAdminRoute("/sbdevstudio"), { replace: true });
      }
    } catch (error) {
      const message = error?.response?.data?.detail || "Authentication failed. Check your email and password.";
      toast({ title: "Authentication Error", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length < 6) {
      toast({ title: "Incomplete Code", description: "Please enter the full 6-digit code." });
      return;
    }
    setLoading(true);
    try {
      const data = await verifyAdminOTP(targetEmail, cleanOtp);
      login(data.access_token);
      toast({ title: "Access Granted", description: "Two-factor authentication verified." });
      navigate(getAdminRoute("/sbdevstudio"), { replace: true });
    } catch (error) {
      const message = error?.response?.data?.detail || "Invalid or expired code. Please retry.";
      toast({ title: "Verification Failed", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!targetEmail || resending) return;
    setResending(true);
    try {
      await resendAdminOTP(targetEmail);
      toast({ title: "Code Dispatched", description: `A fresh 6-digit code was sent to ${targetEmail}.` });
    } catch (error) {
      const message = error?.response?.data?.detail || "Could not resend verification code.";
      toast({ title: "Resend Error", description: message, variant: "destructive" });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-[#e9edf3] flex flex-col justify-center items-center px-4 py-12 font-sans selection:bg-[#5ab9fc]/20 selection:text-[#5ab9fc]">
      <SEOHead
        title="Admin Sign In | SB Dev Studio"
        description="Administrative authentication portal for SB Dev Studio control center."
        robots="noindex, nofollow"
      />

      <div className="w-full max-w-md">
        {/* Top Header / Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#131824] border border-[#232b3e] text-[#5ab9fc] mb-4">
            {step === "credentials" ? <Lock className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {step === "credentials" ? "Studio Control Center" : "Two-Factor Verification"}
          </h1>
          <p className="text-xs sm:text-sm text-[#8891a1] mt-2 font-mono">
            {step === "credentials"
              ? "Authenticate with studio administrator credentials"
              : `Enter the 6-digit code sent to ${targetEmail}`}
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl bg-[#131824] border border-[#232b3e] p-6 sm:p-8 shadow-2xl">
          {step === "credentials" ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-xs font-mono uppercase tracking-wider text-[#8891a1] mb-2"
                >
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8891a1] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="admin-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="admin@sbdevstudio.in"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0d111c] border border-[#232b3e] text-sm text-white placeholder-[#454e5f] focus:outline-none focus:border-[#5ab9fc] focus:ring-1 focus:ring-[#5ab9fc] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-mono uppercase tracking-wider text-[#8891a1] mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#8891a1] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="admin-password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-[#0d111c] border border-[#232b3e] text-sm text-white placeholder-[#454e5f] focus:outline-none focus:border-[#5ab9fc] focus:ring-1 focus:ring-[#5ab9fc] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-sm flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{loading ? "Authenticating..." : "Sign In to Studio"}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleOTPSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="admin-otp"
                  className="block text-xs font-mono uppercase tracking-wider text-[#8891a1] mb-2 text-center"
                >
                  6-Digit Verification Code
                </label>
                <input
                  id="admin-otp"
                  type="text"
                  inputMode="numeric"
                  autoFocus
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="w-full text-center text-3xl font-mono tracking-[0.35em] py-3.5 rounded-lg bg-[#0d111c] border border-[#232b3e] text-[#5ab9fc] placeholder-[#454e5f] focus:outline-none focus:border-[#5ab9fc] focus:ring-1 focus:ring-[#5ab9fc] transition-colors"
                />
                <p className="text-[11px] text-[#8891a1] text-center mt-2 font-mono">
                  Code expires in 10 minutes · Check spam folder if delayed
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full btn-primary py-3 text-sm flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <span>{loading ? "Verifying..." : "Confirm & Sign In"}</span>
              </button>

              <div className="flex items-center justify-between pt-4 border-t border-[#232b3e] text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setStep("credentials");
                    setOtp("");
                  }}
                  className="text-[#8891a1] hover:text-white flex items-center space-x-1.5 transition-colors font-mono"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Login</span>
                </button>

                <button
                  type="button"
                  disabled={resending}
                  onClick={handleResendOTP}
                  className="text-[#5ab9fc] hover:text-[#5ab9fc]/80 flex items-center space-x-1.5 disabled:opacity-50 transition-colors font-mono"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`} />
                  <span>{resending ? "Dispatching..." : "Resend Code"}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => navigate(getAdminRoute("/"))}
            className="text-xs font-mono text-[#8891a1] hover:text-white transition-colors"
          >
            ← Back to Product Selection
          </button>
        </div>
      </div>
    </div>
  );
}
