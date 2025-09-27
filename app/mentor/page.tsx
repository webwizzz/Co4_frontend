"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import IdeaAnalysisView from "@/components/ui/mentor/idea-analysis-view"
import StudentIdeasView from "@/components/ui/mentor/student-ideas-view"
import { mockIdeas, mockMentor } from "@/lib/mock-data"
import type { Idea, Student } from "@/types/mentor"
import { useState } from "react"


type ViewState = "dashboard" | "student-ideas" | "idea-analysis"

export default function MentorDashboard() {
  const [currentView, setCurrentView] = useState<ViewState>("dashboard")
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null)

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student)
    setCurrentView("student-ideas")
  }

  const handleIdeaClick = (idea: Idea) => {
    setSelectedIdea(idea)
    setCurrentView("idea-analysis")
  }

  const handleBackToDashboard = () => {
    setCurrentView("dashboard")
    setSelectedStudent(null)
    setSelectedIdea(null)
  }

  const handleBackToStudentIdeas = () => {
    setCurrentView("student-ideas")
    setSelectedIdea(null)
  }

  if (currentView === "idea-analysis" && selectedIdea) {
    return <IdeaAnalysisView idea={selectedIdea} onBack={handleBackToStudentIdeas} />
  }

  if (currentView === "student-ideas" && selectedStudent) {
    return (
      <StudentIdeasView
        student={selectedStudent}
        ideas={mockIdeas.filter((idea) => idea.studentId === selectedStudent.id)}
        onBack={handleBackToDashboard}
        onIdeaClick={handleIdeaClick}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Mentor Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {mockMentor.name}</p>
        </div>

        {/* Students Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Your Students</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mockMentor.students.map((student) => (
              <Card
                key={student.id}
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => handleStudentClick(student)}
              >
                <CardHeader className="pb-3">
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
                      <CardDescription className="text-sm">{student.department}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Year:</span>
                      <span className="font-medium">{student.year}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Ideas:</span>
                      <Badge variant="secondary">{student.ideasCount}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
