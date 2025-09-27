"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, FileText, MessageSquare } from "lucide-react"
import type { Student, Idea } from "@/types/mentor"

interface StudentIdeasViewProps {
  student: Student
  ideas: Idea[]
  onBack: () => void
  onIdeaClick: (idea: Idea) => void
}

export default function StudentIdeasView({ student, ideas, onBack, onIdeaClick }: StudentIdeasViewProps) {
  const getPotentialColor = (category: string) => {
    switch (category) {
      case "High":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Low":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">{student.name}'s Ideas</h1>
          <p className="text-muted-foreground">
            {student.department} • Year {student.year}
          </p>
        </div>

        {/* Ideas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea) => (
            <Card
              key={idea.id}
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
              onClick={() => onIdeaClick(idea)}
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg line-clamp-2">{idea.name}</CardTitle>
                  <Badge className={getPotentialColor(idea.mentorRemarks.potentialCategory)}>
                    {idea.mentorRemarks.potentialCategory}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-3">{idea.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {idea.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {idea.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{idea.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Metrics */}
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {idea.submittedAt.toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium text-foreground">{idea.mentorRemarks.Score}/10</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <FileText className="h-3 w-3 mr-1" />
                      {idea.rawFiles.length} files
                    </div>
                    <div className="flex items-center">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      {idea.comments.length} comments
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {ideas.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground">No ideas submitted yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
