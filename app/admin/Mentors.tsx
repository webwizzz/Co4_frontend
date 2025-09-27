import React from "react";

type Mentor = {
  id: number;
  name: string;
  status: string;
  expertise?: string;
  email?: string;
  studentsCount?: number;
};

const Mentors = ({ mentors }: { mentors: Mentor[] }) => (
  <section id="mentors" className="mb-8">
    <h2 className="text-xl font-semibold mb-4">Mentors</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {mentors.map(mentor => (
        <div key={mentor.id} className="rounded-2xl shadow bg-white border border-blue-200 p-6 flex flex-col gap-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-bold text-blue-800">{mentor.name}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${mentor.status === 'Active' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{mentor.status}</span>
          </div>
          <div className="text-sm text-gray-700 mb-1">Expertise: {mentor.expertise || "Web Development"}</div>
          <div className="text-sm text-gray-700 mb-1">Email: {mentor.email || `mentor${mentor.id}@example.com`}</div>
          <div className="text-sm text-gray-700">Students Assigned: {mentor.studentsCount ?? Math.floor(Math.random()*5+1)}</div>
        </div>
      ))}
    </div>
  </section>
);

export default Mentors;
