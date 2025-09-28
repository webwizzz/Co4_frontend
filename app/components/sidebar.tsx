import React from "react";

const Sidebar = ({ onNavigate }: { onNavigate: (section: string) => void }) => (
  <aside className="w-64 bg-white border-r border-blue-200 flex flex-col justify-between py-8 px-4 min-h-screen">
    <div>
      <h2 className="text-2xl font-bold text-blue-800 mb-8 text-center">Admin</h2>
      <nav className="flex flex-col gap-4">
        <button onClick={() => onNavigate("mentors")} className="text-blue-700 hover:bg-blue-50 rounded px-3 py-2 font-medium text-left">Mentors</button>
        <button onClick={() => onNavigate("students")} className="text-blue-700 hover:bg-blue-50 rounded px-3 py-2 font-medium text-left">Students</button>
        <button onClick={() => onNavigate("assigned-mentors")} className="text-blue-700 hover:bg-blue-50 rounded px-3 py-2 font-medium text-left">Assigned Mentors</button>
        <button onClick={() => onNavigate("student-reports")} className="text-blue-700 hover:bg-blue-50 rounded px-3 py-2 font-medium text-left">Potential Ideas</button>
      </nav>
    </div>
    <button className="text-red-600 hover:bg-red-50 rounded px-3 py-2 font-medium w-full text-left mt-8">Logout</button>
  </aside>
);

export default Sidebar;
