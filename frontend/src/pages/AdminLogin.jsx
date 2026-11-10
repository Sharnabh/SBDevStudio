import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAdminRoute } from "@/lib/routes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { adminLogin, verifyAdminOTP, resendAdminOTP } from "@/lib/api";
import { ShieldCheck, Mail, Lock, ArrowLeft, RefreshCw, KeyRound } from "lucide-react";

const AdminLogin = () => {
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
      toast({ title: "Missing fields", description: "Please enter your email and password." });
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
          description: `Enter the 6-digit 2FA code sent to ${data.email || form.email}.`,
        });
      } else if (data.access_token) {
        login(data.access_token);
        toast({ title: "Welcome", description: "You are now signed in." });
        navigate(getAdminRoute("/sbdevstudio"), { replace: true });
      }
    } catch (error) {
      const message = error?.response?.data?.detail || "Login failed. Check your email and password.";
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
      toast({ title: "Access Granted", description: "Two-factor authentication verified successfully." });
      navigate(getAdminRoute("/sbdevstudio"), { replace: true });
    } catch (error) {
      const message = error?.response?.data?.detail || "Invalid or expired code. Please try again.";
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
      toast({ title: "Code Resent", description: `A new 6-digit verification code was sent to ${targetEmail}.` });
    } catch (error) {
      const message = error?.response?.data?.detail || "Could not resend verification code.";
      toast({ title: "Resend Error", description: message, variant: "destructive" });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 blur-[140px] rounded-full pointer-events-none" />

      <Card className="w-full max-w-md border border-slate-800 bg-[#0B1120]/90 backdrop-blur-xl text-white shadow-2xl shadow-cyan-500/5 relative z-10">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3 shadow-lg shadow-cyan-500/10">
            {step === "credentials" ? <Lock className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            {step === "credentials" ? "Admin Portal" : "Two-Factor Authentication"}
          </CardTitle>
          <CardDescription className="text-slate-400 text-sm">
            {step === "credentials"
              ? "Sign in with your admin credentials to access the studio."
              : `Enter the 6-digit code sent to ${targetEmail}`}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {step === "credentials" ? (
            <form className="space-y-4" onSubmit={handleCredentialsSubmit}>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="admin@sbdevstudio.in"
                    className="pl-9 bg-slate-900/80 border-slate-700/80 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input
                    type="password"
                    required
                    value={form.password}
                    onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="••••••••"
                    className="pl-9 bg-slate-900/80 border-slate-700/80 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/20"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-2.5 text-sm font-semibold flex items-center justify-center space-x-2 mt-2"
              >
                <span>{loading ? "Verifying..." : "Continue to Verification"}</span>
              </Button>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleOTPSubmit}>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block text-center">
                  6-Digit OTP Code
                </label>
                <Input
                  type="text"
                  inputMode="numeric"
                  autoFocus
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="bg-slate-900/90 border-cyan-500/40 text-cyan-300 text-center text-3xl font-mono tracking-[0.35em] py-6 focus:border-cyan-400 focus:ring-cyan-400/30"
                />
                <p className="text-[11px] text-slate-400 text-center">
                  Code expires in 10 minutes. Check your spam folder if not found.
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full btn-primary py-2.5 text-sm font-semibold flex items-center justify-center space-x-2"
              >
                <span>{loading ? "Verifying Code..." : "Verify & Sign In"}</span>
              </Button>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setStep("credentials");
                    setOtp("");
                  }}
                  className="text-slate-400 hover:text-white flex items-center space-x-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Login</span>
                </button>

                <button
                  type="button"
                  disabled={resending}
                  onClick={handleResendOTP}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1.5 disabled:opacity-50 transition-colors font-medium"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`} />
                  <span>{resending ? "Sending..." : "Resend Code"}</span>
                </button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
