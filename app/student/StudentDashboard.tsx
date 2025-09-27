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
    User,
    Video,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useRef } from "react"
import axios from "axios"

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
  // projects coming from backend
  const [projects, setProjects] = useState<{
    _id: string
    title: string
    description: string
    tags: string[]
  }[]>([])
  // keep upload/file state for the upload area (previously had dummy data)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [title, setTitle] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [currentView, setCurrentView] = useState<"dashboard" | "upload">("dashboard")
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  
  // fetch projects (extracted so createProject can refresh)
  async function fetchProjects() {
    setLoading(true)
    setError(null)
    const studentId = localStorage.getItem("_id")
    try {
      if (!studentId) {
        setError("Student id not found in localStorage")
        setLoading(false)
        return
      }

      const token = localStorage.getItem("token")
      console.log("Loading projects for studentId:", studentId)
      const res = await axios.get(`http://localhost:8000/api/student/${studentId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      })

      const data = res.data
      console.log("Fetched student data:", data)
      if (res.status !== 200) {
        setError(data?.message || "Failed to fetch projects")
        setLoading(false)
        return
      }

      // expected data.details.projects
      const projectsFromApi = data?.details?.projects || []
      // map to minimal shape
      const mapped = projectsFromApi.map((p: any) => ({ _id: p._id, title: p.title, description: p.description, tags: p.tags || [] }))
      setProjects(mapped)
    } catch (e) {
      setError((e as Error).message || "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

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
  // keep the actual File object for upload
  setSelectedFiles((prev) => [...prev, file])

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

  async function createProject() {
    const studentId = localStorage.getItem("_id")
    const token = localStorage.getItem("token")
    if (!studentId) {
      setError("Student id not found in localStorage")
      return
    }

    if (!title) {
      setError("Title is required")
      return
    }

    try {
      setLoading(true)
      setError(null)
      const form = new FormData()
      form.append("studentId", studentId)
      form.append("title", title)
      form.append("description", description)
      // tags optional - backend expects array
      const tagsArray = tags.split(",").map((t) => t.trim()).filter(Boolean)
      tagsArray.forEach((t) => form.append("tags", t))

      // append files as 'files' so backend can read req.files
      selectedFiles.forEach((f) => form.append("files", f))

      const res = await axios.post("http://localhost:8000/api/student/create", form, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "multipart/form-data",
        },
      })

      if (res.status !== 200 && res.status !== 201) {
        setError(res.data?.message || "Failed to create project")
        setLoading(false)
        return
      }

      // success - refresh projects and clear form
      setTitle("")
      setDescription("")
      setTags("")
      setSelectedFiles([])
      setFiles([])
      await fetchProjects()
    } catch (e) {
      setError((e as Error).message || "An error occurred while creating project")
    } finally {
      setLoading(false)
    }
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
    router.push(`/student/idea-details?projectId=${fileId}`)
  }

  const filteredFiles = projects.filter(
    (file) =>
      file.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
                <Button variant="ghost" size="sm" onClick={() => setCurrentView("dashboard")} className="mr-2 cursor-pointer">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              
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
              <User />
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
              <Button onClick={() => setCurrentView("upload")} size="lg" className="gap-2 border border-black cursor-pointer">
                <Plus className="h-4 w-4" />
                Submit Idea
              </Button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredFiles.map((file) => (
                  <Card
                    key={file._id}
                    className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 flex flex-col cursor-pointer"
                    onClick={() => handleIdeaClick(file._id)}
                  >
                    <CardContent className="p-4 md:p-6 flex-1 flex flex-col">
                      <div className="mb-2">
                        <h3 className="font-semibold text-sm md:text-base leading-tight mb-1" title={file.title}>
                          {file.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-3">{file.description}</p>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-auto">
                        {file.tags.map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
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
                      <Button onClick={() => setCurrentView("upload")} size="lg" className="border border-black cursor-pointer">
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
                {/* Project metadata form */}
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project title" />
                  </div>

                  <div>
                    <Label htmlFor="desc">Description</Label>
                    <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
                  </div>

                  <div>
                    <Label htmlFor="tagsInput">Tags (comma separated)</Label>
                    <Input id="tagsInput" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="ent, startup" />
                  </div>

                </div>
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
                  {/* native file input (hidden) + button trigger */}
                  <input
                    ref={(el) => { fileInputRef.current = el }}
                    id="file-upload"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                  />
                  <Button
                    size="lg"
                    className="cursor-pointer text-white bg-black hover:bg-black/90"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose Files
                  </Button>
                </div>

                {/* Selected files preview */}
                {selectedFiles.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Selected files</h4>
                    <ul className="space-y-1 text-sm">
                      {selectedFiles.map((f, idx) => (
                        <li key={idx} className="flex items-center justify-between">
                          <span className="truncate max-w-xs">{f.name}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-2">
                      <Button variant="ghost" className="cursor-pointer border border-black" size="sm" onClick={() => setSelectedFiles([])}>
                        Clear files
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Button onClick={createProject} disabled={loading} className="bg-black cursor-pointer text-white">
                    {loading ? "Creating..." : "Create Project"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
