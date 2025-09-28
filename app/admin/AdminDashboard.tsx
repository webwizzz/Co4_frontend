"use client";

import React, { useState } from "react";
import Sidebar from "../components/sidebar";
import Mentors from "./Mentors";
import Students from "./Students";
import AssignedMentors from "./AssignedMentors";
import PotentialIdeas from "./PotentialIdeas";
import StudentsIdeas from "./Studentsideas";
import { mentors, students, ideas } from "./Data";

const reports = {
	Best: students.filter((u) => u.report === "Best").map((s) => ({ name: s.name, ideas })),
	Mediocre: students.filter((u) => u.report === "Mediocre").map((s) => ({ name: s.name, ideas: ideas.slice(0, 2) })),
	Low: students.filter((u) => u.report === "Low").map((s) => ({ name: s.name, ideas: [] })),
};

const StudentDashboard: React.FC = () => (
	<section className="mb-8">
		<h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">
			Students
		</h2>
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{students.map((student) => (
				<div
					key={student.id}
					className="rounded-2xl shadow bg-white border border-blue-200 p-6 flex flex-col gap-2"
				>
					<div className="font-semibold text-blue-800 text-lg mb-1">
						{student.name}
					</div>
					<div className="text-sm text-gray-700 mb-1">
						Status: {student.status}
					</div>
					<div className="text-xs text-gray-500 mb-1">
						Mentor: {student.assignedMentor}
					</div>
					<div className="text-xs text-gray-500 mb-1">
						Report: {student.report}
					</div>
				</div>
			))}
		</div>
	</section>
);

export const AdminDashboard: React.FC = () => {
	const [section, setSection] = useState<string>("mentors");
	const [selectedStudent, setSelectedStudent] = useState<any>(null);

	return (
		<div className="flex min-h-screen">
			<Sidebar
				onNavigate={(s) => {
					setSection(s);
					setSelectedStudent(null);
				}}
			/>
			<main className="flex-1 p-8 bg-blue-50 text-blue-900">
				<h1 className="text-3xl font-bold mb-8 text-center">
					Admin Dashboard
				</h1>
				{section === "mentors" && <Mentors mentors={mentors} />}
				{section === "students" && !selectedStudent && <StudentDashboard />}
				{section === "students" && selectedStudent && (
					<StudentsIdeas
						studentName={selectedStudent.name}
						onBack={() => setSelectedStudent(null)}
					/>
				)}
				{section === "assigned-mentors" && (
					<AssignedMentors students={students} />
				)}
				{section === "student-reports" && <PotentialIdeas reports={reports} />}
			</main>
		</div>
	);
};

export default AdminDashboard;
