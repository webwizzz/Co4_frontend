import React from "react";
import CompleteProjectIdea from "./completeprojectidea";

import { useRouter, useSearchParams } from "next/navigation";

// Dummy data for demonstration (should be replaced with real data source)
const dummyIdeas = [
  {
    id: 1,
    title: "Smart Attendance System",
    student: "Ravi Kumar",
    mentor: "Priya Sharma",
    raw: "Initial idea: Use face recognition for attendance.",
    refined: "Refined: Integrate with college ERP and add mobile notifications.",
    comments: [
      { mentor: "Priya Sharma", text: "Great start! Add more security checks." },
      { mentor: "Amit Patel", text: "Consider privacy issues." },
    ],
  },
  {
    id: 2,
    title: "E-Learning Platform",
    student: "Asha Singh",
    mentor: "Priya Sharma",
    raw: "Initial idea: Online courses for students.",
    refined: "Refined: Add quizzes and progress tracking.",
    comments: [
      { mentor: "Priya Sharma", text: "Needs more unique features." },
    ],
  },
  {
    id: 3,
    title: "Health Tracker App",
    student: "Rahul Verma",
    mentor: "Priya Sharma",
    raw: "Initial idea: Track health stats.",
    refined: "Refined: Add reminders and connect with wearables.",
    comments: [
      { mentor: "Neha Gupta", text: "Try to focus on a specific user group." },
    ],
  },
];

const IdeaDetailsPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ideaId = Number(searchParams.get("id"));
  const idea = dummyIdeas.find((i) => i.id === ideaId);

  if (!idea) {
    return <div className="p-8 text-center text-red-600">Idea not found.</div>;
  }

  return (
    <CompleteProjectIdea idea={idea} onBack={() => router.back()} />
  );
};

export default IdeaDetailsPage;
