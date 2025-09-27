"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import {
    Archive,
    ArrowLeft,
    Download,
    Eye,
    FileText,
    FolderOpen,
    ImageIcon,
    MessageCircle,
    Music,
    Play,
    Share2,
    Star,
    Tag,
    Video,
    Volume2
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
  feedback_timestamp?: string
  current_strength_level?: string
  overall_completeness?: number
  high_priority_improvements?: FeedbackImprovement[]
  medium_priority_improvements?: FeedbackImprovement[]
  low_priority_improvements?: FeedbackImprovement[]
  next_steps_this_week?: string[]
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

        // The API may either return the project directly, or nest it inside `details` / `details.projects`.
        let project: any = null

        if (Array.isArray(data?.details)) {
          // look for the project in details[].projects or details[] entries
          for (const d of data.details) {
            if (d._id === projectId) {
              project = d
              break
            }
            if (Array.isArray(d?.projects)) {
              const found = d.projects.find((p: any) => p._id === projectId || p.id === projectId)
              if (found) {
                project = found
                break
              }
            }
          }
        }

        // If the API returned the project object directly
        if (!project) {
          if (data?._id === projectId || data?.id === projectId) project = data
        }

        // As a fallback, if nothing matched, but `data` contains reasonable fields, use it
        if (!project && (data?.title || data?.description || data?.rawFiles)) {
          project = data
        }

        if (!project) {
          console.warn('Could not find project in response, falling back to dummy')
          setIdea(dummyIdeaData)
          return
        }

        // Map API shape to IdeaData
        const mapped: IdeaData = {
          id: project._id || project.id || String(projectId),
          name: project.title || project.name || 'Untitled',
          description: project.description || project.desc || '',
          tags: project.tags || project.tag || [],
          rawFiles: Array.isArray(project.rawFiles)
            ? project.rawFiles.map((f: any) => ({
                id: f._id || f.publicId || f.name,
                name: f.name || (f.url && f.url.split('/').pop()) || 'file',
                type: f.type || (f.name ? f.name.split('.').pop() : undefined) || undefined,
                size: f.size || undefined,
                url: f.url || f.path || '',
                uploadDate: f.uploadDate || f.createdAt || f.upload_date || undefined,
              }))
            : [],
          formattedFile: project.formattedFile || null,
          feedback: project.feedback || null,
          comments: project.comments || [],
          transcribe: Array.isArray(project.transcribe) ? project.transcribe : (project.transcribe ? [project.transcribe] : []),
          mentorRemarks: project.mentorRemarks || { Score: 0, potentialCategory: 'Low' },
          createdAt: project.createdAt || project.created_at || new Date().toISOString(),
        }

        setIdea(mapped)
      } catch (e) {
        console.error(e)
        setIdea(dummyIdeaData)
      }
    }

    fetchProject()
  }, [projectId])

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

  const fileType = getFileType(idea.rawFiles[0])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
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

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
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
                      <h3 className="font-semibold mb-2">AI-Generated Summary</h3>
                      <div className="bg-blue-50 p-4 rounded-lg overflow-y-auto">
                        {idea.formattedFile.title && (
                          <p className="text-sm text-blue-900 font-medium">{idea.formattedFile.title}</p>
                        )}
                        {idea.formattedFile.tagline && (
                          <p className="text-sm text-blue-800 italic">{idea.formattedFile.tagline}</p>
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
                        </div>
                      </div>
                    </div>
                  )}

                  {idea.transcribe && (
                    <div>
                      <h3 className="font-semibold mb-2">Transcription</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-700 italic">"{idea.transcribe }</p>
                      </div>
                    </div>
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
                            {getFileIcon(file.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm truncate" title={file.name}>
                              {file.name}
                            </h4>
                            <p className="text-xs text-gray-400 mt-1">
                              Uploaded {file.uploadDate.slice(0, 10)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 cursor-pointer" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Preview for different file types */}
                        {fileType === 'image' && (
                          <div className="mt-3">
                            <img 
                              src={file.url} 
                              alt={file.name}
                              className="w-full h-32 object-cover rounded-md"
                            />
                          </div>
                        )}

                        {fileType === 'video' && (
                          <div className="mt-3">
                            <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center">
                              <Play className="h-8 w-8 text-gray-400" />
                            </div>
                          </div>
                        )}
                        
                        {fileType === 'audio' && (
                          <div className="mt-3">
                            <div className="w-full h-16 bg-gray-100 rounded-md flex items-center justify-center">
                              <Volume2 className="h-6 w-6 text-gray-400" />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'feedback' && (
              <Card>
                <CardContent className="space-y-4 mt-2">
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
                      <div className="text-3xl font-bold text-blue-600">{idea.mentorRemarks.Score}/10</div>
                      <div className="text-sm text-gray-600">Overall Score</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <Badge className={`text-sm ${getPotentialCategoryColor(idea.mentorRemarks.potentialCategory)}`}>
                        {idea.mentorRemarks.potentialCategory} Potential
                      </Badge>
                      <div className="text-sm text-gray-600 mt-1">Assessment</div>
                    </div>
                  </div>

                  
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Files Uploaded</span>
                  <span className="font-semibold">{idea.rawFiles.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Comments</span>
                  <span className="font-semibold">{idea.comments.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Mentor Score</span>
                  <span className="font-semibold text-blue-600">{idea.mentorRemarks.Score}/10</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}