"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckIcon, X } from "lucide-react"

type ApiStudent = { _id: string; name: string }
type ApiMentor = { _id: string; name: string }

export default function AssignedMentors() {
  const [students, setStudents] = useState<ApiStudent[]>([])
  const [mentors, setMentors] = useState<ApiMentor[]>([])
  const [assignmentsMap, setAssignmentsMap] = useState<Record<string, ApiMentor | null>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selected, setSelected] = useState<Record<string, string | null>>({})
  const [rowLoading, setRowLoading] = useState<Record<string, boolean>>({})
  const [rowSuccess, setRowSuccess] = useState<Record<string, boolean>>({})

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const [sRes, mRes, aRes] = await Promise.all([
          fetch("http://localhost:8000/api/admin/students"),
          fetch("http://localhost:8000/api/admin/mentors"),
          fetch("http://localhost:8000/api/admin/mentor-assignments"),
        ])
        if (!sRes.ok) throw new Error(`Failed fetching students: ${sRes.status}`)
        if (!mRes.ok) throw new Error(`Failed fetching mentors: ${mRes.status}`)
        if (!aRes.ok) throw new Error(`Failed fetching assignments: ${aRes.status}`)
        const sJson = await sRes.json()
        const mJson = await mRes.json()
        const aJson = await aRes.json()
        if (!mounted) return
        setStudents(sJson.students || [])
        setMentors(mJson.mentors || [])

        // Build assignments map: studentId -> mentor
        const assignMap: Record<string, ApiMentor | null> = {}
        const assignmentsArray = Array.isArray(aJson.assignments) ? aJson.assignments : []
        assignmentsArray.forEach((as: any) => {
          const sid = as.student?._id || as.student?.id || (typeof as.student === 'string' ? as.student : undefined)
          const mentorObj = as.mentor ? { _id: (as.mentor._id || as.mentor.id), name: as.mentor.name } : null
          if (sid) assignMap[sid] = mentorObj
        })
        setAssignmentsMap(assignMap)
      } catch (e: any) {
        console.error(e)
        setError(e?.message || String(e))
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const handleSelect = (studentId: string, mentorId: string) => {
    setSelected(prev => ({ ...prev, [studentId]: mentorId }))
    setRowSuccess(prev => ({ ...prev, [studentId]: false }))
  }

  const assignMentor = async (studentId: string) => {
    const mentorId = selected[studentId]
    if (!mentorId) return
    setRowLoading(prev => ({ ...prev, [studentId]: true }))
    try {
      const res = await fetch("http://localhost:8000/api/admin/assign-mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, mentorId }),
      })
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || `Assign failed: ${res.status}`)
      }
      const data = await res.json()
      // mark success
      setRowSuccess(prev => ({ ...prev, [studentId]: true }))
    } catch (e: any) {
      console.error(e)
      setError(e?.message || String(e))
    } finally {
      setRowLoading(prev => ({ ...prev, [studentId]: false }))
    }
  }

  return (
    <section id="assigned-mentors" className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Assigned Mentors</h2>
      {loading ? (
        <div className="p-6 bg-white rounded shadow">Loading students and mentors…</div>
      ) : error ? (
        <div className="p-6 bg-red-50 text-red-700 rounded">{error}</div>
      ) : (
        <div className="rounded-2xl shadow bg-white border border-blue-200 p-6 overflow-auto">
          <table className="w-full table-fixed text-center border-collapse bg-white">
            <colgroup>
              <col style={{ width: '40%' }} />
              <col style={{ width: '40%' }} />
              <col style={{ width: '20%' }} />
            </colgroup>
            <thead>
              <tr className="bg-blue-100 text-blue-800">
                <th className="py-2 px-4 font-medium">Student</th>
                <th className="py-2 px-4 font-medium">Mentor</th>
                <th className="py-2 px-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id} className="border-t border-blue-100 align-top">
                  <td className="py-2 px-4 align-top">{s.name}</td>
                  <td className="py-2 px-4 align-top">
                    {assignmentsMap[s._id] ? (
                      <div className="text-sm text-gray-800">{assignmentsMap[s._id]?.name}</div>
                    ) : (
                      <select
                        value={selected[s._id] ?? ""}
                        onChange={(e) => handleSelect(s._id, e.target.value)}
                        className="border rounded px-2 py-1 w-48"
                      >
                        <option value="">Select mentor</option>
                        {mentors.map((m) => (
                          <option key={m._id} value={m._id}>{m.name}</option>
                        ))}
                      </select>
                    )}
                  </td>
                  <td className="py-2 px-4 align-top">
                    {assignmentsMap[s._id] ? (
                      <span className="text-sm text-gray-600">Assigned</span>
                    ) : selected[s._id] ? (
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" onClick={() => assignMentor(s._id)} disabled={rowLoading[s._id]}>
                          {rowLoading[s._id] ? 'Saving…' : <CheckIcon className="h-4 cursor-pointer w-4"/>}
                        </Button>
                        <Button variant="ghost" onClick={() => setSelected(prev => ({ ...prev, [s._id]: null }))}>
                          <X className="h-4 cursor-pointer w-4"/>
                        </Button>
                        {rowSuccess[s._id] && <span className="text-sm text-green-600">Assigned</span>}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
