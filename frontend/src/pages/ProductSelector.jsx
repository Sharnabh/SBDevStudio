import React from "react";
import { useNavigate } from "react-router-dom";
import { getAdminRoute } from "@/lib/routes";
import SEOHead from "@/components/SEOHead";
import { ArrowRight, Layers, UtensilsCrossed, ExternalLink, Shield } from "lucide-react";

/* ────────────────────────────────────────────
   ProductSelector — Choose which admin portal to enter.
   Redesigned with the SB Dev Studio dark slate design system.
   ──────────────────────────────────────────── */

export default function ProductSelector() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0d14] text-[#e9edf3] flex flex-col font-sans selection:bg-[#5ab9fc]/20 selection:text-[#5ab9fc]">
      <SEOHead
        title="Select Workspace | SB Dev Studio Admin"
        description="Select an administrative workspace for SB Dev Studio or Foodies POS."
        robots="noindex, nofollow"
      />

      {/* Top Navigation Bar */}
      <header className="border-b border-[#232b3e] bg-[#0d111c]/80 backdrop-blur-md px-6 sm:px-10 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img
            src="/assets/SB_DevStudio_Logo.svg"
            alt="SB Dev Studio"
            className="w-7 h-7 object-contain"
          />
          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="text-[#8891a1]">studio</span>
            <span className="text-[#454e5f]">/</span>
            <span className="text-[#5ab9fc] font-semibold">admin-portals</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs text-[#8891a1]">
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#131824] border border-[#232b3e]">
            <Shield className="w-3 h-3 text-[#5ab9fc]" />
            <span>Isolated Workspaces</span>
          </span>
          <a
            href="/"
            className="hidden sm:inline-flex items-center space-x-1 text-[#8891a1] hover:text-[#e9edf3] transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-16">
        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-[#131824] border border-[#232b3e] text-xs font-mono text-[#8891a1] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5ab9fc]"></span>
            <span>Authentication Gateway</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
            Select Workspace
          </h1>
          <p className="text-sm sm:text-base text-[#8891a1] leading-relaxed">
            Choose the application portal you want to manage. Each control panel maintains isolated authentication, roles, and database scopes.
          </p>
        </div>

        {/* Portal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          {/* Card 1: SB Dev Studio Agency CMS */}
          <button
            type="button"
            onClick={() => navigate(getAdminRoute("/sbdevstudio/login"))}
            className="group relative flex flex-col items-start text-left p-8 rounded-2xl bg-[#131824] border border-[#232b3e] hover:border-[#5ab9fc]/60 hover:bg-[#182030] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5ab9fc]"
          >
            <div className="w-full flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#182030] border border-[#232b3e] flex items-center justify-center text-[#5ab9fc] group-hover:scale-105 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-[#5ab9fc]/10 text-[#5ab9fc] border border-[#5ab9fc]/20 font-medium">
                Agency CMS
              </span>
            </div>

            <h2 className="text-xl font-bold text-white mb-2 group-hover:text-[#5ab9fc] transition-colors flex items-center space-x-2">
              <span>SB Dev Studio</span>
            </h2>

            <p className="text-xs sm:text-sm text-[#8891a1] leading-relaxed flex-1 mb-6">
              Manage live portfolio case studies, verified client testimonials, and inbound contact enquiries for the primary agency platform.
            </p>

            <div className="w-full pt-4 border-t border-[#232b3e] flex items-center justify-between text-xs font-mono text-[#8891a1] group-hover:text-[#e9edf3]">
              <span>Enter Control Center</span>
              <ArrowRight className="w-4 h-4 text-[#5ab9fc] group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Card 2: Foodies POS Platform */}
          <button
            type="button"
            onClick={() => navigate(getAdminRoute("/foodies/login"))}
            className="group relative flex flex-col items-start text-left p-8 rounded-2xl bg-[#131824] border border-[#232b3e] hover:border-[#f59e0b]/60 hover:bg-[#182030] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f59e0b]"
          >
            <div className="w-full flex items-center justify-between mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#182030] border border-[#232b3e] flex items-center justify-center text-[#f59e0b] group-hover:scale-105 transition-transform">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20 font-medium">
                POS Platform
              </span>
            </div>

            <h2 className="text-xl font-bold text-white mb-2 group-hover:text-[#f59e0b] transition-colors flex items-center space-x-2">
              <span>Foodies POS</span>
            </h2>

            <p className="text-xs sm:text-sm text-[#8891a1] leading-relaxed flex-1 mb-6">
              Monitor restaurant partners, manage multi-outlet billing, oversee live order streams, and toggle real-time feature flags.
            </p>

            <div className="w-full pt-4 border-t border-[#232b3e] flex items-center justify-between text-xs font-mono text-[#8891a1] group-hover:text-[#e9edf3]">
              <span>Enter Restaurant Admin</span>
              <ArrowRight className="w-4 h-4 text-[#f59e0b] group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* Studio System Footer Note */}
        <p className="text-xs text-[#8891a1] mt-14 font-mono">
          SB Dev Studio v2.5 · Production Workspaces
        </p>
      </main>
    </div>
  );
}
