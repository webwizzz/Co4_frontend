"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import axios from "axios"
import {
  Archive,
  ArrowLeft,
  BookOpen,
  FileText,
  ImageIcon,
  Music,
  Plus,
  Search,
  TrendingUp,
  Upload,
  User,
  Video
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

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
  // Logout handler
  const handleLogout = () => {
    localStorage.clear()
    router.push("/login")
  }
  const router = useRouter()
  // projects coming from backend
  const [projects, setProjects] = useState<
    {
      _id: string
      title: string
      description: string
      tags: string[]
    }[]
  >([])
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
      const mapped = projectsFromApi.map((p: any) => ({
        _id: p._id,
        title: p.title,
        description: p.description,
        tags: p.tags || [],
      }))
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
      const tagsArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
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
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {currentView === "upload" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentView("dashboard")}
                  className="mr-2 cursor-pointer"
                >
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
                <div className="relative hidden sm:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search ideas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-48 lg:w-64"
                  />
                </div>
              )}
              <User className="h-5 w-5" />
              <Button variant="outline" size="sm" className="ml-2 bg-transparent" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
          {/* Mobile search */}
          {currentView === "dashboard" && (
            <div className="mt-4 sm:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search ideas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6 lg:py-8">
        {currentView === "dashboard" ? (
          <div className="space-y-6 lg:space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
              {/* Main hero card - spans 3 columns on large screens */}
              <Card className="lg:col-span-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-6 lg:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="space-y-2">
                      <h2 className="text-2xl lg:text-3xl font-bold text-balance">Entrepreneurship & Startup Ideas</h2>
                      <p className="text-muted-foreground text-pretty max-w-2xl">
                        Discover innovative business concepts and entrepreneurial ventures from students across the
                        globe
                      </p>
                    </div>
                    <Button
                      onClick={() => setCurrentView("upload")}
                      size="lg"
                      className="gap-2 bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                      Submit Idea
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Stats card - spans 1 column */}
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
                <CardContent className="p-6 text-center">
                  <div className="space-y-2">
                    <TrendingUp className="h-8 w-8 text-green-600 mx-auto" />
                    <div className="text-2xl font-bold text-green-700 dark:text-green-400">{filteredFiles.length}</div>
                    <p className="text-sm text-green-600 dark:text-green-500 font-medium">Active Ideas</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Removed Innovation, Focus, Impact, Driven, Community, Powered, Learning, Focused cards as requested */}

            <div className="space-y-4">
              {filteredFiles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6 auto-rows-fr">
                  {filteredFiles.map((file, index) => {
                    const isLarge = index % 7 === 0 && index > 0 // Every 7th card (except first) is large
                    const isMedium = index % 5 === 0 && !isLarge // Every 5th card is medium

                    return (
                      <Card
                        key={file._id}
                        className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 flex flex-col cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 ${
                          isLarge
                            ? "sm:col-span-2 lg:col-span-2 xl:col-span-2 sm:row-span-2"
                            : isMedium
                              ? "lg:col-span-2 xl:col-span-1"
                              : ""
                        }`}
                        onClick={() => handleIdeaClick(file._id)}
                      >
                        <CardContent className={`p-4 lg:p-6 flex-1 flex flex-col ${isLarge ? "lg:p-8" : ""}`}>
                          <div className="mb-3">
                            <h3
                              className={`font-semibold leading-tight mb-2 text-balance ${
                                isLarge ? "text-lg lg:text-xl" : "text-sm lg:text-base"
                              }`}
                              title={file.title}
                            >
                              {file.title}
                            </h3>
                            <p
                              className={`text-muted-foreground text-pretty ${
                                isLarge ? "text-sm lg:text-base line-clamp-4" : "text-xs lg:text-sm line-clamp-3"
                              }`}
                            >
                              {file.description}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-auto">
                            {file.tags.slice(0, isLarge ? 6 : 3).map((tag, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className={`${isLarge ? "text-xs lg:text-sm" : "text-xs"}`}
                              >
                                {tag}
                              </Badge>
                            ))}
                            {file.tags.length > (isLarge ? 6 : 3) && (
                              <Badge variant="outline" className="text-xs">
                                +{file.tags.length - (isLarge ? 6 : 3)}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <Card className="lg:col-span-full">
                  <CardContent className="p-12 lg:p-16 text-center">
                    <BookOpen className="h-16 w-16 lg:h-20 lg:w-20 text-muted-foreground mx-auto mb-6" />
                    <h3 className="text-xl lg:text-2xl font-semibold mb-3">No ideas found</h3>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                      {searchQuery
                        ? "Try adjusting your search terms to find what you're looking for"
                        : "Be the first to share your creative idea and inspire others!"}
                    </p>
                    {!searchQuery && (
                      <Button
                        onClick={() => setCurrentView("upload")}
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                      >
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
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Project title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="desc">Description</Label>
                    <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
                  </div>

                  <div>
                    <Label htmlFor="tagsInput">Tags (comma separated)</Label>
                    <Input
                      id="tagsInput"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="ent, startup"
                    />
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
                    ref={(el) => {
                      fileInputRef.current = el
                    }}
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
                      <Button
                        variant="ghost"
                        className="cursor-pointer border border-black"
                        size="sm"
                        onClick={() => setSelectedFiles([])}
                      >
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
