"use client"

import React from "react"
import AdminDashboard from "./AdminDashboard"

export default function Page() {
  // AdminDashboard contains the students view; reuse it to avoid prop mismatches.
  return <AdminDashboard />
}