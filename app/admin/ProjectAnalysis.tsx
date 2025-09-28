import React from 'react'

type Student = { _id?: string; name?: string; email?: string }
type Improvement = {
  section: string
  priority: string
  current_issue: string
  specific_action: string
  why_important?: string | null
  resources_needed?: string | null
}

type Feedback = {
  submission_id?: string
  feedback_timestamp?: string
  current_strength_level?: string
  overall_completeness?: number
  high_priority_improvements?: Improvement[]
  medium_priority_improvements?: Improvement[]
  low_priority_improvements?: Improvement[]
  next_steps_this_week?: string[]
  research_assignments?: string[]
  questions_to_answer?: string[]
  what_youre_doing_well?: string[]
  motivational_note?: string
  estimated_hours_to_improve?: number
}

type Analysis = {
  overall_confidence?: number
  problem_and_market_score?: number
  value_and_model_score?: number
  team_and_traction_score?: number
  funding_readiness_score?: number
  market_feasibility_score?: number
  financial_feasibility_score?: number
  technical_feasibility_score?: number
  strengths?: string[]
  weaknesses?: string[]
  prioritized_actions?: string[]
  red_flags?: string[]
  risk_assessment?: string
  automated_feedback?: string
  market_feasibility_feedback?: string
  financial_feasibility_feedback?: string
  technical_feasibility_feedback?: string
  problem_and_market_basis?: string
  value_and_model_basis?: string
  team_and_traction_basis?: string
  funding_readiness_basis?: string
  market_feasibility_basis?: string
  financial_feasibility_basis?: string
  technical_feasibility_basis?: string
  extracted_kpis?: string[]
}

type Project = {
  _id?: string
  title?: string
  description?: string
  tags?: string[]
  comments?: string[]
  feedback?: Feedback
  analysis?: Analysis
  mentorRemarks?: { Score?: number; potentialCategory?: string }
}

const StatPill: React.FC<{ label: string; value?: string | number; color?: string }> = ({ label, value, color = 'bg-blue-100 text-blue-800' }) => (
  <div className={`px-3 py-1 rounded-full text-sm font-medium ${color} inline-flex items-center gap-2`}> 
    <span className="font-semibold">{label}:</span>
    <span>{value ?? '-'}</span>
  </div>
)

const ScoreBar: React.FC<{ score?: number }> = ({ score = 0 }) => {
  const pct = Math.max(0, Math.min(100, Math.round(score * 10)))
  return (
    <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
      <div className="h-4 rounded-full bg-gradient-to-r from-green-400 to-blue-600" style={{ width: `${pct}%` }} />
    </div>
  )
}

const ProjectAnalysis: React.FC<{ student: Student; project: Project; onBack: () => void }> = ({ student, project, onBack }) => {
  const comments = project.comments || []
  const feedback = project.feedback
  const analysis = project.analysis
  const score = project.mentorRemarks?.Score ?? 0

  return (
    <section className="mb-8">
      <button onClick={onBack} className="mb-4 text-blue-700 hover:underline">&larr; Back</button>

      <div className="rounded-2xl shadow bg-white border p-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold">{project.title}</h2>
            <div className="text-sm text-gray-600">by <span className="font-semibold">{student?.name || 'Unknown'}</span> • <span className="text-xs text-gray-500">{student?.email}</span></div>
            <div className="mt-4 text-gray-700 whitespace-pre-line">{project.description}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              {(project.tags || []).map((t) => (
                <span key={t} className="text-xs bg-gray-100 px-2 py-1 rounded">{t}</span>
              ))}
            </div>
          </div>

          <div className="w-48 flex-shrink-0 text-center">
            <div className="text-sm text-gray-500 mb-2">Mentor Score</div>
            <div className="text-4xl font-extrabold text-blue-700">{score}</div>
            <div className="mt-3"><ScoreBar score={score} /></div>
            <div className="mt-3">{project.mentorRemarks?.potentialCategory && <StatPill label="Category" value={project.mentorRemarks?.potentialCategory} />}</div>
          </div>
        </div>

        <hr className="my-6" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2">
            <h3 className="text-lg font-semibold mb-2">Automated Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">Overall Confidence</div>
                <div className="font-semibold text-blue-700">{analysis?.overall_confidence ?? '-'}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">Market Feasibility</div>
                <div className="font-semibold text-blue-700">{analysis?.market_feasibility_score ?? '-'}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">Financial Feasibility</div>
                <div className="font-semibold text-blue-700">{analysis?.financial_feasibility_score ?? '-'}</div>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <div className="text-sm text-gray-600">Technical Feasibility</div>
                <div className="font-semibold text-blue-700">{analysis?.technical_feasibility_score ?? '-'}</div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold">Strengths</h4>
              <ul className="list-disc pl-6 mt-2 text-sm text-gray-700">
                {(analysis?.strengths || []).map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>

            <div className="mt-4">
              <h4 className="font-semibold">Weaknesses</h4>
              <ul className="list-disc pl-6 mt-2 text-sm text-gray-700">
                {(analysis?.weaknesses || []).map((w, i) => <li key={i}>{w}</li>)}
              </ul>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold">Prioritized Actions</h4>
              <ol className="list-decimal pl-6 mt-2 text-sm text-gray-700">
                {(analysis?.prioritized_actions || []).map((a, i) => <li key={i}>{a}</li>)}
              </ol>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold">Next Steps This Week</h4>
              <ul className="list-disc pl-6 mt-2 text-sm text-gray-700">
                {(feedback?.next_steps_this_week || []).map((n, i) => <li key={i}>{n}</li>)}
              </ul>
            </div>
          </div>

          <aside className="p-6 bg-gray-50 rounded max-h-[860px] overflow-auto">
            <h4 className="font-semibold mb-2">Feedback Summary</h4>
            <div className="text-sm text-gray-700 mb-2">Strength level: <span className="font-semibold">{feedback?.current_strength_level ?? '-'}</span></div>
            <div className="text-sm text-gray-700 mb-2">Completeness: <span className="font-semibold">{feedback?.overall_completeness ?? '-' }%</span></div>
            <div className="mb-3">
              <h5 className="font-semibold">High Priority Improvements</h5>
              {(feedback?.high_priority_improvements || []).map((imp, i) => (
                <div key={i} className="mt-2 p-2 bg-white rounded border">
                  <div className="text-sm font-semibold">{imp.section} • <span className="text-xs text-gray-500">{imp.priority}</span></div>
                  <div className="text-sm text-gray-700 mt-1">{imp.current_issue}</div>
                  <div className="text-sm text-blue-700 mt-1">Action: {imp.specific_action}</div>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <hr className="my-6" />

        <div>
          <h3 className="text-lg font-semibold mb-2">Comments</h3>
          {comments.length ? (
            <ul className="space-y-2">
              {comments.map((c, i) => (
                <li key={i} className="p-3 bg-gray-50 rounded border">{c}</li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-500">No comments yet</div>
          )}
        </div>

        <hr className="my-6" />

        <div>
          <h3 className="text-lg font-semibold mb-2">Extracted KPIs</h3>
          <div className="flex flex-wrap gap-2">
            {(analysis?.extracted_kpis || []).map((kpi, i) => (
              <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded text-sm">{kpi}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProjectAnalysis
