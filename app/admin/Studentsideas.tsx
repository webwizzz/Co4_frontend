import React from "react";

type Idea = {
  id: number;
  title: string;
  description: string;
  status: string;
};

const dummyIdeas: Idea[] = [
  { id: 1, title: "Smart Attendance System", description: "A system to automate attendance using face recognition.", status: "Approved" },
  { id: 2, title: "E-Learning Platform", description: "A platform for online courses and quizzes.", status: "Pending" },
  { id: 3, title: "Health Tracker App", description: "An app to track daily health and fitness activities.", status: "Rejected" },
];

const StudentsIdeas = ({ studentName, onBack }: { studentName: string; onBack: () => void }) => (
  <section className="mb-8">
    <button onClick={onBack} className="mb-4 text-blue-700 hover:underline">&larr; Back to Students</button>
    <h2 className="text-xl font-semibold mb-4">{studentName}'s Ideas</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {dummyIdeas.map(idea => (
        <div key={idea.id} className="rounded-2xl shadow bg-white border border-blue-200 p-6 flex flex-col gap-2">
          <span className="text-lg font-bold text-blue-800">{idea.title}</span>
          <span className="text-sm text-gray-700 mb-1">{idea.description}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold w-fit ${idea.status === 'Approved' ? 'bg-blue-100 text-blue-700' : idea.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{idea.status}</span>
        </div>
      ))}
    </div>
  </section>
);

export default StudentsIdeas;
