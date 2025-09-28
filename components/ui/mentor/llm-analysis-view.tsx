"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, TrendingUp, TrendingDown, Target, Flag, DollarSign } from "lucide-react"
import type { LLMAnalysis } from "@/types/mentor"

interface LLMAnalysisViewProps {
  analysis: LLMAnalysis
}

export default function LLMAnalysisView({ analysis }: LLMAnalysisViewProps) {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.7) return "text-green-600"
    if (confidence >= 0.4) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreColor = (scores: number) => {
    if (scores >= 4) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    if (scores >= 3) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
  }

  return (
    <div className="space-y-6">

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader className="bg-green-50 dark:bg-green-950">
            <CardTitle className="flex items-center text-green-800 dark:text-green-200">
              <TrendingUp className="h-5 w-5 mr-2" />
              Strengths ({analysis.strengths?.length ?? 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {(analysis.strengths || []).map((strength, index) => (
                <div key={index} className="flex items-start">
                  <Badge variant="outline" className="mr-2 mt-0.5 text-xs border-green-300 text-green-700 shrink-0">
                    {index + 1}
                  </Badge>
                  <p className="text-sm">{strength}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 dark:border-red-800">
          <CardHeader className="bg-red-50 dark:bg-red-950">
            <CardTitle className="flex items-center text-red-800 dark:text-red-200">
              <TrendingDown className="h-5 w-5 mr-2" />
              Weaknesses ({analysis.weaknesses?.length ?? 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {(analysis.weaknesses || []).map((weakness, index) => (
                <div key={index} className="flex items-start">
                  <Badge variant="outline" className="mr-2 mt-0.5 text-xs border-red-300 text-red-700 shrink-0">
                    {index + 1}
                  </Badge>
                  <p className="text-sm">{weakness}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 dark:border-blue-800">
          <CardHeader className="bg-blue-50 dark:bg-blue-950">
            <CardTitle className="flex items-center text-blue-800 dark:text-blue-200">
              <Target className="h-5 w-5 mr-2" />
              Prioritized Actions ({analysis.prioritized_actions?.length ?? 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {(analysis.prioritized_actions || []).map((action, index) => (
                <div key={index} className="flex items-start">
                  <Badge variant="outline" className="mr-2 mt-0.5 text-xs border-blue-300 text-blue-700 shrink-0">
                    {index + 1}
                  </Badge>
                  <p className="text-sm">{action}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 dark:border-orange-800">
          <CardHeader className="bg-orange-50 dark:bg-orange-950">
            <CardTitle className="flex items-center text-orange-800 dark:text-orange-200">
              <Flag className="h-5 w-5 mr-2" />
              Red Flags ({analysis.red_flags?.length ?? 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {(analysis.red_flags || []).map((flag, index) => (
                <div key={index} className="flex items-start">
                  <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 text-orange-600 shrink-0" />
                  <p className="text-sm">{flag}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{analysis.risk_assessment}</p>
        </CardContent>
      </Card>

      {/* Key Performance Indicators */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Extracted KPIs ({analysis.extracted_kpis?.length ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
          <h3 className="text-lg font-semibold mb-2">Extracted KPIs</h3>
          <div className="flex flex-wrap gap-2">
            {(analysis?.extracted_kpis || []).map((kpi, i) => (
              <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded text-sm">{kpi}</span>
            ))}
          </div>
        </div>
        </CardContent>
      </Card>
    </div>
  )
}
