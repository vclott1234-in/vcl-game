import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";

const API_BASE = "http://127.0.0.1:8080"; // 🔁 change if needed

export default function AdminUsers() {
  // ================= FORM STATE =================
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    password: "",
    town: "",
    address: "",
  });

  const [editingUser, setEditingUser] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // ================= USERS STATE =================
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // ================= FETCH USERS =================
  async function fetchUsers() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/user/get-users`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch users");
      }

      setUsers(data?.users);
      console.log(data);
    } catch (err) {
      console.error(err);
      alert("Error fetching users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= FILTER =================
  const filtered = users.filter((u) =>
    `${u.name} ${u.mobile} ${u.address} ${u.town}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  // ================= EDIT =================
  const handleEditClick = (u) => {
    setForm({
      name: u.name || "",
      mobile: u.mobile || "",
      password: "",
      town: u.town || "",
      address: u.address || "",
    });
    setEditingUser(u);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setForm({ name: "", mobile: "", password: "", town: "", address: "" });
  };

  // ================= UPDATE USER =================
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const payload = {
        userId: editingUser._id || editingUser.id,
        name: form.name,
        mobile: form.mobile,
        town: form.town,
        address: form.address,
      };

      const res = await fetch(`${API_BASE}/api/user/update-profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update failed");
      }

      alert("User updated successfully");
      setEditingUser(null);
      fetchUsers(); // 🔁 refresh list
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  // ================= UI =================
  return (
    <Navbar>
      {!editingUser ? (
        <section className="bg-[#f6dedb] rounded-lg p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">All Users</h2>
              <p className="text-sm text-gray-600 mt-1">
                A list of all users including their details.
              </p>
            </div>

            <input
              type="text"
              placeholder="Search by name, mobile, town..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300"
            />
          </div>

          <div className="mt-6 overflow-x-auto">
            {loading ? (
              <p className="text-center py-6">Loading users...</p>
            ) : (
              <table className="min-w-full bg-white rounded">
                <thead>
                  <tr className="text-sm text-gray-600">
                    <th className="p-3">#</th>
                    <th className="p-3">Token</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Mobile</th>
                    <th className="p-3">Town</th>
                    <th className="p-3">Address</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u, i) => (
                    <tr
                      key={u._id || u.id}
                      className="odd:bg-white even:bg-gray-50"
                    >
                      <td className="p-3">{i + 1}</td>
                      <td className="p-3">{u._id.substring(10)}</td>
                      <td className="p-3">{u.name}</td>
                      <td className="p-3">{u.mobile}</td>
                      <td className="p-3">{u.town}</td>
                      <td className="p-3">{u.address}</td>
                      <td className="p-3">{u.role}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleEditClick(u)}
                          className="text-teal-600 hover:underline"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      ) : (
        <section className="bg-white rounded-lg p-6 shadow max-w-2xl">
          <h3 className="text-xl font-semibold mb-4">Edit User</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {["name", "mobile", "town", "address"].map((field) => (
              <input
                key={field}
                name={field}
                value={form[field]}
                onChange={handleChange}
                placeholder={field}
                className="w-full px-4 py-3 border rounded"
              />
            ))}

            <div className="flex gap-2">
              <button className="bg-teal-500 text-white px-5 py-2 rounded">
                Update
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="border px-5 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}
    </Navbar>
  );
}
