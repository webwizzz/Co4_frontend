"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Archive,
  ArrowLeft,
  Eye,
  FileText,
  FolderOpen,
  ImageIcon,
  Music,
  Star,
  Tag,
  Video
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

interface FileSchema {
  id?: string
  name: string
  type?: string
  size?: number
  url: string
  uploadDate?: string
}

interface MentorRemarks {
  Score?: number
  potentialCategory?: 'High' | 'Medium' | 'Low'
}

interface FormattedFile {
  title?: string | null
  tagline?: string | null
  vision?: string | null
  mission?: string | null
  language?: string | null
  stage?: string | null
  summary?: string | null
  problem_and_customer?: string | null
  solution_and_features?: string | null
  market_and_competitors?: string | null
  channels_and_revenue?: string | null
  operations_and_team?: string | null
  traction_and_funding?: string | null
  risks_and_mitigation?: string | null
  social_and_environmental_impact?: string | null
}

interface FeedbackImprovement {
  section?: string
  priority?: string
  current_issue?: string
  specific_action?: string
  why_important?: string
  resources_needed?: string | null
}

interface FeedbackSchema {
  submission_id?: string
  research_assignments?: string[]
  questions_to_answer?: string[]
  feedback_timestamp?: string
  current_strength_level?: string
  overall_completeness?: number
  high_priority_improvements?: FeedbackImprovement[]
  medium_priority_improvements?: FeedbackImprovement[]
  low_priority_improvements?: FeedbackImprovement[]
  next_steps_this_week?: string[]
  what_youre_doing_well?: string[]
}

interface IdeaData {
  id: string
  name: string
  description: string
  tags: string[]
  rawFiles: FileSchema[]
  formattedFile: FormattedFile | null
  feedback: FeedbackSchema | null
  comments: string[]
  transcribe: string[]
  mentorRemarks: MentorRemarks
  createdAt: string
}

// Dummy data for the idea
const dummyIdeaData: IdeaData = {
  id: "idea-001",
  name: "AI-Powered Study Assistant for Students",
  description:
    "An innovative mobile application that uses artificial intelligence to help students organize their study materials, create personalized learning schedules, and provide instant answers to academic questions.",
  tags: ["AI", "Education", "Mobile App", "Machine Learning", "Study Tools"],
  rawFiles: [],
  formattedFile: null,
  feedback: null,
  comments: [],
  transcribe: [],
  mentorRemarks: {
    Score: 8.5,
    potentialCategory: 'High',
  },
  createdAt: '2024-01-14',
}

const fileTypeIcons = {
  'application/pdf': FileText,
  'video/mp4': Video,
  'video/quicktime': Video,
  'audio/mpeg': Music,
  'audio/mp3': Music,
  'image/jpeg': ImageIcon,
  'image/png': ImageIcon,
  'image/jpg': ImageIcon,
  default: Archive
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getFileIcon = (mimeType: string) => {
  const IconComponent = fileTypeIcons[mimeType as keyof typeof fileTypeIcons] || fileTypeIcons.default
  return <IconComponent className="h-4 w-4" />
}

const getPotentialCategoryColor = (category: string) => {
  switch (category) {
    case 'High': return 'bg-green-100 text-green-800 border-green-200'
    case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'Low': return 'bg-red-100 text-red-800 border-red-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

const ToggleSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border rounded-lg mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-gray-200 font-semibold"
      >
        {title}
      </button>
      {isOpen && <div className="p-4">{children}</div>}
    </div>
  );
};

export default function IdeaDetails() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const projectId = searchParams?.get('projectId')

  const [idea, setIdea] = useState<IdeaData | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'files' | 'feedback' | 'mentor'>('overview')
  const [newComment, setNewComment] = useState('')
  const [feedbackLoading, setFeedbackLoading] = useState(false)
  const [feedbackError, setFeedbackError] = useState<string | null>(null)
  
  // Translation related states
  const [showTranslationModal, setShowTranslationModal] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<string>('')
  const [translatedContent, setTranslatedContent] = useState<any>(null)
  const [translationLoading, setTranslationLoading] = useState(false)
  const [translationError, setTranslationError] = useState<string | null>(null)
  
  // Available languages for translation
  const availableLanguages = [
    { value: 'hindi', label: 'Hindi' },
    { value: 'marathi', label: 'Marathi' },
    { value: 'gujarati', label: 'Gujarati' },
    { value: 'odia', label: 'Odia' },
    { value: 'bengali', label: 'Bengali' },
    { value: 'tamil', label: 'Tamil' }
  ]

  useEffect(() => {
    if (!projectId) return

    async function fetchProject() {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(`http://localhost:8000/api/student/project/${projectId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        })
        const data = await res.json()
        console.log(data)
        if (!res.ok) {
          console.error('Failed to fetch project', data)
          setIdea(dummyIdeaData)
          return
        }

        setIdea(data.details || [])
      } catch (e) {
        console.error(e)
        setIdea(dummyIdeaData)
      }
    }

    fetchProject()
  }, [projectId])

  // Helper to fetch feedback for a given project id (or fallback to idea.id)
  async function fetchFeedbackForProject(pid?: string) {
    const idToUse = pid || projectId || idea?.id
    console.log('Fetching feedback for project id:', idToUse)
    
    if (!idToUse) {
      setFeedbackError('No project id available to fetch feedback')
      return
    }

    try {
      setFeedbackError(null)
      setFeedbackLoading(true)
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const res = await fetch(`http://localhost:8000/api/student/feedback/${idToUse}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || `Failed to fetch feedback: ${res.status}`)
      }
      const data = await res.json()
      const fb = data.feedback ?? data
      setIdea(prev => prev ? { ...prev, feedback: fb } : prev)
    } catch (e: any) {
      console.error('Error fetching feedback:', e)
      setFeedbackError(e?.message || String(e))
    } finally {
      setFeedbackLoading(false)
    }
  }

  // Normalize mentor comments which may be an array of strings or a JSON string
  const normalizeMentorComments = (raw: any): { id: string; text: string }[] => {
    if (!raw) return []
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw)
        return normalizeMentorComments(parsed)
      } catch (e) {
        return [{ id: `m_${Date.now()}`, text: raw }]
      }
    }
    if (Array.isArray(raw)) {
      return raw.map((item: any, idx: number) => ({ id: `m_${idx}_${Date.now()}`, text: String(item) }))
    }
    return []
  }

  // Normalize transcription content which may be string or array
  const normalizeTranscribe = (raw: any): string[] => {
    if (!raw) return []
    if (typeof raw === 'string') return [raw]
    if (Array.isArray(raw)) return raw.map((r) => String(r))
    return [String(raw)]
  }

  // Download transcript as a .doc (simple HTML blob that Word can open)
  const downloadAsWord = (title = 'transcript') => {
    if (!idea) {
      console.warn('No idea available for download')
      return
    }
    const items = normalizeTranscribe(idea.transcribe)
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title></head><body><h2>${idea.name} - Transcript</h2>${items.map(p => `<p>${p.replace(/\n/g, '<br/>')}</p>`).join('')}</body></html>`
    const blob = new Blob([html], { type: 'application/msword' })
  const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title.replace(/[^a-z0-9_-]/gi, '_')}_${idea.id}.doc`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  // Open a print-friendly window with the transcript content and trigger print (user can save as PDF)
  const downloadAsPDF = (title = 'transcript') => {
    if (!idea) {
      console.warn('No idea available for print')
      return
    }
    const items = normalizeTranscribe(idea.transcribe)
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title><style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;margin:20px;color:#111}h2{color:#0b5cff}</style></head><body><h2>${idea.name} - Transcript</h2>${items.map(p => `<p style="margin-bottom:12px">${p.replace(/\n/g, '<br/>')}</p>`).join('')}</body></html>`
    const win = window.open('', '_blank', 'noopener,noreferrer')
    if (!win) {
      alert('Unable to open print window. Please allow popups for this site to save as PDF.')
      return
    }
    win.document.open()
    win.document.write(html)
    win.document.close()
    // Give the window a moment to render then call print
    setTimeout(() => {
      try {
        win.focus()
        win.print()
        // optionally close after print: win.close()
      } catch (e) {
        console.error('Print failed', e)
      }
    }, 400)
  }

  if (!idea) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading project...</div>
      </div>
    )
  }

  const handleBack = () => {
    router.back()
  }

  const handleFilePreview = (file: FileSchema) => {
    // Open file in new tab or preview modal
    window.open(file.url, '_blank')
  }

  function getFileType (file: FileSchema) {
    const fileType = file.name.split(".").pop();
    return fileType || 'other'
  }

  // Handle translation request
  const handleTranslate = async () => {
    if (!selectedLanguage || !idea?.formattedFile) {
      setTranslationError('Please select a language and ensure idea data is loaded');
      return;
    }

    try {
      setTranslationLoading(true);
      setTranslationError(null);
      
      const response = await fetch('http://127.0.0.1:7000/translate-structured-output', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: selectedLanguage,
          structured_output: idea.formattedFile
        }),
      });

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('Translation response:', data);
      setTranslatedContent(data);
      setShowTranslationModal(true);
    } catch (error: any) {
      console.error('Translation error:', error);
      setTranslationError(error?.message || 'Failed to translate content');
    } finally {
      setTranslationLoading(false);
    }
  };

  // Close translation modal
  const closeTranslationModal = () => {
    setShowTranslationModal(false);
    setTranslatedContent(null);
  };

  const fileType = getFileType(idea?.rawFiles?.[0] || { name: '' })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 w-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10 w-full">
        <div className="w-full max-w-full px-6 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack}
              className="gap-2 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900">{idea.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500">
                  Date: {idea.createdAt.slice(0, 10)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-2 sm:px-6 py-8 max-w-full mx-auto">
        {/* Main Content - now full width */}
        <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'files', label: 'Uploaded Files' },
                { id: 'feedback', label: 'Feedback' },
                { id: 'mentor', label: 'Mentor Review' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 cursor-pointer py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Idea Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{idea.description}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {idea.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {idea.formattedFile && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">Structured Summary</h3>
                        <div className="flex items-center gap-2">
                          <select 
                            className="text-sm border rounded p-1"
                            value={selectedLanguage}
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                          >
                            <option value="">Translate to...</option>
                            {availableLanguages.map(lang => (
                              <option key={lang.value} value={lang.value}>{lang.label}</option>
                            ))}
                          </select>
                          <Button 
                            size="sm" 
                            variant="outline"
                            disabled={!selectedLanguage || translationLoading}
                            onClick={handleTranslate}
                          >
                            {translationLoading ? 'Translating...' : 'Translate'}
                          </Button>
                        </div>
                      </div>
                      {translationError && <p className="text-xs text-red-600 mb-2">{translationError}</p>}
                      <div className="bg-blue-50 p-4 rounded-lg overflow-y-auto">
                        {idea.formattedFile.title && (
                          <p className="text-sm text-blue-900 font-medium">{idea.formattedFile.title}</p>
                        )}
                        {idea.formattedFile.tagline && (
                          <p className="text-sm text-blue-800 italic">{idea.formattedFile.tagline}</p>
                        )}
                        {idea.formattedFile.language && (
                          <p className="text-sm text-blue-700">Language: {idea.formattedFile.language}</p>
                        )}
                        {idea.formattedFile.stage && (
                          <p className="text-sm text-blue-700">Stage: {idea.formattedFile.stage}</p>
                        )}
                        {idea.formattedFile.vision && (
                          <p className="text-sm text-blue-700">Vision: {idea.formattedFile.vision}</p>
                        )}
                        {idea.formattedFile.mission && (
                          <p className="text-sm text-blue-700">Mission: {idea.formattedFile.mission}</p>
                        )}
                        {idea.formattedFile.summary && (
                          <div className="mt-2 text-sm text-blue-900">{idea.formattedFile.summary}</div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                          {idea.formattedFile.problem_and_customer && (
                            <div className="bg-white p-3 rounded">
                              <h4 className="text-xs font-semibold mb-1">Problem & Customers</h4>
                              <div className="text-sm text-blue-900">{idea.formattedFile.problem_and_customer}</div>
                            </div>
                          )}

                          {idea.formattedFile.solution_and_features && (
                            <div className="bg-white p-3 rounded">
                              <h4 className="text-xs font-semibold mb-1">Solution & Features</h4>
                              <div className="text-sm text-blue-900">{idea.formattedFile.solution_and_features}</div>
                            </div>
                          )}

                          {idea.formattedFile.market_and_competitors && (
                            <div className="bg-white p-3 rounded">
                              <h4 className="text-xs font-semibold mb-1">Market & Competitors</h4>
                              <div className="text-sm text-blue-900">{idea.formattedFile.market_and_competitors}</div>
                            </div>
                          )}

                          {idea.formattedFile.channels_and_revenue && (
                            <div className="bg-white p-3 rounded">
                              <h4 className="text-xs font-semibold mb-1">Channels & Revenue</h4>
                              <div className="text-sm text-blue-900">{idea.formattedFile.channels_and_revenue}</div>
                            </div>
                          )}

                          {idea.formattedFile.operations_and_team && (
                            <div className="bg-white p-3 rounded">
                              <h4 className="text-xs font-semibold mb-1">Operations & Team</h4>
                              <div className="text-sm text-blue-900">{idea.formattedFile.operations_and_team}</div>
                            </div>
                          )}

                          {idea.formattedFile.traction_and_funding && (
                            <div className="bg-white p-3 rounded">
                              <h4 className="text-xs font-semibold mb-1">Traction & Funding</h4>
                              <div className="text-sm text-blue-900">{idea.formattedFile.traction_and_funding}</div>
                            </div>
                          )}

                          {idea.formattedFile.risks_and_mitigation && (
                            <div className="bg-white p-3 rounded">
                              <h4 className="text-xs font-semibold mb-1">Risks & Mitigation</h4>
                              <div className="text-sm text-blue-900">{idea.formattedFile.risks_and_mitigation}</div>
                            </div>
                          )}

                          {idea.formattedFile.social_and_environmental_impact && (
                            <div className="bg-white p-3 rounded">
                              <h4 className="text-xs font-semibold mb-1">Social & Environmental Impact</h4>
                              <div className="text-sm text-blue-900">{idea.formattedFile.social_and_environmental_impact}</div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {idea.transcribe && (
                    <ToggleSection title="Transcription">
                      <div className="flex items-center justify-end gap-2 mb-3">
                        <Button size="sm" variant="outline" onClick={() => downloadAsWord('transcript')}>
                          Download as Word
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => downloadAsPDF('transcript')}>
                          Download as PDF
                        </Button>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                        {normalizeTranscribe(idea.transcribe).length ? (
                          normalizeTranscribe(idea.transcribe).map((t, idx) => (
                            <p key={idx} className="text-sm text-gray-700 italic">{t}</p>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500">No transcription available.</p>
                        )}
                      </div>
                    </ToggleSection>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === 'files' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5" />
                    Uploaded Files ({idea.rawFiles.length})
                  </CardTitle>
                  <CardDescription>
                    All files uploaded for this idea submission
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {idea.rawFiles.map((file) => (
                      <div
                        key={file.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleFilePreview(file)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            {file.type && getFileIcon(file.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate" title={file.name}>
                              {file.name}
                            </h4>
                            <p className="text-xs text-gray-400 mt-1">
                              Uploaded {file.uploadDate && file.uploadDate.slice(0, 10)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 cursor-pointer" />
                            </Button>
                          </div>
                        </div>
                        
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'feedback' && (
              <Card>
                <CardContent className="space-y-4 mt-2">
                  {/* Show Get Feedback button when no feedback is present */}
                  {!idea.feedback && (
                    <div className="mb-4">
                      <Button onClick={() => fetchFeedbackForProject()} disabled={feedbackLoading}>
                        {feedbackLoading ? 'Fetching…' : 'Get Feedback'}
                      </Button>
                      {feedbackError && <div className="text-sm text-red-600 mt-2">{feedbackError}</div>}
                    </div>
                  )}
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-600">Strength</div>
                        <div className="text-lg font-medium">{idea.feedback?.current_strength_level || 'Unknown'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Completeness</div>
                        <div className="text-lg font-medium">{idea.feedback?.overall_completeness ?? 0}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Submitted</div>
                        <div className="text-sm">{idea.feedback?.feedback_timestamp ? new Date(idea.feedback.feedback_timestamp).toLocaleString() : '-'}</div>
                      </div>
                    </div>
                  </div>

                  <ToggleSection title="High Priority Improvements">
                    {idea.feedback?.high_priority_improvements?.length ? (
                      idea.feedback.high_priority_improvements.map((imp, idx) => (
                        <div key={idx} className="p-3 bg-white border rounded-lg mb-2">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-semibold">{imp.section}</div>
                            <div className="text-xs text-red-600 uppercase">{imp.priority}</div>
                          </div>
                          {imp.current_issue && <div className="text-sm text-gray-700 mb-2"><strong>Issue:</strong> {imp.current_issue}</div>}
                          {imp.specific_action && <div className="text-sm text-gray-700 mb-2"><strong>Action:</strong> {imp.specific_action}</div>}
                          {imp.why_important && <div className="text-sm text-gray-600"><em>{imp.why_important}</em></div>}
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">No high priority improvements provided.</div>
                    )}
                  </ToggleSection>

                  <ToggleSection title="Medium Priority Improvements">
                    {idea.feedback?.medium_priority_improvements?.length ? (
                      idea.feedback.medium_priority_improvements.map((imp, idx) => (
                        <div key={idx} className="p-3 bg-white border rounded-lg mb-2">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-semibold">{imp.section}</div>
                            <div className="text-xs text-yellow-600 uppercase">{imp.priority}</div>
                          </div>
                          {imp.current_issue && <div className="text-sm text-gray-700 mb-2"><strong>Issue:</strong> {imp.current_issue}</div>}
                          {imp.specific_action && <div className="text-sm text-gray-700 mb-2"><strong>Action:</strong> {imp.specific_action}</div>}
                          {imp.why_important && <div className="text-sm text-gray-600"><em>{imp.why_important}</em></div>}
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">No medium priority improvements provided.</div>
                    )}
                  </ToggleSection>

                  <ToggleSection title="Next Steps This Week">
                    <ul className="list-disc pl-5">
                      {idea.feedback?.next_steps_this_week?.map((step, idx) => (
                        <li key={idx} className="text-sm text-gray-700">{step}</li>
                      ))}
                    </ul>
                  </ToggleSection>

                  <ToggleSection title="Research Assignments">
                    <ul className="list-disc pl-5">
                      {idea.feedback?.research_assignments?.map((assignment, idx) => (
                        <li key={idx} className="text-sm text-gray-700">{assignment}</li>
                      ))}
                    </ul>
                  </ToggleSection>

                  <ToggleSection title="Questions to Answer">
                    <ul className="list-disc pl-5">
                      {idea.feedback?.questions_to_answer?.map((question, idx) => (
                        <li key={idx} className="text-sm text-gray-700">{question}</li>
                      ))}
                    </ul>
                  </ToggleSection>

                  <ToggleSection title="What You're Doing Well">
                    <ul className="list-disc pl-5">
                      {idea.feedback?.what_youre_doing_well?.map((point, idx) => (
                        <li key={idx} className="text-sm text-gray-700">{point}</li>
                      ))}
                    </ul>
                  </ToggleSection>
                </CardContent>
              </Card>
            )}

            {activeTab === 'mentor' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Mentor Review
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600">{idea.mentorRemarks?.Score ?? 0}/10</div>
                      <div className="text-sm text-gray-600">Overall Score</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Badge className={`text-sm ${idea.mentorRemarks?.potentialCategory && getPotentialCategoryColor(idea.mentorRemarks.potentialCategory)}`}>
                        {idea.mentorRemarks?.potentialCategory ?? 'No'} Potential
                      </Badge>
                      <div className="text-sm text-gray-600 mt-1">Assessment</div>
                    </div>
                  </div>

                    {/* Mentor comments (may come as array of strings) */}
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold mb-2">Mentor Comments</h4>
                      <div className="space-y-2">
                        {normalizeMentorComments(idea.comments).length > 0 ? (
                          normalizeMentorComments(idea.comments).map((c) => (
                            <div key={c.id} className="p-3 bg-white border rounded-lg">
                              <div className="text-sm text-gray-800">{c.text}</div>
                              <div className="text-xs text-gray-500 mt-1">Mentor</div>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-gray-500">No mentor comments yet.</div>
                        )}
                      </div>
                    </div>

                  
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar removed for full width layout */}
        </div>

      {/* Translation Modal */}
      {showTranslationModal && translatedContent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
              <h3 className="font-semibold text-lg">
                Translated Content ({translatedContent.language.charAt(0).toUpperCase() + translatedContent.language.slice(1)})
              </h3>
              <Button variant="ghost" size="sm" onClick={closeTranslationModal}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M18 6 6 18"></path><path d="m6 6 12 12"></path>
                </svg>
              </Button>
            </div>
            <div className="p-6 overflow-auto max-h-[calc(90vh-60px)]">
              <div className="space-y-4">
                {Object.entries(translatedContent.translated_output).map(([key, value]) => {
                  // Skip null/undefined values
                  if (value === null || value === undefined) return null;
                  
                  return (
                    <div key={key} className="border-b pb-3">
                      <h4 className="font-medium capitalize text-gray-700 mb-1">{key.replace(/_/g, ' ')}</h4>
                      <div className="whitespace-pre-wrap text-sm">
                        {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end">
              <Button variant="outline" onClick={closeTranslationModal}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}