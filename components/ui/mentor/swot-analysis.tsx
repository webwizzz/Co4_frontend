"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Shield, AlertTriangle } from "lucide-react"
import type { MarketAnalysis } from "@/types/mentor"

interface SWOTAnalysisProps {
  analysis: MarketAnalysis
}

export default function SWOTAnalysis({ analysis }: SWOTAnalysisProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-green-200 dark:border-green-800">
        <CardHeader className="bg-green-50 dark:bg-green-950">
          <CardTitle className="flex items-center text-green-800 dark:text-green-200">
            <TrendingUp className="h-5 w-5 mr-2" />
            Strengths
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-2">
            {analysis.strengths.map((strength, index) => (
              <div key={index} className="flex items-start">
                <Badge variant="outline" className="mr-2 mt-0.5 text-xs border-green-300 text-green-700">
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
            Weaknesses
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-2">
            {analysis.weaknesses.map((weakness, index) => (
              <div key={index} className="flex items-start">
                <Badge variant="outline" className="mr-2 mt-0.5 text-xs border-red-300 text-red-700">
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
            <Shield className="h-5 w-5 mr-2" />
            Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-2">
            {analysis.opportunities.map((opportunity, index) => (
              <div key={index} className="flex items-start">
                <Badge variant="outline" className="mr-2 mt-0.5 text-xs border-blue-300 text-blue-700">
                  {index + 1}
                </Badge>
                <p className="text-sm">{opportunity}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-200 dark:border-orange-800">
        <CardHeader className="bg-orange-50 dark:bg-orange-950">
          <CardTitle className="flex items-center text-orange-800 dark:text-orange-200">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Threats
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-2">
            {analysis.threats.map((threat, index) => (
              <div key={index} className="flex items-start">
                <Badge variant="outline" className="mr-2 mt-0.5 text-xs border-orange-300 text-orange-700">
                  {index + 1}
                </Badge>
                <p className="text-sm">{threat}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
