import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Components/Login";
import Signup from "./Components/Signup";
import AdminUsers from "./Components/AdminUsers";
import AddUsers from "./Components/Addusers";
import Winners from "./Components/Winners";
import Schedule from "./Components/Schedule";
import ProtectedRoute from "./Components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Pages */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-user"
          element={
            <ProtectedRoute>
              <AddUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/winners"
          element={
            <ProtectedRoute>
              <Winners />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <Schedule />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
