import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";

const API_BASE = "https://vcl-game.vercel.app";

export default function Schedule() {
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

  /* ================= FETCH USERS & LOTTERIES ================= */
  useEffect(() => {
    const init = async () => {
      try {
        const [userRes, lotteryRes] = await Promise.all([
          fetch(`${API_BASE}/api/user/get-users`),
          fetch(`${API_BASE}/api/schedule/get-lottery`),
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

  /* ================= PREFILL DATA ON LOTTERY SELECT ================= */
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

  /* ================= HANDLERS ================= */
  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminInfo((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= UPDATE LOTTERY DETAILS ================= */
  const handleScheduleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedScheduleId) {
      alert("Please select a lottery first");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("scheduleId", selectedScheduleId);
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
    } catch (err) {
      alert(err.message);
    }
  };

  /* ================= DECLARE / CHANGE WINNER ================= */
  const handleSelectWinner = async () => {
    if (!selectedScheduleId || !selectedWinner) {
      alert("Select lottery and user first");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/schedule/select-winner`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduleId: selectedScheduleId,
          winnerId: selectedWinner,
        }),
      });

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
          <h2 className="text-xl font-semibold mb-6">👤 Update Admin Info</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Mobile Number
              </label>
              <input
                type="text"
                name="mobile"
                value={adminInfo.mobile}
                onChange={handleAdminChange}
                className="w-full border rounded-md px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">UPI ID</label>
              <input
                type="text"
                name="upi"
                value={adminInfo.upi}
                onChange={handleAdminChange}
                className="w-full border rounded-md px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                QR Code Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setQrFile(e.target.files[0])}
                className="w-full"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium mb-1">
              Lottery Name
            </label>
            <input
              type="text"
              name="lotteryName"
              value={adminInfo.lotteryName}
              onChange={handleAdminChange}
              className="w-full border rounded-md px-4 py-2"
            />
          </div>
        </div>

        {/* SCHEDULE LOTTERY */}
        <div className="bg-white rounded-xl shadow-md p-8 border-l-4 border-teal-400">
          <h2 className="text-xl font-semibold mb-6">⏰ Schedule Lottery</h2>

          <form
            onSubmit={handleScheduleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div>
              <label className="block text-sm font-medium mb-1">
                Select Lottery
              </label>
              <select
                value={selectedScheduleId}
                onChange={(e) => setSelectedScheduleId(e.target.value)}
                className="w-full border rounded-md px-4 py-2 mb-4"
              >
                <option value="">Select lottery</option>
                {lotteries.map((l) => (
                  <option key={l._id} value={l._id}>
                    {l.lotteryName}
                  </option>
                ))}
              </select>

              <label className="block text-sm font-medium mb-1">
                Select Date & Time
              </label>
              <input
                type="datetime-local"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="w-full border rounded-md px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Message (optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border rounded-md px-4 py-2 h-32 resize-none"
              />

              <button
                type="submit"
                className="mt-6 bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-md"
              >
                Update Lottery
              </button>
            </div>
          </form>
        </div>

        {/* SELECT WINNER */}
        <div className="bg-white rounded-xl shadow-md p-8 border-l-4 border-orange-400">
          <h2 className="text-xl font-semibold mb-6">🏆 Select Winner</h2>

          <select
            disabled={!selectedScheduleId}
            value={selectedWinner}
            onChange={(e) => setSelectedWinner(e.target.value)}
            className="w-full border rounded-md px-4 py-2"
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

