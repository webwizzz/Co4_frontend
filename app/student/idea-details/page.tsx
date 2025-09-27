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
import { useRouter } from "next/navigation"
import { useState } from "react"

interface FileSchema {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadDate: Date
}

interface IdeaData {
  id: string
  name: string
  description: string
  tags: string[]
  rawFiles: FileSchema[]
  formattedFile: {
    summary?: string
    keyPoints?: string[]
    processedAt?: Date
  }
  feedback: {
    likes: number
    views: number
    shares: number
  }
  comments: string[]
  transcribe: {
    text?: string
    confidence?: number
    language?: string
  }
  mentorRemarks: {
    Score: number
    potentialCategory: 'High' | 'Medium' | 'Low'
    feedback?: string
    reviewedAt?: Date
  }
  submittedAt: Date
  status: 'Under Review' | 'Approved' | 'Needs Revision' | 'Rejected'
}

// Dummy data for the idea
const dummyIdeaData: IdeaData = {
  id: "idea-001",
  name: "AI-Powered Study Assistant for Students",
  description: "An innovative mobile application that uses artificial intelligence to help students organize their study materials, create personalized learning schedules, and provide instant answers to academic questions. The app integrates with existing learning management systems and offers voice-to-text note-taking capabilities.",
  tags: ["AI", "Education", "Mobile App", "Machine Learning", "Study Tools"],
  rawFiles: [
    {
      id: "file-001",
      name: "business-plan-presentation.pdf",
      type: "application/pdf",
      size: 2048576,
      url: "https://res.cloudinary.com/demo/business-plan-presentation.pdf",
      uploadDate: new Date('2024-01-15')
    },
    {
      id: "file-002", 
      name: "market-research-video.mp4",
      type: "video/mp4",
      size: 15728640,
      url: "https://res.cloudinary.com/demo/market-research-video.mp4",
      uploadDate: new Date('2024-01-16')
    },
    {
      id: "file-003",
      name: "prototype-demo.mov",
      type: "video/quicktime", 
      size: 8388608,
      url: "https://res.cloudinary.com/demo/prototype-demo.mov",
      uploadDate: new Date('2024-01-17')
    },
    {
      id: "file-004",
      name: "user-interviews-audio.mp3",
      type: "audio/mpeg",
      size: 5242880,
      url: "https://res.cloudinary.com/demo/user-interviews-audio.mp3",
      uploadDate: new Date('2024-01-18')
    },
    {
      id: "file-005",
      name: "handwritten-notes.jpg",
      type: "image/jpeg",
      size: 1024000,
      url: "https://res.cloudinary.com/demo/handwritten-notes.jpg",
      uploadDate: new Date('2024-01-19')
    }
  ],
  formattedFile: {
    summary: "A comprehensive business plan for an AI-powered study assistant targeting college students. The solution addresses key pain points in academic organization and learning efficiency.",
    keyPoints: [
      "Market size: $8.2B educational technology market",
      "Target audience: 18-25 year old college students",
      "Revenue model: Freemium with premium features",
      "Key differentiator: Voice-to-text and AI personalization"
    ],
    processedAt: new Date('2024-01-20')
  },
  feedback: {
    likes: 47,
    views: 234,
    shares: 12
  },
  comments: [
    "This is a brilliant idea! I would definitely use this app during my studies.",
    "Have you considered integration with popular note-taking apps like Notion?",
    "The AI component sounds promising. What's your approach to data privacy?",
    "Great presentation! The market research seems thorough."
  ],
  transcribe: {
    text: "So in our user interviews, we found that 87% of students struggle with organizing their study materials across different subjects. They often lose track of important notes and deadlines. Our AI assistant would solve this by automatically categorizing content and sending smart reminders.",
    confidence: 0.94,
    language: "en-US"
  },
  mentorRemarks: {
    Score: 8.5,
    potentialCategory: 'High',
    feedback: "Excellent market research and clear value proposition. The team shows strong technical understanding. Consider focusing on MVP features first before expanding to advanced AI capabilities.",
    reviewedAt: new Date('2024-01-25')
  },
  submittedAt: new Date('2024-01-14'),
  status: 'Approved'
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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Approved': return 'bg-green-100 text-green-800 border-green-200'
    case 'Under Review': return 'bg-blue-100 text-blue-800 border-blue-200'
    case 'Needs Revision': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    case 'Rejected': return 'bg-red-100 text-red-800 border-red-200'
    default: return 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export default function IdeaDetails() {
  const router = useRouter()
  const [idea] = useState<IdeaData>(dummyIdeaData)
  const [activeTab, setActiveTab] = useState<'overview' | 'files' | 'feedback' | 'mentor'>('overview')
  const [newComment, setNewComment] = useState('')

  const handleBack = () => {
    router.back()
  }

  const handleFilePreview = (file: FileSchema) => {
    // Open file in new tab or preview modal
    window.open(file.url, '_blank')
  }

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
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900">{idea.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`text-xs ${getStatusColor(idea.status)}`}>
                  {idea.status}
                </Badge>
                <span className="text-sm text-gray-500">
                  Submitted {idea.submittedAt.toLocaleDateString()}
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
                { id: 'feedback', label: 'Community Feedback' },
                { id: 'mentor', label: 'Mentor Review' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
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

                  {idea.formattedFile.summary && (
                    <div>
                      <h3 className="font-semibold mb-2">AI-Generated Summary</h3>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-900">{idea.formattedFile.summary}</p>
                        {idea.formattedFile.keyPoints && (
                          <div className="mt-3">
                            <h4 className="font-medium text-blue-900 mb-2">Key Points:</h4>
                            <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                              {idea.formattedFile.keyPoints.map((point, index) => (
                                <li key={index}>{point}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {idea.transcribe.text && (
                    <div>
                      <h3 className="font-semibold mb-2">Audio Transcription</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-700 italic">"{idea.transcribe.text}"</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>Confidence: {Math.round((idea.transcribe.confidence || 0) * 100)}%</span>
                          <span>Language: {idea.transcribe.language}</span>
                        </div>
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
                            <p className="text-xs text-gray-500 mt-1">
                              {formatFileSize(file.size)} • {file.type}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Uploaded {file.uploadDate.toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Preview for different file types */}
                        {file.type.startsWith('image/') && (
                          <div className="mt-3">
                            <img 
                              src={file.url} 
                              alt={file.name}
                              className="w-full h-32 object-cover rounded-md"
                            />
                          </div>
                        )}
                        
                        {file.type.startsWith('video/') && (
                          <div className="mt-3">
                            <div className="w-full h-32 bg-gray-100 rounded-md flex items-center justify-center">
                              <Play className="h-8 w-8 text-gray-400" />
                            </div>
                          </div>
                        )}
                        
                        {file.type.startsWith('audio/') && (
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
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Community Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{idea.feedback.likes}</div>
                      <div className="text-sm text-gray-500">Likes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{idea.feedback.views}</div>
                      <div className="text-sm text-gray-500">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{idea.feedback.shares}</div>
                      <div className="text-sm text-gray-500">Shares</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Comments ({idea.comments.length})</h3>
                    <div className="space-y-3">
                      {idea.comments.map((comment, index) => (
                        <div key={index} className="flex gap-3 p-3 bg-white border rounded-lg">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>U{index + 1}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">Student {index + 1}</span>
                              <span className="text-xs text-gray-500">2 hours ago</span>
                            </div>
                            <p className="text-sm text-gray-700">{comment}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4">
                      <Textarea
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="mb-2"
                      />
                      <Button size="sm">Post Comment</Button>
                    </div>
                  </div>
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

                  {idea.mentorRemarks.feedback && (
                    <div>
                      <h3 className="font-semibold mb-2">Mentor Feedback</h3>
                      <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
                        <p className="text-sm text-amber-800">{idea.mentorRemarks.feedback}</p>
                        {idea.mentorRemarks.reviewedAt && (
                          <p className="text-xs text-amber-600 mt-2">
                            Reviewed on {idea.mentorRemarks.reviewedAt.toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">Next Steps</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Schedule a follow-up meeting with your mentor</li>
                      <li>• Work on the suggested improvements</li>
                      <li>• Prepare for the next review cycle</li>
                      <li>• Consider applying for startup incubation programs</li>
                    </ul>
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
                  <span className="text-sm text-gray-600">Total Views</span>
                  <span className="font-semibold">{idea.feedback.views}</span>
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

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Idea
                </Button>
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
                <Button className="w-full" variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Mentor
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="text-sm">
                      <div className="font-medium">Approved</div>
                      <div className="text-gray-500">{idea.mentorRemarks.reviewedAt?.toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="text-sm">
                      <div className="font-medium">Under Review</div>
                      <div className="text-gray-500">{idea.formattedFile.processedAt?.toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="text-sm">
                      <div className="font-medium">Submitted</div>
                      <div className="text-gray-500">{idea.submittedAt.toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}