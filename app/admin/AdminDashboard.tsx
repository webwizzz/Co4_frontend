"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import Mentors from "./Mentors";
import AssignedMentors from "./AssignedMentors";
import PotentialIdeas from "./PotentialIdeas";
import StudentsIdeas from "./Studentsideas";
import { ideas, students as dummyStudents, mentors as dummyMentors } from "./Data";

// reports will be computed from fetched students when available

const StudentDashboard: React.FC<{ students: any[]; loading: boolean }> = ({ students, loading }) => (
  <section className="mb-8">
    <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">Students</h2>
    {loading ? (
      <div className="text-center py-8">Loading students…</div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <div
            key={student.id}
            className="rounded-2xl shadow bg-white border border-blue-200 p-6 flex flex-col gap-2"
          >
            <div className="font-semibold text-blue-800 text-lg mb-1">{student.name}</div>
            <div className="text-sm text-gray-700 mb-1">Status: {student.status}</div>
            <div className="text-sm text-gray-700 mb-1">Email: {student.email}</div>
          </div>
        ))}
      </div>
    )}
  </section>
)

export const AdminDashboard: React.FC = () => {
		const [section, setSection] = useState<string>("mentors");
		const [selectedStudent, setSelectedStudent] = useState<any>(null);

		const [students, setStudents] = useState<any[]>([])
		const [mentors, setMentors] = useState<any[]>([])
		const [loading, setLoading] = useState(true)
		const [error, setError] = useState<string | null>(null)

		useEffect(() => {
			let mounted = true
			const load = async () => {
				try {
					setLoading(true)
					setError(null)

					const [studentsRes, mentorsRes] = await Promise.all([
						fetch('http://localhost:8000/api/admin/students'),
						fetch('http://localhost:8000/api/admin/mentors'),
					])

					if (!studentsRes.ok) throw new Error('Failed to fetch students')
					if (!mentorsRes.ok) throw new Error('Failed to fetch mentors')

					const studentsJson = await studentsRes.json()
					const mentorsJson = await mentorsRes.json()

					// Map backend shape to UI shape used in this file
					const studentsMapped = (studentsJson.students || []).map((s: any) => ({
						id: s._id,
						name: s.name,
						email: s.email,
						status: s.status || 'Active',
						assignedMentor: s.assignedMentor || '',
						report: s.report || 'Unknown',
					}))

					const mentorsMapped = (mentorsJson.mentors || []).map((m: any, idx: number) => ({
						id: m._id || idx,
						name: m.name,
						status: m.status || 'Active',
						expertise: m.expertise || '',
						email: m.email,
						studentsCount: m.studentsCount || 0,
					}))

					if (mounted) {
						setStudents(studentsMapped.length ? studentsMapped : dummyStudents)
						setMentors(mentorsMapped.length ? mentorsMapped : dummyMentors)
					}
				} catch (e: any) {
					console.error(e)
					if (mounted) setError(e?.message || String(e))
				} finally {
					if (mounted) setLoading(false)
				}
			}

			load()
			return () => { mounted = false }
		}, [])

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
				{section === "students" && !selectedStudent && <StudentDashboard students={students} loading={loading} />}
				{section === "students" && selectedStudent && (
					<StudentsIdeas
						studentName={selectedStudent.name}
						onBack={() => setSelectedStudent(null)}
					/>
				)}
				{section === "assigned-mentors" && (
					<AssignedMentors students={students} />
				)}
				{section === "student-reports" && <PotentialIdeas reports={{}} />}
				{error && <div className="text-sm text-red-600 mt-4">{error}</div>}
			</main>
		</div>
	);
};

export default AdminDashboard;
