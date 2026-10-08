import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  Trophy,
  Brain,
  User,
  LogOut,
  Menu,
  X,
  Edit3,
  Save,
  Check,
  CheckCircle2,
  Award,
  Copy,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Briefcase,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Plus,
} from "lucide-react";
import careergizeLogo from "../assets/careergize-logo.png";

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "My Profile", icon: User },
  { label: "My Learning", icon: BookOpen },
  { label: "Schedule", icon: CalendarDays },
  { label: "Achievements", icon: Trophy },
  { label: "AI Mentor", icon: Brain },
];

export interface StudentProfileData {
  id: number;
  name: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone: string;
  date_of_birth: string | null;
  age: number | null;
  address: string;
  city: string;
  course: string;
  career_goal: string;
  experience_level: "beginner" | "intermediate" | "advanced" | "";
  skills: string[];
  github: string;
  linkedin: string;
  bio: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

interface ProfileProps {
  userId?: number;
}

export const Profile: React.FC<ProfileProps> = ({ userId = 1 }) => {
  const navigate = useNavigate();
  const API_URL = `http://127.0.0.1:8000/api/profile/${userId}/`;

  const [profile, setProfile] = useState<StudentProfileData | null>(null);
  const [formData, setFormData] = useState<Partial<StudentProfileData>>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<boolean>(false);
  const [skillInput, setSkillInput] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [localUser] = useState<any>(() => {
    try {
      const saved = localStorage.getItem("loggedInUser");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleNavigation = (label: string) => {
    if (label === "Overview") navigate("/dashboard");
    if (label === "My Profile") navigate("/profile");
    if (label === "My Learning") navigate("/my-learning");
    if (label === "Schedule") navigate("/schedule");
    if (label === "Achievements") navigate("/achievements");
    if (label === "AI Mentor") navigate("/ai-mentor");
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInStudentId");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("authToken");
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Token ${token}`;
      }

      const response = await fetch(API_URL, { headers });
      if (!response.ok) throw new Error(`Failed to fetch profile: ${response.statusText}`);
      const data: StudentProfileData = await response.json();
      setProfile(data);
      setFormData(data);
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching the profile.");
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (dob: string | null): number | null => {
    if (!dob) return null;
    const birth = new Date(dob);
    if (isNaN(birth.getTime())) return null;
    const today = new Date();
    let calculated = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      calculated--;
    }
    return calculated >= 0 ? calculated : null;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value === "" ? null : value,
      };

      // Auto-compute age if date of birth is updated
      if (name === "date_of_birth") {
        const computed = calculateAge(value);
        if (computed !== null) {
          updated.age = computed;
        }
      }

      return updated;
    });
  };

  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const newSkill = skillInput.trim();
    if (!newSkill) return;

    if (!formData.skills?.includes(newSkill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), newSkill],
      }));
    }
    setSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills?.filter((s) => s !== skillToRemove) || [],
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      const token = localStorage.getItem("authToken");
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Token ${token}`;
      }

      let response = await fetch(API_URL, {
        method: "PATCH",
        headers,
        body: JSON.stringify(formData),
      });

      // If backend only implements PUT (HTTP 405 Method Not Allowed), fallback to PUT
      if (response.status === 405) {
        response = await fetch(API_URL, {
          method: "PUT",
          headers,
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          (errorData && (errorData.detail || errorData.error)) || "Failed to update profile."
        );
      }

      const updatedData: StudentProfileData = await response.json();
      setProfile(updatedData);
      setFormData(updatedData);
      setIsEditing(false);
      showToast("Profile details updated and saved successfully!");
    } catch (err: any) {
      setError(err.message || "An error occurred while saving profile changes.");
      showToast("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile || {});
    setIsEditing(false);
    setError(null);
  };

  const handleCopyId = () => {
    if (profile?.id) {
      navigator.clipboard.writeText(String(profile.id));
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
      showToast(`Student ID #${profile.id} copied to clipboard!`);
    }
  };

  const getFormattedName = (
    prof?: StudentProfileData | null,
    u?: any,
    fallback = "Student"
  ) => {
    // 1. Check first_name / last_name from profile or loggedInUser
    const firstName = prof?.first_name || u?.first_name;
    const lastName = prof?.last_name || u?.last_name;
    if (firstName || lastName) {
      const full = [firstName, lastName].filter(Boolean).join(" ").trim();
      if (full) {
        const cleaned = full.includes("@") ? full.split("@")[0].trim() : full;
        const words = cleaned.split(/\s+/).filter(Boolean);
        if (words.length > 2) return `${words[0]} ${words[words.length - 1]}`;
        return cleaned;
      }
    }

    // 2. Check profile.name or u.name
    const nameVal = prof?.name || u?.name;
    if (nameVal && typeof nameVal === "string" && nameVal.trim()) {
      const trimmed = nameVal.trim();
      const cleaned = trimmed.includes("@") ? trimmed.split("@")[0].trim() : trimmed;
      const words = cleaned.split(/\s+/).filter(Boolean);
      if (words.length > 2) return `${words[0]} ${words[words.length - 1]}`;
      return cleaned;
    }

    // 3. Check username
    const usernameVal = u?.username;
    if (usernameVal && typeof usernameVal === "string" && usernameVal.trim()) {
      const trimmed = usernameVal.trim();
      const cleaned = trimmed.includes("@") ? trimmed.split("@")[0].trim() : trimmed;
      const words = cleaned.split(/\s+/).filter(Boolean);
      if (words.length > 2) return `${words[0]} ${words[words.length - 1]}`;
      return cleaned;
    }

    return fallback;
  };

  const displayName = getFormattedName(profile, localUser, "Student");

  const displayEmail =
    profile?.email ||
    localUser?.email ||
    (typeof localUser?.username === "string" && localUser.username.includes("@")
      ? localUser.username
      : "");

  const initials = displayName
    ? displayName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "S";

  const getStatusBadge = (status: string) => {
    if (status === "approved") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Verified Student</span>
        </span>
      );
    }
    if (status === "rejected") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <X className="w-3.5 h-3.5" />
          <span>Rejected</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
        <Clock className="w-3.5 h-3.5" />
        <span>Pending Approval</span>
      </span>
    );
  };

  return (
    <div className="student-dark-theme min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-slate-900 text-white shadow-xl shadow-slate-900/20 border border-slate-800 text-sm font-semibold transition-all">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================
          DESKTOP SIDEBAR (Consistent with Website Theme)
          ========================================================= */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 flex-col z-30">
        <div className="px-7 py-7">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full logo-circle-white flex items-center justify-center p-1.5 shadow-md overflow-hidden shrink-0">
              <img
                src={careergizeLogo}
                alt="Careergize Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="font-extrabold text-xl tracking-tight">
                Careergize<span className="text-brand-primary">.</span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400 font-bold">
                Learning Hub
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-4 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.label === "My Profile";

            return (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.label)}
                aria-current={isActive ? "page" : undefined}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition cursor-pointer ${
                  isActive
                    ? "bg-brand-primary/10 text-brand-primary font-bold shadow-2xs"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-brand-primary" : "text-slate-400"}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-brand-primary" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Student Profile Quick Tile (Bottom before logout) */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-sm shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm truncate text-slate-800">
                {displayName}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {displayEmail}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* =========================================================
          MOBILE HEADER
          ========================================================= */}
      <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full logo-circle-white flex items-center justify-center p-1 shadow-sm overflow-hidden shrink-0">
              <img
                src={careergizeLogo}
                alt="Careergize Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="font-extrabold text-lg">
                Careergize<span className="text-brand-primary">.</span>
              </div>
              <div className="text-[9px] uppercase tracking-[0.18em] text-slate-400 font-bold">
                Learning Hub
              </div>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-700 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <nav className="px-4 pb-4 border-t border-slate-100 pt-3 space-y-1 bg-white">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.label === "My Profile";

              return (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.label)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${
                    isActive
                      ? "bg-brand-primary/10 text-brand-primary font-bold"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </nav>
        )}
      </header>

      {/* =========================================================
          MAIN CONTENT AREA (Matched to MyLearning / Website Theme)
          ========================================================= */}
      <main className="lg:ml-64 min-h-screen">
        <div className="w-full px-4 sm:px-8 lg:px-10 py-8 space-y-8">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center min-h-[450px] bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
              <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-brand-primary animate-spin mb-4" />
              <p className="text-base font-bold text-slate-700">Loading student profile...</p>
              <p className="text-xs text-slate-400 mt-1">Connecting to server API</p>
            </div>
          )}

          {/* Error Alert */}
          {!loading && error && (
            <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm">Action failed</p>
                  <p className="text-xs text-rose-600 mt-0.5">{error}</p>
                </div>
              </div>
              <button
                onClick={fetchProfile}
                className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition cursor-pointer"
              >
                Retry
              </button>
            </div>
          )}

          {/* Profile Loaded Successfully */}
          {!loading && profile && (
            <>
              {/* =====================================================
                  1. HERO / HEADER BANNER (Theme Matched)
                  ===================================================== */}
              <div className="relative overflow-hidden bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8">
                {/* Decorative blurs */}
                <div className="absolute -top-20 -right-16 w-64 h-64 rounded-full bg-brand-primary/10 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 right-60 w-56 h-56 rounded-full bg-blue-100/70 blur-2xl pointer-events-none" />

                <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-primary mb-2">
                      <User className="w-4 h-4" />
                      <span>STUDENT PROFILE • ACCOUNT & VERIFICATION</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                      My Profile
                    </h1>

                    <p className="text-slate-500 mt-2 text-sm sm:text-base max-w-2xl leading-relaxed">
                      Manage your personal credentials, contact details, academic track, technical skills, and developer portfolio links.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Edit Profile</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleCancel}
                          disabled={saving}
                          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-sm transition cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleSave}
                          disabled={saving}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-primary text-white hover:bg-brand-primary/95 font-bold text-sm shadow-sm transition cursor-pointer disabled:opacity-60"
                        >
                          <Save className="w-4 h-4" />
                          <span>{saving ? "Saving..." : "Save Changes"}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* =====================================================
                  2. PROFILE IDENTITY SHOWCASE CARD
                  ===================================================== */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-5">
                    {/* Large Avatar */}
                    <div className="relative">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-primary-light text-white flex items-center justify-center font-extrabold text-2xl shadow-lg shadow-brand-primary/20">
                        {initials}
                      </div>
                      <span
                        title="Active Learner"
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white ring-2 ring-emerald-100"
                      />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                          {displayName}
                        </h2>
                        {getStatusBadge(profile.status)}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-slate-500">
                        <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                          <GraduationCap className="w-4 h-4 text-brand-primary" />
                          {profile.course || "General Student"}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                          {profile.career_goal || "Learner"}
                        </span>
                      </div>

                      {/* ID with Copy action */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-bold text-slate-400">
                          Student ID: #{profile.id}
                        </span>
                        <button
                          onClick={handleCopyId}
                          title="Copy Student ID"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-primary hover:text-brand-primary/80 bg-brand-primary/5 hover:bg-brand-primary/10 px-2 py-0.5 rounded-md transition cursor-pointer"
                        >
                          {copiedId ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Status & Quick Tags */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-right">
                      <span className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                        Experience Level
                      </span>
                      <span className="text-sm font-bold text-slate-800 capitalize">
                        {profile.experience_level || "Beginner"}
                      </span>
                    </div>

                    <div className="px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-right">
                      <span className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400">
                        Member Since
                      </span>
                      <span className="text-sm font-bold text-slate-800">
                        {profile.created_at
                          ? new Date(profile.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                            })
                          : "2026"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-brand-primary shrink-0 shadow-2xs">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Email Address
                      </p>
                      <p className="text-sm font-bold text-slate-800 truncate" title={profile.email}>
                        {profile.email || "Not set"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-amber-500 shrink-0 shadow-2xs">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Phone Number
                      </p>
                      <p className="text-sm font-bold text-slate-800 truncate">
                        {profile.phone || "Not set"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-600 shrink-0 shadow-2xs">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Location / City
                      </p>
                      <p className="text-sm font-bold text-slate-800 truncate">
                        {profile.city || "Not set"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-purple-600 shrink-0 shadow-2xs">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Account Status
                      </p>
                      <p className="text-sm font-bold text-slate-800 capitalize truncate">
                        {profile.status || "Active"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* =====================================================
                  3. FOUR KPI STAT CARDS (Matches Theme 1-to-1)
                  ===================================================== */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {/* Card 1: Contact Phone */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-brand-primary/40 hover:shadow-sm transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-brand-primary" />
                    </div>
                    <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                      Contact
                    </span>
                  </div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 truncate">
                    {profile.phone || "—"}
                  </p>
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-sm font-semibold text-slate-600">Mobile Phone</p>
                    <span className="text-xs text-brand-primary font-bold">Verified</span>
                  </div>
                </div>

                {/* Card 2: Date of Birth */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-amber-400/40 hover:shadow-sm transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-amber-500" />
                    </div>
                    <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                      Birth Date
                    </span>
                  </div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 truncate">
                    {profile.date_of_birth || "—"}
                  </p>
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-sm font-semibold text-slate-600">Date of Birth</p>
                    <span className="text-xs text-amber-600 font-bold">Recorded</span>
                  </div>
                </div>

                {/* Card 3: Age */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-400/40 hover:shadow-sm transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                      Age
                    </span>
                  </div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {profile.age ? `${profile.age} Yrs` : "—"}
                  </p>
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-sm font-semibold text-slate-600">Student Age</p>
                    <span className="text-xs text-emerald-600 font-bold">Eligible</span>
                  </div>
                </div>

                {/* Card 4: Location */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-purple-400/40 hover:shadow-sm transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-purple-50 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                      City
                    </span>
                  </div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 truncate">
                    {profile.city || "—"}
                  </p>
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-sm font-semibold text-slate-600">Location</p>
                    <span className="text-xs text-purple-600 font-bold">Region</span>
                  </div>
                </div>
              </div>

              {/* =====================================================
                  4. EDIT FORM SECTION (Interactive Backend Updates)
                  ===================================================== */}
              {isEditing && (
                <div className="bg-white rounded-3xl border border-brand-primary/30 shadow-md p-6 sm:p-8">
                  <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                        <Edit3 className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-extrabold text-slate-900">
                          Edit Student Details
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Update profile fields below and click "Save Changes" to sync with backend.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full">
                      Editing Mode
                    </span>
                  </div>

                  <form onSubmit={handleSave} className="space-y-6">
                    {/* Section: Personal Info */}
                    <div>
                      <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-400 mb-4">
                        1. Personal & Contact Information
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name || ""}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition"
                            placeholder="Your full name"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Phone Number
                          </label>
                          <input
                            type="text"
                            name="phone"
                            value={formData.phone || ""}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition"
                            placeholder="+1 (555) 000-0000"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            City / Location
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city || ""}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition"
                            placeholder="e.g. San Francisco, CA"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            name="date_of_birth"
                            value={formData.date_of_birth || ""}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Age (Auto-calculated)
                          </label>
                          <input
                            type="number"
                            name="age"
                            value={formData.age ?? ""}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition"
                            placeholder="Age in years"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Email (Read-only)
                          </label>
                          <input
                            type="email"
                            name="email"
                            disabled
                            value={formData.email || ""}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-sm font-medium cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section: Academic & Goals */}
                    <div className="pt-4 border-t border-slate-100">
                      <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-400 mb-4">
                        2. Academic Focus & Career Goals
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Enrolled Course
                          </label>
                          <input
                            type="text"
                            name="course"
                            value={formData.course || ""}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition"
                            placeholder="e.g. Python Full Stack Development"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Target Career Goal
                          </label>
                          <input
                            type="text"
                            name="career_goal"
                            value={formData.career_goal || ""}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition"
                            placeholder="e.g. Senior Software Engineer"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Experience Level
                          </label>
                          <select
                            name="experience_level"
                            value={formData.experience_level || ""}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition bg-white"
                          >
                            <option value="">Select Level</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Section: Developer Portfolio */}
                    <div className="pt-4 border-t border-slate-100">
                      <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-400 mb-4">
                        3. Developer Profiles & Social
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            GitHub Profile URL
                          </label>
                          <input
                            type="url"
                            name="github"
                            value={formData.github || ""}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition"
                            placeholder="https://github.com/yourusername"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            LinkedIn Profile URL
                          </label>
                          <input
                            type="url"
                            name="linkedin"
                            value={formData.linkedin || ""}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition"
                            placeholder="https://linkedin.com/in/yourprofile"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section: Bio & Address */}
                    <div className="pt-4 border-t border-slate-100">
                      <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-400 mb-4">
                        4. Biography & Address
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Street Address
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={formData.address || ""}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition"
                            placeholder="Street address and apartment/suite"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Bio & Objective
                          </label>
                          <textarea
                            name="bio"
                            rows={3}
                            value={formData.bio || ""}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition"
                            placeholder="Write a brief professional summary about your learning journey and aspirations..."
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section: Skills */}
                    <div className="pt-4 border-t border-slate-100">
                      <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-400 mb-4">
                        5. Technical Skills
                      </h4>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddSkill();
                              }
                            }}
                            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition"
                            placeholder="Add a new skill (e.g. React, Python, Django, SQL) and click Add or press Enter"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddSkill()}
                            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Add</span>
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                          {formData.skills && formData.skills.length > 0 ? (
                            formData.skills.map((skill, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary font-bold text-xs"
                              >
                                <span>{skill}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSkill(skill)}
                                  className="w-4 h-4 rounded-full hover:bg-brand-primary/20 flex items-center justify-center text-brand-primary cursor-pointer transition"
                                >
                                  ×
                                </button>
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400 italic">
                              No skills added yet. Type above to add skills.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Bar */}
                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={handleCancel}
                        disabled={saving}
                        className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-sm transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-sm shadow-sm transition cursor-pointer disabled:opacity-60"
                      >
                        <Save className="w-4 h-4" />
                        <span>{saving ? "Saving to Backend..." : "Save Changes"}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* =====================================================
                  5. VIEW MODE CONTENT SECTIONS
                  ===================================================== */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Biography & Skills */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Biography Card */}
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                          <User className="w-4 h-4" />
                        </div>
                        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                          Biography & Objectives
                        </h3>
                      </div>

                      {!isEditing && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="text-xs font-bold text-brand-primary hover:text-brand-primary/80 flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      )}
                    </div>

                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                      {profile.bio ||
                        "No biography provided yet. Click 'Edit Profile' to write a personal overview and career objectives."}
                    </p>

                    {profile.address && (
                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-start gap-2.5 text-xs text-slate-500">
                        <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-slate-700">Residential Address:</strong>{" "}
                          {profile.address}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Technical Skills Card */}
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                            Technical Skills & Stack
                          </h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Verified competencies & technologies
                          </p>
                        </div>
                      </div>

                      {!isEditing && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="text-xs font-bold text-brand-primary hover:text-brand-primary/80 flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add More</span>
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      {profile.skills && profile.skills.length > 0 ? (
                        profile.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-brand-primary/10 border border-slate-200/90 hover:border-brand-primary/30 text-slate-700 hover:text-brand-primary font-bold text-xs transition duration-150"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                            <span>{skill}</span>
                          </span>
                        ))
                      ) : (
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-center w-full">
                          <p className="text-xs text-slate-500 font-medium">
                            No skills added yet. Add your technologies to stand out!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right 1 Col: Developer Links & Academic Card */}
                <div className="space-y-6">
                  {/* Social & Portfolio Links */}
                  <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
                    <div className="flex items-center gap-2.5 mb-5">
                      <div className="w-9 h-9 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                        <ExternalLink className="w-4 h-4" />
                      </div>
                      <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                        Developer Profiles
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {/* GitHub */}
                      {profile.github ? (
                        <a
                          href={profile.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition group"
                        >
                          <div className="flex items-center gap-3">
                            <Github className="w-5 h-5 text-slate-900" />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900">GitHub Profile</p>
                              <p className="text-[11px] text-slate-500 truncate max-w-[170px]">
                                {profile.github.replace("https://github.com/", "@")}
                              </p>
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition" />
                        </a>
                      ) : (
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-slate-400 text-xs">
                          <div className="flex items-center gap-2.5">
                            <Github className="w-4 h-4" />
                            <span>GitHub not connected</span>
                          </div>
                          {!isEditing && (
                            <button
                              onClick={() => setIsEditing(true)}
                              className="font-bold text-brand-primary hover:underline cursor-pointer"
                            >
                              Add
                            </button>
                          )}
                        </div>
                      )}

                      {/* LinkedIn */}
                      {profile.linkedin ? (
                        <a
                          href={profile.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3.5 rounded-2xl bg-blue-50/60 hover:bg-blue-50 border border-blue-200 text-blue-900 transition group"
                        >
                          <div className="flex items-center gap-3">
                            <Linkedin className="w-5 h-5 text-blue-700" />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-blue-900">LinkedIn Profile</p>
                              <p className="text-[11px] text-blue-600 truncate max-w-[170px]">
                                Verified Network
                              </p>
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-blue-500 group-hover:text-blue-800 transition" />
                        </a>
                      ) : (
                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-slate-400 text-xs">
                          <div className="flex items-center gap-2.5">
                            <Linkedin className="w-4 h-4" />
                            <span>LinkedIn not connected</span>
                          </div>
                          {!isEditing && (
                            <button
                              onClick={() => setIsEditing(true)}
                              className="font-bold text-brand-primary hover:underline cursor-pointer"
                            >
                              Add
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Academic Track Card */}
                  <div className="bg-white rounded-3xl border border-brand-primary/25 p-6 sm:p-8 shadow-xs relative overflow-hidden">
                    <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-brand-primary/10 blur-2xl pointer-events-none" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 text-xs font-extrabold text-brand-primary uppercase tracking-wider mb-2">
                        <Award className="w-4 h-4" />
                        <span>Academic Pathway</span>
                      </div>

                      <h4 className="text-lg font-extrabold text-slate-900 tracking-tight">
                        {profile.course || "Full Stack Engineering"}
                      </h4>

                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Enrolled and actively participating in the Careergize Learning Hub syllabus.
                      </p>

                      <div className="mt-5 pt-4 border-t border-brand-primary/15 flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-600">Verification</span>
                        <span className="text-brand-primary flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-brand-primary" />
                          <span>Certified Cohort</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};