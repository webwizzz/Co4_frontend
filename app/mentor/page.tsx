"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import MentorHeader from "@/components/ui/mentor/header"
import IdeaAnalysisView from "@/components/ui/mentor/idea-analysis-view"
import StudentIdeasView from "@/components/ui/mentor/student-ideas-view"
import type { Idea, Student } from "@/types/mentor"
import { useEffect, useState } from "react"

// Define the ViewState type
type ViewState = "dashboard" | "student-ideas" | "idea-analysis"

export default function MentorDashboard() {
  const [currentView, setCurrentView] = useState<ViewState>("dashboard")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [studentIdeas, setStudentIdeas] = useState<Idea[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true)
      try {
        const mentorId = localStorage.getItem("_id")
        if (!mentorId) {
          console.error("Mentor ID not found in localStorage")
          setLoading(false)
          return
        }

        const response = await fetch(`http://localhost:8000/api/mentor/${mentorId}/students`)
        const data = await response.json()

        if (response.ok) {
          setStudents(data.students.map((student: any) => ({
            id: student.studentId._id,
            name: student.studentId.name,
            email: student.studentId.email,
            ideasCount: student.projects.length,
          })))
        } else {
          console.error("Failed to fetch students:", data.message)
        }
      } catch (error) {
        console.error("Error fetching students:", error)
      }
      setLoading(false)
    }

    fetchStudents()
  }, [])

  const handleStudentClick = async (student: Student) => {
    setSelectedStudent(student)
    setCurrentView("student-ideas")
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:8000/api/student/${student.id}`)
      const data = await response.json()
      if (response.ok) {
        setStudentIdeas(data.details.projects.map((project: any) => ({
          id: project._id,
          studentId: student.id,
          name: project.title,
          description: project.description,
          tags: project.tags || [],
          rawFiles: project.uploadedFiles?.map((file: any) => ({
            id: file._id,
            name: file.name,
            type: file.type,
            size: file.size,
            url: file.url
          })) || [],
          formattedFile: project.formatedFile || {},
          feedback: project.feedback || {},
          comments: project.comments || [],
          transcribe: project.transcribe || {},
          mentorRemarks: project.mentorRemarks || {
            Score: 0,
            potentialCategory: "Medium"
          },
          createdAt: project.createdAt || new Date().toISOString(),
          overview: project.overview ? {
            title: project.overview.title || project.title,
            description: project.overview.description || project.description,
            tags: project.overview.tags || project.tags || [],
            uploadedFiles: project.overview.uploadedFiles || project.uploadedFiles || [],
            transcribe: project.overview.transcribe || [],
            formatedFile: project.overview.formatedFile || project.formatedFile || {}
          } : undefined,
          llmAnalysis: project.llmAnalysis,
          marketAnalysis: project.marketAnalysis,
          feasibilityAnalysis: project.feasibilityAnalysis
        })))
      } else {
        console.error("Failed to fetch student ideas:", data.message)
      }
    } catch (error) {
      console.error("Error fetching student ideas:", error)
    }
    setLoading(false)
  }

  const handleIdeaClick = (idea: Idea) => {
    setSelectedIdea(idea)
    setCurrentView("idea-analysis")
  }

  const handleBackToDashboard = () => {
    setCurrentView("dashboard")
    setSelectedStudent(null)
    setSelectedIdea(null)
    setStudentIdeas([])
  }

  const handleBackToStudentIdeas = () => {
    setCurrentView("student-ideas")
    setSelectedIdea(null)
  }

  // Always render the header, and then the current view below it
  // Navigation logic for header
  let onBack, onNext, canGoBack = false, canGoNext = false
  if (currentView === "idea-analysis") {
    onBack = handleBackToStudentIdeas
    canGoBack = true
  } else if (currentView === "student-ideas") {
    onBack = handleBackToDashboard
    canGoBack = true
    if (studentIdeas.length > 0) {
      onNext = () => handleIdeaClick(studentIdeas[0])
      canGoNext = true
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <MentorHeader onBack={onBack} onNext={onNext} canGoBack={canGoBack} canGoNext={canGoNext} />
      <div className="max-w-7xl mx-auto p-6">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : currentView === "idea-analysis" && selectedIdea ? (
          <IdeaAnalysisView idea={selectedIdea} onBack={handleBackToStudentIdeas} />
        ) : currentView === "student-ideas" && selectedStudent ? (
          <StudentIdeasView
            student={selectedStudent}
            ideas={studentIdeas}
            onBack={handleBackToDashboard}
            onIdeaClick={handleIdeaClick}
          />
        ) : (
          <>
            {/* Students Grid */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-6">Your Students</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {students.map((student) => (
                  <Card
                    key={student.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                    onClick={() => handleStudentClick(student)}
                  >
                    <CardHeader className="pb-0">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                          <AvatarFallback>
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg truncate">{student.name}</CardTitle>
                          <CardDescription className="text-sm">{student.email}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <div className="flex gap-2 text-sm">
                          <span className="text-muted-foreground">Ideas:</span>
                          <Badge variant="secondary">{student.ideasCount}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
