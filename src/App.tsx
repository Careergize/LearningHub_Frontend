
import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

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


/* =========================================================
   TYPES
========================================================= */

interface Student {
  id: number;
  name: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}


/* =========================================================
   LANDING PAGE
========================================================= */

function LandingPage() {
  return (
    <div className="font-sans antialiased bg-[#f7f9ff] text-[#171c21] min-h-screen">

      <NavBar />

      <main className="space-y-12">

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

  const adminUser = JSON.parse(
    localStorage.getItem("adminUser") || "null"
  );


  /* ---------------------------------------------------------
     STATES
  --------------------------------------------------------- */

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");


  /* ---------------------------------------------------------
     FETCH STUDENTS
  --------------------------------------------------------- */

  const fetchStudents = async () => {

    try {

      setLoading(true);
      setError("");

      const response = await fetch(
        "http://127.0.0.1:8000/api/students/"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch students.");
      }

      const data = await response.json();

      setStudents(data);

    } catch (error) {

      console.error("Fetch students error:", error);

      setError(
        "Unable to load students. Please make sure the backend is running."
      );

    } finally {

      setLoading(false);

    }
  };


  /* ---------------------------------------------------------
     FETCH ON PAGE LOAD
  --------------------------------------------------------- */

  useEffect(() => {

    fetchStudents();

  }, []);


  /* ---------------------------------------------------------
     APPROVE / REJECT STUDENT
  --------------------------------------------------------- */

  const updateStudentStatus = async (
    studentId: number,
    action: "approve" | "reject"
  ) => {

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/api/students/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            student_id: studentId,
            action: action,
          }),
        }
      );


      const data = await response.json();


      if (!response.ok) {

        alert(data.error || "Unable to update student.");

        return;

      }


      /* Refresh student list */

      fetchStudents();

    } catch (error) {

      console.error("Update student error:", error);

      alert(
        "Unable to connect to the server. Please try again."
      );

    }

  };


  /* ---------------------------------------------------------
     LOGOUT
  --------------------------------------------------------- */

  const handleLogout = () => {

    localStorage.removeItem("adminUser");

    window.location.href = "/admin-login";

  };


  /* ---------------------------------------------------------
     COUNTS
  --------------------------------------------------------- */

  const totalStudents = students.length;

  const pendingStudents = students.filter(
    (student) => student.status === "pending"
  ).length;

  const approvedStudents = students.filter(
    (student) => student.status === "approved"
  ).length;

  const rejectedStudents = students.filter(
    (student) => student.status === "rejected"
  ).length;


  /* ---------------------------------------------------------
     SEARCH
  --------------------------------------------------------- */

  const filteredStudents = students.filter((student) => {

    const searchText = search.toLowerCase();

    return (
      student.name.toLowerCase().includes(searchText) ||
      student.email.toLowerCase().includes(searchText)
    );

  });


  return (

    <div className="min-h-screen bg-[#f6f8fc] flex">


      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="hidden md:flex w-64 bg-[#111827] text-white flex-col fixed left-0 top-0 bottom-0">


        {/* Logo */}

        <div className="px-6 py-7 border-b border-white/10">

          <div className="flex items-center gap-2">

            <span className="material-symbols-outlined text-blue-400 text-3xl">
              rocket_launch
            </span>

            <span className="text-xl font-extrabold tracking-tight">

              Careergize
              <span className="text-blue-400">.</span>

            </span>

          </div>


          <p className="text-xs text-gray-400 mt-2">
            Learning Hub Admin
          </p>

        </div>


        {/* Navigation */}

        <nav className="flex-1 px-4 py-6 space-y-2">


          <button
            type="button"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white text-sm font-medium"
          >

            <span className="material-symbols-outlined">
              dashboard
            </span>

            Dashboard

          </button>


          <button
            type="button"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition"
          >

            <span className="material-symbols-outlined">
              group
            </span>

            Students

          </button>


          <button
            type="button"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition"
          >

            <span className="material-symbols-outlined">
              pending_actions
            </span>

            Pending Requests

          </button>


          <button
            type="button"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition"
          >

            <span className="material-symbols-outlined">
              school
            </span>

            Courses

          </button>


          <button
            type="button"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition"
          >

            <span className="material-symbols-outlined">
              analytics
            </span>

            Analytics

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


          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">


            {/* Total */}

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">

              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">

                <span className="material-symbols-outlined text-blue-600">
                  group
                </span>

              </div>


              <p className="text-gray-500 text-sm mt-5">
                Total Students
              </p>


              <p className="text-3xl font-bold text-gray-900 mt-1">
                {totalStudents}
              </p>

            </div>



            {/* Pending */}

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">

              <div className="w-12 h-12 rounded-xl bg-yellow-50 flex items-center justify-center">

                <span className="material-symbols-outlined text-yellow-600">
                  pending_actions
                </span>

              </div>


              <p className="text-gray-500 text-sm mt-5">
                Pending Requests
              </p>


              <p className="text-3xl font-bold text-gray-900 mt-1">
                {pendingStudents}
              </p>


              <p className="text-xs text-yellow-600 mt-2">
                Requires attention
              </p>

            </div>



            {/* Approved */}

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">

              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">

                <span className="material-symbols-outlined text-green-600">
                  verified
                </span>

              </div>


              <p className="text-gray-500 text-sm mt-5">
                Approved Students
              </p>


              <p className="text-3xl font-bold text-gray-900 mt-1">
                {approvedStudents}
              </p>


              <p className="text-xs text-green-600 mt-2">
                Successfully enrolled
              </p>

            </div>



            {/* Rejected */}

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition">

              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">

                <span className="material-symbols-outlined text-red-600">
                  person_off
                </span>

              </div>


              <p className="text-gray-500 text-sm mt-5">
                Rejected
              </p>


              <p className="text-3xl font-bold text-gray-900 mt-1">
                {rejectedStudents}
              </p>


              <p className="text-xs text-red-500 mt-2">
                Registration requests
              </p>

            </div>

          </div>



          {/* =====================================================
              STUDENT TABLE
          ===================================================== */}

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">


            {/* Table Header */}

            <div className="p-6 md:p-7 border-b border-gray-100">

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                <div>

                  <h2 className="text-xl font-bold text-gray-900">
                    Student Registrations
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Review and manage student applications
                  </p>

                </div>


                {/* Search */}

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



            {/* Error */}

            {error && (

              <div className="m-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm">

                {error}

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
                        Registered
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


                        {/* Registered */}

                        <td className="px-6 py-5">

                          <p className="text-sm text-gray-600">

                            {new Date(
                              student.created_at
                            ).toLocaleDateString()}

                          </p>

                        </td>


                        {/* Actions */}

                        <td className="px-6 py-5">

                          <div className="flex items-center justify-end gap-2">

                            {student.status !== "approved" && (

                              <button
                                type="button"
                                onClick={() =>
                                  updateStudentStatus(
                                    student.id,
                                    "approve"
                                  )
                                }
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

          </div>

        </div>

      </main>

    </div>

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


