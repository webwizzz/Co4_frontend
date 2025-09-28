import React, { useState } from "react";
import CompleteProjectIdeas from "./CompleteProjectIdeas";
import { Idea } from "./Data";

const TABS = ["Best", "Mediocre", "Low"];

// Dummy ratings for demonstration
const ratings: Record<number, { llm: number; mentor: number }> = {
  1: { llm: 9, mentor: 8 },
  2: { llm: 7, mentor: 6 },
  3: { llm: 5, mentor: 7 },
};

// Dummy data for demonstration (replace with real data from Data.ts)
const reports: Record<string, { name: string; ideas: Idea[] }[]> = {
  Best: [
    {
      name: "Ravi Kumar",
      ideas: [
        {
          id: 1,
          title: "Smart Attendance System",
          description: "A system to automate attendance using face recognition.",
          status: "Approved",
        },
      ],
    },
  ],
  Mediocre: [
    {
      name: "Asha Singh",
      ideas: [
        {
          id: 2,
          title: "E-Learning Platform",
          description: "A platform for online courses and quizzes.",
          status: "Pending",
        },
      ],
    },
  ],
  Low: [
    {
      name: "Rahul Verma",
      ideas: [
        {
          id: 3,
          title: "Health Tracker App",
          description: "An app to track daily health and fitness activities.",
          status: "Rejected",
        },
      ],
    },
  ],
};

const PotentialIdeas = () => {
  const [selectedIdea, setSelectedIdea] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>(TABS[0]);

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
      <div className="flex gap-4 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-full font-semibold border transition-all ${
              activeTab === tab
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-blue-700 border-blue-300 hover:bg-blue-50"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(() => {
          const students = reports[activeTab] || [];
          return (
            <div className="rounded-2xl shadow bg-white border border-blue-200 p-6 flex flex-col items-center w-full col-span-3">
              <h3 className="text-lg font-semibold mb-4">{activeTab}</h3>
              {students.length === 0 ? (
                <div className="text-gray-400">No students</div>
              ) : (
                <div className="flex flex-col gap-4 w-full">
                  {students.flatMap((student) =>
                    student.ideas.length === 0
                      ? [
                          <div
                            key={student.name}
                            className="text-gray-400 text-sm mb-2"
                          >
                            {student.name}: No ideas
                          </div>,
                        ]
                      : student.ideas.map((idea) => (
                          <div
                            key={student.name + idea.id}
                            className="rounded-xl border border-blue-100 bg-blue-50 p-4 shadow-sm flex flex-col cursor-pointer hover:bg-blue-100 transition"
                            onClick={() =>
                              setSelectedIdea({
                                ...idea,
                                category: activeTab,
                                student: student.name,
                                mentor: "Priya Sharma",
                                raw: idea.description,
                                refined: idea.description + " (refined)",
                                comments: [
                                  { mentor: "Priya Sharma", text: "Great start!" },
                                  {
                                    mentor: "Amit Patel",
                                    text: "Consider privacy issues.",
                                  },
                                ],
                                tags: ["Demo"],
                                rawFiles: [],
                                formattedFile: null,
                                feedback: "Well structured proposal.",
                                transcribe: "This is a transcribed summary.",
                                mentorRemarks: {
                                  Score: ratings[idea.id]?.mentor ?? 0,
                                  potentialCategory:
                                    activeTab === "Best"
                                      ? "High"
                                      : activeTab === "Mediocre"
                                      ? "Medium"
                                      : "Low",
                                },
                              })
                            }
                          >
                            <div className="font-semibold text-blue-800 text-base mb-1">
                              {idea.title}
                            </div>
                            <div className="text-sm text-gray-700 mb-1">
                              {idea.description}
                            </div>
                            <div className="text-xs text-gray-500 mb-1">
                              Student: {student.name}
                            </div>
                            <span
                              className={`self-start px-3 py-1 rounded-full text-xs font-semibold ${
                                idea.status === "Approved"
                                  ? "bg-blue-100 text-blue-700"
                                  : idea.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {idea.status}
                            </span>
                            <div className="flex gap-4 mt-2 text-xs">
                              <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                                LLM Rating: {" "}
                                <span className="font-bold">
                                  {ratings[idea.id]?.llm ?? "-"} / 10
                                </span>
                              </span>
                              <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                                Mentor Rating: {" "}
                                <span className="font-bold">
                                  {ratings[idea.id]?.mentor ?? "-"} / 10
                                </span>
                              </span>
                            </div>
                          </div>
                        ))
                  )}
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </section>
  );
};

export default PotentialIdeas;
