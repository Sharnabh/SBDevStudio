import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFoodiesAuth } from "@/hooks/useFoodiesAuth";
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  User as UserIcon, 
  Calendar, 
  Info, 
  Search, 
  Sparkles, 
  Key, 
  ToggleLeft, 
  ToggleRight, 
  X,
  ChevronDown,
  LogOut,
  Plus,
  RefreshCw,
  Store,
  LayoutDashboard,
  Tags,
  Zap,
  Globe,
  Settings,
  Shield,
  Trash2,
  ChevronRight,
  TrendingUp,
  CreditCard,
  Users
} from "lucide-react";
import { getAdminRoute } from "@/lib/routes";

/* ────────────────────────────────────────────
   Foodies POS Admin Dashboard
   Manages restaurants, outlets, subscriptions,
   and feature flags across the Foodies platform.
   Styled to match the Foodies POS design language:
   warm amber/orange primary, dark surfaces.
   ──────────────────────────────────────────── */

// Mirrors the URL resolution logic in foodie-frontend/src/lib/api.ts:
// Uses the same hostname as the browser, but always points to port 3001.
// Override with REACT_APP_FOODIE_API in .env if needed (e.g. for production).
const FOODIE_API =
  process.env.REACT_APP_FOODIE_API ||
  (typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.hostname}:3001`
    : "http://localhost:3001");

// Foodies backend uses its own JWT stored by useFoodiesAuth.
async function foodieFetch(endpoint, options = {}) {
  const token = localStorage.getItem("foodies_admin_token");
  const res = await fetch(`${FOODIE_API}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `API error ${res.status}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

/* ── stat card style ── */
const Stat = ({ label, value, color = "orange" }) => {
  const colors = {
    orange: "from-orange-500/10 to-amber-500/5 border-orange-500/20 text-orange-300",
    rose:   "from-rose-500/10 to-pink-500/5 border-rose-500/20 text-rose-300",
    amber:  "from-amber-500/10 to-yellow-500/5 border-amber-500/20 text-amber-300",
    green:  "from-emerald-500/10 to-teal-500/5 border-emerald-500/20 text-emerald-300",
  };
  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-5 ${colors[color]}`}>
      <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-1">{label}</p>
      <p className="text-3xl font-black text-white">{value ?? "—"}</p>
    </div>
  );
};

/* ── Section header ── */
const Section = ({ title, sub }) => (
  <div className="mb-4">
    <h2 className="text-xl font-black text-white">{title}</h2>
    {sub && <p className="text-sm text-slate-400 mt-0.5">{sub}</p>}
  </div>
);

/* ── Table row ── */
const Row = ({ children, className = "" }) => (
  <div className={`flex items-center gap-4 px-5 py-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors ${className}`}>
    {children}
  </div>
);

/* ── Badge ── */
const Badge = ({ children, color = "gray" }) => {
  const colors = {
    green:  "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    orange: "bg-orange-500/15 text-orange-300 border-orange-500/30",
    red:    "bg-rose-500/15 text-rose-300 border-rose-500/30",
    gray:   "bg-white/5 text-slate-400 border-white/10",
    amber:  "bg-amber-500/15 text-amber-300 border-amber-500/30",
  };
  return (
    <span className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${colors[color]}`}>
      {children}
    </span>
  );
};

/* ── Toggle switch ── */
const ToggleFlag = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    className={`relative w-11 h-6 rounded-full transition-all duration-200 flex-shrink-0 ${checked ? "bg-orange-500" : "bg-white/10"}`}
  >
    <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`} />
  </button>
);

/* ── Sidebar nav items ── */
const NAV = [
  { id: "overview",           label: "Overview",            icon: "📊" },
  { id: "restaurants",        label: "Restaurants",          icon: "🏪" },
  { id: "subscription-packs", label: "Subscription Packs",  icon: "📦" },
  { id: "feature-flags",      label: "Feature Flags",       icon: "🚩" },
];

const CustomPackDropdown = ({ value, onChange, disabled, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);
  const buttonRef = useRef(null);

  const selectedOption = options.find(o => o.value === value) || options[0];

  const toggleDropdown = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // If there is less than 220px below, open upwards to avoid clipping
      setOpenUpwards(spaceBelow < 220);
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative w-full">
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={toggleDropdown}
        className="w-full text-left text-xs bg-white/[0.03] border border-white/[0.08] hover:border-orange-500/40 rounded-lg px-3 py-2 text-white transition-all flex items-center justify-between group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="truncate">{selectedOption.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-orange-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className={`absolute z-50 w-full bg-[#1a0b05] border border-orange-500/20 rounded-xl shadow-2xl shadow-black py-1 overflow-hidden animate-fade-in ${openUpwards ? "bottom-full mb-1 origin-bottom" : "top-full mt-1 origin-top"}`}>
          <div 
            className="fixed inset-0 z-[-1]" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="max-h-48 overflow-y-auto">
            {options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 text-xs transition-colors hover:bg-orange-500/10 ${
                  value === opt.value ? "text-orange-400 font-bold bg-white/[0.04]" : "text-slate-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function FoodiesDashboard() {
  const navigate = useNavigate();
  const { logout } = useFoodiesAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedRestaurantId = searchParams.get("restaurantId");
  const [outletQuery, setOutletQuery] = useState("");

  const [restaurants, setRestaurants] = useState([]);
  const [outlets, setOutlets]         = useState([]);
  const [stats, setStats]             = useState(null);
  const [subscriptionPacks, setSubscriptionPacks] = useState([]);
  const [modulePricing, setModulePricing] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  // For inline feature flag editing
  const [editingFlags, setEditingFlags] = useState({ id: null, type: null, flags: {} });
  const [savingFlags, setSavingFlags]   = useState(false);

  // Global feature flags state
  const [globalFlags, setGlobalFlags] = useState([]);
  const [newFlag, setNewFlag]         = useState({ feature_key: "", is_enabled: true, description: "" });
  const [flagQuery, setFlagQuery]     = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGlobalFlag, setEditingGlobalFlag] = useState(null); // id of flag being edited
  const [savingGlobalFlag, setSavingGlobalFlag]   = useState(false);

  // Subscription Pack Editor State
  const [showPackModal, setShowPackModal] = useState(false);
  const [packFormData, setPackFormData] = useState({
    id: null, name: "", description: "", price_monthly: 0, price_yearly: 0,
    has_pos: false, has_whatsapp: false, has_delivery_partner: false, has_ordering_app: false,
    is_custom: false, max_staff_per_outlet: 5, feature_flags: {}
  });
  const [savingPack, setSavingPack] = useState(false);

  // Custom Module Modal State
  const [showCustomModuleModal, setShowCustomModuleModal] = useState(false);
  const [customModuleData, setCustomModuleData] = useState({ outletId: null, modules: {} });
  const [savingCustomModules, setSavingCustomModules] = useState(false);

  // Multi-step Restaurant Onboarding Wizard state
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [onboardStep, setOnboardStep] = useState(1);
  const [onboardingSubmitting, setOnboardingSubmitting] = useState(false);
  
  const defaultFlags = {
    dashboard_enabled: true,
    orders_enabled: true,
    tables_enabled: true,
    bookings_enabled: true,
    menu_enabled: true,
    marketing_enabled: true,
    customers_enabled: true,
    kitchen_enabled: true,
    analytics_enabled: true,
    staff_enabled: true,
  };

  const [onboardData, setOnboardData] = useState({
    restaurant: {
      name: "",
      owner_name: "",
      phone_number: "",
      address: "",
      details: "",
      feature_flags: { ...defaultFlags },
    },
    owner: {
      email: "",
      password: "",
    },
    outlet: {
      name: "",
      address: "",
      latitude: "",
      longitude: "",
      outlet_code: "",
      feature_flags: { ...defaultFlags },
    },
    manager: {
      is_owner: true,
      name: "",
      email: "",
      password: "",
      phone: "",
    }
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [r, o, s, gf, sp, mp] = await Promise.all([
        foodieFetch("/admin/restaurants"),
        foodieFetch("/admin/outlets"),
        foodieFetch("/admin/stats"),
        foodieFetch("/admin/feature-flags").catch(() => []),
        foodieFetch("/admin/subscription-packs").catch(() => []),
        foodieFetch("/admin/module-pricing").catch(() => []),
      ]);
      setRestaurants(Array.isArray(r) ? r : []);
      setOutlets(Array.isArray(o) ? o : []);
      setStats(s || null);
      setGlobalFlags(Array.isArray(gf) ? gf : []);
      setSubscriptionPacks(Array.isArray(sp) ? sp : []);
      setModulePricing(Array.isArray(mp) ? mp : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate(getAdminRoute("/foodies/login"), { replace: true });
  };

  /* ── Feature flag editing ── */
  const openFlagEditor = (id, type, flags) => {
    setEditingFlags({ id, type, flags: { ...flags } });
  };

  const saveFlags = async () => {
    const { id, type, flags } = editingFlags;
    if (!id) return;
    setSavingFlags(true);
    try {
      const endpoint = type === "restaurant"
        ? `/restaurants/${id}/feature-flags`
        : `/outlets/${id}/feature-flags`;
      await foodieFetch(endpoint, {
        method: "PATCH",
        body: JSON.stringify({ feature_flags: flags }),
      });
      await loadData();
      setEditingFlags({ id: null, type: null, flags: {} });
    } catch (err) {
      alert("Failed to save: " + err.message);
    } finally {
      setSavingFlags(false);
    }
  };

  const handleAssignPack = async (outletId, packId) => {
    if (packId === "custom") {
      const o = outlets.find(x => x.id === outletId);
      setCustomModuleData({ outletId, modules: o?.custom_modules || {} });
      setShowCustomModuleModal(true);
      return;
    }
    try {
      setLoading(true);
      await foodieFetch(`/admin/outlets/${outletId}/pack`, {
        method: "PATCH",
        body: JSON.stringify({ pack_id: packId || null, is_custom_subscription: false }),
      });
      await loadData();
    } catch (err) {
      alert("Failed to assign pack: " + err.message);
      setLoading(false);
    }
  };

  const handleSaveCustomModules = async () => {
    try {
      setSavingCustomModules(true);
      await foodieFetch(`/admin/outlets/${customModuleData.outletId}/pack`, {
        method: "PATCH",
        body: JSON.stringify({ is_custom_subscription: true, custom_modules: customModuleData.modules }),
      });
      setShowCustomModuleModal(false);
      await loadData();
    } catch (err) {
      alert("Failed to save custom configuration: " + err.message);
    } finally {
      setSavingCustomModules(false);
    }
  };

  /* ── Subscription Packs CRUD ── */
  const openPackModal = (pack = null) => {
    if (pack) {
      setPackFormData({ ...pack });
    } else {
      setPackFormData({
        id: null, name: "", description: "", price_monthly: 0, price_yearly: 0,
        has_pos: false, has_whatsapp: false, has_delivery_partner: false, has_ordering_app: false,
        is_custom: false, max_staff_per_outlet: 5, feature_flags: {}
      });
    }
    setShowPackModal(true);
  };

  const handleSavePack = async (e) => {
    e.preventDefault();
    setSavingPack(true);
    try {
      if (packFormData.id) {
        await foodieFetch(`/admin/subscription-packs/${packFormData.id}`, {
          method: "PATCH",
          body: JSON.stringify(packFormData)
        });
      } else {
        await foodieFetch("/admin/subscription-packs", {
          method: "POST",
          body: JSON.stringify(packFormData)
        });
      }
      await loadData();
      setShowPackModal(false);
    } catch (err) {
      alert("Failed to save pack: " + err.message);
    } finally {
      setSavingPack(false);
    }
  };

  const handleDeletePack = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pack? It will be removed from all outlets using it.")) return;
    try {
      setLoading(true);
      await foodieFetch(`/admin/subscription-packs/${id}`, { method: "DELETE" });
      await loadData();
    } catch (err) {
      alert("Failed to delete pack: " + err.message);
      setLoading(false);
    }
  };

  /* ── Global Feature Flags CRUD ── */
  const handleCreateGlobalFlag = async (e) => {
    e.preventDefault();
    if (!newFlag.feature_key.trim()) return;
    setSavingGlobalFlag(true);
    try {
      const created = await foodieFetch("/admin/feature-flags", {
        method: "POST",
        body: JSON.stringify({
          feature_key: newFlag.feature_key.trim(),
          is_enabled: newFlag.is_enabled,
          description: newFlag.description.trim(),
        }),
      });
      setGlobalFlags((prev) => [...prev, created].sort((a, b) => a.feature_key.localeCompare(b.feature_key)));
      setNewFlag({ feature_key: "", is_enabled: true, description: "" });
      setShowAddForm(false);
    } catch (err) {
      alert("Failed to create flag: " + err.message);
    } finally {
      setSavingGlobalFlag(false);
    }
  };

  const handleToggleGlobalFlag = async (id, currentVal) => {
    try {
      const updated = await foodieFetch(`/admin/feature-flags/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ is_enabled: !currentVal }),
      });
      setGlobalFlags((prev) => prev.map((f) => (f.id === id ? updated : f)));
    } catch (err) {
      alert("Failed to toggle flag: " + err.message);
    }
  };

  const handleUpdateGlobalFlagDesc = async (id, newDesc) => {
    try {
      const updated = await foodieFetch(`/admin/feature-flags/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ description: newDesc }),
      });
      setGlobalFlags((prev) => prev.map((f) => (f.id === id ? updated : f)));
      setEditingGlobalFlag(null);
    } catch (err) {
      alert("Failed to update description: " + err.message);
    }
  };

  const handleDeleteGlobalFlag = async (id) => {
    if (!window.confirm("Are you sure you want to delete this global feature flag?")) return;
    try {
      await foodieFetch(`/admin/feature-flags/${id}`, {
        method: "DELETE",
      });
      setGlobalFlags((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      alert("Failed to delete flag: " + err.message);
    }
  };

  /* ── Multi-Step Restaurant Onboarding Wizard Submit ── */
  const handleOnboardSubmit = async (e) => {
    e.preventDefault();
    setOnboardingSubmitting(true);
    try {
      // Build final payload
      const payload = {
        restaurant: {
          ...onboardData.restaurant,
        },
        owner: {
          ...onboardData.owner,
        },
        outlet: {
          ...onboardData.outlet,
          latitude: onboardData.outlet.latitude ? parseFloat(onboardData.outlet.latitude) : undefined,
          longitude: onboardData.outlet.longitude ? parseFloat(onboardData.outlet.longitude) : undefined,
        },
        manager: {
          ...onboardData.manager,
        }
      };

      await foodieFetch("/admin/restaurants/onboard", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      alert("🎉 Restaurant, Owner, Outlet, and Manager onboarded successfully!");
      
      // Reset forms and reload dashboard data
      setShowOnboardModal(false);
      setOnboardStep(1);
      setOnboardData({
        restaurant: {
          name: "",
          owner_name: "",
          phone_number: "",
          address: "",
          details: "",
          feature_flags: { ...defaultFlags },
        },
        owner: {
          email: "",
          password: "",
        },
        outlet: {
          name: "",
          address: "",
          latitude: "",
          longitude: "",
          outlet_code: "",
          feature_flags: { ...defaultFlags },
        },
        manager: {
          is_owner: true,
          name: "",
          email: "",
          password: "",
          phone: "",
        }
      });
      await loadData();
    } catch (err) {
      alert("Failed to onboard restaurant: " + err.message);
    } finally {
      setOnboardingSubmitting(false);
    }
  };

  /* ── Derived stats ── */
  const totalOutlets   = outlets.length;
  const activeRests    = restaurants.filter((r) => r.is_active !== false).length;
  const flaggedRests   = restaurants.filter((r) => r.feature_flags && Object.values(r.feature_flags).some((v) => v === false)).length;

  /* ── All feature flag keys ── */
  const FLAG_KEYS = [
    "dashboard_enabled",
    "orders_enabled",
    "tables_enabled",
    "bookings_enabled",
    "menu_enabled",
    "marketing_enabled",
    "customers_enabled",
    "kitchen_enabled",
    "analytics_enabled",
    "staff_enabled",
    "settings_enabled",
  ];

  const flagLabel = (key) => key.replace("_enabled", "").replace(/_/g, " ");

  const currentRest = restaurants.find((r) => r.id === selectedRestaurantId);
  const linkedOutlets = outlets.filter((o) => o.restaurant_id === selectedRestaurantId);
  const sub = Array.isArray(currentRest?.subscriptions)
    ? currentRest.subscriptions[0]
    : currentRest?.subscriptions || {
        plan_id: "starter",
        status: "active",
        max_outlets: 1,
        max_staff_per_outlet: 5,
      };

  const planNames = [...new Set(linkedOutlets.map(o => {
    if (o.is_custom_subscription) return "Custom";
    if (o.subscription_packs) {
      const pack = Array.isArray(o.subscription_packs) ? o.subscription_packs[0] : o.subscription_packs;
      return pack?.name;
    }
    return null;
  }).filter(name => name))];
  
  const displayPlanName = planNames.length === 0 ? "Not Assigned" : planNames.join(" + ");

  const filteredOutlets = linkedOutlets.filter((o) => 
    o.name?.toLowerCase().includes(outletQuery.toLowerCase()) ||
    o.outlet_code?.toLowerCase().includes(outletQuery.toLowerCase()) ||
    o.address?.toLowerCase().includes(outletQuery.toLowerCase()) ||
    o.manager_details?.name?.toLowerCase().includes(outletQuery.toLowerCase()) ||
    o.manager_details?.phone?.toLowerCase().includes(outletQuery.toLowerCase()) ||
    o.manager_details?.email?.toLowerCase().includes(outletQuery.toLowerCase())
  );

  /* ═══════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#0e0500] text-white flex">
      {/* ── Sidebar ── */}
      <aside className="w-60 flex-shrink-0 bg-[#160800] border-r border-orange-900/30 flex flex-col">
        {/* Brand */}
        <div className="px-6 pt-7 pb-6 border-b border-orange-900/20">
          <button
            onClick={() => navigate(getAdminRoute("/"))}
            className="flex items-center gap-2 text-slate-400 hover:text-white text-xs mb-4 transition-colors"
          >
            ← Back to products
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-rose-600 flex items-center justify-center text-base">
              🍽️
            </div>
            <div>
              <p className="text-xs font-black text-white">Foodies POS</p>
              <p className="text-[10px] text-orange-400/70 uppercase tracking-widest">Admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setSearchParams({});
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-all duration-150 ${
                activeTab === item.id
                  ? "bg-gradient-to-r from-orange-500/20 to-rose-500/10 text-orange-200 border border-orange-500/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Sign out */}
        <div className="px-4 pb-6">
          <button
            onClick={handleLogout}
            className="w-full text-sm text-slate-500 hover:text-white border border-white/5 hover:border-white/20 px-4 py-2 rounded-xl transition-all"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto px-8 py-8">
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl px-5 py-4 mb-6 text-sm">
            ⚠️ {error} — Make sure the Foodies backend is running on port 3001.
          </div>
        )}

        {/* ─── OVERVIEW ─── */}
        {activeTab === "overview" && !loading && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="text-3xl font-black text-white">Overview</h1>
              <p className="text-slate-400 mt-1">Platform-wide stats for the Foodies POS network.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Stat label="Restaurants"      value={stats?.totalRestaurants || 0} color="orange" />
              <Stat label="Total Outlets"    value={stats?.totalOutlets || 0}     color="amber"  />
              <Stat label="Total Staff"      value={stats?.totalStaff || 0}       color="rose"   />
              <Stat label="Total Orders"     value={stats?.totalOrders || 0}      color="green"  />
              <Stat label="Total Customers"  value={stats?.totalCustomers || 0}   color="blue"   />
              <Stat label="Restricted"       value={flaggedRests}                 color="rose"   />
            </div>

            {/* Recent restaurants */}
            <div>
              <Section title="Recent Restaurants" sub="Latest onboarded restaurants (click to manage outlets)" />
              <div className="space-y-2">
                {restaurants.slice(0, 5).map((r) => (
                  <div
                    key={r.id}
                    onClick={() => setSearchParams({ restaurantId: r.id })}
                    className="flex items-center gap-4 px-5 py-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-orange-500/20 cursor-pointer transition-all duration-200"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500/30 to-rose-600/20 flex items-center justify-center text-lg flex-shrink-0">
                      🏪
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white truncate">{r.name}</p>
                      <p className="text-xs text-slate-400 truncate">{r.email}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openFlagEditor(r.id, "restaurant", r.feature_flags || {});
                      }}
                      className="text-xs border border-orange-500/30 text-orange-300 hover:bg-orange-500/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      Edit Flags
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── RESTAURANTS LIST ─── */}
        {activeTab === "restaurants" && !selectedRestaurantId && !loading && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black text-white">Restaurants</h1>
                <p className="text-slate-400 mt-1">{restaurants.length} registered restaurants (click row to manage outlets)</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setOnboardStep(1);
                    setShowOnboardModal(true);
                  }}
                  className="text-xs font-black bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
                >
                  ➕ Onboard Restaurant
                </button>
                <button
                  onClick={loadData}
                  className="text-xs border border-white/10 text-slate-300 hover:border-white/30 px-4 py-2.5 rounded-xl transition-all"
                >
                  ↻ Refresh
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {restaurants.map((r) => {
                const outletCount = outlets.filter((o) => o.restaurant_id === r.id).length;
                return (
                  <div
                    key={r.id}
                    onClick={() => setSearchParams({ restaurantId: r.id })}
                    className="flex items-center gap-4 px-5 py-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-orange-500/20 cursor-pointer transition-all duration-200"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500/30 to-rose-600/20 flex items-center justify-center text-lg flex-shrink-0">
                      🏪
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-white truncate">{r.name}</p>
                      <p className="text-xs text-slate-400 truncate">{r.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge color="amber">{outletCount} outlet{outletCount !== 1 ? "s" : ""}</Badge>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openFlagEditor(r.id, "restaurant", r.feature_flags || {});
                        }}
                        className="text-xs border border-orange-500/30 text-orange-300 hover:bg-orange-500/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        🚩 Edit Flags
                      </button>
                    </div>
                  </div>
                );
              })}
              {restaurants.length === 0 && (
                <p className="text-slate-500 text-sm py-8 text-center">No restaurants found.</p>
              )}
            </div>
          </div>
        )}

        {/* ─── RESTAURANT DETAILS VIEW ─── */}
        {activeTab === "restaurants" && selectedRestaurantId && currentRest && !loading && (
          <div className="space-y-8 animate-fade-in">
            {/* Header / Breadcrumb */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-orange-950/40 pb-6">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => setSearchParams({})}
                  className="mt-1 w-10 h-10 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/30 hover:bg-orange-500/10 flex items-center justify-center text-slate-400 hover:text-white transition-all group"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🏪</span>
                    <h1 className="text-3xl font-black text-white tracking-tight">{currentRest.name}</h1>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 font-semibold tracking-wide flex items-center gap-2">
                    RESTAURANT ID: <code className="text-orange-400 bg-orange-500/5 px-2 py-0.5 rounded border border-orange-500/10 font-mono select-all">{currentRest.id}</code>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Badge color={currentRest.is_active !== false ? "green" : "red"}>
                  {currentRest.is_active !== false ? "Active" : "Restricted"}
                </Badge>
                <Badge color="orange">
                  Plan: {displayPlanName}
                </Badge>
              </div>
            </div>

            {/* Profile & Subscription Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Card */}
              <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6 space-y-4">
                <h3 className="text-base font-black text-white border-b border-white/5 pb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-orange-500" />
                  Restaurant Profile
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Owner Name</span>
                    <span className="text-white font-semibold flex items-center gap-2">
                      <UserIcon className="w-3.5 h-3.5 text-orange-400/80" />
                      {currentRest.owner_name || "—"}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Phone Number</span>
                    <span className="text-white font-semibold flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-orange-400/80" />
                      {currentRest.phone_number || "—"}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Contact Email</span>
                    <span className="text-white font-semibold flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-orange-400/80" />
                      {currentRest.email || "—"}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Onboarded On</span>
                    <span className="text-white font-semibold flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-orange-400/80" />
                      {currentRest.created_at ? new Date(currentRest.created_at).toLocaleDateString(undefined, { dateStyle: "long" }) : "—"}
                    </span>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 space-y-3">
                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Business Address</span>
                    <span className="text-slate-300 flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-orange-400/80 mt-0.5 flex-shrink-0" />
                      {currentRest.address || "—"}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Details / Notes</span>
                    <span className="text-slate-300 flex items-start gap-2">
                      <Info className="w-3.5 h-3.5 text-orange-400/80 mt-0.5 flex-shrink-0" />
                      {currentRest.details || "No supplementary details provided."}
                    </span>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 flex justify-end">
                  <button
                    onClick={() => openFlagEditor(currentRest.id, "restaurant", currentRest.feature_flags || {})}
                    className="text-[10px] font-bold border border-orange-500/30 hover:border-orange-500/60 text-orange-300 hover:bg-orange-500/10 px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
                  >
                    🚩 Configure Restaurant Flags
                  </button>
                </div>
              </div>

              {/* Limits and Subscription Card */}
              <div className="rounded-3xl border border-orange-500/15 bg-gradient-to-br from-orange-500/[0.03] to-rose-500/[0.01] p-6 space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <h3 className="text-base font-black text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-400" />
                    Subscription Limits
                  </h3>
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                    sub.status === "active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}>
                    {sub.status || "active"}
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Outlets Limit */}
                  <div>
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="font-bold text-slate-400">Outlets Registered</span>
                      <span className="font-black text-white">{linkedOutlets.length} / {sub.max_outlets || 1}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min((linkedOutlets.length / (sub.max_outlets || 1)) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Staff Limit */}
                  <div>
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="font-bold text-slate-400">Staff Allocation Limit</span>
                      <span className="font-black text-white">{sub.max_staff_per_outlet || 5} per outlet</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full w-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full" />
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Outlets Section */}
            <div className="space-y-5 pt-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-orange-950/40 pb-4">
                <div>
                  <h2 className="text-xl font-black text-white">Outlets Linked</h2>
                  <p className="text-xs text-slate-400 mt-1">{linkedOutlets.length} outlet{linkedOutlets.length !== 1 ? "s" : ""} registered to this restaurant</p>
                </div>

                {/* Outlet Search Bar */}
                <div className="relative w-full max-w-sm">
                  <Search className="w-4 h-4 text-slate-500 absolute top-1/2 left-3.5 -translate-y-1/2" />
                  <input
                    type="text"
                    value={outletQuery}
                    onChange={(e) => setOutletQuery(e.target.value)}
                    placeholder="Search outlets, codes, managers..."
                    className="w-full text-xs bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] focus:border-orange-500/40 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none transition-all placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Outlets Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredOutlets.map((o) => {
                  const hasCustomFlags = o.feature_flags && Object.values(o.feature_flags).some((v) => v === false);
                  const mgr = o.manager_details || {};
                  return (
                    <div key={o.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] p-5 flex flex-col justify-between transition-all group hover:border-orange-500/15">
                      <div className="space-y-3.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h4 className="font-bold text-white group-hover:text-orange-400 transition-colors truncate text-sm">{o.name}</h4>
                            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mt-0.5">Code: {o.outlet_code || "—"}</p>
                          </div>
                          <span className={`flex-shrink-0 text-[9px] font-bold px-2 py-0.5 rounded border ${
                            hasCustomFlags ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          }`}>
                            {hasCustomFlags ? "Customized Flags" : "Standard Flags"}
                          </span>
                        </div>

                        <div className="space-y-1.5 text-xs">
                          <div className="text-slate-400 flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">{o.address || "—"}</span>
                          </div>
                          {(o.latitude || o.longitude) && (
                            <p className="text-[10px] text-slate-500 font-medium pl-5 font-mono">
                              GPS: {Number(o.latitude).toFixed(4)}, {Number(o.longitude).toFixed(4)}
                            </p>
                          )}
                        </div>

                        {/* Manager details block */}
                        <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-3 text-xs space-y-1">
                          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block mb-1">Outlet Manager</span>
                          <p className="font-semibold text-slate-300">{mgr.name || "—"}</p>
                          {mgr.phone && <p className="text-slate-400 flex items-center gap-1.5 mt-0.5"><Phone className="w-3 h-3 text-slate-500" />{mgr.phone}</p>}
                          {mgr.email && <p className="text-slate-400 flex items-center gap-1.5 mt-0.5"><Mail className="w-3 h-3 text-slate-500" />{mgr.email}</p>}
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-3">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Subscription Pack</label>
                          <div className="flex gap-2 w-full">
                            <div className="flex-1">
                              <CustomPackDropdown
                                value={o.is_custom_subscription ? "custom" : (o.pack_id || "")}
                                onChange={(val) => handleAssignPack(o.id, val)}
                                disabled={loading}
                                options={[
                                  { value: "", label: "No Pack Assigned (Inherits)" },
                                  ...subscriptionPacks.filter(p => !p.is_custom).map(p => ({
                                    value: p.id,
                                    label: p.name
                                  })),
                                  { value: "custom", label: "Custom Configuration" }
                                ]}
                              />
                            </div>
                            {o.is_custom_subscription && (
                              <button
                                onClick={() => {
                                  setCustomModuleData({ outletId: o.id, modules: o.custom_modules || {} });
                                  setShowCustomModuleModal(true);
                                }}
                                className="text-[10px] bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 px-3 rounded-lg border border-orange-500/30 font-bold whitespace-nowrap transition-colors"
                              >
                                Configure
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <button
                            onClick={() => openFlagEditor(o.id, "outlet", o.feature_flags || {})}
                            className="text-[10px] font-bold border border-white/10 hover:border-orange-500/30 text-slate-400 hover:text-orange-300 hover:bg-orange-500/5 px-3 py-1.5 rounded-lg transition-all"
                          >
                            🚩 Edit Flags
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredOutlets.length === 0 && (
                  <div className="col-span-full rounded-2xl border border-dashed border-white/10 p-12 text-center">
                    <p className="text-slate-500 text-xs">
                      {linkedOutlets.length === 0 ? "No active outlets linked to this restaurant." : "No outlets matching your search criteria."}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── SUBSCRIPTION PACKS VIEW ─── */}
        {activeTab === "subscription-packs" && !loading && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black text-white">Subscription Packs</h1>
                <p className="text-slate-400 mt-1">Manage subscription models and pricing to assign to outlets.</p>
              </div>
              <button
                onClick={() => openPackModal()}
                className="text-xs font-bold bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 self-start sm:self-auto"
              >
                ➕ New Pack
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {subscriptionPacks.map((pack) => (
                <div key={pack.id} className="relative rounded-3xl border border-white/10 bg-[#1a0b05] overflow-hidden flex flex-col group hover:border-orange-500/30 transition-all">
                  {pack.is_custom && (
                    <div className="absolute top-0 right-0 bg-rose-500/20 text-rose-300 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl border-b border-l border-rose-500/20 z-10">
                      Custom
                    </div>
                  )}
                  <div className="p-6 pb-4 relative z-0">
                    <h3 className="text-xl font-black text-white mb-2 group-hover:text-orange-400 transition-colors">{pack.name}</h3>
                    <p className="text-xs text-slate-400 mb-4 h-8">{pack.description}</p>
                    <div className="flex items-end gap-2 mb-4">
                      <span className="text-3xl font-black text-orange-400">₹{pack.price_monthly}</span>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">/ mo</span>
                    </div>
                  </div>
                  <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 flex-1 space-y-3 relative z-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${pack.has_pos ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`} />
                      <span className={`text-xs font-bold ${pack.has_pos ? 'text-white' : 'text-slate-500 line-through'}`}>Core POS System</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${pack.has_whatsapp ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`} />
                      <span className={`text-xs font-bold ${pack.has_whatsapp ? 'text-white' : 'text-slate-500 line-through'}`}>WhatsApp Integration</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${pack.has_delivery_partner ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`} />
                      <span className={`text-xs font-bold ${pack.has_delivery_partner ? 'text-white' : 'text-slate-500 line-through'}`}>Delivery Aggregators</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${pack.has_ordering_app ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-700'}`} />
                      <span className={`text-xs font-bold ${pack.has_ordering_app ? 'text-white' : 'text-slate-500 line-through'}`}>Custom Ordering App</span>
                    </div>
                  </div>
                  <div className="p-4 bg-orange-950/20 border-t border-orange-500/20 text-center relative z-0 flex justify-between items-center">
                    <p className="text-[10px] font-mono text-orange-300">
                      {pack.is_custom ? 'Fully Flexible Flags' : `${Object.keys(pack.feature_flags || {}).length} Base Flags Included`}
                    </p>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openPackModal(pack)} className="text-[10px] font-bold text-orange-400 hover:text-orange-300 bg-orange-500/10 hover:bg-orange-500/20 px-2 py-1 rounded">Edit</button>
                      <button onClick={() => handleDeletePack(pack.id)} className="text-[10px] font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-2 py-1 rounded">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              {subscriptionPacks.length === 0 && (
                <div className="col-span-full py-12 text-center border border-dashed border-white/10 rounded-3xl">
                  <p className="text-slate-500">No subscription packs found.</p>
                </div>
              )}
            </div>

            {/* ── ITEMIZED MODULE PRICING ── */}
            <div className="pt-8 mt-8 border-t border-white/5 space-y-6">
              <div>
                <h3 className="text-xl font-black text-white">Itemized Module Pricing</h3>
                <p className="text-slate-400 text-xs mt-1">Base monthly pricing for specific modules. These are used to calculate the cost of Custom packs for individual outlets.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {modulePricing.map(mp => (
                  <div key={mp.module_key} className="bg-[#1a0b05] border border-white/10 rounded-2xl p-4 hover:border-orange-500/30 transition-all flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">{mp.module_key}</p>
                      <h4 className="text-sm font-black text-white mt-1">{mp.name}</h4>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/5 flex items-end justify-between">
                      <div className="flex items-end gap-1">
                        <span className="text-xl font-black text-emerald-400">₹{mp.price_monthly}</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">/ mo</span>
                      </div>
                      <button 
                        onClick={() => {
                          const newPrice = prompt(`Enter new monthly price for ${mp.name} (₹):`, mp.price_monthly);
                          if (newPrice !== null && !isNaN(newPrice)) {
                            foodieFetch(`/admin/module-pricing/${mp.module_key}`, {
                              method: 'PATCH',
                              body: JSON.stringify({ price_monthly: Number(newPrice) })
                            }).then(() => loadData());
                          }
                        }}
                        className="text-[10px] font-bold border border-white/10 hover:bg-white/5 px-2.5 py-1.5 rounded-lg text-slate-300 transition-all"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
                {modulePricing.length === 0 && (
                  <div className="col-span-full py-6 text-center border border-dashed border-white/10 rounded-2xl">
                    <p className="text-slate-500 text-xs">No itemized pricing found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── GLOBAL FEATURE FLAGS VIEW ─── */}
        {activeTab === "feature-flags" && !loading && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black text-white">Global Feature Flags</h1>
                <p className="text-slate-400 mt-1">Platform-wide global flags in the Supabase database. These control platform configurations globally.</p>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="text-xs font-bold bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 self-start sm:self-auto"
              >
                {showAddForm ? "✕ Close Form" : "➕ New Global Flag"}
              </button>
            </div>

            {/* Create form */}
            {showAddForm && (
              <form onSubmit={handleCreateGlobalFlag} className="rounded-2xl border border-orange-500/20 bg-orange-500/[0.02] p-5 space-y-4 animate-fade-in max-w-xl">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <span>🚩</span> Create New Global Feature Flag
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Feature Key *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. loyalty_points_enabled"
                      value={newFlag.feature_key}
                      onChange={(e) => setNewFlag({ ...newFlag, feature_key: e.target.value })}
                      className="w-full text-xs bg-white/[0.03] border border-white/[0.08] focus:border-orange-500/40 rounded-xl px-3 py-2.5 text-white focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Description</label>
                    <textarea
                      placeholder="Describe what this platform feature flag regulates..."
                      value={newFlag.description}
                      onChange={(e) => setNewFlag({ ...newFlag, description: e.target.value })}
                      className="w-full text-xs bg-white/[0.03] border border-white/[0.08] focus:border-orange-500/40 rounded-xl px-3 py-2 text-white focus:outline-none transition-all h-20 resize-none font-sans"
                    />
                  </div>

                  <div className="flex items-center gap-3 py-1">
                    <ToggleFlag
                      checked={newFlag.is_enabled}
                      onChange={() => setNewFlag({ ...newFlag, is_enabled: !newFlag.is_enabled })}
                    />
                    <span className="text-xs font-bold text-slate-300">Enabled by Default</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-2">
                  <button
                    type="submit"
                    disabled={savingGlobalFlag}
                    className="text-[10px] uppercase tracking-wider font-black bg-gradient-to-r from-orange-500 to-rose-600 px-4 py-2.5 rounded-xl text-white hover:opacity-90 disabled:opacity-50"
                  >
                    {savingGlobalFlag ? "Creating…" : "Create Flag"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="text-[10px] uppercase tracking-wider font-bold border border-white/10 hover:bg-white/5 px-4 py-2.5 rounded-xl text-slate-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Filter Search */}
            <div className="relative w-full max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute top-1/2 left-3.5 -translate-y-1/2" />
              <input
                type="text"
                value={flagQuery}
                onChange={(e) => setFlagQuery(e.target.value)}
                placeholder="Search global flags by key or description..."
                className="w-full text-xs bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] focus:border-orange-500/40 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none transition-all placeholder:text-slate-500"
              />
            </div>

            {/* Flags List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {globalFlags
                .filter((f) => 
                  f.feature_key?.toLowerCase().includes(flagQuery.toLowerCase()) ||
                  f.description?.toLowerCase().includes(flagQuery.toLowerCase())
                )
                .map((f) => {
                  const isEditingThis = editingGlobalFlag === f.id;
                  return (
                    <div key={f.id} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] p-5 flex flex-col justify-between transition-all hover:border-orange-500/15">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <h4 className="font-bold text-white truncate text-sm flex items-center gap-2">
                              <span className="text-orange-400">🚩</span>
                              {f.feature_key}
                            </h4>
                            <p className="text-[9px] text-slate-500 font-mono mt-0.5">ID: {f.id}</p>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <ToggleFlag
                              checked={f.is_enabled}
                              onChange={() => handleToggleGlobalFlag(f.id, f.is_enabled)}
                            />
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                              f.is_enabled ? "bg-orange-500/15 text-orange-400 border border-orange-500/30" : "bg-white/5 text-slate-500 border border-white/10"
                            }`}>
                              {f.is_enabled ? "Active" : "Disabled"}
                            </span>
                          </div>
                        </div>

                        {/* Description field */}
                        <div className="text-xs">
                          {isEditingThis ? (
                            <div className="space-y-2 pt-1 animate-fade-in">
                              <textarea
                                id={`desc-edit-${f.id}`}
                                defaultValue={f.description || ""}
                                className="w-full text-xs bg-white/[0.04] border border-orange-500/30 focus:border-orange-500 rounded-xl px-3 py-2 text-white focus:outline-none transition-all h-20 resize-none font-sans"
                              />
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    const val = document.getElementById(`desc-edit-${f.id}`).value;
                                    handleUpdateGlobalFlagDesc(f.id, val);
                                  }}
                                  className="text-[9px] font-bold bg-emerald-500 hover:bg-emerald-600 text-white px-2.5 py-1.5 rounded-lg transition-all"
                                >
                                  Save Description
                                </button>
                                <button
                                  onClick={() => setEditingGlobalFlag(null)}
                                  className="text-[9px] font-bold border border-white/10 hover:bg-white/5 text-slate-400 px-2.5 py-1.5 rounded-lg transition-all"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-start justify-between gap-2 group/desc pt-1">
                              <p className="text-slate-400 leading-relaxed font-sans font-medium italic">
                                {f.description || "No description provided."}
                              </p>
                              <button
                                onClick={() => setEditingGlobalFlag(f.id)}
                                className="text-[10px] text-slate-500 hover:text-orange-400 opacity-0 group-hover/desc:opacity-100 transition-all font-semibold flex-shrink-0"
                              >
                                ✏️ Edit
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Created timestamp */}
                        <div className="text-[9px] text-slate-600 font-medium font-mono pt-1">
                          Last Updated: {f.updated_at ? new Date(f.updated_at).toLocaleString() : new Date(f.created_at).toLocaleString()}
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
                        <button
                          onClick={() => handleDeleteGlobalFlag(f.id)}
                          className="text-[9px] font-bold border border-rose-500/20 hover:border-rose-500/50 text-rose-400 hover:bg-rose-500/10 px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
                        >
                          🗑️ Delete Flag
                        </button>
                      </div>
                    </div>
                  );
                })}

              {globalFlags.length === 0 && (
                <div className="col-span-full rounded-2xl border border-dashed border-white/10 p-12 text-center">
                  <p className="text-slate-500 text-xs">No global feature flags loaded from the database.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ─── SLIDING FEATURE FLAGS DRAWER ─── */}
      <div className={`fixed inset-0 z-50 transition-all duration-300 ${editingFlags.id ? "pointer-events-auto" : "pointer-events-none"}`}>
        {/* Backdrop overlay */}
        <div 
          onClick={() => setEditingFlags({ id: null, type: null, flags: {} })}
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
            editingFlags.id ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Drawer Panel */}
        <div className={`absolute top-0 right-0 w-full max-w-md h-full bg-[#140600] border-l border-orange-500/20 shadow-2xl flex flex-col transition-transform duration-300 ease-out transform ${
          editingFlags.id ? "translate-x-0" : "translate-x-full"
        }`}>
          {/* Header */}
          <div className="p-6 border-b border-orange-950 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-orange-400 font-black uppercase tracking-widest flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" />
                Configure Feature Flags
              </p>
              <h3 className="text-base font-black text-white mt-1">
                {editingFlags.type === "restaurant"
                  ? restaurants.find((r) => r.id === editingFlags.id)?.name
                  : outlets.find((o) => o.id === editingFlags.id)?.name}
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5 capitalize">
                Applying to this {editingFlags.type}
              </p>
            </div>
            <button
              onClick={() => setEditingFlags({ id: null, type: null, flags: {} })}
              className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Flags Toggles List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-2">
            {FLAG_KEYS.map((key) => {
              const val = editingFlags.flags[key];
              const isOn = val === undefined ? true : val === true || val === "true";
              return (
                <button
                  key={key}
                  onClick={() =>
                    setEditingFlags((prev) => ({
                      ...prev,
                      flags: { ...prev.flags, [key]: !isOn },
                    }))
                  }
                  className="w-full text-left flex items-center justify-between p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] hover:bg-white/[0.03] hover:border-orange-500/10 transition-all group"
                >
                  <div className="min-w-0 pr-4">
                    <p className="text-xs font-bold text-white group-hover:text-orange-300 transition-colors capitalize">
                      {flagLabel(key)}
                    </p>
                    <p className="text-[9px] text-slate-500 truncate mt-0.5 font-mono">{key}</p>
                  </div>
                  {isOn ? (
                    <ToggleRight className="w-7 h-7 text-orange-500 flex-shrink-0 transition-transform group-hover:scale-105" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-slate-600 flex-shrink-0 transition-transform group-hover:scale-105" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Actions Footer */}
          <div className="p-6 bg-orange-950/10 border-t border-orange-950/45 flex items-center gap-3">
            <button
              onClick={saveFlags}
              disabled={savingFlags}
              className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-black rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/10 transition-all text-[10px] uppercase tracking-wider"
            >
              {savingFlags ? "Saving Changes…" : "Save Flags"}
            </button>
            <button
              onClick={() => setEditingFlags({ id: null, type: null, flags: {} })}
              className="px-5 py-3 border border-white/5 bg-white/[0.02] text-slate-300 hover:text-white hover:bg-white/5 font-bold rounded-xl transition-all text-[10px] uppercase tracking-wider"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* ─── MULTI-STEP RESTAURANT ONBOARDING MODAL ─── */}
      {showOnboardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop overlay */}
          <div 
            onClick={() => {
              if (onboardingSubmitting) return;
              setShowOnboardModal(false);
            }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Modal Content Card */}
          <div className="relative bg-[#140600] border border-orange-500/20 shadow-2xl rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col transition-all duration-300 transform scale-100">
            {/* Header */}
            <div className="p-6 border-b border-orange-950/45 bg-orange-950/10 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-orange-400 font-black uppercase tracking-widest flex items-center gap-1.5">
                  <span>🏪</span> Onboard New Restaurant Portal
                </p>
                <h3 className="text-lg font-black text-white mt-1">
                  Restaurant Setup Wizard
                </h3>
              </div>
              <button
                disabled={onboardingSubmitting}
                onClick={() => setShowOnboardModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            {/* Steps Progress Indicator */}
            <div className="px-8 py-5 border-b border-white/[0.04] bg-white/[0.01] flex items-center justify-between text-xs font-bold text-slate-400 overflow-x-auto gap-4">
              {[
                { step: 1, label: "Restaurant" },
                { step: 2, label: "Owner Auth" },
                { step: 3, label: "Outlet" },
                { step: 4, label: "Manager" },
                { step: 5, label: "Features" },
              ].map((s) => (
                <div key={s.step} className="flex items-center gap-2 flex-shrink-0">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-all ${
                    onboardStep === s.step
                      ? "bg-gradient-to-r from-orange-500 to-rose-600 text-white shadow-md shadow-orange-500/20"
                      : onboardStep > s.step
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-white/5 text-slate-500 border border-white/5"
                  }`}>
                    {onboardStep > s.step ? "✓" : s.step}
                  </div>
                  <span className={onboardStep === s.step ? "text-orange-300" : "text-slate-500"}>
                    {s.label}
                  </span>
                  {s.step < 5 && <div className="w-8 h-[1px] bg-white/10 hidden sm:block" />}
                </div>
              ))}
            </div>

            {/* Scrollable Form Content */}
            <form onSubmit={handleOnboardSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
              
              {/* ── STEP 1: RESTAURANT INFO ── */}
              {onboardStep === 1 && (
                <div className="space-y-4">
                  <div className="border-b border-white/5 pb-2">
                    <h4 className="text-sm font-black text-white">Step 1: Restaurant Basic Information</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Provide the legal business details for the restaurant brand.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Restaurant Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Pizza Palace"
                        value={onboardData.restaurant.name}
                        onChange={(e) => setOnboardData({
                          ...onboardData,
                          restaurant: { ...onboardData.restaurant, name: e.target.value }
                        })}
                        className="w-full text-xs bg-white/[0.02] border border-white/[0.08] focus:border-orange-500/40 rounded-xl px-4 py-3 text-white focus:outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Owner Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        value={onboardData.restaurant.owner_name}
                        onChange={(e) => setOnboardData({
                          ...onboardData,
                          restaurant: { ...onboardData.restaurant, owner_name: e.target.value }
                        })}
                        className="w-full text-xs bg-white/[0.02] border border-white/[0.08] focus:border-orange-500/40 rounded-xl px-4 py-3 text-white focus:outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Owner Phone Number</label>
                      <input
                        type="tel"
                        placeholder="e.g. +91 98765 43210"
                        value={onboardData.restaurant.phone_number}
                        onChange={(e) => setOnboardData({
                          ...onboardData,
                          restaurant: { ...onboardData.restaurant, phone_number: e.target.value }
                        })}
                        className="w-full text-xs bg-white/[0.02] border border-white/[0.08] focus:border-orange-500/40 rounded-xl px-4 py-3 text-white focus:outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Restaurant Details / Slogan</label>
                      <input
                        type="text"
                        placeholder="e.g. Premium Italian Woodfired Pizzeria"
                        value={onboardData.restaurant.details}
                        onChange={(e) => setOnboardData({
                          ...onboardData,
                          restaurant: { ...onboardData.restaurant, details: e.target.value }
                        })}
                        className="w-full text-xs bg-white/[0.02] border border-white/[0.08] focus:border-orange-500/40 rounded-xl px-4 py-3 text-white focus:outline-none transition-all"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Headquarters Address</label>
                      <textarea
                        placeholder="Full street address..."
                        value={onboardData.restaurant.address}
                        onChange={(e) => setOnboardData({
                          ...onboardData,
                          restaurant: { ...onboardData.restaurant, address: e.target.value }
                        })}
                        className="w-full text-xs bg-white/[0.02] border border-white/[0.08] focus:border-orange-500/40 rounded-xl px-4 py-3 text-white focus:outline-none transition-all h-20 resize-none font-sans"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 2: OWNER AUTH ── */}
              {onboardStep === 2 && (
                <div className="space-y-4">
                  <div className="border-b border-white/5 pb-2">
                    <h4 className="text-sm font-black text-white">Step 2: Owner Auth Credentials</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Setup Supabase database auth credentials for the primary restaurant Owner (Superadmin role).</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Owner Onboarding Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="owner@example.com"
                        value={onboardData.owner.email}
                        onChange={(e) => setOnboardData({
                          ...onboardData,
                          owner: { ...onboardData.owner, email: e.target.value }
                        })}
                        className="w-full text-xs bg-white/[0.02] border border-white/[0.08] focus:border-orange-500/40 rounded-xl px-4 py-3 text-white focus:outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Owner Secure Password *</label>
                      <input
                        type="password"
                        required
                        minLength={6}
                        placeholder="••••••••"
                        value={onboardData.owner.password}
                        onChange={(e) => setOnboardData({
                          ...onboardData,
                          owner: { ...onboardData.owner, password: e.target.value }
                        })}
                        className="w-full text-xs bg-white/[0.02] border border-white/[0.08] focus:border-orange-500/40 rounded-xl px-4 py-3 text-white focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 3: OUTLET INFO ── */}
              {onboardStep === 3 && (
                <div className="space-y-4">
                  <div className="border-b border-white/5 pb-2">
                    <h4 className="text-sm font-black text-white">Step 3: Primary Outlet Details</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Every restaurant requires at least one primary outlet to receive POS order items.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Primary Outlet Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Pizza Palace Downtown"
                        value={onboardData.outlet.name}
                        onChange={(e) => setOnboardData({
                          ...onboardData,
                          outlet: { ...onboardData.outlet, name: e.target.value }
                        })}
                        className="w-full text-xs bg-white/[0.02] border border-white/[0.08] focus:border-orange-500/40 rounded-xl px-4 py-3 text-white focus:outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Outlet Unique Code (e.g. PPDT01) *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. PPDT01"
                        value={onboardData.outlet.outlet_code}
                        onChange={(e) => setOnboardData({
                          ...onboardData,
                          outlet: { ...onboardData.outlet, outlet_code: e.target.value.toUpperCase().replace(/\s/g, "") }
                        })}
                        className="w-full text-xs bg-white/[0.02] border border-white/[0.08] focus:border-orange-500/40 rounded-xl px-4 py-3 text-white focus:outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Latitude (Optional)</label>
                      <input
                        type="number"
                        step="any"
                        placeholder="e.g. 12.9716"
                        value={onboardData.outlet.latitude}
                        onChange={(e) => setOnboardData({
                          ...onboardData,
                          outlet: { ...onboardData.outlet, latitude: e.target.value }
                        })}
                        className="w-full text-xs bg-white/[0.02] border border-white/[0.08] focus:border-orange-500/40 rounded-xl px-4 py-3 text-white focus:outline-none transition-all font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Longitude (Optional)</label>
                      <input
                        type="number"
                        step="any"
                        placeholder="e.g. 77.5946"
                        value={onboardData.outlet.longitude}
                        onChange={(e) => setOnboardData({
                          ...onboardData,
                          outlet: { ...onboardData.outlet, longitude: e.target.value }
                        })}
                        className="w-full text-xs bg-white/[0.02] border border-white/[0.08] focus:border-orange-500/40 rounded-xl px-4 py-3 text-white focus:outline-none transition-all font-mono"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Outlet Delivery Address</label>
                      <textarea
                        placeholder="Outlet location physical address..."
                        value={onboardData.outlet.address}
                        onChange={(e) => setOnboardData({
                          ...onboardData,
                          outlet: { ...onboardData.outlet, address: e.target.value }
                        })}
                        className="w-full text-xs bg-white/[0.02] border border-white/[0.08] focus:border-orange-500/40 rounded-xl px-4 py-3 text-white focus:outline-none transition-all h-20 resize-none font-sans"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 4: MANAGER DETAILS ── */}
              {onboardStep === 4 && (
                <div className="space-y-4">
                  <div className="border-b border-white/5 pb-2">
                    <h4 className="text-sm font-black text-white">Step 4: Outlet Manager Assignment</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Every outlet is linked to a manager responsible for inventory and cashier settlements.</p>
                  </div>

                  <div className="p-5 rounded-2xl border border-orange-500/20 bg-orange-500/[0.02] flex items-center justify-between gap-4">
                    <div className="pr-4">
                      <p className="text-xs font-bold text-white">Is the Restaurant Owner also the Outlet Manager?</p>
                      <p className="text-[10px] text-slate-400 mt-1">If enabled, owner profiles automatically receive manager credentials to POS, saving a license count.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOnboardData({
                        ...onboardData,
                        manager: { ...onboardData.manager, is_owner: !onboardData.manager.is_owner }
                      })}
                      className="flex-shrink-0"
                    >
                      {onboardData.manager.is_owner ? (
                        <ToggleRight className="w-10 h-10 text-orange-500" />
                      ) : (
                        <ToggleLeft className="w-10 h-10 text-slate-600" />
                      )}
                    </button>
                  </div>

                  {!onboardData.manager.is_owner && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Manager Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Jane Manager"
                          value={onboardData.manager.name}
                          onChange={(e) => setOnboardData({
                            ...onboardData,
                            manager: { ...onboardData.manager, name: e.target.value }
                          })}
                          className="w-full text-xs bg-white/[0.02] border border-white/[0.08] focus:border-orange-500/40 rounded-xl px-4 py-3 text-white focus:outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Manager Phone Number</label>
                        <input
                          type="tel"
                          placeholder="e.g. +91 99999 88888"
                          value={onboardData.manager.phone}
                          onChange={(e) => setOnboardData({
                            ...onboardData,
                            manager: { ...onboardData.manager, phone: e.target.value }
                          })}
                          className="w-full text-xs bg-white/[0.02] border border-white/[0.08] focus:border-orange-500/40 rounded-xl px-4 py-3 text-white focus:outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Manager POS Onboarding Email *</label>
                        <input
                          type="email"
                          required
                          placeholder="manager@example.com"
                          value={onboardData.manager.email}
                          onChange={(e) => setOnboardData({
                            ...onboardData,
                            manager: { ...onboardData.manager, email: e.target.value }
                          })}
                          className="w-full text-xs bg-white/[0.02] border border-white/[0.08] focus:border-orange-500/40 rounded-xl px-4 py-3 text-white focus:outline-none transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Manager Secure Password *</label>
                        <input
                          type="password"
                          required
                          minLength={6}
                          placeholder="••••••••"
                          value={onboardData.manager.password}
                          onChange={(e) => setOnboardData({
                            ...onboardData,
                            manager: { ...onboardData.manager, password: e.target.value }
                          })}
                          className="w-full text-xs bg-white/[0.02] border border-white/[0.08] focus:border-orange-500/40 rounded-xl px-4 py-3 text-white focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── STEP 5: FEATURE FLAGS DEFAULT TRUE ── */}
              {onboardStep === 5 && (
                <div className="space-y-4">
                  <div className="border-b border-white/5 pb-2">
                    <h4 className="text-sm font-black text-white">Step 5: Setup Feature Flags</h4>
                    <p className="text-xs text-slate-400 mt-0.5">By default, all features are enabled (true). Toggle selections to restrict initial permissions.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Restaurant Flags */}
                    <div className="space-y-3">
                      <h5 className="text-xs font-bold text-orange-400 flex items-center gap-1.5 uppercase tracking-wider pb-1.5 border-b border-orange-950/20">
                        <span>🏪</span> Restaurant-Level Flags
                      </h5>
                      <div className="grid grid-cols-1 gap-2 max-h-[30vh] overflow-y-auto pr-2">
                        {FLAG_KEYS.map((key) => {
                          const isChecked = onboardData.restaurant.feature_flags[key] !== false;
                          return (
                            <button
                              type="button"
                              key={`rest-${key}`}
                              onClick={() => {
                                setOnboardData({
                                  ...onboardData,
                                  restaurant: {
                                    ...onboardData.restaurant,
                                    feature_flags: {
                                      ...onboardData.restaurant.feature_flags,
                                      [key]: !isChecked
                                    }
                                  }
                                });
                              }}
                              className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-white/[0.04] hover:bg-white/[0.03] text-left transition-all"
                            >
                              <span className="text-xs font-semibold capitalize text-slate-300">
                                {flagLabel(key)}
                              </span>
                              {isChecked ? (
                                <ToggleRight className="w-7 h-7 text-orange-500" />
                              ) : (
                                <ToggleLeft className="w-7 h-7 text-slate-600" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Outlet Flags */}
                    <div className="space-y-3">
                      <h5 className="text-xs font-bold text-rose-400 flex items-center gap-1.5 uppercase tracking-wider pb-1.5 border-b border-rose-950/20">
                        <span>📍</span> Primary Outlet-Level Flags
                      </h5>
                      <div className="grid grid-cols-1 gap-2 max-h-[30vh] overflow-y-auto pr-2">
                        {FLAG_KEYS.map((key) => {
                          const isChecked = onboardData.outlet.feature_flags[key] !== false;
                          return (
                            <button
                              type="button"
                              key={`out-${key}`}
                              onClick={() => {
                                setOnboardData({
                                  ...onboardData,
                                  outlet: {
                                    ...onboardData.outlet,
                                    feature_flags: {
                                      ...onboardData.outlet.feature_flags,
                                      [key]: !isChecked
                                    }
                                  }
                                });
                              }}
                              className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-white/[0.04] hover:bg-white/[0.03] text-left transition-all"
                            >
                              <span className="text-xs font-semibold capitalize text-slate-300">
                                {flagLabel(key)}
                              </span>
                              {isChecked ? (
                                <ToggleRight className="w-7 h-7 text-orange-500" />
                              ) : (
                                <ToggleLeft className="w-7 h-7 text-slate-600" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </form>

            {/* Actions Footer */}
            <div className="p-6 bg-orange-950/10 border-t border-orange-950/45 flex items-center justify-between">
              <div>
                {onboardStep > 1 && (
                  <button
                    type="button"
                    disabled={onboardingSubmitting}
                    onClick={() => setOnboardStep(onboardStep - 1)}
                    className="px-5 py-3 border border-white/5 bg-white/[0.02] text-slate-300 hover:text-white hover:bg-white/5 font-bold rounded-xl transition-all text-[10px] uppercase tracking-wider disabled:opacity-50"
                  >
                    ← Back
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={onboardingSubmitting}
                  onClick={() => setShowOnboardModal(false)}
                  className="px-5 py-3 border border-white/5 bg-white/[0.02] text-slate-400 hover:text-slate-200 hover:bg-white/5 font-bold rounded-xl transition-all text-[10px] uppercase tracking-wider"
                >
                  Cancel
                </button>

                {onboardStep < 5 ? (
                  <button
                    type="button"
                    onClick={() => {
                      // Basic required field validations per step
                      if (onboardStep === 1) {
                        if (!onboardData.restaurant.name || !onboardData.restaurant.owner_name) {
                          alert("Restaurant Name and Owner Name are required.");
                          return;
                        }
                      }
                      if (onboardStep === 2) {
                        if (!onboardData.owner.email || !onboardData.owner.password) {
                          alert("Owner Email and Password are required.");
                          return;
                        }
                        if (onboardData.owner.password.length < 6) {
                          alert("Owner Password must be at least 6 characters long.");
                          return;
                        }
                      }
                      if (onboardStep === 3) {
                        if (!onboardData.outlet.name || !onboardData.outlet.outlet_code) {
                          alert("Outlet Name and Unique Code are required.");
                          return;
                        }
                      }
                      if (onboardStep === 4) {
                        if (!onboardData.manager.is_owner) {
                          if (!onboardData.manager.name || !onboardData.manager.email || !onboardData.manager.password) {
                            alert("Manager Name, Email and Password are required.");
                            return;
                          }
                          if (onboardData.manager.password.length < 6) {
                            alert("Manager Password must be at least 6 characters long.");
                            return;
                          }
                        }
                      }
                      setOnboardStep(onboardStep + 1);
                    }}
                    className="px-5 py-3 bg-white/10 hover:bg-white/15 text-white font-black rounded-xl transition-all text-[10px] uppercase tracking-wider"
                  >
                    Next Step →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleOnboardSubmit}
                    disabled={onboardingSubmitting}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-black rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/10 transition-all text-[10px] uppercase tracking-wider"
                  >
                    {onboardingSubmitting ? "Onboarding Restaurant…" : "Onboard Restaurant ✓"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── SUBSCRIPTION PACK MODAL ─── */}
      {showPackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div 
            onClick={() => { if (!savingPack) setShowPackModal(false); }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />
          <div className="relative bg-[#140600] border border-orange-500/20 shadow-2xl rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-orange-950/45 bg-orange-950/10 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white mt-1">
                  {packFormData.id ? "Edit Subscription Pack" : "Create New Pack"}
                </h3>
              </div>
              <button
                disabled={savingPack}
                onClick={() => setShowPackModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSavePack} className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pack Name *</label>
                  <input required type="text" value={packFormData.name} onChange={e => setPackFormData({...packFormData, name: e.target.value})} className="w-full text-xs bg-white/[0.03] border border-white/[0.08] focus:border-orange-500/40 rounded-lg px-3 py-2 text-white outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Monthly Price (₹) *</label>
                  <input required type="number" value={packFormData.price_monthly} onChange={e => setPackFormData({...packFormData, price_monthly: Number(e.target.value)})} className="w-full text-xs bg-white/[0.03] border border-white/[0.08] focus:border-orange-500/40 rounded-lg px-3 py-2 text-white outline-none" />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Description</label>
                <textarea value={packFormData.description} onChange={e => setPackFormData({...packFormData, description: e.target.value})} className="w-full text-xs bg-white/[0.03] border border-white/[0.08] focus:border-orange-500/40 rounded-lg px-3 py-2 text-white outline-none h-16 resize-none" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/5 mt-4">
                <div className="flex items-center gap-3">
                  <ToggleFlag checked={packFormData.is_custom} onChange={() => setPackFormData({...packFormData, is_custom: !packFormData.is_custom})} />
                  <span className="text-xs font-bold text-slate-300">Is Custom Pack</span>
                </div>
                <div className="flex items-center gap-3">
                  <ToggleFlag checked={packFormData.has_pos} onChange={() => setPackFormData({...packFormData, has_pos: !packFormData.has_pos})} />
                  <span className="text-xs font-bold text-slate-300">Core POS Included</span>
                </div>
                <div className="flex items-center gap-3">
                  <ToggleFlag checked={packFormData.has_whatsapp} onChange={() => setPackFormData({...packFormData, has_whatsapp: !packFormData.has_whatsapp})} />
                  <span className="text-xs font-bold text-slate-300">WhatsApp Integration</span>
                </div>
                <div className="flex items-center gap-3">
                  <ToggleFlag checked={packFormData.has_delivery_partner} onChange={() => setPackFormData({...packFormData, has_delivery_partner: !packFormData.has_delivery_partner})} />
                  <span className="text-xs font-bold text-slate-300">Delivery Aggregators</span>
                </div>
                <div className="flex items-center gap-3">
                  <ToggleFlag checked={packFormData.has_ordering_app} onChange={() => setPackFormData({...packFormData, has_ordering_app: !packFormData.has_ordering_app})} />
                  <span className="text-xs font-bold text-slate-300">Ordering App</span>
                </div>
              </div>
              <div className="pt-4 border-t border-white/5 mt-4">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-3">Included Feature Flags</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-4">
                  {FLAG_KEYS.map(key => {
                    const isOn = packFormData.feature_flags?.[key] !== false;
                    return (
                      <div key={key} className="flex items-center gap-3">
                        <ToggleFlag 
                          checked={isOn} 
                          onChange={() => setPackFormData({
                            ...packFormData, 
                            feature_flags: { ...packFormData.feature_flags, [key]: !isOn }
                          })} 
                        />
                        <span className="text-[11px] font-medium text-slate-300 capitalize truncate">{flagLabel(key)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl mt-4">
                <p className="text-xs text-orange-200">For "Custom" packs, assigning the pack to an outlet unlocks manual feature flag control for that outlet. For standard packs, assigning the pack automatically locks and overwrites the outlet's flags with the pack's defaults.</p>
              </div>
            </form>

            <div className="p-6 bg-orange-950/10 border-t border-orange-950/45 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowPackModal(false)}
                className="px-5 py-2.5 border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white font-bold rounded-xl transition-all text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePack}
                disabled={savingPack}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-black rounded-xl disabled:opacity-50 transition-all text-xs"
              >
                {savingPack ? "Saving…" : "Save Pack"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ─── CUSTOM MODULE MODAL ─── */}
      {showCustomModuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div 
            onClick={() => {
              if (savingCustomModules) return;
              setShowCustomModuleModal(false);
            }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />
          <div className="relative bg-[#140600] border border-orange-500/20 shadow-2xl rounded-3xl w-full max-w-lg overflow-hidden flex flex-col transition-all duration-300">
            <div className="p-6 border-b border-orange-950/45 bg-orange-950/10 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-white">Custom Outlet Modules</h3>
                <p className="text-xs text-slate-400 mt-0.5">Select modules and feature packs for this outlet.</p>
              </div>
              <button
                disabled={savingCustomModules}
                onClick={() => setShowCustomModuleModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {modulePricing.map(mp => {
                  const isOn = customModuleData.modules[mp.module_key] === true;
                  return (
                    <div key={mp.module_key} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isOn ? 'bg-orange-500/10 border-orange-500/30' : 'bg-white/[0.02] border-white/5'}`}>
                      <div>
                        <h4 className="text-sm font-bold text-white">{mp.name}</h4>
                        <p className="text-xs text-slate-400">₹{mp.price_monthly}/mo</p>
                      </div>
                      <ToggleFlag 
                        checked={isOn} 
                        onChange={() => {
                          setCustomModuleData(prev => ({
                            ...prev, 
                            modules: { ...prev.modules, [mp.module_key]: !isOn }
                          }));
                        }} 
                      />
                    </div>
                  );
                })}
              </div>
              
              <div className="bg-orange-950/20 border border-orange-500/20 rounded-xl p-4 flex justify-between items-center mt-4">
                <span className="text-sm font-bold text-slate-300">Total Monthly Cost:</span>
                <span className="text-2xl font-black text-orange-400">
                  ₹{modulePricing.filter(mp => customModuleData.modules[mp.module_key]).reduce((acc, mp) => acc + Number(mp.price_monthly), 0)}
                </span>
              </div>
            </div>

            <div className="p-6 bg-orange-950/10 border-t border-orange-950/45 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCustomModuleModal(false)}
                className="px-5 py-2.5 border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white font-bold rounded-xl transition-all text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCustomModules}
                disabled={savingCustomModules}
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-black rounded-xl disabled:opacity-50 transition-all text-xs"
              >
                {savingCustomModules ? "Saving…" : "Save Custom Plan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
