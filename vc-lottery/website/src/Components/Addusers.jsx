import React, { useState } from "react";
import Navbar from "./Navbar";

const API_URL = "https://vcl-game.vercel.app/api/auth/add-user";

export default function AddUsers() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    password: "",
    town: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add user");
      }

      alert("User added successfully");

      // reset form
      setFormData({
        name: "",
        mobile: "",
        password: "",
        town: "",
        address: "",
      });
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Navbar>
      <div className="bg-[#fdece6] p-6 rounded-lg">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-800">Add User</h1>
          <p className="text-gray-600 mt-1">
            Add a new User to your account by filling in the information below.
          </p>

          <form
            onSubmit={handleSubmit}
            className="bg-white mt-6 rounded-lg shadow-md p-8"
          >
            {["name", "mobile", "password", "town", "address"].map((field) => (
              <div key={field} className="mb-5">
                <label className="block font-medium mb-2 capitalize">
                  {field}
                </label>
                <input
                  type={field === "password" ? "password" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full border rounded-md px-4 py-2"
                  required
                />
              </div>
            ))}

            {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-teal-500 hover:bg-teal-600"
              }`}
            >
              {loading ? "Adding..." : "Add User"}
            </button>
          </form>
        </div>
      </div>
    </Navbar>
  );
}

