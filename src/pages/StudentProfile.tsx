import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit3,
  Save,
  X,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  BookOpen,
  Target,
  Code2,
  Github,
  Linkedin,
  FileText,
  Award,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface StudentData {
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
  experience_level: string;
  skills: string[];
  github: string;
  linkedin: string;

  bio: string;

  status: string;
  created_at: string;
}

const API_URL = "http://127.0.0.1:8000/api";

const defaultSkills = [
  "Python",
  "Django",
  "React",
  "JavaScript",
  "TypeScript",
  "MySQL",
  "REST API",
  "Git & GitHub",
];

const calculateAge = (dateOfBirth: string | null) => {
  if (!dateOfBirth) {
    return null;
  }

  const today = new Date();
  const birthDate = new Date(dateOfBirth);

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 &&
      today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

const StudentProfile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<StudentData | null>(null);
  const [editProfile, setEditProfile] = useState<StudentData | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const userId = localStorage.getItem("loggedInStudentId");

      if (!userId) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/profile/${userId}/`
      );

      if (!response.ok) {
        throw new Error("Failed to load profile");
      }

      const data = await response.json();

      setProfile({
        ...data,
        skills:
          Array.isArray(data.skills) && data.skills.length > 0
            ? data.skills
            : defaultSkills,
      });
    } catch (err) {
      console.error(err);
      setError("Unable to load your profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (!profile) return;

    setEditProfile({
      ...profile,
      skills: [...profile.skills],
    });

    setIsEditing(true);
    setError("");
  };

  const handleCancel = () => {
    setEditProfile(null);
    setNewSkill("");
    setIsEditing(false);
    setError("");
  };

  const handleChange = (
    field: keyof StudentData,
    value: string
  ) => {
    if (!editProfile) return;

    setEditProfile({
      ...editProfile,
      [field]: value,
    });
  };

  const handleAddSkill = () => {
    if (!editProfile) return;

    const skill = newSkill.trim();

    if (!skill) return;

    if (
      editProfile.skills.some(
        (existingSkill) =>
          existingSkill.toLowerCase() === skill.toLowerCase()
      )
    ) {
      setNewSkill("");
      return;
    }

    setEditProfile({
      ...editProfile,
      skills: [...editProfile.skills, skill],
    });

    setNewSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    if (!editProfile) return;

    setEditProfile({
      ...editProfile,
      skills: editProfile.skills.filter(
        (skill) => skill !== skillToRemove
      ),
    });
  };

  const handleSave = async () => {
    if (!editProfile) return;

    try {
      setSaving(true);
      setError("");

      const userId = localStorage.getItem("loggedInStudentId");

      if (!userId) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/profile/${userId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: editProfile.phone,
            date_of_birth:
              editProfile.date_of_birth || null,
            address: editProfile.address,
            city: editProfile.city,
            course: editProfile.course,
            career_goal: editProfile.career_goal,
            experience_level:
              editProfile.experience_level,
            skills: editProfile.skills,
            github: editProfile.github,
            linkedin: editProfile.linkedin,
            bio: editProfile.bio,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      const updatedData = await response.json();

      setProfile({
        ...updatedData,
        skills:
          Array.isArray(updatedData.skills)
            ? updatedData.skills
            : [],
      });

      setEditProfile(null);
      setNewSkill("");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError("Unable to save your profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center max-w-md w-full">
          <User className="w-12 h-12 text-slate-400 mx-auto mb-4" />

          <h2 className="text-xl font-semibold text-slate-800">
            Profile not found
          </h2>

          <p className="text-slate-500 mt-2">
            {error || "Unable to load your profile."}
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-6 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentData = isEditing && editProfile
    ? editProfile
    : profile;

  const currentAge = calculateAge(
    currentData.date_of_birth
  );

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              My Profile
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Manage your student information
            </p>
          </div>

          <div className="flex items-center gap-3">

            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
                >
                  <X size={18} />
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
                >
                  <Save size={18} />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center gap-2 px-4 py-2.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition"
                >
                  <ArrowLeft size={18} />
                  Dashboard
                </button>

                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Edit3 size={18} />
                  Edit Profile
                </button>
              </>
            )}

          </div>
        </div>
      </header>


      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}


        {/* Profile Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg">

          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-white rounded-full" />
            <div className="absolute -bottom-32 left-20 w-80 h-80 bg-white rounded-full" />
          </div>

          <div className="relative p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-6">

            <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center text-4xl font-bold shadow-lg">
              {profile.name
                ? profile.name.charAt(0).toUpperCase()
                : "S"}
            </div>

            <div className="text-center md:text-left flex-1">

              <h2 className="text-3xl font-bold">
                {profile.name}
              </h2>

              <p className="text-blue-100 mt-1">
                Student
                {profile.course
                  ? ` · ${profile.course}`
                  : ""}
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-5">

                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-sm">
                  <Mail size={15} />
                  {profile.email}
                </span>

                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-sm capitalize">
                  {profile.status === "approved" ? (
                    <CheckCircle2 size={15} />
                  ) : (
                    <Clock size={15} />
                  )}

                  {profile.status}
                </span>

              </div>
            </div>

          </div>
        </section>


        {/* Personal Information */}
        <section className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm">

          <div className="px-6 py-5 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 rounded-xl">
                <User className="w-5 h-5 text-blue-600" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Personal Information
                </h3>

                <p className="text-sm text-slate-500">
                  Your basic personal details
                </p>
              </div>
            </div>
          </div>


          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Name */}
            <div>
              <label className="text-sm font-medium text-slate-600">
                Full Name
              </label>

              <div className="mt-2 flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
                <User size={18} className="text-slate-400" />
                <span className="text-slate-800">
                  {profile.name}
                </span>
              </div>
            </div>


            {/* Email */}
            <div>
              <label className="text-sm font-medium text-slate-600">
                Email
              </label>

              <div className="mt-2 flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
                <Mail size={18} className="text-slate-400" />
                <span className="text-slate-800">
                  {profile.email}
                </span>
              </div>
            </div>


            {/* Phone */}
            <div>
              <label className="text-sm font-medium text-slate-600">
                Phone
              </label>

              {isEditing ? (
                <input
                  type="text"
                  value={currentData.phone}
                  onChange={(e) =>
                    handleChange(
                      "phone",
                      e.target.value
                    )
                  }
                  placeholder="Enter your phone number"
                  className="mt-2 w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="mt-2 flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <Phone size={18} className="text-slate-400" />
                  <span className="text-slate-800">
                    {profile.phone || "Not added yet"}
                  </span>
                </div>
              )}
            </div>


            {/* DOB */}
            <div>
              <label className="text-sm font-medium text-slate-600">
                Date of Birth
              </label>

              {isEditing ? (
                <input
                  type="date"
                  value={
                    currentData.date_of_birth || ""
                  }
                  onChange={(e) =>
                    handleChange(
                      "date_of_birth",
                      e.target.value
                    )
                  }
                  className="mt-2 w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="mt-2 flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <Calendar size={18} className="text-slate-400" />

                  <span className="text-slate-800">
                    {profile.date_of_birth
                      ? new Date(
                          profile.date_of_birth
                        ).toLocaleDateString()
                      : "Not added yet"}
                  </span>
                </div>
              )}
            </div>


            {/* Age */}
            <div>
              <label className="text-sm font-medium text-slate-600">
                Age
              </label>

              <div className="mt-2 flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
                <Calendar size={18} className="text-slate-400" />

                <span className="text-slate-800">
                  {currentAge !== null
                    ? `${currentAge} years`
                    : "Not added yet"}
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-1.5">
                Age is calculated automatically from your date of birth.
              </p>
            </div>


            {/* City */}
            <div>
              <label className="text-sm font-medium text-slate-600">
                City
              </label>

              {isEditing ? (
                <input
                  type="text"
                  value={currentData.city}
                  onChange={(e) =>
                    handleChange(
                      "city",
                      e.target.value
                    )
                  }
                  placeholder="Enter your city"
                  className="mt-2 w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="mt-2 flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <MapPin size={18} className="text-slate-400" />

                  <span className="text-slate-800">
                    {profile.city || "Not added yet"}
                  </span>
                </div>
              )}
            </div>


            {/* Address */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-slate-600">
                Address
              </label>

              {isEditing ? (
                <textarea
                  value={currentData.address}
                  onChange={(e) =>
                    handleChange(
                      "address",
                      e.target.value
                    )
                  }
                  placeholder="Enter your address"
                  rows={3}
                  className="mt-2 w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              ) : (
                <div className="mt-2 flex items-start gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <MapPin
                    size={18}
                    className="text-slate-400 mt-0.5"
                  />

                  <span className="text-slate-800">
                    {profile.address || "Not added yet"}
                  </span>
                </div>
              )}
            </div>

          </div>
        </section>


        {/* Learning & Career */}
        <section className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm">

          <div className="px-6 py-5 border-b border-slate-200">

            <div className="flex items-center gap-3">

              <div className="p-2.5 bg-indigo-50 rounded-xl">
                <BookOpen className="w-5 h-5 text-indigo-600" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Learning & Career
                </h3>

                <p className="text-sm text-slate-500">
                  Tell us about your learning and career goals
                </p>
              </div>

            </div>

          </div>


          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Course */}
            <div>
              <label className="text-sm font-medium text-slate-600">
                Current Course
              </label>

              {isEditing ? (
                <input
                  type="text"
                  value={currentData.course}
                  onChange={(e) =>
                    handleChange(
                      "course",
                      e.target.value
                    )
                  }
                  placeholder="e.g. Python Full Stack Development"
                  className="mt-2 w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="mt-2 flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <BookOpen size={18} className="text-slate-400" />

                  <span className="text-slate-800">
                    {profile.course || "Not added yet"}
                  </span>
                </div>
              )}
            </div>


            {/* Career Goal */}
            <div>
              <label className="text-sm font-medium text-slate-600">
                Career Goal
              </label>

              {isEditing ? (
                <input
                  type="text"
                  value={currentData.career_goal}
                  onChange={(e) =>
                    handleChange(
                      "career_goal",
                      e.target.value
                    )
                  }
                  placeholder="e.g. Full Stack Developer"
                  className="mt-2 w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="mt-2 flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <Target size={18} className="text-slate-400" />

                  <span className="text-slate-800">
                    {profile.career_goal || "Not added yet"}
                  </span>
                </div>
              )}
            </div>


            {/* Experience Level */}
            <div>
              <label className="text-sm font-medium text-slate-600">
                Experience Level
              </label>

              {isEditing ? (
                <select
                  value={
                    currentData.experience_level
                  }
                  onChange={(e) =>
                    handleChange(
                      "experience_level",
                      e.target.value
                    )
                  }
                  className="mt-2 w-full px-4 py-3 border border-slate-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">
                    Select experience level
                  </option>

                  <option value="beginner">
                    Beginner
                  </option>

                  <option value="intermediate">
                    Intermediate
                  </option>

                  <option value="advanced">
                    Advanced
                  </option>
                </select>
              ) : (
                <div className="mt-2 flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <Code2 size={18} className="text-slate-400" />

                  <span className="text-slate-800 capitalize">
                    {profile.experience_level ||
                      "Not added yet"}
                  </span>
                </div>
              )}
            </div>


            {/* GitHub */}
            <div>
              <label className="text-sm font-medium text-slate-600">
                GitHub Profile
              </label>

              {isEditing ? (
                <input
                  type="url"
                  value={currentData.github}
                  onChange={(e) =>
                    handleChange(
                      "github",
                      e.target.value
                    )
                  }
                  placeholder="https://github.com/username"
                  className="mt-2 w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="mt-2 flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <Github size={18} className="text-slate-400" />

                  {profile.github ? (
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline truncate"
                    >
                      {profile.github}
                    </a>
                  ) : (
                    <span className="text-slate-800">
                      Not added yet
                    </span>
                  )}
                </div>
              )}
            </div>


            {/* LinkedIn */}
            <div>
              <label className="text-sm font-medium text-slate-600">
                LinkedIn Profile
              </label>

              {isEditing ? (
                <input
                  type="url"
                  value={currentData.linkedin}
                  onChange={(e) =>
                    handleChange(
                      "linkedin",
                      e.target.value
                    )
                  }
                  placeholder="https://linkedin.com/in/username"
                  className="mt-2 w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="mt-2 flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <Linkedin size={18} className="text-slate-400" />

                  {profile.linkedin ? (
                    <a
                      href={profile.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline truncate"
                    >
                      {profile.linkedin}
                    </a>
                  ) : (
                    <span className="text-slate-800">
                      Not added yet
                    </span>
                  )}
                </div>
              )}
            </div>

          </div>
        </section>


        {/* Skills */}
        <section className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm">

          <div className="px-6 py-5 border-b border-slate-200">

            <div className="flex items-center gap-3">

              <div className="p-2.5 bg-violet-50 rounded-xl">
                <Code2 className="w-5 h-5 text-violet-600" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Skills
                </h3>

                <p className="text-sm text-slate-500">
                  Add the skills you are learning or have experience with
                </p>
              </div>

            </div>

          </div>


          <div className="p-6">

            <div className="flex flex-wrap gap-2">

              {currentData.skills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-2 px-3.5 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                >
                  {skill}

                  {isEditing && (
                    <button
                      onClick={() =>
                        handleRemoveSkill(skill)
                      }
                      className="hover:text-red-600"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
              ))}

              {currentData.skills.length === 0 &&
                !isEditing && (
                  <p className="text-slate-500">
                    No skills added yet.
                  </p>
                )}

            </div>


            {isEditing && (
              <div className="mt-5 flex gap-3">

                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) =>
                    setNewSkill(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  placeholder="Add a skill"
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-5 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition"
                >
                  Add Skill
                </button>

              </div>
            )}

          </div>
        </section>


        {/* About Me */}
        <section className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm">

          <div className="px-6 py-5 border-b border-slate-200">

            <div className="flex items-center gap-3">

              <div className="p-2.5 bg-emerald-50 rounded-xl">
                <FileText className="w-5 h-5 text-emerald-600" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  About Me
                </h3>

                <p className="text-sm text-slate-500">
                  Tell us a little about yourself
                </p>
              </div>

            </div>

          </div>


          <div className="p-6">

            {isEditing ? (
              <textarea
                value={currentData.bio}
                onChange={(e) =>
                  handleChange(
                    "bio",
                    e.target.value
                  )
                }
                placeholder="Write a short introduction about yourself..."
                rows={5}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            ) : (
              <p className="text-slate-700 leading-7">
                {profile.bio ||
                  "Tell us about yourself by clicking Edit Profile."}
              </p>
            )}

          </div>
        </section>


        {/* Learning Progress */}
        <section className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm">

          <div className="p-6">

            <div className="flex items-center justify-between mb-4">

              <div className="flex items-center gap-3">

                <div className="p-2.5 bg-blue-50 rounded-xl">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    Learning Progress
                  </h3>

                  <p className="text-sm text-slate-500">
                    Your current learning progress
                  </p>
                </div>

              </div>

              <span className="text-lg font-bold text-blue-600">
                0%
              </span>

            </div>


            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{ width: "0%" }}
              />
            </div>

            <p className="text-sm text-slate-500 mt-3">
              Your course progress will appear here.
            </p>

          </div>
        </section>


        {/* Achievements */}
        <section className="mt-6 mb-10 bg-white rounded-2xl border border-slate-200 shadow-sm">

          <div className="p-6">

            <div className="flex items-center gap-3">

              <div className="p-2.5 bg-amber-50 rounded-xl">
                <Award className="w-5 h-5 text-amber-600" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Achievements
                </h3>

                <p className="text-sm text-slate-500">
                  Your learning achievements
                </p>
              </div>

            </div>


            <div className="mt-6 border border-dashed border-slate-300 rounded-xl p-8 text-center">

              <Award className="w-10 h-10 text-slate-300 mx-auto mb-3" />

              <h4 className="font-medium text-slate-700">
                No achievements yet
              </h4>

              <p className="text-sm text-slate-500 mt-1">
                Complete courses and activities to earn achievements.
              </p>

            </div>

          </div>
        </section>

      </main>
    </div>
  );
};

export default StudentProfile;
