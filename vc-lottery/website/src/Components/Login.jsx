import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../public/vite.svg";
import loginImg from "../assets/login-img.png";

export default function Login() {
  const navigate = useNavigate();

  const [mob, setmob] = useState("");
  const [pass, setpass] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mobile: mob,
          password: pass,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // ✅ Login success
      localStorage.setItem("isAuth", "true");
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/"); // go to AdminUsers
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl bg-transparent rounded-lg shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="bg-white p-12 md:px-16 md:py-20">
          <img src={logo} alt="logo" className="w-10 mb-8" />

          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Sign In to your account
          </h1>

          <form className="space-y-6 max-w-md" onSubmit={handleSubmit}>
            {error && (
              <p className="text-red-600 text-sm font-medium">{error}</p>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile number
              </label>
              <input
                type="tel"
                placeholder="Enter mobile number"
                value={mob}
                onChange={(e) => setmob(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-black-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={pass}
                onChange={(e) => setpass(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-black-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 rounded-lg bg-teal-400 text-white font-semibold shadow hover:opacity-95"
            >
              Sign in
            </button>

            <p className="text-center text-sm text-gray-600">
              Not a member?{" "}
              <Link to="/signup" className="text-indigo-600 font-medium">
                Create an Account
              </Link>
            </p>
          </form>
        </div>

        <div className="hidden md:flex items-center justify-center bg-[#fde6e2]">
          <img
            src={loginImg}
            alt="login illustration"
            className="max-w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
}
