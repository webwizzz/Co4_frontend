"use client"

import type React from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import {
    Archive,
    ArrowLeft,
    BookOpen,
    Calendar,
    Download,
    Eye,
    FileText,
    ImageIcon,
    MoreVertical,
    Music,
    Plus,
    Search,
    Share2,
    Trash2,
    Upload,
    Video,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface UploadedFile {
  id: string
  name: string
  type: string
  size: number
  uploadDate: Date
  category: string
  description?: string
  tags: string[]
  status: "processing" | "completed" | "failed"
  progress?: number
}

const fileTypeIcons = {
  pdf: FileText,
  doc: FileText,
  docx: FileText,
  txt: FileText,
  jpg: ImageIcon,
  jpeg: ImageIcon,
  png: ImageIcon,
  gif: ImageIcon,
  svg: ImageIcon,
  mp3: Music,
  wav: Music,
  m4a: Music,
  mp4: Video,
  avi: Video,
  mov: Video,
  zip: Archive,
  rar: Archive,
  "7z": Archive,
}

export function StudentDashboard() {
  const router = useRouter()
  const [files, setFiles] = useState<UploadedFile[]>([
    {
      id: "1",
      name: "EcoTech_Startup_Pitch.pdf",
      type: "pdf",
      size: 2048000,
      uploadDate: new Date("2024-01-15"),
      category: "startup",
      description: "Revolutionary green technology startup idea for sustainable energy solutions",
      tags: ["startup", "green-tech", "sustainability", "energy"],
      status: "completed",
    },
    {
      id: "2",
      name: "Business_Model_Presentation.mp3",
      type: "mp3",
      size: 15728640,
      uploadDate: new Date("2024-01-14"),
      category: "startup",
      description: "Audio pitch for a peer-to-peer learning platform connecting students globally",
      tags: ["edtech", "platform", "peer-learning", "global"],
      status: "completed",
    },
    {
      id: "3",
      name: "App_Wireframe_Design.jpg",
      type: "jpg",
      size: 1024000,
      uploadDate: new Date("2024-01-13"),
      category: "startup",
      description: "Mobile app concept for local food waste reduction and community sharing",
      tags: ["mobile-app", "food-waste", "community", "social-impact"],
      status: "processing",
      progress: 75,
    },
    {
      id: "4",
      name: "AI_Healthcare_Proposal.docx",
      type: "docx",
      size: 3072000,
      uploadDate: new Date("2024-01-12"),
      category: "startup",
      description: "AI-powered healthcare assistant for remote patient monitoring and diagnosis",
      tags: ["ai", "healthcare", "remote-monitoring", "diagnosis"],
      status: "completed",
    },
  ])

  const [dragActive, setDragActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [currentView, setCurrentView] = useState<"dashboard" | "upload">("dashboard")

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFiles = (fileList: FileList) => {
    Array.from(fileList).forEach((file) => {
      const newFile: UploadedFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.name.split(".").pop()?.toLowerCase() || "unknown",
        size: file.size,
        uploadDate: new Date(),
        category: "startup",
        description: description || `Uploaded ${file.name}`,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        status: "processing",
        progress: 0,
      }

      setFiles((prev) => [newFile, ...prev])

      // Simulate upload progress
      const interval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) => {
            if (f.id === newFile.id && f.progress !== undefined && f.progress < 100) {
              const newProgress = f.progress + Math.random() * 20
              if (newProgress >= 100) {
                clearInterval(interval)
                return { ...f, progress: 100, status: "completed" }
              }
              return { ...f, progress: newProgress }
            }
            return f
          }),
        )
      }, 500)
    })

    // Reset form
    setDescription("")
    setTags("")
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type: string) => {
    const IconComponent = fileTypeIcons[type as keyof typeof fileTypeIcons] || FileText
    return <IconComponent className="h-4 w-4" />
  }

  const handleIdeaClick = (fileId: string) => {
    router.push('/student/idea-details')
  }

  const filteredFiles = files.filter(
    (file) =>
      file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {currentView === "upload" && (
                <Button variant="ghost" size="sm" onClick={() => setCurrentView("dashboard")} className="mr-2">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Upload className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-balance">Student Ideas Hub</h1>
                <p className="text-sm text-muted-foreground">
                  {currentView === "dashboard"
                    ? "Discover and explore student ideas"
                    : "Upload and share your creative content"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {currentView === "dashboard" && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search ideas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              )}
              <Avatar>
                <AvatarImage src="/student-avatar.png" />
                <AvatarFallback>ST</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {currentView === "dashboard" ? (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-balance">Entrepreneurship & Startup Ideas</h2>
                <p className="text-muted-foreground text-pretty">
                  Discover innovative business concepts and entrepreneurial ventures from students
                </p>
              </div>
              <Button onClick={() => setCurrentView("upload")} size="lg" className="gap-2">
                <Plus className="h-4 w-4" />
                Submit Idea
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredFiles.map((file) => (
                  <Card
                    key={file.id}
                    className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 flex flex-col cursor-pointer"
                    onClick={() => handleIdeaClick(file.id)}
                  >
                    <CardContent className="p-4 md:p-6 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="p-2 rounded-lg bg-muted flex-shrink-0">{getFileIcon(file.type)}</div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm md:text-base leading-tight mb-1" title={file.name}>
                              {file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ")}
                            </h3>
                            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 flex-shrink-0"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="h-4 w-4 mr-2" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {file.status === "processing" && file.progress !== undefined && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="text-muted-foreground">Processing...</span>
                            <span className="text-muted-foreground">{Math.round(file.progress)}%</span>
                          </div>
                          <Progress value={file.progress} className="h-2" />
                        </div>
                      )}

                      {file.description && (
                        <div className="flex-1 mb-3">
                          <p className="text-xs md:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                            {file.description}
                          </p>
                        </div>
                      )}

                      <div className="flex flex-col gap-2 mt-auto">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{file.uploadDate.toLocaleDateString()}</span>
                          </div>
                        </div>

                        {file.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {file.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {file.tags.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{file.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredFiles.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No ideas found</h3>
                    <p className="text-muted-foreground mb-6">
                      {searchQuery ? "Try adjusting your search terms" : "Be the first to share your creative idea!"}
                    </p>
                    {!searchQuery && (
                      <Button onClick={() => setCurrentView("upload")} size="lg">
                        Submit Your First Idea
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-balance mb-4">Submit Your Idea</h2>
              <p className="text-lg text-muted-foreground text-pretty">
                Share your creativity in any format - documents, audio, images, handwritten notes, or diagrams
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-balance">Upload Your Content</CardTitle>
                <CardDescription className="text-pretty">
                  Express your ideas in any format you prefer. All file types are welcome.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                    dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <Upload className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                  <h3 className="text-xl font-semibold mb-3">Drop files here or click to browse</h3>
                  <p className="text-muted-foreground mb-6">
                    Supports: PDF, DOC, TXT, JPG, PNG, MP3, MP4, ZIP and more
                  </p>
                  <Input
                    type="file"
                    multiple
                    className="hidden"
                    id="file-upload"
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                  />
                  <Label htmlFor="file-upload">
                    <Button size="lg" className="cursor-pointer">
                      Choose Files
                    </Button>
                  </Label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your idea or content..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (Optional)</Label>
                    <Input
                      id="tags"
                      placeholder="startup, innovation, business-idea"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Separate tags with commas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
