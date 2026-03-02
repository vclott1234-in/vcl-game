import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";

const API_BASE = "https://vcl-game.vercel.app";

export default function Schedule() {
  const [adminId, setAdminId] = useState("");

  const [adminInfo, setAdminInfo] = useState({
    mobile: "",
    upi: "",
    lotteryName: "",
  });

  const [scheduleDate, setScheduleDate] = useState("");
  const [message, setMessage] = useState("");

  const [lotteries, setLotteries] = useState([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState("");

  const [users, setUsers] = useState([]);
  const [selectedWinner, setSelectedWinner] = useState("");

  const [qrFile, setQrFile] = useState(null);

  /* ================= INITIAL FETCH ================= */
  useEffect(() => {
    const init = async () => {
      const storedUser = JSON.parse(localStorage.getItem("users"));

      if (!storedUser || !storedUser._id) {
        alert("Admin not found. Please login again.");
        return;
      }

      setAdminId(storedUser._id);

      try {
        const [userRes, lotteryRes] = await Promise.all([
          fetch(
            `${API_BASE}/api/user/get-users?createdBy=${storedUser._id}`
          ),
          fetch(
            `${API_BASE}/api/schedule/get-lottery?adminId=${storedUser._id}`
          ),
        ]);

        const userData = await userRes.json();
        const lotteryData = await lotteryRes.json();

        setUsers(userData.users || []);
        setLotteries(lotteryData.lottery || []);
      } catch (err) {
        console.error(err);
      }
    };

    init();
  }, []);

  /* ================= PREFILL LOTTERY DATA ================= */
  useEffect(() => {
    if (!selectedScheduleId) return;

    const selected = lotteries.find((l) => l._id === selectedScheduleId);
    if (!selected) return;

    setAdminInfo({
      mobile: selected.adminMobile || "",
      upi: selected.upiId || "",
      lotteryName: selected.lotteryName || "",
    });

    if (selected.scheduleDate) {
      setScheduleDate(
        new Date(selected.scheduleDate).toISOString().slice(0, 16)
      );
    }

    if (selected.winnerId) {
      setSelectedWinner(selected.winnerId);
    }
  }, [selectedScheduleId, lotteries]);

  /* ================= HANDLE INPUT CHANGE ================= */
  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminInfo((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= UPDATE LOTTERY ================= */
  const handleScheduleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedScheduleId) {
      alert("Please select a lottery first");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("scheduleId", selectedScheduleId);
      formData.append("adminId", adminId); // ✅ REQUIRED
      formData.append("lotteryName", adminInfo.lotteryName);
      formData.append("upiId", adminInfo.upi);
      formData.append("adminMobile", adminInfo.mobile);
      formData.append("scheduleDate", scheduleDate);

      if (qrFile) {
        formData.append("qrCode", qrFile);
      }

      const res = await fetch(`${API_BASE}/api/schedule/update`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("Lottery updated successfully");

      // Refresh lotteries
      const refresh = await fetch(
        `${API_BASE}/api/schedule/get-lottery?adminId=${adminId}`
      );
      const refreshedData = await refresh.json();
      setLotteries(refreshedData.lottery || []);

    } catch (err) {
      alert(err.message);
    }
  };

  /* ================= DECLARE WINNER ================= */
  const handleSelectWinner = async () => {
    if (!selectedScheduleId || !selectedWinner) {
      alert("Select lottery and user first");
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/api/schedule/select-winner`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            scheduleId: selectedScheduleId,
            adminId: adminId, // ✅ REQUIRED
            winnerId: selectedWinner,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("Winner updated successfully");

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Navbar>
      <div className="bg-[#fdece6] p-6 rounded-lg space-y-8">
        <h1 className="text-3xl font-bold text-center text-orange-600">
          Admin Control Panel
        </h1>

        {/* UPDATE ADMIN INFO */}
        <div className="bg-white rounded-xl shadow-md p-8 border-l-4 border-teal-400">
          <h2 className="text-xl font-semibold mb-6">Update Lottery Info</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input
              type="text"
              name="mobile"
              placeholder="Mobile"
              value={adminInfo.mobile}
              onChange={handleAdminChange}
              className="border rounded-md px-4 py-2"
            />

            <input
              type="text"
              name="upi"
              placeholder="UPI ID"
              value={adminInfo.upi}
              onChange={handleAdminChange}
              className="border rounded-md px-4 py-2"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setQrFile(e.target.files[0])}
            />
          </div>

          <input
            type="text"
            name="lotteryName"
            placeholder="Lottery Name"
            value={adminInfo.lotteryName}
            onChange={handleAdminChange}
            className="border rounded-md px-4 py-2 mt-4 w-full"
          />
        </div>

        {/* SCHEDULE */}
        <div className="bg-white rounded-xl shadow-md p-8 border-l-4 border-teal-400">
          <h2 className="text-xl font-semibold mb-6">Schedule Lottery</h2>

          <form onSubmit={handleScheduleSubmit}>
            <select
              value={selectedScheduleId}
              onChange={(e) => setSelectedScheduleId(e.target.value)}
              className="border rounded-md px-4 py-2 w-full mb-4"
            >
              <option value="">Select lottery</option>
              {lotteries.map((l) => (
                <option key={l._id} value={l._id}>
                  {l.lotteryName}
                </option>
              ))}
            </select>

            <input
              type="datetime-local"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="border rounded-md px-4 py-2 w-full mb-4"
            />

            <button
              type="submit"
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-md"
            >
              Update Lottery
            </button>
          </form>
        </div>

        {/* SELECT WINNER */}
        <div className="bg-white rounded-xl shadow-md p-8 border-l-4 border-orange-400">
          <h2 className="text-xl font-semibold mb-6">Select Winner</h2>

          <select
            disabled={!selectedScheduleId}
            value={selectedWinner}
            onChange={(e) => setSelectedWinner(e.target.value)}
            className="border rounded-md px-4 py-2 w-full"
          >
            <option value="">Select a user</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name} — {u.mobile}
              </option>
            ))}
          </select>

          <button
            onClick={handleSelectWinner}
            disabled={!selectedScheduleId}
            className="mt-6 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-md"
          >
            Declare / Update Winner
          </button>
        </div>
      </div>
    </Navbar>
  );
}