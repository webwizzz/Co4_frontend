import React, { useState } from "react";
import CompleteProjectIdeas from "./CompleteProjectIdeas";

type Idea = {
  id: number;
  title: string;
  description: string;
  status: string;
};

type Reports = Record<string, { name: string; ideas: Idea[] }[]>;

type CompleteIdea = Idea & {
  student: string;
  mentor: string;
  raw: string;
  refined: string;
  comments: { mentor: string; text: string }[];
};

// Dummy mapping for demo (in real app, fetch from backend or Data.ts)
const ideaDetails: Record<number, Omit<CompleteIdea, 'id' | 'title' | 'description' | 'status' | 'student'> & { id: number }> = {
  1: {
    id: 1,
    mentor: "Priya Sharma",
    raw: "Initial idea: Use face recognition for attendance.",
    refined: "Refined: Integrate with college ERP and add mobile notifications.",
    comments: [
      { mentor: "Priya Sharma", text: "Great start! Add more security checks." },
      { mentor: "Amit Patel", text: "Consider privacy issues." },
    ],
  },
  2: {
    id: 2,
    mentor: "Priya Sharma",
    raw: "Initial idea: Online courses for students.",
    refined: "Refined: Add quizzes and progress tracking.",
    comments: [
      { mentor: "Priya Sharma", text: "Needs more unique features." },
    ],
  },
  3: {
    id: 3,
    mentor: "Priya Sharma",
    raw: "Initial idea: Track health stats.",
    refined: "Refined: Add reminders and connect with wearables.",
    comments: [
      { mentor: "Neha Gupta", text: "Try to focus on a specific user group." },
    ],
  },
};

const PotentialIdeas = ({ reports }: { reports: Reports }) => {
  const [selectedIdea, setSelectedIdea] = useState<CompleteIdea | null>(null);

  if (selectedIdea) {
    return (
      <CompleteProjectIdeas
        idea={selectedIdea}
        onBack={() => setSelectedIdea(null)}
      />
    );
  }

  return (
    <section id="potential-ideas" className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Potential IDEAS</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(reports).map(([category, students]) => (
          <div key={category} className="rounded-2xl shadow bg-white border border-blue-200 p-6 flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4">{category}</h3>
            {students.length === 0 ? (
              <div className="text-gray-400">No students</div>
            ) : (
              <div className="flex flex-col gap-4 w-full">
                {students.flatMap(student =>
                  student.ideas.length === 0
                    ? [
                        <div key={student.name} className="text-gray-400 text-sm mb-2">{student.name}: No ideas</div>
                      ]
                    : student.ideas.map(idea => (
                        <div
                          key={student.name + idea.id}
                          className="rounded-xl border border-blue-100 bg-blue-50 p-4 shadow-sm flex flex-col cursor-pointer hover:bg-blue-100 transition"
                          onClick={() => setSelectedIdea({
                            ...idea,
                            student: student.name,
                            mentor: ideaDetails[idea.id]?.mentor || "",
                            raw: ideaDetails[idea.id]?.raw || "",
                            refined: ideaDetails[idea.id]?.refined || "",
                            comments: ideaDetails[idea.id]?.comments || [],
                          })}
                        >
                          <div className="font-semibold text-blue-800 text-base mb-1">{idea.title}</div>
                          <div className="text-sm text-gray-700 mb-1">{idea.description}</div>
                          <div className="text-xs text-gray-500 mb-1">Student: {student.name}</div>
                          <span className={`self-start px-3 py-1 rounded-full text-xs font-semibold ${idea.status === 'Approved' ? 'bg-blue-100 text-blue-700' : idea.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{idea.status}</span>
                        </div>
                      ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default PotentialIdeas;
