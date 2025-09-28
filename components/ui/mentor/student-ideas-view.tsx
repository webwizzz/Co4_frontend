"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Idea, Student } from "@/types/mentor"

interface StudentIdeasViewProps {
  student: Student
  ideas: Idea[]
  onBack?: () => void
  onIdeaClick: (idea: Idea) => void
}

export default function StudentIdeasView({ student, ideas, onBack, onIdeaClick }: StudentIdeasViewProps) {
  const handleIdeaClick = async (idea: Idea) => {
    try {
      // Make API call to fetch project details
      const response = await fetch(`http://localhost:8000/api/mentor/project/${idea.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch idea details');
      }

      // Get the complete data from the response
      const detailedIdea = await response.json();
      console.log('Fetched detailed idea:', detailedIdea);

      // Proceed with the idea click handler with the complete data
      // Create a merged object that preserves the Idea interface structure
      const mergedIdea: Idea = {
        ...idea,
        name: detailedIdea.title || idea.name,
        description: detailedIdea.description || idea.description,
        tags: detailedIdea.tags || idea.tags,
        overview: detailedIdea.overview,
        llmAnalysis: detailedIdea.llmAnalysis,
        feasibilityAnalysis: detailedIdea.feasibility
        // Add any other fields from detailedIdea that should be included
      };
      
      onIdeaClick(mergedIdea);
    } catch (error) {
      console.error("Error fetching idea details:", error);
    }
  };

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
              onClick={() => handleIdeaClick(idea)}
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-lg line-clamp-2">{idea.name}</CardTitle>
                  {idea.mentorRemarks && idea.mentorRemarks.potentialCategory && (
                    <Badge className={getPotentialColor(idea.mentorRemarks.potentialCategory)}>
                      {idea.mentorRemarks.potentialCategory}
                    </Badge>
                  )}
                </div>
                <CardDescription className="line-clamp-3">{idea.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {(idea.tags || []).slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {(idea.tags || []).length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{(idea.tags || []).length - 3}
                      </Badge>
                    )}
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
