import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  // Store the real user ID returned by Django
  localStorage.setItem(
    "loggedInStudentId",
    data.user.id.toString()
  );

  // Store the user's information
  localStorage.setItem(
    "loggedInUser",
    JSON.stringify(data.user)
  );

  navigate("/dashboard");
} catch (error) {
  console.error("Login error:", error);
  setError(
    "Unable to connect to the server. Please try again."
  );
} finally {
  setLoading(false);
}


};

return ( <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4"> <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8"> <div className="text-center mb-8"> <h1 className="text-3xl font-bold text-gray-900">
Careergize Learning Hub </h1>


      <p className="text-gray-500 mt-2">
        Sign in to continue learning
      </p>
    </div>

    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-2"
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>

    <p className="text-center text-sm text-gray-500 mt-6">
      Don't have an account?{" "}
      <button
        type="button"
        onClick={() => navigate("/signup")}
        className="text-blue-600 font-semibold hover:underline"
      >
        Sign Up
      </button>
    </p>
  </div>
</div>


);
};

export default Login;
