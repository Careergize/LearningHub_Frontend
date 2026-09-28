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
} from "lucide-react";
import careergizeLogo from "../assets/careergize-logo.jpeg";

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "My Profile", icon: User },
  { label: "My Learning", icon: BookOpen },
  { label: "Schedule", icon: CalendarDays },
  { label: "Achievements", icon: Trophy },
  { label: "AI Mentor", icon: Brain },
];

interface StudentProfileData {
  id: number;
  name: string;
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
  const [skillInput, setSkillInput] = useState<string>("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigation = (label: string) => {
    if (label === "Overview") navigate("/dashboard");
    if (label === "My Learning") navigate("/my-learning");
    if (label === "Schedule") navigate("/schedule");
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInStudentId");
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(API_URL);
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  };

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      const newSkill = skillInput.trim();
      if (!formData.skills?.includes(newSkill)) {
        setFormData((prev) => ({
          ...prev,
          skills: [...(prev.skills || []), newSkill],
        }));
      }
      setSkillInput("");
    }
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

      const response = await fetch(API_URL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update profile.");

      const updatedData: StudentProfileData = await response.json();
      setProfile(updatedData);
      setFormData(updatedData);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile || {});
    setIsEditing(false);
  };

  const initials = profile?.name ? profile.name.slice(0, 2).toUpperCase() : "ST";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 flex-col">
        <div className="px-7 py-7">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-primary text-white flex items-center justify-center shadow-lg shadow-brand-primary/20">
              <img src={careergizeLogo} alt="Careergize Logo" className="w-8 h-8 object-contain scale-125" />
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
          <div className="mt-8 flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center">
              <User className="w-5 h-5 text-slate-500" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm truncate">{profile?.name || "Student"}</p>
              <p className="text-xs text-slate-400 truncate">{profile?.email || ""}</p>
            </div>
          </div>
        </div>

        <nav className="px-4 space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.label === "My Profile";

            return (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.label)}
                aria-current={isActive ? "page" : undefined}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? "bg-brand-primary/10 text-brand-primary"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
                {isActive && <span className="ml-auto w-2 h-2 rounded-full bg-brand-primary" />}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={careergizeLogo} alt="Careergize Logo" className="w-9 h-9 object-contain" />
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
            aria-expanded={mobileMenuOpen}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <nav className="px-4 pb-4 border-t border-slate-100 pt-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.label === "My Profile";

              return (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.label)}
                  aria-current={isActive ? "page" : undefined}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${
                    isActive ? "bg-brand-primary/10 text-brand-primary" : "text-slate-500 hover:bg-slate-100"
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
              Logout
            </button>
          </nav>
        )}
      </header>

      <main className="lg:ml-64 min-h-screen">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          {loading ? (
            <div style={styles.centerContainer}>Loading profile details...</div>
          ) : error ? (
            <div style={{ ...styles.centerContainer, color: "#d9534f" }}>Error: {error}</div>
          ) : !profile ? (
            <div style={styles.centerContainer}>No profile found.</div>
          ) : (
      <div style={styles.container}>
        {/* Top Header Bar */}
        <div style={styles.topHeader}>
          <span style={styles.headerTitle}>STUDENT PROFILE DETAILS</span>
          <span style={styles.closeIcon}>✕</span>
        </div>

        {/* Profile Header Card */}
        <div style={styles.profileCard}>
          {/* Left Avatar & User Meta Box */}
          <div style={styles.leftProfileBox}>
            <div style={styles.avatarContainer}>
              <div style={styles.avatar}>{initials}</div>
              <span style={styles.onlineDot} />
            </div>

            <div style={styles.idRow}>
              <span style={styles.idText}>ID: {profile.id}</span>
              <span style={styles.copyIcon}>📋</span>
            </div>

            <div style={styles.nameRow}>
              <h2 style={styles.userName}>{profile.name}</h2>
              <span
                style={{
                  ...styles.statusBadge,
                  ...(profile.status === "approved"
                    ? styles.statusApproved
                    : profile.status === "rejected"
                    ? styles.statusRejected
                    : styles.statusPending),
                }}
              >
                ✓ {profile.status ? profile.status.charAt(0).toUpperCase() + profile.status.slice(1) : "Pending"}
              </span>
            </div>

            <p style={styles.userRole}>
              {profile.course || "Student"} {profile.city ? `(${profile.city})` : ""}
            </p>
          </div>

          {/* Right Details Grid */}
          <div style={styles.rightDetailsBox}>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>🏢 Course</span>
              <span style={styles.detailValue}>{profile.course || "—"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>👤 Career Goal</span>
              <span style={styles.detailValue}>{profile.career_goal || "—"}</span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>💼 Experience</span>
              <span style={styles.detailValue}>
                {profile.experience_level
                  ? profile.experience_level.charAt(0).toUpperCase() + profile.experience_level.slice(1)
                  : "—"}
              </span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>🕒 Member Since</span>
              <span style={styles.pillValue}>
                {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "—"}
              </span>
            </div>
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>📧 Email</span>
              <span style={styles.pillValue}>{profile.email || "—"}</span>
            </div>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div style={styles.sectionHeaderRow}>
          <h3 style={styles.sectionTitle}>Overview Summary</h3>
          {!isEditing ? (
            <button style={styles.editBtn} onClick={() => setIsEditing(true)}>
              View / Edit Details
            </button>
          ) : (
            <div style={styles.buttonGroup}>
              <button style={styles.cancelBtn} onClick={handleCancel} disabled={saving}>
                Cancel
              </button>
              <button style={styles.saveBtn} onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        <div style={styles.metricsGrid}>
          <div style={styles.metricCard}>
            <span style={styles.metricLabel}>Phone</span>
            <span style={styles.metricValue}>{profile.phone || "Not set"}</span>
          </div>
          <div style={styles.metricCard}>
            <span style={styles.metricLabel}>Date of Birth</span>
            <span style={styles.metricValue}>{profile.date_of_birth || "Not set"}</span>
          </div>
          <div style={styles.metricCard}>
            <span style={styles.metricLabel}>Age</span>
            <span style={styles.metricValue}>{profile.age ?? "Not set"}</span>
          </div>
          <div style={styles.metricCard}>
            <span style={styles.metricLabel}>City / Location</span>
            <span style={styles.metricValue}>{profile.city || "Not set"}</span>
          </div>
        </div>

        {/* Edit Form Section */}
        {isEditing && (
          <form onSubmit={handleSave} style={styles.formContainer}>
            <h3 style={styles.sectionTitle}>Edit Profile Details</h3>
            <div style={styles.formGrid}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth || ""}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age ?? ""}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city || ""}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Course</label>
                <input
                  type="text"
                  name="course"
                  value={formData.course || ""}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Career Goal</label>
                <input
                  type="text"
                  name="career_goal"
                  value={formData.career_goal || ""}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>Experience Level</label>
                <select
                  name="experience_level"
                  value={formData.experience_level || ""}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="">Select Level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div style={styles.fieldGroup}>
                <label style={styles.label}>GitHub URL</label>
                <input
                  type="url"
                  name="github"
                  value={formData.github || ""}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={{ ...styles.fieldGroup, gridColumn: "1 / -1" }}>
                <label style={styles.label}>Address</label>
                <textarea
                  name="address"
                  value={formData.address || ""}
                  onChange={handleChange}
                  rows={2}
                  style={styles.textarea}
                />
              </div>

              <div style={{ ...styles.fieldGroup, gridColumn: "1 / -1" }}>
                <label style={styles.label}>Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio || ""}
                  onChange={handleChange}
                  rows={3}
                  style={styles.textarea}
                />
              </div>

              <div style={{ ...styles.fieldGroup, gridColumn: "1 / -1" }}>
                <label style={styles.label}>Skills (Press Enter to add)</label>
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder="Type a skill and hit Enter..."
                  style={styles.input}
                />
                <div style={styles.tagContainer}>
                  {formData.skills?.map((skill, index) => (
                    <span key={index} style={styles.editableTag}>
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        style={styles.removeTagBtn}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </form>
        )}

        {/* Links & Skills Section */}
        <div style={styles.bottomSection}>
          <div style={styles.bottomCard}>
            <span style={styles.detailLabel}>Bio</span>
            <p style={styles.bioText}>{profile.bio || "No bio provided."}</p>
          </div>
          <div style={styles.bottomCard}>
            <span style={styles.detailLabel}>Skills</span>
            <div style={styles.tagContainer}>
              {profile.skills && profile.skills.length > 0 ? (
                profile.skills.map((skill, idx) => (
                  <span key={idx} style={styles.skillBadge}>
                    {skill}
                  </span>
                ))
              ) : (
                <span style={styles.bioText}>No skills added yet.</span>
              )}
            </div>
          </div>
        </div>
      </div>
          )}
        </div>
      </main>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  outerWrapper: {
    backgroundColor: "#f5f6f8",
    minHeight: "100vh",
    padding: "24px",
    display: "flex",
    justifyContent: "center",
  },
  container: {
    width: "100%",
    maxWidth: "none",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    border: "1px solid #eaeaea",
    padding: "24px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    color: "#2d3748",
  },
  centerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "300px",
    fontSize: "16px",
    color: "#666",
  },
  topHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  headerTitle: {
    backgroundColor: "#f0f2f5",
    padding: "6px 12px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.5px",
    color: "#4a5568",
  },
  closeIcon: {
    cursor: "pointer",
    color: "#a0aec0",
    fontSize: "16px",
  },
  profileCard: {
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "24px",
    display: "grid",
    gridTemplateColumns: "1.1fr 1fr",
    gap: "32px",
    backgroundColor: "#fff",
  },
  leftProfileBox: {
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  avatarContainer: {
    position: "relative",
    width: "64px",
    height: "64px",
  },
  avatar: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    backgroundColor: "#e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    fontWeight: "bold",
    color: "#4a5568",
  },
  onlineDot: {
    position: "absolute",
    bottom: "2px",
    right: "2px",
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: "#38a169",
    border: "2px solid #fff",
  },
  idRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    color: "#a0aec0",
    fontSize: "13px",
  },
  idText: {
    fontWeight: 500,
  },
  copyIcon: {
    cursor: "pointer",
    fontSize: "12px",
  },
  nameRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "4px",
  },
  userName: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 700,
    color: "#1a202c",
  },
  statusBadge: {
    fontSize: "12px",
    fontWeight: 600,
    padding: "4px 10px",
    borderRadius: "20px",
    display: "inline-flex",
    alignItems: "center",
  },
  statusApproved: {
    backgroundColor: "#e6fffa",
    color: "#234e52",
  },
  statusPending: {
    backgroundColor: "#fefcbf",
    color: "#744210",
  },
  statusRejected: {
    backgroundColor: "#fed7d7",
    color: "#742a2a",
  },
  userRole: {
    margin: 0,
    color: "#718096",
    fontSize: "14px",
  },
  rightDetailsBox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "16px",
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "14px",
  },
  detailLabel: {
    color: "#718096",
    fontWeight: 500,
  },
  detailValue: {
    fontWeight: 600,
    color: "#2d3748",
  },
  pillValue: {
    backgroundColor: "#f7fafc",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#2d3748",
  },
  sectionHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "28px",
    marginBottom: "16px",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: 600,
    color: "#2d3748",
  },
  editBtn: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#fff",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
    color: "#2d3748",
  },
  buttonGroup: {
    display: "flex",
    gap: "8px",
  },
  saveBtn: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#3182ce",
    color: "#fff",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
  },
  cancelBtn: {
    padding: "8px 16px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#fff",
    color: "#4a5568",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 600,
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    overflow: "hidden",
  },
  metricCard: {
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    borderRight: "1px solid #e2e8f0",
    backgroundColor: "#fff",
  },
  metricLabel: {
    fontSize: "12px",
    color: "#a0aec0",
    fontWeight: 500,
  },
  metricValue: {
    fontSize: "15px",
    fontWeight: 700,
    color: "#1a202c",
  },
  formContainer: {
    marginTop: "24px",
    padding: "20px",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    backgroundColor: "#faf5ff",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginTop: "16px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#4a5568",
  },
  input: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #cbd5e0",
    fontSize: "14px",
  },
  textarea: {
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #cbd5e0",
    fontSize: "14px",
    fontFamily: "inherit",
  },
  bottomSection: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginTop: "24px",
  },
  bottomCard: {
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "16px",
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  bioText: {
    margin: 0,
    fontSize: "14px",
    color: "#4a5568",
    lineHeight: "1.5",
  },
  tagContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginTop: "4px",
  },
  skillBadge: {
    backgroundColor: "#edf2f7",
    color: "#2d3748",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 500,
  },
  editableTag: {
    backgroundColor: "#3182ce",
    color: "#fff",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  removeTagBtn: {
    background: "none",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
    padding: 0,
  },
};