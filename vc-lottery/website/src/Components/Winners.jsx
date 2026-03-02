import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";

const API_BASE = "https://vcl-game.vercel.app";

export default function Winners() {
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("users"));

        if (!storedUser?._id) {
          console.log("Admin not found");
          return;
        }

        const adminId = storedUser._id;

        // 1️⃣ Get all lotteries for this admin
        const lotteryRes = await fetch(
          `${API_BASE}/api/schedule/get-lottery?adminId=${adminId}`
        );

        const lotteryData = await lotteryRes.json();
        const lotteries = lotteryData.lottery || [];

        if (!lotteries.length) {
          setWinners([]);
          return;
        }

        // 2️⃣ Find latest declared winner
        const declaredLottery = lotteries.find(
          (l) => l.isDeclared === true
        );

        if (!declaredLottery) {
          setWinners([]);
          return;
        }

        // 3️⃣ Fetch result using adminId + scheduleId
        const resultRes = await fetch(
          `${API_BASE}/api/schedule/result/${declaredLottery._id}?adminId=${adminId}`
        );

        if (!resultRes.ok) throw new Error("Failed to fetch result");

        const data = await resultRes.json();

        if (data.winner) {
          setWinners([
            {
              id: 1,
              token: data.winner.token || "-",
              name: data.winner.name || "Unknown",
              role: "User",
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
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-black">Winning Users</h2>
          <p className="text-gray-700 mt-1">
            A list of all the users who have won the lottery.
          </p>
        </div>

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