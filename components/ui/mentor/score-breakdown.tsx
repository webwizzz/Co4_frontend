"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { Idea } from "@/types/mentor"

interface ScoreBreakdownProps {
  idea: Idea
}

export default function ScoreBreakdown({ idea }: ScoreBreakdownProps) {
  // Generate detailed scoring breakdown based on the overall score
  const scoreBreakdown = [
    { category: "Innovation", score: Math.min(10, idea.mentorRemarks.Score + 1.2), maxScore: 10 },
    { category: "Feasibility", score: Math.min(10, idea.mentorRemarks.Score - 0.5), maxScore: 10 },
    { category: "Market Potential", score: Math.min(10, idea.mentorRemarks.Score + 0.8), maxScore: 10 },
    { category: "Technical Merit", score: Math.min(10, idea.mentorRemarks.Score - 0.3), maxScore: 10 },
    { category: "Presentation", score: Math.min(10, idea.mentorRemarks.Score + 0.2), maxScore: 10 },
  ]

  const chartData = scoreBreakdown.map((item) => ({
    category: item.category,
    score: Math.round(item.score * 10) / 10,
  }))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Score Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              score: {
                label: "Score",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                <YAxis domain={[0, 10]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="score" fill="var(--color-score)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Detailed Scoring</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {scoreBreakdown.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.category}</span>
                  <span className="text-muted-foreground">
                    {Math.round(item.score * 10) / 10}/{item.maxScore}
                  </span>
                </div>
                <Progress value={(item.score / item.maxScore) * 100} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mentor Remarks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Overall Assessment</h4>
              <p className="text-sm text-muted-foreground">
                This idea shows {idea.mentorRemarks.potentialCategory.toLowerCase()} potential with a score of{" "}
                {idea.mentorRemarks.Score}/10.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Key Recommendations</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {idea.mentorRemarks.Score >= 8 ? (
                  <>
                    <li>• Consider prototype development</li>
                    <li>• Explore funding opportunities</li>
                    <li>• Conduct user validation studies</li>
                  </>
                ) : idea.mentorRemarks.Score >= 6 ? (
                  <>
                    <li>• Strengthen market research</li>
                    <li>• Refine technical approach</li>
                    <li>• Address identified weaknesses</li>
                  </>
                ) : (
                  <>
                    <li>• Revisit core concept</li>
                    <li>• Conduct thorough market analysis</li>
                    <li>• Consider alternative approaches</li>
                  </>
                )}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Next Steps</h4>
              <p className="text-sm text-muted-foreground">
                Schedule a follow-up meeting to discuss implementation strategy and resource requirements.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
