import React from "react";
import { ideas } from "./Data";

interface FileSchema {
  name: string;
  url: string;
}

interface MentorRemarks {
  Score: number;
  potentialCategory: "High" | "Medium" | "Low";
}

interface Comment {
  mentor: string;
  text: string;
}

interface Idea {
  id: number;
  title: string;
  category: string;
  student: string;
  mentor: string;
  raw: string;
  refined: string;
  comments: Comment[];
  tags: string[];
  rawFiles: FileSchema[];
  formattedFile: FileSchema | null;
  feedback: string;
  transcribe: string;
  mentorRemarks: MentorRemarks;
}

interface CompleteProjectIdeasProps {
  idea?: Idea;
  onBack: () => void;
}

const dummyIdea: Idea = {
  id: ideas[0].id,
  title: ideas[0].title,
  category: "Best",
  student: "Ravi Kumar",
  mentor: "Priya Sharma",
  raw: "Initial idea: Use face recognition for attendance.",
  refined: "Refined: Integrate with college ERP and add mobile notifications.",
  comments: [
    { mentor: "Priya Sharma", text: "Great start! Add more security checks." },
    { mentor: "Amit Patel", text: "Consider privacy issues." },
  ],
  tags: ["AI", "Attendance", "ERP"],
  rawFiles: [
    { name: "proposal.pdf", url: "/files/proposal.pdf" },
    { name: "diagram.png", url: "/files/diagram.png" },
  ],
  formattedFile: { name: "formatted-proposal.pdf", url: "/files/formatted-proposal.pdf" },
  feedback: "Well structured proposal, but needs more on privacy.",
  transcribe: "This is a transcribed summary of the student's voice note.",
  mentorRemarks: { Score: 8, potentialCategory: "High" },
};

const CompleteProjectIdeas: React.FC<CompleteProjectIdeasProps> = ({ idea, onBack }) => {
  const displayIdea = idea || dummyIdea;

  return (
    <section className="mb-8">
      <button onClick={onBack} className="mb-4 text-blue-700 hover:underline">&larr; Back to Potential Ideas</button>
      <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">Project Idea - Complete Details</h2>
      <div className="max-w-4xl mx-auto"> {/* Increased from max-w-2xl to max-w-4xl */}
        <div className="rounded-2xl shadow bg-white border border-blue-200 p-8 flex flex-col gap-2"> {/* Increased padding */}
          <div className="font-semibold text-blue-800 text-lg mb-1">{displayIdea.title}</div>
          <div className="text-sm text-gray-700 mb-1">Student: {displayIdea.student}</div>
          <div className="text-xs text-gray-500 mb-1">Mentor: {displayIdea.mentor}</div>
          <div className="mb-2 flex flex-wrap gap-2">
            {displayIdea.tags.map((tag, idx) => (
              <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">{tag}</span>
            ))}
          </div>
          <div className="font-semibold text-blue-700 mb-1 mt-2">Raw Idea from Student:</div>
          <div className="bg-blue-50 rounded p-2 text-gray-800 mb-2">{displayIdea.raw}</div>
          <div className="font-semibold text-blue-700 mb-1">Refined Student Idea:</div>
          <div className="bg-blue-50 rounded p-2 text-gray-800 mb-2">{displayIdea.refined}</div>
          <div className="font-semibold text-blue-700 mb-1">Raw Files:</div>
          <ul className="list-disc pl-4 mb-2">
            {displayIdea.rawFiles.map((file, idx) => (
              <li key={idx}><a href={file.url} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">{file.name}</a></li>
            ))}
          </ul>
          <div className="font-semibold text-blue-700 mb-1">Formatted File:</div>
          {displayIdea.formattedFile ? (
            <a href={displayIdea.formattedFile.url} className="text-blue-600 underline mb-2" target="_blank" rel="noopener noreferrer">{displayIdea.formattedFile.name}</a>
          ) : (
            <div className="text-gray-400 mb-2">No formatted file</div>
          )}
          <div className="font-semibold text-blue-700 mb-1">Feedback:</div>
          <div className="bg-blue-50 rounded p-2 text-gray-800 mb-2">{displayIdea.feedback}</div>
          <div className="font-semibold text-blue-700 mb-1">Transcribe:</div>
          <div className="bg-blue-50 rounded p-2 text-gray-800 mb-2">{displayIdea.transcribe}</div>
          <div className="font-semibold text-blue-700 mb-1">Mentor Remarks:</div>
          <div className="mb-2 text-sm text-gray-700">Score: {displayIdea.mentorRemarks.Score} / 10</div>
          <div className="mb-2 text-sm text-gray-700">Potential Category: <span className="font-semibold">{displayIdea.mentorRemarks.potentialCategory}</span></div>
          <div className="font-semibold text-blue-700 mb-1">Mentor Comments:</div>
          {displayIdea.comments && displayIdea.comments.length > 0 ? (
            <ul className="list-disc pl-4">
              {displayIdea.comments.map((c, idx) => (
                <li key={idx} className="mb-1">
                  <span className="font-semibold">{c.mentor}:</span> {c.text}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-400">No comments yet.</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CompleteProjectIdeas;
