
import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Routes, Route, useNavigate } from "react-router-dom";

import NavBar from "./components/NavBar";
import HeroSection from "./components/HeroSection";
import MarqueeLogos from "./components/MarqueeLogos";
import BentoGrid from "./components/BentoGrid";
import CourseCatalog from "./components/CourseCatalog";
import MentorChat from "./components/MentorChat";
import CommandCenter from "./components/CommandCenter";
import TrajectoryTimeline from "./components/TrajectoryTimeline";
import CertificateShowcase from "./components/CertificateShowcase";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { Profile } from "./components/profile";
import AdminLogin from "./pages/AdminLogin";
import MyLearning from "./pages/MyLearning";
import Schedule from "./pages/Schedule";
import Achievements from "./pages/Achievements";
import AiMentor from "./pages/AiMentor";



/* =========================================================
   TYPES
========================================================= */

interface Student {
  id: number;
  user_id: number;
  name: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  phone: string;
  age: number | null;
  course: string;
  career_goal: string;
  experience_level: string;
  enrollment_count: number;
  completed_courses: number;
  average_progress: number;
  courses: Array<{
    id: number;
    title: string;
    status: string;
    progress: number;
    completed_lessons: number;
    total_lessons: number;
  }>;
}

type AdminSection = "overview" | "students" | "pending" | "courses" | "schedule" | "achievements" | "analytics";

interface AdminStats {
  total_students: number;
  pending_students: number;
  approved_students: number;
  rejected_students: number;
  total_courses: number;
  published_courses: number;
  enrollments: number;
  completed_enrollments: number;
  in_progress_enrollments: number;
  average_progress: number;
  achievements: number;
  unlocked_achievements: number;
}

interface AdminAnalytics {
  registrations_by_month: Array<{ month: string; year: number; count: number }>;
  progress_distribution: Array<{ label: string; count: number }>;
  enrollments_by_course: Array<{ title: string; enrollment_count: number }>;
}

interface AdminOverviewActivity {
  recent_registrations: Array<{ id: number; name: string; email: string; status: string; created_at: string }>;
  recent_enrollments: Array<{ id: number; student: string; course: string; status: string; enrolled_at: string }>;
  upcoming_classes: Array<{ id: number; course: string; topic: string; date: string; start_time: string; end_time: string; instructor: string }>;
}


/* =========================================================
   LANDING PAGE
========================================================= */

function LandingPage() {
  return (
    <div className="landing-page font-sans antialiased bg-white text-[#171c21] min-h-screen">

      <NavBar />

      <main>

        <HeroSection />

        <MarqueeLogos />

        <BentoGrid />

        <CourseCatalog />

        <TrajectoryTimeline />

        <MentorChat />

        <CommandCenter />

        <CertificateShowcase />

        <CTASection />

      </main>

      <Footer />

    </div>
  );
}


/* =========================================================
   ADMIN DASHBOARD
========================================================= */

function AuthenticatedProfile() {
  const storedStudentId = localStorage.getItem("loggedInStudentId");
  const studentId = Number(storedStudentId);

  if (!storedStudentId || !Number.isInteger(studentId) || studentId <= 0) {
    return <Navigate to="/login" replace />;
  }

  return <Profile userId={studentId} />;
}

function AdminDashboard() {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState<any>(() => {
    try {
      return JSON.parse(localStorage.getItem("adminUser") || "null");
    } catch {
      return null;
    }
  });


  /* ---------------------------------------------------------
     STATES
  --------------------------------------------------------- */

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");
  const [studentStatusFilter, setStudentStatusFilter] = useState("all");
  const [adminStats, setAdminStats] = useState<AdminStats>({
    total_students: 0,
    pending_students: 0,
    approved_students: 0,
    rejected_students: 0,
    total_courses: 0,
    published_courses: 0,
    enrollments: 0,
    completed_enrollments: 0,
    in_progress_enrollments: 0,
    average_progress: 0,
    achievements: 0,
    unlocked_achievements: 0,
  });
  const [overviewActivity, setOverviewActivity] = useState<AdminOverviewActivity>({ recent_registrations: [], recent_enrollments: [], upcoming_classes: [] });
  const [analytics, setAnalytics] = useState<AdminAnalytics>({
    registrations_by_month: [],
    progress_distribution: [],
    enrollments_by_course: [],
  });
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentActionError, setStudentActionError] = useState("");
  const [updatingStudentId, setUpdatingStudentId] = useState<number | null>(null);


  /* ---------------------------------------------------------
     FETCH STUDENTS
  --------------------------------------------------------- */

  
const fetchStudents = async () => {
  try {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Admin authentication is required.");

    const params = new URLSearchParams();
    if (activeSection === "pending") params.set("status", "pending");
    else if (activeSection === "students" && studentStatusFilter !== "all") {
      params.set("status", studentStatusFilter);
    }
    if (search.trim()) params.set("search", search.trim());

    const response = await fetch(
      `http://127.0.0.1:8000/api/students/${params.toString() ? `?${params}` : ""}`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch students: ${response.status}`);
    }

    const data = await response.json();
    setStudents(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Fetch students error:", error);

    setError(
      "Unable to load students. Please make sure the backend is running."
    );
  } finally {
    setLoading(false);
  }
};
const fetchAdminDashboard = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    navigate("/admin-login", { replace: true });
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/api/admin/dashboard/", {
      headers: { Authorization: `Token ${token}` },
    });
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("adminUser");
      localStorage.removeItem("authToken");
      navigate("/admin-login", { replace: true });
      return;
    }
    if (!response.ok) throw new Error(`Failed to load admin dashboard: ${response.status}`);
    const data = await response.json();
    setAdminStats(data.stats);
    setAnalytics({
      registrations_by_month: data.registrations_by_month || [],
      progress_distribution: data.progress_distribution || [],
      enrollments_by_course: data.enrollments_by_course || [],
    });
    setOverviewActivity({
      recent_registrations: data.recent_registrations || [],
      recent_enrollments: data.recent_enrollments || [],
      upcoming_classes: data.upcoming_classes || [],
    });
    if (data.admin?.username) {
      setAdminUser((current: any) => ({ ...current, ...data.admin, is_staff: true }));
    }
  } catch (dashboardError) {
    console.error("Admin dashboard data error:", dashboardError);
    setError("Unable to load current dashboard data. Please try again.");
  }
};
  /* ---------------------------------------------------------
     FETCH ON PAGE LOAD
  --------------------------------------------------------- */

  useEffect(() => {
    fetchAdminDashboard();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => fetchStudents(), 200);
    return () => window.clearTimeout(timer);
  }, [activeSection, search, studentStatusFilter]);


  /* ---------------------------------------------------------
     APPROVE / REJECT STUDENT
  --------------------------------------------------------- */

  const updateStudentStatus = async (
    studentId: number,
    action: "approve" | "reject"
  ) => {

    try {
      setStudentActionError("");
      setUpdatingStudentId(studentId);

      const response = await fetch(
        "http://127.0.0.1:8000/api/students/",
        {
          method: "POST",

          headers: {
  "Content-Type": "application/json",
  Authorization: `Token ${localStorage.getItem("authToken")}`,
},

          body: JSON.stringify({
            student_id: studentId,
            action: action,
          }),
        }
      );


      const data = await response.json();


      if (!response.ok) {

        setStudentActionError(data.error || "Unable to update student.");

        return;

      }


      /* Refresh student list */

      await fetchStudents();
      await fetchAdminDashboard();

    } catch (error) {

      console.error("Update student error:", error);

      setStudentActionError("Unable to connect to the server. Please try again.");

    } finally {
      setUpdatingStudentId(null);
    }

  };


  /* ---------------------------------------------------------
     LOGOUT
  --------------------------------------------------------- */

  const handleLogout = () => {

    localStorage.removeItem("adminUser");
    localStorage.removeItem("authToken");

    window.location.href = "/admin-login";

  };


  /* ---------------------------------------------------------
     COUNTS
  --------------------------------------------------------- */

  const totalStudents = adminStats.total_students;
  const pendingStudents = adminStats.pending_students;
  const approvedStudents = adminStats.approved_students;
  const rejectedStudents = adminStats.rejected_students;


  /* ---------------------------------------------------------
     SEARCH
  --------------------------------------------------------- */

  const filteredStudents = activeSection === "overview"
    ? students.slice(0, 8)
    : students;


  return (

    <div className="min-h-screen bg-[#f6f8fc] flex">


      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="hidden md:flex w-64 bg-[#111827] text-white flex-col fixed left-0 top-0 bottom-0">


        {/* Logo */}

        <div className="px-6 py-7 border-b border-white/10">

          <div className="flex items-center">
  <img
    src="/src/assets/logo.jpeg"
    alt="Careergize Logo"
    className="h-10 w-auto object-contain"
  />
</div>


          <p className="text-xs text-gray-400 mt-2">
            Learning Hub Admin
          </p>

        </div>


        {/* Navigation */}

        <nav className="flex-1 px-4 py-6 space-y-2">


          <button
            type="button"
            onClick={() => setActiveSection("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeSection === "overview" ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
          >

            <span className="material-symbols-outlined">
              dashboard
            </span>

            Dashboard

          </button>


          <button
            type="button"
            onClick={() => setActiveSection("students")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeSection === "students" ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
          >

            <span className="material-symbols-outlined">
              group
            </span>

            Students

          </button>


          <button
            type="button"
            onClick={() => setActiveSection("pending")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeSection === "pending" ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
          >

            <span className="material-symbols-outlined">
              pending_actions
            </span>

            Pending Requests

          </button>


          <button
            type="button"
            onClick={() => setActiveSection("courses")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeSection === "courses" ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
          >

            <span className="material-symbols-outlined">
              school
            </span>

            Courses

          </button>


          <button
            type="button"
            onClick={() => setActiveSection("analytics")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${activeSection === "analytics" ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
          >

            <span className="material-symbols-outlined">
              analytics
            </span>

            Analytics

          </button>

          <button type="button" onClick={() => setActiveSection("schedule")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeSection === "schedule" ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
            <span className="material-symbols-outlined">event</span> Class Schedule
          </button>
          <button type="button" onClick={() => setActiveSection("achievements")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeSection === "achievements" ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}>
            <span className="material-symbols-outlined">military_tech</span> Achievements
          </button>

        </nav>


        {/* Admin profile */}

        <div className="p-4 border-t border-white/10">

          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">

            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">

              {adminUser?.username
                ?.charAt(0)
                ?.toUpperCase() || "A"}

            </div>


            <div className="flex-1 min-w-0">

              <p className="text-sm font-semibold truncate">

                {adminUser?.username || "Admin"}

              </p>

              <p className="text-xs text-gray-400">
                Administrator
              </p>

            </div>

          </div>


          <button
            type="button"
            onClick={handleLogout}
            className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition text-sm font-medium"
          >

            <span className="material-symbols-outlined text-lg">
              logout
            </span>

            Logout

          </button>

        </div>

      </aside>



      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="flex-1 md:ml-64">

        <nav aria-label="Admin sections" className="md:hidden sticky top-0 z-20 bg-[#111827] text-white px-3 py-2 flex gap-2 overflow-x-auto">
          {([ ["overview", "Overview"], ["students", "Students"], ["pending", "Requests"], ["courses", "Courses"], ["schedule", "Schedule"], ["achievements", "Badges"], ["analytics", "Analytics"] ] as Array<[AdminSection, string]>).map(([section, label]) => <button key={section} onClick={() => setActiveSection(section)} className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold ${activeSection === section ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-white/10"}`}>{label}</button>)}
          <button onClick={handleLogout} className="shrink-0 rounded-lg border border-white/20 px-3 py-2 text-xs font-semibold text-red-200">Logout</button>
        </nav>


        {/* Header */}

        <header className="bg-white border-b border-gray-200 px-6 md:px-10 py-5">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div>

              <p className="text-sm text-gray-500">
                Admin Portal
              </p>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">

                Welcome back,{" "}
                {adminUser?.username || "Admin"} 👋

              </h1>

            </div>


            <div className="flex items-center gap-3">

              <button
                type="button"
                className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50"
              >

                <span className="material-symbols-outlined text-gray-600">
                  notifications
                </span>

              </button>


              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">

                {adminUser?.username
                  ?.charAt(0)
                  ?.toUpperCase() || "A"}

              </div>

            </div>

          </div>

        </header>



        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div className="p-6 md:p-10">


          {/* Welcome Banner */}

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-7 md:p-9 mb-8">

            <div className="relative z-10 max-w-2xl">

              <p className="text-blue-100 text-sm font-medium mb-2">
                LEARNING HUB OVERVIEW
              </p>

              <h2 className="text-2xl md:text-3xl font-bold">
                Manage your learning community
              </h2>

              <p className="text-blue-100 mt-3 text-sm md:text-base">

                Review student registrations, approve new learners,
                and manage your Learning Hub community.

              </p>

            </div>


            <div className="absolute -right-10 -top-16 w-56 h-56 rounded-full bg-white/10" />

            <div className="absolute right-20 -bottom-20 w-48 h-48 rounded-full bg-white/10" />


            <span className="material-symbols-outlined absolute right-8 bottom-6 text-7xl text-white/20">

              school

            </span>

          </div>



          {/* =====================================================
              STATISTICS
          ===================================================== */}


          {(["overview", "students", "pending"] as AdminSection[]).includes(activeSection) && (
          <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-7">


            {/* Total */}

            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition">

              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">

                <span className="material-symbols-outlined text-blue-600">
                  group
                </span>

              </div>


              <p className="text-gray-500 text-sm mt-4">
                Total Students
              </p>


              <p className="text-3xl font-bold text-gray-900 mt-1">
                {loading ? "—" : totalStudents}
              </p>

            </div>



            {/* Pending */}

            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition">

              <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">

                <span className="material-symbols-outlined text-yellow-600">
                  pending_actions
                </span>

              </div>


              <p className="text-gray-500 text-sm mt-4">
                Pending Requests
              </p>


              <p className="text-3xl font-bold text-gray-900 mt-1">
                {loading ? "—" : pendingStudents}
              </p>


              <p className="text-xs text-yellow-600 mt-2">
                Requires attention
              </p>

            </div>



            {/* Approved */}

            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition">

              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">

                <span className="material-symbols-outlined text-green-600">
                  verified
                </span>

              </div>


              <p className="text-gray-500 text-sm mt-4">
                Approved Students
              </p>


              <p className="text-3xl font-bold text-gray-900 mt-1">
                {loading ? "—" : approvedStudents}
              </p>


              <p className="text-xs text-green-600 mt-2">
                Successfully enrolled
              </p>

            </div>



            {/* Rejected */}

            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition">

              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">

                <span className="material-symbols-outlined text-red-600">
                  person_off
                </span>

              </div>


              <p className="text-gray-500 text-sm mt-4">
                Rejected
              </p>


              <p className="text-3xl font-bold text-gray-900 mt-1">
                {loading ? "—" : rejectedStudents}
              </p>


              <p className="text-xs text-red-500 mt-2">
                Registration requests
              </p>

            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-7">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Courses</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{loading ? "—" : adminStats.total_courses}</p>
                <p className="text-xs text-gray-500 mt-1">{adminStats.published_courses} published</p>
              </div>
              <span className="material-symbols-outlined text-blue-600 bg-blue-50 rounded-xl p-3">school</span>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Course Enrollments</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{loading ? "—" : adminStats.enrollments}</p>
                <p className="text-xs text-gray-500 mt-1">{adminStats.average_progress}% average learning progress</p>
              </div>
              <span className="material-symbols-outlined text-indigo-600 bg-indigo-50 rounded-xl p-3">query_stats</span>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Earned Badges</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{loading ? "—" : adminStats.unlocked_achievements}</p>
                <p className="text-xs text-gray-500 mt-1">of {adminStats.achievements} achievement records</p>
              </div>
              <span className="material-symbols-outlined text-amber-600 bg-amber-50 rounded-xl p-3">military_tech</span>
            </div>
          </div>

          {activeSection === "overview" && (
            <div className="grid xl:grid-cols-2 gap-5 mb-7">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4"><div><h2 className="font-bold text-gray-900">Upcoming classes</h2><p className="text-xs text-gray-500 mt-1">Scheduled sessions from your course calendar</p></div><button onClick={() => setActiveSection("schedule")} className="text-sm font-semibold text-blue-700 hover:text-blue-900">Manage</button></div>
                {overviewActivity.upcoming_classes.length ? <div className="divide-y divide-gray-100">{overviewActivity.upcoming_classes.map((item) => <div key={item.id} className="py-3 flex items-center justify-between gap-4"><div className="min-w-0"><p className="text-sm font-semibold text-gray-900 truncate">{item.topic}</p><p className="text-xs text-gray-500 mt-1">{item.course} · {item.instructor}</p></div><div className="shrink-0 text-right"><p className="text-sm font-medium text-gray-800">{new Date(`${item.date}T00:00:00`).toLocaleDateString()}</p><p className="text-xs text-gray-500">{item.start_time.slice(0, 5)}–{item.end_time.slice(0, 5)}</p></div></div>)}</div> : <p className="py-5 text-sm text-gray-500">No upcoming classes are scheduled.</p>}
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h2 className="font-bold text-gray-900">Recent learning activity</h2><p className="text-xs text-gray-500 mt-1 mb-3">Latest course enrollments recorded in the system</p>
                {overviewActivity.recent_enrollments.length ? <div className="divide-y divide-gray-100">{overviewActivity.recent_enrollments.map((item) => <div key={item.id} className="py-3 flex items-center justify-between gap-4"><div className="min-w-0"><p className="text-sm font-semibold text-gray-900 truncate">{item.student}</p><p className="text-xs text-gray-500 mt-1">Enrolled in {item.course}</p></div><span className="text-xs text-gray-500 capitalize shrink-0">{item.status.replace("_", " ")}</span></div>)}</div> : <p className="py-5 text-sm text-gray-500">No enrollments are recorded yet.</p>}
              </div>
            </div>
          )}



          {/* =====================================================
              STUDENT TABLE
          ===================================================== */}

          {(["overview", "students", "pending"] as AdminSection[]).includes(activeSection) && <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">


            {/* Table Header */}

            <div className="p-6 md:p-7 border-b border-gray-100">

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                <div>

                  <h2 className="text-xl font-bold text-gray-900">
                    {activeSection === "overview" ? "Recent Student Registrations" : activeSection === "pending" ? "Pending Requests" : "Students"}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    {activeSection === "pending" ? "Review and decide on new student applications" : activeSection === "overview" ? "Latest student accounts and their current learning status" : "Search, filter, and inspect registered student accounts"}
                  </p>

                </div>


                {/* Search */}

                <div className="flex flex-col sm:flex-row gap-2">
                {activeSection === "students" && (
                  <select
                    value={studentStatusFilter}
                    onChange={(event) => setStudentStatusFilter(event.target.value)}
                    aria-label="Filter students by approval status"
                    className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="all">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                )}
                <div className="relative">

                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    search
                  </span>


                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search students..."
                    className="pl-10 pr-4 py-2.5 w-full md:w-64 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />

                </div>
                </div>

              </div>

            </div>



            {/* Error */}

            {error && (

              <div className="m-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">

                {error}

              </div>

            )}

            {studentActionError && (
              <div className="mx-6 mt-5 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">
                {studentActionError}
              </div>
            )}



            {/* Loading */}

            {loading ? (

              <div className="p-12 text-center">

                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

                <p className="text-gray-500 text-sm mt-4">
                  Loading students...
                </p>

              </div>

            ) : filteredStudents.length === 0 ? (

              /* Empty */

              <div className="p-12 text-center">

                <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center">

                  <span className="material-symbols-outlined text-blue-600 text-3xl">
                    group
                  </span>

                </div>


                <h3 className="text-lg font-semibold text-gray-900 mt-5">

                  No students found

                </h3>


                <p className="text-sm text-gray-500 mt-2">

                  There are currently no student registrations
                  matching your search.

                </p>

              </div>

            ) : (

              /* Student Table */

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead>

                    <tr className="text-left text-xs text-gray-500 uppercase tracking-wider border-b border-gray-100">

                      <th className="px-6 py-4">
                        Student
                      </th>

                      <th className="px-6 py-4">
                        Email
                      </th>

                      <th className="px-6 py-4">
                        Status
                      </th>

                      <th className="px-6 py-4">
                        Learning
                      </th>

                      <th className="px-6 py-4 text-right">
                        Actions
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {filteredStudents.map((student) => (

                      <tr
                        key={student.id}
                        className="border-b border-gray-50 hover:bg-gray-50 transition"
                      >


                        {/* Student */}

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">

                              {student.name.charAt(0).toUpperCase()}

                            </div>


                            <div>

                              <p className="font-semibold text-gray-900">
                                {student.name}
                              </p>

                              <p className="text-xs text-gray-400">
                                Student ID: {student.id}
                              </p>

                            </div>

                          </div>

                        </td>


                        {/* Email */}

                        <td className="px-6 py-5">

                          <p className="text-sm text-gray-700">
                            {student.email}
                          </p>

                        </td>


                        {/* Status */}

                        <td className="px-6 py-5">

                          {student.status === "pending" && (

                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-50 text-yellow-700 text-xs font-semibold">

                              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />

                              Pending

                            </span>

                          )}


                          {student.status === "approved" && (

                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-semibold">

                              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />

                              Approved

                            </span>

                          )}


                          {student.status === "rejected" && (

                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 text-red-700 text-xs font-semibold">

                              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />

                              Rejected

                            </span>

                          )}

                        </td>


                        {/* Learning information */}

                        <td className="px-6 py-5">
                          <p className="text-sm font-medium text-gray-700">{student.enrollment_count} course{student.enrollment_count === 1 ? "" : "s"}</p>
                          <p className="text-xs text-gray-500 mt-1">{student.average_progress}% average progress</p>
                        </td>


                        {/* Actions */}

                        <td className="px-6 py-5">

                          <div className="flex items-center justify-end gap-2">

                            <button
                              type="button"
                              onClick={() => setSelectedStudent(student)}
                              className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition"
                            >
                              Details
                            </button>

                            {student.status !== "approved" && (

                              <button
                                type="button"
                                onClick={() =>
                                  updateStudentStatus(
                                    student.id,
                                    "approve"
                                  )
                                }
                                disabled={updatingStudentId === student.id}
                                className="px-3 py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 text-xs font-semibold transition"
                              >
                                Approve
                              </button>

                            )}


                            {student.status !== "rejected" && (

                              <button
                                type="button"
                                onClick={() =>
                                  updateStudentStatus(
                                    student.id,
                                    "reject"
                                  )
                                }
                                disabled={updatingStudentId === student.id}
                                className="px-3 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold transition"
                              >
                                Reject
                              </button>

                            )}

                          </div>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>}

          </>
          )}

          {activeSection === "courses" && (
            <AdminCoursesPanel
              token={localStorage.getItem("authToken") || ""}
              onCoursesChanged={fetchAdminDashboard}
            />
          )}

          {activeSection === "analytics" && (
            <AdminAnalyticsPanel stats={adminStats} analytics={analytics} />
          )}
          {activeSection === "schedule" && (
            <AdminSchedulePanel token={localStorage.getItem("authToken") || ""} onChanged={fetchAdminDashboard} />
          )}
          {activeSection === "achievements" && (
            <AdminAchievementsPanel token={localStorage.getItem("authToken") || ""} />
          )}

        </div>

        {selectedStudent && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setSelectedStudent(null)}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 md:p-8" onClick={(event) => event.stopPropagation()}>
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Student profile</p>
                  <h2 className="text-2xl font-bold text-gray-900 mt-1">{selectedStudent.name}</h2>
                  <p className="text-sm text-gray-600 mt-1">{selectedStudent.email}</p>
                </div>
                <button type="button" onClick={() => setSelectedStudent(null)} aria-label="Close student details" className="w-9 h-9 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50">×</button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="p-4 rounded-xl bg-gray-50"><p className="text-gray-500">Registration status</p><p className="font-semibold text-gray-900 mt-1 capitalize">{selectedStudent.status}</p></div>
                <div className="p-4 rounded-xl bg-gray-50"><p className="text-gray-500">Registered</p><p className="font-semibold text-gray-900 mt-1">{new Date(selectedStudent.created_at).toLocaleDateString()}</p></div>
                <div className="p-4 rounded-xl bg-gray-50"><p className="text-gray-500">Phone / age</p><p className="font-semibold text-gray-900 mt-1">{selectedStudent.phone || "Not provided"}{selectedStudent.age ? ` · ${selectedStudent.age}` : ""}</p></div>
                <div className="p-4 rounded-xl bg-gray-50"><p className="text-gray-500">Learning profile</p><p className="font-semibold text-gray-900 mt-1">{selectedStudent.course || "Course not specified"}</p><p className="text-gray-600 mt-1">{selectedStudent.career_goal || "No career goal provided"}{selectedStudent.experience_level ? ` · ${selectedStudent.experience_level}` : ""}</p></div>
              </div>
              <div className="mt-6">
                <h3 className="font-bold text-gray-900">Enrolled courses</h3>
                {selectedStudent.courses.length ? (
                  <div className="mt-3 space-y-2">
                    {selectedStudent.courses.map((course) => (
                      <div key={course.id} className="p-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div><p className="font-semibold text-gray-900">{course.title}</p><p className="text-xs text-gray-500 mt-1 capitalize">{course.status.replace("_", " ")} · {course.completed_lessons}/{course.total_lessons} lessons</p></div>
                        <span className="text-sm font-bold text-blue-700">{course.progress}%</span>
                      </div>
                    ))}
                  </div>
                ) : <p className="mt-3 text-sm text-gray-500">No course enrollments recorded.</p>}
              </div>
            </div>
          </div>
        )}

      </main>

    </div>

  );
}


interface ManagedCourse {
  id: number;
  title: string;
  slug: string;
  category: number;
  category_name: string;
  instructor: number;
  instructor_name: string;
  level: string;
  duration_weeks: number;
  short_description: string;
  description: string;
  is_published: boolean;
  enrollment_count: number;
  completed_enrollments: number;
  average_progress: number;
  lesson_count: number;
  enrolled_students: Array<{ id: number; name: string; email: string; status: string; enrollment_status: string; progress: number }>;
}

interface CourseOptions {
  categories: Array<{ id: number; name: string }>;
  instructors: Array<{ id: number; name: string }>;
  levels: string[];
}

interface CourseEditorData {
  title: string;
  category: string;
  instructor: string;
  level: string;
  duration_weeks: string;
  short_description: string;
  description: string;
  is_published: boolean;
}

const emptyCourseEditor: CourseEditorData = {
  title: "",
  category: "",
  instructor: "",
  level: "Beginner",
  duration_weeks: "1",
  short_description: "",
  description: "",
  is_published: true,
};

type AdminSchedule = {
  id: number; course: number; course_title: string; topic: string; date: string;
  start_time: string; end_time: string; instructor: number; instructor_name: string;
  platform: string; meet_url: string; enrolled_students: number;
};

function AdminSchedulePanel({ token, onChanged }: { token: string; onChanged: () => Promise<void> }) {
  const [sessions, setSessions] = useState<AdminSchedule[]>([]);
  const [courses, setCourses] = useState<Array<{ id: number; title: string }>>([]);
  const [instructors, setInstructors] = useState<Array<{ id: number; name: string }>>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const emptyForm = { course: "", topic: "", date: "", start_time: "", end_time: "", instructor: "", platform: "", meet_url: "" };
  const [form, setForm] = useState(emptyForm);
  const headers = { Authorization: `Token ${token}`, "Content-Type": "application/json" };
  const load = async () => {
    try {
      setError("");
      const [scheduleResponse, optionsResponse] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/admin/schedule/", { headers }),
        fetch("http://127.0.0.1:8000/api/admin/schedule/options/", { headers }),
      ]);
      if (!scheduleResponse.ok || !optionsResponse.ok) throw new Error("Unable to load schedule data. Check administrator access and backend availability.");
      const [scheduleData, options] = await Promise.all([scheduleResponse.json(), optionsResponse.json()]);
      setSessions(Array.isArray(scheduleData) ? scheduleData : scheduleData.results || []);
      setCourses(options.courses || []);
      setInstructors(options.instructors || []);
    } catch (loadError) { setError(loadError instanceof Error ? loadError.message : "Unable to load schedule data."); }
  };
  useEffect(() => { void load(); }, [token]);
  const edit = (session: AdminSchedule) => {
    setEditingId(session.id);
    setForm({ course: String(session.course), topic: session.topic, date: session.date, start_time: session.start_time.slice(0, 5), end_time: session.end_time.slice(0, 5), instructor: String(session.instructor), platform: session.platform, meet_url: session.meet_url });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const save = async (event: React.FormEvent) => {
    event.preventDefault(); setSaving(true); setError("");
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/admin/schedule/${editingId ? `${editingId}/` : ""}`, { method: editingId ? "PATCH" : "POST", headers, body: JSON.stringify({ ...form, course: Number(form.course), instructor: Number(form.instructor) }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(Object.values(payload).flat().join(" ") || "Unable to save this class.");
      setForm(emptyForm); setEditingId(null); await load(); await onChanged();
    } catch (saveError) { setError(saveError instanceof Error ? saveError.message : "Unable to save this class."); }
    finally { setSaving(false); }
  };
  const fieldClass = "w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-blue-500";
  return <div className="space-y-5">
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6"><div className="mb-5"><h2 className="text-xl font-bold text-gray-900">{editingId ? "Update class" : "Schedule a class"}</h2><p className="text-sm text-gray-500 mt-1">Create or edit course sessions using the existing course calendar.</p></div>
      {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <form onSubmit={save} className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3">
        <select required className={fieldClass} value={form.course} onChange={e => setForm({ ...form, course: e.target.value })}><option value="">Select course</option>{courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select>
        <input required className={fieldClass} placeholder="Class topic" value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} />
        <select required className={fieldClass} value={form.instructor} onChange={e => setForm({ ...form, instructor: e.target.value })}><option value="">Select instructor</option>{instructors.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}</select>
        <input required type="date" className={fieldClass} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
        <input required type="time" className={fieldClass} value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} />
        <input required type="time" className={fieldClass} value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })} />
        <input required className={fieldClass} placeholder="Platform (e.g. Zoom)" value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })} />
        <input type="url" className={fieldClass} placeholder="Meeting link (optional)" value={form.meet_url} onChange={e => setForm({ ...form, meet_url: e.target.value })} />
        <div className="sm:col-span-2 xl:col-span-4 flex gap-2 justify-end"><button disabled={saving} className="px-4 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold disabled:opacity-50">{saving ? "Saving…" : editingId ? "Save changes" : "Schedule class"}</button>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold">Cancel</button>}</div>
      </form>
    </div>
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"><div className="p-5 border-b border-gray-100"><h2 className="font-bold text-gray-900">Scheduled classes</h2><p className="text-sm text-gray-500 mt-1">{sessions.length} session{sessions.length === 1 ? "" : "s"} · enrolled student counts use live course enrollments</p></div>
      {sessions.length ? <div className="divide-y divide-gray-100">{sessions.map(s => <div key={s.id} className="p-5 flex flex-col lg:flex-row lg:items-center gap-4 justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-gray-900">{s.topic}</h3><span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">{s.course_title}</span></div><p className="text-sm text-gray-500 mt-2">{new Date(`${s.date}T00:00:00`).toLocaleDateString()} · {s.start_time.slice(0, 5)}–{s.end_time.slice(0, 5)} · {s.instructor_name} · {s.platform} · {s.enrolled_students} enrolled</p>{s.meet_url && <a href={s.meet_url} target="_blank" rel="noreferrer" className="text-xs text-blue-700 hover:underline mt-1 inline-block">Meeting link</a>}</div><button onClick={() => edit(s)} className="self-start lg:self-auto px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50">Edit class</button></div>)}</div> : <p className="p-8 text-center text-sm text-gray-500">No classes scheduled yet.</p>}
    </div>
  </div>;
}

function AdminAchievementsPanel({ token }: { token: string }) {
  const [records, setRecords] = useState<Array<{ id: number; student_id: number; student_name: string; student_email: string; title: string; description: string; category: string; tier: string; xp: number; unlocked: boolean; unlocked_date: string | null; progress: number; progress_label: string; requirement: string }>>([]);
  const [search, setSearch] = useState(""); const [filter, setFilter] = useState("all"); const [error, setError] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(); if (search.trim()) params.set("search", search.trim()); if (filter !== "all") params.set("unlocked", filter);
    fetch(`http://127.0.0.1:8000/api/admin/achievements/?${params}`, { headers: { Authorization: `Token ${token}` } })
      .then(async response => { if (!response.ok) throw new Error("Unable to load achievement records. Check administrator access and backend availability."); return response.json(); })
      .then(data => { setRecords(Array.isArray(data) ? data : []); setError(""); })
      .catch(loadError => setError(loadError instanceof Error ? loadError.message : "Unable to load achievements."));
  }, [token, search, filter]);
  return <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"><div className="p-5 md:p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3"><div><h2 className="text-xl font-bold text-gray-900">Achievements &amp; badges</h2><p className="text-sm text-gray-500 mt-1">Existing student achievement records, tied to their actual account.</p></div><div className="flex gap-2"><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search student or badge" className="rounded-xl border border-gray-200 px-3 py-2 text-sm"/><select value={filter} onChange={e => setFilter(e.target.value)} className="rounded-xl border border-gray-200 px-3 py-2 text-sm"><option value="all">All records</option><option value="true">Earned</option><option value="false">In progress</option></select></div></div>
    {error ? <p role="alert" className="m-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p> : records.length ? <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-5 py-3">Achievement</th><th className="px-5 py-3">Student</th><th className="px-5 py-3">Category</th><th className="px-5 py-3">Progress</th><th className="px-5 py-3">Status</th></tr></thead><tbody className="divide-y divide-gray-100">{records.map(item => <tr key={item.id}><td className="px-5 py-4"><p className="font-semibold text-gray-900">{item.title}</p><p className="text-xs text-gray-500 mt-1">{item.description || item.requirement || `${item.xp} XP`}</p></td><td className="px-5 py-4"><p className="font-medium text-gray-800">{item.student_name}</p><p className="text-xs text-gray-500">{item.student_email}</p></td><td className="px-5 py-4 text-gray-600">{item.category || item.tier || "—"}</td><td className="px-5 py-4 text-gray-600">{item.unlocked ? item.unlocked_date || "Complete" : `${item.progress}% ${item.progress_label}`}</td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.unlocked ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>{item.unlocked ? "Earned" : "In progress"}</span></td></tr>)}</tbody></table></div> : <p className="p-10 text-center text-sm text-gray-500">No achievement records match this filter.</p>}
  </div>;
}

function AdminCoursesPanel({ token, onCoursesChanged }: { token: string; onCoursesChanged: () => Promise<void> }) {
  const [courses, setCourses] = useState<ManagedCourse[]>([]);
  const [options, setOptions] = useState<CourseOptions>({ categories: [], instructors: [], levels: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [editingCourse, setEditingCourse] = useState<number | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editor, setEditor] = useState<CourseEditorData>(emptyCourseEditor);
  const [expandedCourseId, setExpandedCourseId] = useState<number | null>(null);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const headers = { Authorization: `Token ${token}` };
      const [courseResponse, optionsResponse] = await Promise.all([
        fetch("http://127.0.0.1:8000/api/admin/courses/", { headers }),
        fetch("http://127.0.0.1:8000/api/admin/courses/options/", { headers }),
      ]);
      if (!courseResponse.ok || !optionsResponse.ok) {
        throw new Error(`Unable to load admin course data (${courseResponse.status}/${optionsResponse.status}).`);
      }
      const [courseData, optionData] = await Promise.all([courseResponse.json(), optionsResponse.json()]);
      setCourses(courseData.results || courseData);
      setOptions(optionData);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCourses(); }, [token]);

  const startEdit = (course?: ManagedCourse) => {
    setIsEditorOpen(true);
    if (course) {
      setEditingCourse(course.id);
      setEditor({
        title: course.title,
        category: String(course.category),
        instructor: String(course.instructor),
        level: course.level,
        duration_weeks: String(course.duration_weeks),
        short_description: course.short_description || "",
        description: course.description || "",
        is_published: course.is_published,
      });
    } else {
      setEditingCourse(null);
      setEditor({
        ...emptyCourseEditor,
        category: options.categories[0] ? String(options.categories[0].id) : "",
        instructor: options.instructors[0] ? String(options.instructors[0].id) : "",
        level: options.levels[0] || "Beginner",
      });
    }
    setError("");
    setNotice("");
  };

  const saveCourse = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const payload = {
        ...editor,
        title: editor.title.trim(),
        category: Number(editor.category),
        instructor: Number(editor.instructor),
        duration_weeks: Number(editor.duration_weeks),
      };
      const url = editingCourse
        ? `http://127.0.0.1:8000/api/admin/courses/${editingCourse}/`
        : "http://127.0.0.1:8000/api/admin/courses/";
      const response = await fetch(url, {
        method: editingCourse ? "PATCH" : "POST",
        headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        const message = Object.values(data).flat().join(" ");
        throw new Error(message || "Unable to save the course.");
      }
      setNotice(editingCourse ? "Course updated." : "Course created.");
      setEditingCourse(null);
      setIsEditorOpen(false);
      await loadCourses();
      await onCoursesChanged();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save the course.");
    } finally {
      setSaving(false);
    }
  };

  const filteredCourses = courses.filter((course) =>
    `${course.title} ${course.category_name} ${course.instructor_name}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="space-y-5">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div><h2 className="text-xl font-bold text-gray-900">Courses</h2><p className="text-sm text-gray-500 mt-1">Manage the existing catalog and inspect real enrollment progress.</p></div>
          <button type="button" onClick={() => startEdit()} className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700">Add course</button>
        </div>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search courses..." className="mt-5 px-4 py-2.5 w-full sm:max-w-sm border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      {(isEditorOpen || notice) && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-7">
          {notice && <p className="mb-4 text-sm text-green-700">{notice}</p>}
          {isEditorOpen ? (
            <form onSubmit={saveCourse} className="space-y-4">
              <h3 className="font-bold text-gray-900">{editingCourse ? "Edit course" : "Create course"}</h3>
              {error && <p role="alert" className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</p>}
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="text-sm text-gray-700">Title<input required value={editor.title} onChange={(event) => setEditor({ ...editor, title: event.target.value })} className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-lg" /></label>
                <label className="text-sm text-gray-700">Category<select required value={editor.category} onChange={(event) => setEditor({ ...editor, category: event.target.value })} className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white"><option value="">Select category</option>{options.categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
                <label className="text-sm text-gray-700">Instructor<select required value={editor.instructor} onChange={(event) => setEditor({ ...editor, instructor: event.target.value })} className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white"><option value="">Select instructor</option>{options.instructors.map((instructor) => <option key={instructor.id} value={instructor.id}>{instructor.name}</option>)}</select></label>
                <label className="text-sm text-gray-700">Level<select value={editor.level} onChange={(event) => setEditor({ ...editor, level: event.target.value })} className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-white">{options.levels.map((level) => <option key={level}>{level}</option>)}</select></label>
                <label className="text-sm text-gray-700">Duration (weeks)<input type="number" min="1" required value={editor.duration_weeks} onChange={(event) => setEditor({ ...editor, duration_weeks: event.target.value })} className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-lg" /></label>
                <label className="text-sm text-gray-700">Short description<input maxLength={300} value={editor.short_description} onChange={(event) => setEditor({ ...editor, short_description: event.target.value })} className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-lg" /></label>
              </div>
              <label className="block text-sm text-gray-700">Description<textarea rows={3} value={editor.description} onChange={(event) => setEditor({ ...editor, description: event.target.value })} className="mt-1 w-full px-3 py-2.5 border border-gray-200 rounded-lg" /></label>
              <label className="inline-flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={editor.is_published} onChange={(event) => setEditor({ ...editor, is_published: event.target.checked })} /> Published in the student catalog</label>
              {!options.categories.length || !options.instructors.length ? <p className="text-sm text-amber-700">A category and instructor are required before saving a course.</p> : null}
              <div className="flex gap-2"><button type="submit" disabled={saving || !options.categories.length || !options.instructors.length} className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold disabled:opacity-50">{saving ? "Saving..." : "Save course"}</button><button type="button" onClick={() => { setEditingCourse(null); setIsEditorOpen(false); setNotice(""); setError(""); }} className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold">Cancel</button></div>
            </form>
          ) : null}
        </div>
      )}

      {error && !editingCourse && <p role="alert" className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</p>}
      {loading ? <div className="bg-white rounded-2xl p-10 text-center text-gray-500">Loading courses…</div> : filteredCourses.length === 0 ? <div className="bg-white rounded-2xl p-10 text-center text-gray-500">No courses match this search.</div> : (
        <div className="space-y-4">
          {filteredCourses.map((course) => (
            <article key={course.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-6">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2"><h3 className="text-lg font-bold text-gray-900">{course.title}</h3><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${course.is_published ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-600"}`}>{course.is_published ? "Published" : "Draft"}</span></div>
                  <p className="text-sm text-gray-500 mt-1">{course.category_name} · {course.level} · {course.instructor_name}</p>
                  <p className="text-sm text-gray-600 mt-3">{course.short_description || course.description || "No course description provided."}</p>
                </div>
                <div className="flex gap-2 shrink-0"><button type="button" onClick={() => startEdit(course)} className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-sm font-semibold">Edit</button><button type="button" onClick={() => setExpandedCourseId(expandedCourseId === course.id ? null : course.id)} className="px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-semibold">{expandedCourseId === course.id ? "Hide learners" : `View learners (${course.enrollment_count})`}</button></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
                <div className="p-3 rounded-xl bg-gray-50"><p className="text-xs text-gray-500">Enrolled</p><p className="text-lg font-bold text-gray-900 mt-1">{course.enrollment_count}</p></div>
                <div className="p-3 rounded-xl bg-gray-50"><p className="text-xs text-gray-500">Completed</p><p className="text-lg font-bold text-gray-900 mt-1">{course.completed_enrollments}</p></div>
                <div className="p-3 rounded-xl bg-gray-50"><p className="text-xs text-gray-500">Average progress</p><p className="text-lg font-bold text-gray-900 mt-1">{course.average_progress}%</p></div>
                <div className="p-3 rounded-xl bg-gray-50"><p className="text-xs text-gray-500">Lessons / duration</p><p className="text-lg font-bold text-gray-900 mt-1">{course.lesson_count} / {course.duration_weeks}w</p></div>
              </div>
              {expandedCourseId === course.id && <div className="mt-5 border-t border-gray-100 pt-4"><h4 className="font-semibold text-gray-900">Enrolled students</h4>{course.enrolled_students.length ? <div className="mt-3 divide-y divide-gray-100">{course.enrolled_students.map((student) => <div key={student.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm"><div><p className="font-semibold text-gray-800">{student.name}</p><p className="text-xs text-gray-500">{student.email} · {student.status}</p></div><span className="text-gray-600">{student.enrollment_status.replace("_", " ")} · {student.progress}%</span></div>)}</div> : <p className="text-sm text-gray-500 mt-2">No enrolled students yet.</p>}</div>}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function AdminAnalyticsPanel({ stats, analytics }: { stats: AdminStats; analytics: AdminAnalytics }) {
  const maxRegistrations = Math.max(1, ...analytics.registrations_by_month.map((month) => month.count));
  const maxProgressCount = Math.max(1, ...analytics.progress_distribution.map((bucket) => bucket.count));
  const maxCourseEnrollments = Math.max(1, ...analytics.enrollments_by_course.map((course) => course.enrollment_count));
  return (
    <section className="space-y-5">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-7"><h2 className="text-xl font-bold text-gray-900">Learning Hub Analytics</h2><p className="text-sm text-gray-500 mt-1">Registration, enrollment, and lesson progress totals from the database.</p></div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[["All enrollments", stats.enrollments], ["In progress", stats.in_progress_enrollments], ["Completed", stats.completed_enrollments], ["Average progress", `${stats.average_progress}%`]].map(([label, value]) => <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"><p className="text-sm text-gray-500">{label}</p><p className="text-2xl font-bold text-gray-900 mt-2">{value}</p></div>)}
      </div>
      <div className="grid xl:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"><h3 className="font-bold text-gray-900">Registrations by month</h3><p className="text-xs text-gray-500 mt-1">Last six calendar months</p><div className="h-48 mt-5 flex items-end justify-around gap-3 border-b border-gray-100">{analytics.registrations_by_month.map((month) => <div key={`${month.year}-${month.month}`} className="flex-1 h-full flex flex-col items-center justify-end gap-2"><span className="text-xs text-gray-600">{month.count}</span><div className="w-full max-w-10 rounded-t-lg bg-blue-600" style={{ height: `${Math.max(3, month.count / maxRegistrations * 70)}%` }} /><span className="text-[11px] text-gray-500 pb-2">{month.month}</span></div>)}</div></div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"><h3 className="font-bold text-gray-900">Enrollment progress distribution</h3><p className="text-xs text-gray-500 mt-1">Learners grouped by completed lesson percentage</p><div className="mt-6 space-y-4">{analytics.progress_distribution.map((bucket) => <div key={bucket.label}><div className="flex justify-between text-sm mb-1"><span className="text-gray-600">{bucket.label}</span><span className="font-semibold text-gray-900">{bucket.count}</span></div><div className="h-2.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-indigo-600 rounded-full" style={{ width: `${bucket.count / maxProgressCount * 100}%` }} /></div></div>)}</div></div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"><h3 className="font-bold text-gray-900">Enrollments by course</h3><p className="text-xs text-gray-500 mt-1">Top courses by current student enrollments</p>{analytics.enrollments_by_course.length ? <div className="mt-5 space-y-4">{analytics.enrollments_by_course.map((course) => <div key={course.title}><div className="flex justify-between gap-3 text-sm mb-1"><span className="text-gray-700 truncate">{course.title}</span><span className="font-semibold text-gray-900">{course.enrollment_count}</span></div><div className="h-2.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-blue-600 rounded-full" style={{ width: `${course.enrollment_count / maxCourseEnrollments * 100}%` }} /></div></div>)}</div> : <p className="mt-5 text-sm text-gray-500">No course enrollments recorded yet.</p>}</div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"><h3 className="font-bold text-gray-900">Student account totals</h3><div className="grid sm:grid-cols-3 gap-4 mt-4">{[["Total", stats.total_students], ["Approved", stats.approved_students], ["Pending", stats.pending_students], ["Rejected", stats.rejected_students], ["Courses", stats.total_courses], ["Published courses", stats.published_courses]].map(([label, value]) => <div key={label} className="p-4 rounded-xl bg-gray-50"><p className="text-xs text-gray-500">{label}</p><p className="text-xl font-bold text-gray-900 mt-1">{value}</p></div>)}</div></div>
    </section>
  );
}


/* =========================================================
   APP
========================================================= */

export default function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/profile"
          element={<AuthenticatedProfile />}
        />

        {/* My Learning */}

        <Route
          path="/my-learning"
          element={<MyLearning />}
        />

        {/* Schedule */}

        <Route
          path="/schedule"
          element={<Schedule />}
        />

        {/* Achievements */}

        <Route
          path="/achievements"
          element={<Achievements />}
        />

        {/* AI Mentor */}

        <Route
          path="/ai-mentor"
          element={<AiMentor />}
        />

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />
        

      </Routes>

    </BrowserRouter>

  );
}


