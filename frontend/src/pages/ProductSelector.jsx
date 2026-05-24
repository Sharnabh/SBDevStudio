import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getAdminRoute } from "@/lib/routes";

/* ────────────────────────────────────────────
   ProductSelector — Choose which admin panel to enter.
   Shows two big cards: SBDevStudio and Foodies POS.
   ──────────────────────────────────────────── */

const products = [
  {
    id: "sbdevstudio",
    label: "SB Dev Studio",
    description: "Manage portfolio projects, client testimonials, and contact enquiries for the agency website.",
    href: getAdminRoute("/sbdevstudio/login"),
    gradient: "from-cyan-500 via-blue-600 to-fuchsia-600",
    glow: "shadow-cyan-500/30",
    border: "border-cyan-500/30",
    bg: "from-[#07152a] via-[#091e3a] to-[#07152a]",
    icon: (
      <img
        src="/assets/SB_DevStudio_Logo.jpeg"
        alt="SB Dev Studio"
        className="w-20 h-20 object-contain rounded-2xl"
      />
    ),
    tag: "Agency CMS",
    tagColor: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  },
  {
    id: "foodies",
    label: "Foodies POS",
    description: "Monitor restaurants, manage outlets, view subscriptions, and control feature flags across the Foodies platform.",
    href: getAdminRoute("/foodies/login"),
    gradient: "from-orange-500 via-rose-500 to-pink-600",
    glow: "shadow-orange-500/30",
    border: "border-orange-500/30",
    bg: "from-[#1a0a00] via-[#220e00] to-[#1a0a00]",
    icon: (
      <img
        src="/assets/foodies_logo.png"
        alt="Foodies POS"
        className="w-20 h-20 object-contain"
      />
    ),
    tag: "POS Management",
    tagColor: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  },
];

export default function ProductSelector() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050b17] flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-white/5">
        <div>
          <p className="text-xs text-cyan-300/60 uppercase tracking-widest font-semibold">SB Dev Studio</p>
          <h1 className="text-lg font-bold text-white">Admin Portal</h1>
        </div>
        <p className="text-xs text-slate-600">Select a product to continue</p>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-black text-white tracking-tight">Choose a product</h2>
          <p className="text-slate-400 mt-3 text-base max-w-md mx-auto">
            Select the admin panel you want to manage. Both systems are completely isolated.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
          {products.map((product) => (
            <button
              key={product.id}
              onClick={() => navigate(product.href)}
              className={`
                group relative flex flex-col items-start text-left
                bg-gradient-to-br ${product.bg}
                border ${product.border}
                rounded-3xl p-8 gap-5
                shadow-2xl ${product.glow}
                hover:scale-[1.025] hover:shadow-3xl
                transition-all duration-300 ease-out
                focus:outline-none focus:ring-2 focus:ring-white/20
              `}
            >
              {/* Gradient glow blob */}
              <div
                className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br ${product.gradient}`}
              />

              {/* Icon */}
              <div className="relative z-10">{product.icon}</div>

              {/* Tag */}
              <span className={`relative z-10 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${product.tagColor}`}>
                {product.tag}
              </span>

              {/* Text */}
              <div className="relative z-10 flex-1">
                <h3 className="text-2xl font-black text-white mb-2">{product.label}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">{product.description}</p>
              </div>

              {/* Arrow */}
              <div className={`relative z-10 self-end w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${product.gradient} opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200`}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4 9h10M10 5l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
