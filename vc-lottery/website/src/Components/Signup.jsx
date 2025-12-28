import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import sign_up from "../assets/signup_img.jpg";

export default function Signup() {
  const navigate = useNavigate();

  const [user, setUser] = useState("");
  const [mob, setMob] = useState("");
  const [pass, setPass] = useState("");
  const [cpass, setCpass] = useState("");
  const [add, setAdd] = useState("");
  const [town, setTown] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (pass !== cpass) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("https://vcl-game.vercel.app/api/auth/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user,
          mobile: mob,
          password: pass,
          address: add,
          town: town,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      // ✅ Signup successful → redirect to login
      navigate("/login");
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen relative">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${sign_up})` }}
      />
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />

      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-lg bg-white rounded-md shadow-lg p-10">
          <h1 className="text-3xl font-extrabold text-center text-gray-900">
            Start Your VC Today
          </h1>

          <p className="text-center text-sm text-gray-600 mt-2">
            Already joined?{" "}
            <Link to="/login" className="text-indigo-600 font-medium">
              Sign in now
            </Link>
          </p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <p className="text-red-600 text-sm font-medium text-center">
                {error}
              </p>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                value={user}
                onChange={(e) => setUser(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-200"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile number
              </label>
              <input
                value={mob}
                onChange={(e) => setMob(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-200"
                placeholder="Enter mobile number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-200"
                placeholder="Enter password"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={cpass}
                onChange={(e) => setCpass(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-200"
                placeholder="Confirm password"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                value={add}
                onChange={(e) => setAdd(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-200"
                placeholder="Your address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Town
              </label>
              <input
                value={town}
                onChange={(e) => setTown(e.target.value)}
                className="w-full px-4 py-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-200"
                placeholder="Town / City"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-md bg-teal-400 text-white font-semibold"
            >
              Signup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

