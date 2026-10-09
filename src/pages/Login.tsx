import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import careergizeLogo from "../assets/careergize-logo.png";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid email or password.");
        setLoading(false);
        return;
      }

      const studentId = Number(data.user?.id);

      if (!Number.isInteger(studentId) || studentId <= 0) {
        setError("Login response is missing a valid student ID.");
        return;
      }

      // Store the real user ID returned by Django
      localStorage.setItem(
        "loggedInStudentId",
        studentId.toString()
      );
      // Store the authentication token
      localStorage.setItem("authToken", data.token);

      // Store the user's information
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify(data.user)
      );

      navigate(data.user.is_staff ? "/admin-dashboard" : "/dashboard");
    } catch (error) {
      console.error("Login error:", error);

      setError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-dark-theme min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-sky-500/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10 relative z-10 border border-slate-200">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full logo-circle-white flex items-center justify-center mx-auto mb-4 p-2 shadow-lg overflow-hidden shrink-0">
            <img
              src={careergizeLogo}
              alt="Careergize Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Careergize Learning Hub
          </h1>

          <p className="text-slate-400 mt-2 text-sm">
            Sign in to continue your learning journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-slate-300 mb-2"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-3 border border-slate-700/60 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary/50 transition"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-slate-300 mb-2"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-3 border border-slate-700/60 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary/50 transition"
            />
          </div>

          {error && (
            <div className="text-rose-300 text-sm bg-rose-950/40 border border-rose-500/30 rounded-xl p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-primary hover:bg-brand-primary-light text-white py-3.5 rounded-xl font-bold shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="text-brand-primary-light hover:text-sky-300 font-bold hover:underline transition cursor-pointer"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
