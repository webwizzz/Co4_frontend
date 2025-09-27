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

  const getScoreColor = (score: number) => {
    if (score >= 4) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    if (score >= 3) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
  }

  return (
    <div className="space-y-6">
      {/* Overall Assessment */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getConfidenceColor(analysis.overall_confidence)}`}>
              {Math.round(analysis.overall_confidence * 100)}%
            </div>
            <Progress value={analysis.overall_confidence * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Problem & Market</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysis.problem_and_market_score}/5</div>
            <Badge className={getScoreColor(analysis.problem_and_market_score)}>
              {analysis.problem_and_market_score >= 4
                ? "Strong"
                : analysis.problem_and_market_score >= 3
                  ? "Moderate"
                  : "Weak"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Value & Model</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysis.value_and_model_score}/5</div>
            <Badge className={getScoreColor(analysis.value_and_model_score)}>
              {analysis.value_and_model_score >= 4
                ? "Strong"
                : analysis.value_and_model_score >= 3
                  ? "Moderate"
                  : "Weak"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Team & Traction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysis.team_and_traction_score}/5</div>
            <Badge className={getScoreColor(analysis.team_and_traction_score)}>
              {analysis.team_and_traction_score >= 4
                ? "Strong"
                : analysis.team_and_traction_score >= 3
                  ? "Moderate"
                  : "Weak"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Funding Readiness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysis.funding_readiness_score}/5</div>
            <Badge className={getScoreColor(analysis.funding_readiness_score)}>
              {analysis.funding_readiness_score >= 4
                ? "Strong"
                : analysis.funding_readiness_score >= 3
                  ? "Moderate"
                  : "Weak"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader className="bg-green-50 dark:bg-green-950">
            <CardTitle className="flex items-center text-green-800 dark:text-green-200">
              <TrendingUp className="h-5 w-5 mr-2" />
              Strengths ({analysis.strengths.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {analysis.strengths.map((strength, index) => (
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
              Weaknesses ({analysis.weaknesses.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {analysis.weaknesses.map((weakness, index) => (
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
              Prioritized Actions ({analysis.prioritized_actions.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {analysis.prioritized_actions.map((action, index) => (
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
              Red Flags ({analysis.red_flags.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {analysis.red_flags.map((flag, index) => (
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
            Extracted KPIs ({analysis.extracted_kpis.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {analysis.extracted_kpis.map((kpi, index) => (
              <div key={index} className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">{kpi}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
