"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import FeasibilityAnalysisView from "@/components/ui/mentor/feasibility-analysis-view"
import LLMAnalysisView from "@/components/ui/mentor/llm-analysis-view"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Comment, Idea } from "@/types/mentor"
import { AlertTriangle, ArrowLeft, CheckCircle, TrendingDown, TrendingUp } from "lucide-react"

interface IdeaAnalysisViewProps {
  idea: Idea
  onBack: () => void
}

export default function IdeaAnalysisView({ idea, onBack }: IdeaAnalysisViewProps) {
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

  const marketAnalysis = idea.marketAnalysis

  const handleAddComment = (text: string, isVisible: boolean) => {
    const newComment: Comment = {
      id: `c${Date.now()}`,
      text,
      author: "Dr. Sarah Thompson", // In real app, get from auth context
      authorRole: "mentor",
      timestamp: new Date(),
      isVisible,
    }

    // In real app, this would make an API call to save the comment
    console.log("[v0] Adding comment:", newComment)

    // For demo purposes, we'll just log it
    // In production, you'd update the idea's comments array
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Ideas
          </Button>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{idea.name}</h1>
              <p className="text-muted-foreground text-lg">{idea.description}</p>
            </div>
            <Badge className={getPotentialColor(idea.mentorRemarks.potentialCategory)}>
              {idea.mentorRemarks.potentialCategory} Potential
            </Badge>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {idea.tags.map((tag, index) => (
              <Badge key={index} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Analysis Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="llm-analysis">LLM Analysis</TabsTrigger>
        <TabsTrigger value="feasibility">Feasibility Analysis</TabsTrigger>
        <TabsTrigger value="mentor-comment">Mentor Comment</TabsTrigger>
      </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Idea Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-muted-foreground">{idea.description}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Submission Date</h4>
                    <p className="text-muted-foreground">{idea.submittedAt.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Files Attached</h4>
                    <p className="text-muted-foreground">{idea.rawFiles.length} files</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Innovation Level</span>
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="font-medium">High</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Technical Complexity</span>
                    <div className="flex items-center">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="font-medium">Medium</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Market Readiness</span>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      <span className="font-medium">Ready</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Resource Requirements</span>
                    <div className="flex items-center">
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      <span className="font-medium">High</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="llm-analysis" className="space-y-6">
            {idea.llmAnalysis && <LLMAnalysisView analysis={idea.llmAnalysis} />}
          </TabsContent>

          <TabsContent value="feasibility" className="space-y-6">
            {idea.feasibilityAnalysis && <FeasibilityAnalysisView analysis={idea.feasibilityAnalysis} />}
          </TabsContent>
          <TabsContent value="mentor-comment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Send Comment to Student</CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const textarea = form.elements.namedItem('mentorComment') as HTMLTextAreaElement;
                    if (textarea.value.trim()) {
                      // In real app, send to backend
                      alert('Comment sent to student: ' + textarea.value);
                      textarea.value = '';
                    }
                  }}
                  className="space-y-4"
                >
                  <textarea
                    name="mentorComment"
                    className="w-full border rounded-md p-2 min-h-[100px] bg-background text-foreground"
                    placeholder="Write your comment to the student here..."
                    required
                  />
                  <Button type="submit">Send Comment</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
