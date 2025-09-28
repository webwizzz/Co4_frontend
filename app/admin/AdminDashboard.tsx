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
 		const [section, setSection] = useState<string>("student-reports");
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

		const Users: React.FC<{ initialTab: 'mentors' | 'students' }> = ({ initialTab }) => {
			const [tab, setTab] = useState<'mentors' | 'students'>(initialTab)

			if (tab === 'students' && selectedStudent) {
				return (
					<StudentsIdeas
						studentName={selectedStudent.name}
						onBack={() => setSelectedStudent(null)}
					/>
				)
			}

			return (
				<section className="mb-8">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-2xl font-bold text-blue-800">Users</h2>
						<div className="flex rounded bg-gray-100 p-1">
							<button onClick={() => setTab('students')} className={`px-3 py-1 rounded ${tab === 'students' ? 'bg-blue-600 text-white' : 'text-blue-700'}`}>Students</button>
							<button onClick={() => setTab('mentors')} className={`px-3 py-1 rounded ${tab === 'mentors' ? 'bg-blue-600 text-white' : 'text-blue-700'}`}>Mentors</button>
						</div>
					</div>

					{tab === 'students' ? (
						<div>
							{loading ? (
								<div className="text-center py-8">Loading students…</div>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{students.map((student) => (
										<div key={student.id} className="rounded-2xl shadow bg-white border border-blue-200 p-6 flex flex-col gap-2">
											<div className="font-semibold text-blue-800 text-lg mb-1">{student.name}</div>
											<div className="text-sm text-gray-700 mb-1">Status: {student.status}</div>
											<div className="text-sm text-gray-700 mb-1">Email: {student.email}</div>
										</div>
									))}
								</div>
							)}
						</div>
					) : (
						<div>
							{loading ? (
								<div className="text-center py-8">Loading mentors…</div>
							) : (
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{mentors.map((mentor) => (
										<div key={mentor.id} className="rounded-2xl shadow bg-white border border-blue-200 p-6 flex flex-col gap-2">
											<div className="font-semibold text-blue-800 text-lg mb-1">{mentor.name}</div>
											<div className="text-sm text-gray-700 mb-1">Expertise: {mentor.expertise}</div>
											<div className="text-sm text-gray-700 mb-1">Email: {mentor.email}</div>
										</div>
									))}
								</div>
							)}
						</div>
					)}
				</section>
			)
		}

		return (
			<div className="flex min-h-screen">
			<Sidebar
				onNavigate={(s) => {
					setSection(s);
					setSelectedStudent(null);
				}}
				onLogout={() => {
					// clear common auth keys and redirect to login
					try {
						localStorage.removeItem('token')
						localStorage.removeItem('auth')
						// add any other keys you use for auth
					} catch (e) { /* ignore in non-browser environments */ }
					window.location.href = '/login'
				}}
			/>
			<main className="flex-1 p-8 bg-blue-50 text-blue-900">
				<h1 className="text-3xl font-bold mb-8 text-center">
					Admin Dashboard
				</h1>
				{(section === "users" || section === "students" || section === 'mentors') && <Users initialTab={(section === 'mentors' ? 'mentors' : 'students')} />}
				{section === "assigned-mentors" && (
					<AssignedMentors/>
				)}
				{section === "student-reports" && <PotentialIdeas />}
				{error && <div className="text-sm text-red-600 mt-4">{error}</div>}
			</main>
		</div>
	);
};

export default AdminDashboard;
