
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Briefcase,
  Award,
} from "lucide-react";

interface StudentData {
  id: number;
  name: string;
  email: string;
  phone: string;
  age: number | null;
  course: string;
  status: string;
  created_at: string;
}

export default function StudentProfile() {
  const navigate = useNavigate();

  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const userId = localStorage.getItem("loggedInStudentId");

        if (!userId) {
          console.error("Student ID not found.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `http://127.0.0.1:8000/api/profile/${userId}/`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch student profile.");
        }

        const data = await response.json();
        setStudent(data);

      } catch (error) {
        console.error("Profile fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f6f8fc] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

          <p className="text-gray-500 text-sm mt-4">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fc]">

      {/* Header */}
      <header className="bg-white border-b border-gray-200">

        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              My Profile
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Manage your student information
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition text-sm font-medium"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>

        </div>

      </header>


      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">

        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">

          <div className="h-32 bg-white" />

          <div className="px-7 pb-7">

            <div className="flex flex-col sm:flex-row sm:items-end gap-5 -mt-12">

              {/* Profile Avatar */}
              <div className="w-24 h-24 rounded-2xl bg-white p-1.5 shadow-md">

                <div className="w-full h-full rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-3xl font-bold">
                  {student?.name?.charAt(0)?.toUpperCase() || "A"}
                </div>

              </div>


              {/* Name */}
              <div className="flex-1 pt-2">

                <div className="flex flex-wrap items-center gap-3">

                  <h2 className="text-2xl font-bold text-gray-900">
                    {student?.name || "Student"}
                  </h2>

                  <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
                    {student?.status === "approved"
                      ? "Active Learner"
                      : student?.status || "Student"}
                  </span>

                </div>

                <p className="text-gray-500 mt-1">
                  Student · Full Stack Developer
                </p>

              </div>

            </div>

          </div>

        </div>


        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">


          {/* Personal Information */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 shadow-sm p-7">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <User size={20} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Personal Information
                </h3>

                <p className="text-sm text-gray-500">
                  Your basic student details
                </p>
              </div>

            </div>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {/* Name */}
              <div className="flex items-start gap-3">

                <User size={18} className="text-gray-400 mt-1" />

                <div>
                  <p className="text-xs text-gray-400">
                    Full Name
                  </p>

                  <p className="text-sm font-semibold text-gray-800 mt-1">
                    {student?.name || "Not available"}
                  </p>
                </div>

              </div>


              {/* Email */}
              <div className="flex items-start gap-3">

                <Mail size={18} className="text-gray-400 mt-1" />

                <div>
                  <p className="text-xs text-gray-400">
                    Email Address
                  </p>

                  <p className="text-sm font-semibold text-gray-800 mt-1">
                    {student?.email || "Not available"}
                  </p>
                </div>

              </div>


              {/* Phone */}
              <div className="flex items-start gap-3">

                <Phone size={18} className="text-gray-400 mt-1" />

                <div>
                  <p className="text-xs text-gray-400">
                    Phone
                  </p>

                  <p className="text-sm font-semibold text-gray-800 mt-1">
                    {student?.phone || "Not available"}
                  </p>
                </div>

              </div>


              {/* Age */}
              <div className="flex items-start gap-3">

                <Calendar size={18} className="text-gray-400 mt-1" />

                <div>
                  <p className="text-xs text-gray-400">
                    Age
                  </p>

                  <p className="text-sm font-semibold text-gray-800 mt-1">
                    {student?.age ?? "Not available"}
                  </p>
                </div>

              </div>


              {/* Learning Status */}
              <div className="flex items-start gap-3">

                <Calendar size={18} className="text-gray-400 mt-1" />

                <div>
                  <p className="text-xs text-gray-400">
                    Learning Status
                  </p>

                  <p className="text-sm font-semibold text-gray-800 mt-1">
                    {student?.status === "approved"
                      ? "Currently Learning"
                      : student?.status || "Not available"}
                  </p>
                </div>

              </div>

            </div>

          </div>


          {/* Learning Overview */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-7">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <BookOpen size={20} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Learning
                </h3>

                <p className="text-sm text-gray-500">
                  Your current journey
                </p>
              </div>

            </div>


            {/* Course */}
            <div className="p-4 rounded-2xl bg-gray-50 mb-4">

              <p className="text-xs text-gray-400">
                Current Course
              </p>

              <p className="text-sm font-semibold text-gray-800 mt-1">
                {student?.course || "Not available"}
              </p>

            </div>


            {/* Progress */}
            <div className="p-4 rounded-2xl bg-gray-50">

              <div className="flex items-center justify-between">

                <p className="text-xs text-gray-400">
                  Learning Progress
                </p>

                <p className="text-xs font-semibold text-blue-600">
                  0%
                </p>

              </div>

              <div className="w-full h-2 bg-gray-200 rounded-full mt-3 overflow-hidden">

                <div className="h-full w-0 bg-blue-600 rounded-full" />

              </div>

            </div>

          </div>


          {/* Skills */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 shadow-sm p-7">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Briefcase size={20} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Skills
                </h3>

                <p className="text-sm text-gray-500">
                  Technologies you are learning
                </p>
              </div>

            </div>


            <div className="flex flex-wrap gap-3">

              {[
                "Python",
                "Django",
                "React",
                "JavaScript",
                "TypeScript",
                "MySQL",
                "REST API",
                "Git & GitHub",
              ].map((skill) => (

                <span
                  key={skill}
                  className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm font-medium text-gray-700"
                >
                  {skill}
                </span>

              ))}

            </div>

          </div>


          {/* Achievements */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-7">

            <div className="flex items-center gap-3 mb-5">

              <div className="w-10 h-10 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
                <Award size={20} />
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Achievements
                </h3>

                <p className="text-sm text-gray-500">
                  Your learning milestones
                </p>
              </div>

            </div>


            <div className="text-center py-5">

              <div className="w-14 h-14 mx-auto rounded-2xl bg-gray-50 flex items-center justify-center">

                <Award
                  size={25}
                  className="text-gray-400"
                />

              </div>

              <p className="text-sm font-semibold text-gray-700 mt-4">
                No achievements yet
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Complete courses to earn badges
              </p>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}


