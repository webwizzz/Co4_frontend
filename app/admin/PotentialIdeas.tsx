import React, { useEffect, useState } from "react";
import CompleteProjectIdeas from "./CompleteProjectIdeas";
import ProjectAnalysis from "./ProjectAnalysis";

type ApiStudent = { _id: string; name: string; email?: string }
type ApiProject = { _id: string; title: string; description: string; tags?: string[]; mentorRemarks?: { Score?: number; potentialCategory?: string } }

type PotentialIdeasApi = {
  ideas: Array<{
    student: ApiStudent
    projects: ApiProject[]
  }>
  categorized: Record<string, Array<{ student: ApiStudent; project: ApiProject }>>
}

export default function PotentialIdeas() {
  const [data, setData] = useState<PotentialIdeasApi | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'best'|'mediocre'|'low'>('best')
  const [openProject, setOpenProject] = useState<{ student: ApiStudent; project: ApiProject } | null>(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('http://localhost:8000/api/admin/potential-ideas')
        if (!res.ok) throw new Error(`Failed: ${res.status}`)
        const json = await res.json()
        if (!mounted) return
        setData(json)
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

  if (openProject) {
    const studentObj = (openProject as any).student || (openProject as any).studentId || { _id: 'unknown', name: 'Unknown', email: '' }
    return (
      <ProjectAnalysis
        student={studentObj}
        project={openProject.project}
        onBack={() => setOpenProject(null)}
      />
    )
  }

  const counts = {
    best: (() => {
      if (!data?.ideas) return 0
      return data.ideas.reduce((acc, s) => acc + (s.projects?.filter(p => (p.mentorRemarks?.potentialCategory || '').toLowerCase() === 'high').length || 0), 0)
    })(),
    mediocre: (() => {
      if (!data?.ideas) return 0
      return data.ideas.reduce((acc, s) => acc + (s.projects?.filter(p => (p.mentorRemarks?.potentialCategory || '').toLowerCase() === 'medium' || (p.mentorRemarks?.potentialCategory || '').toLowerCase() === 'moderate').length || 0), 0)
    })(),
    low: (() => {
      if (!data?.ideas) return 0
      return data.ideas.reduce((acc, s) => acc + (s.projects?.filter(p => (p.mentorRemarks?.potentialCategory || '').toLowerCase() === 'low').length || 0), 0)
    })(),
  }

  const tabMap: Record<string, string> = {
    best: 'High',
    mediocre: 'Moderate',
    low: 'Low'
  }

  return (
    <section id="potential-ideas" className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Potential Ideas</h2>

      {loading ? (
        <div className="p-6 bg-white rounded shadow">Loading ideas…</div>
      ) : error ? (
        <div className="p-6 bg-red-50 text-red-700 rounded">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-white border rounded shadow flex flex-col items-start">
              <div className="text-sm text-gray-500">High</div>
              <div className="text-2xl font-bold">{counts.best}</div>
            </div>
            <div className="p-4 bg-white border rounded shadow flex flex-col items-start">
              <div className="text-sm text-gray-500">Moderate</div>
              <div className="text-2xl font-bold">{counts.mediocre}</div>
            </div>
            <div className="p-4 bg-white border rounded shadow flex flex-col items-start">
              <div className="text-sm text-gray-500">Low</div>
              <div className="text-2xl font-bold">{counts.low}</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex space-x-2">
              {(['best','mediocre','low'] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setActiveTab(k)}
                  className={`px-3 py-1 rounded ${activeTab === k ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                  {tabMap[k]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {((() => {
              // Build categorized list from data.ideas if provided, otherwise fall back to data.categorized
              if (data?.ideas) {
                const buckets: Record<string, Array<{ student: ApiStudent; project: ApiProject }>> = { best: [], mediocre: [], low: [] }
                for (const s of data.ideas) {
                  for (const p of s.projects || []) {
                      const cat = (p.mentorRemarks?.potentialCategory || '').toLowerCase()
                      // API sometimes returns the student under `studentId` or `student` key
                      const studentObj = (s as any).student || (s as any).studentId || { _id: 'unknown', name: 'Unknown', email: '' }
                      if (cat === 'high') buckets.best.push({ student: studentObj, project: p })
                      else if (cat === 'low') buckets.low.push({ student: studentObj, project: p })
                      else buckets.mediocre.push({ student: studentObj, project: p })
                    }
                }
                return buckets[activeTab]
              }
              return data?.categorized?.[activeTab] ?? []
            })()).map((item: any, idx: number) => {
              if (!item || !item.student || !item.project) return null
              return (
              <div key={item.project._id + '_' + idx} className="p-4 bg-white border rounded shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-gray-600">Student</div>
                    <div className="font-semibold">{item.student.name}</div>
                    <div className="text-xs text-gray-500">{item.student.email}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Category</div>
                    <div className="font-semibold">{item.project.mentorRemarks?.potentialCategory ?? '-'}</div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-lg font-medium">{item.project.title}</div>
                  <p className="text-sm text-gray-700 mt-1">{item.project.description.slice(0, 300)}{item.project.description.length > 300 ? '...' : ''}</p>
                  <div className="mt-2 flex items-center gap-2">
                    {(item.project.tags || []).map((t: string) => (
                      <span key={t} className="text-xs bg-gray-100 px-2 py-1 rounded">{t}</span>
                    ))}
                  </div>
                  <div className="mt-3">
                    <button className="text-sm text-blue-600" onClick={() => setOpenProject(item)}>
                      View details
                    </button>
                  </div>
                </div>
              </div>
              )
            })}
          </div>
        </>
      )}
    </section>
  )
}
