import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";

const API_BASE = "https://vcl-game.vercel.app";

export default function Winners() {
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/schedule/result`);
        if (!res.ok) throw new Error("Failed to fetch winners");
        const data = await res.json();

        if (data.winner) {
          setWinners([
            {
              id: 1,
              token: data.winner.token || "-",
              name: data.winner.name || "Unknown",
              role: "user",
              phone: data.winner.mobile || "-",
              datetime: new Date(data.scheduleDate).toLocaleString(),
            },
          ]);
        } else {
          setWinners([]);
        }
      } catch (err) {
        console.error(err);
        setWinners([]);
      }
    };

    fetchWinners();
  }, []);

  return (
    <Navbar>
      <div className="bg-[#fdece6] p-6 rounded-lg">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-black">Winning Users</h2>
          <p className="text-gray-700 mt-1">
            A list of all the users who have won the lottery.
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white border-2 border-teal-400 rounded-md">
          <table className="min-w-full text-left">
            <thead className="border-b">
              <tr className="text-gray-600 text-sm">
                <th className="px-6 py-4">Sr.No</th>
                <th className="px-6 py-4">Token</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Date & Time</th>
              </tr>
            </thead>

            <tbody>
              {winners.length > 0 ? (
                winners.map((user, index) => (
                  <tr key={user.id} className="border-t text-black">
                    <td className="px-6 py-4 font-semibold">{index + 1}</td>
                    <td className="px-6 py-4">{user.token}</td>
                    <td className="px-6 py-4">{user.name}</td>
                    <td className="px-6 py-4">{user.role}</td>
                    <td className="px-6 py-4">{user.phone}</td>
                    <td className="px-6 py-4">{user.datetime}</td>
                  </tr>
                ))
              ) : (
                <tr className="border-t text-black">
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No winner declared yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Navbar>
  );
}

