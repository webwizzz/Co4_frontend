"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { FeasibilityAnalysis } from '@/types/mentor'

interface BackendFeasibilityPayload {
  market_feasibility?: {
    market_feasibility_feedback?: string
    market_feasibility_basis?: string
  }
  technical_feasibility?: {
    technical_feasibility_feedback?: string
    technical_feasibility_basis?: string
  }
  financial_feasibility?: {
    financial_feasibility_feedback?: string
    financial_feasibility_basis?: string
    value_and_model_score?: number
    value_and_model_basis?: string
    funding_readiness_basis?: string
    funding_readiness_score?: number
  }
  kpis?: string[]
}

interface FeasibilityAnalysisViewProps {
  // Accept either the lightweight backend payload shape or the richer FeasibilityAnalysis used elsewhere
  analysis?: BackendFeasibilityPayload | FeasibilityAnalysis | null
}

export default function FeasibilityAnalysisView({ analysis }: FeasibilityAnalysisViewProps) {
  const payload = analysis || ({} as BackendFeasibilityPayload | FeasibilityAnalysis)

  // Narrow between backend-shaped payload and internal FeasibilityAnalysis
  const isBackendShape = (p: any): p is BackendFeasibilityPayload => !!p && (p.market_feasibility || p.technical_feasibility || p.financial_feasibility || p.kpis)

  const marketSrc = isBackendShape(payload) ? payload.market_feasibility || {} : { market_feasibility_feedback: (payload as FeasibilityAnalysis).marketFeasibility?.targetMarket?.description, market_feasibility_basis: (payload as FeasibilityAnalysis).marketFeasibility?.pricingStrategy?.model }
  const techSrc = isBackendShape(payload) ? payload.technical_feasibility || {} : { technical_feasibility_feedback: (payload as FeasibilityAnalysis).technicalFeasibility?.requiredTechnology?.join(', '), technical_feasibility_basis: (payload as FeasibilityAnalysis).technicalFeasibility?.requiredTechnology?.join(', ') }
  const finSrc = isBackendShape(payload) ? payload.financial_feasibility || {} : { financial_feasibility_feedback: (payload as FeasibilityAnalysis).financialFeasibility?.revenueProjections?.year1?.toString?.(), financial_feasibility_basis: (payload as FeasibilityAnalysis).financialFeasibility?.fundingNeeds?.sources?.join(', '), value_and_model_score: (payload as FeasibilityAnalysis).financialFeasibility ? Math.round(((payload as FeasibilityAnalysis).financialFeasibility.revenueProjections.year1 || 0) / 100000) : undefined, value_and_model_basis: undefined, funding_readiness_basis: undefined, funding_readiness_score: undefined }

  const kpis: string[] = isBackendShape(payload) ? (payload.kpis || []) : []

  return (
    <div className="space-y-8">
      {/* Market Feasibility */}
      <Card>
        <CardHeader>
          <CardTitle>Market Feasibility Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Feedback</h4>
            <p className="text-sm text-muted-foreground">{marketSrc.market_feasibility_feedback}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Basis</h4>
            <p className="text-sm text-muted-foreground">{marketSrc.market_feasibility_basis}</p>
          </div>
        </CardContent>
      </Card>

      {/* Technical Feasibility */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Feasibility Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Feedback</h4>
            <p className="text-sm text-muted-foreground">{techSrc.technical_feasibility_feedback}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Basis</h4>
            <p className="text-sm text-muted-foreground">{techSrc.technical_feasibility_basis}</p>
          </div>
        </CardContent>
      </Card>

      {/* Financial Feasibility */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Feasibility Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Feedback</h4>
            <p className="text-sm text-muted-foreground">{finSrc.financial_feasibility_feedback}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Basis</h4>
            <p className="text-sm text-muted-foreground">{finSrc.financial_feasibility_basis}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Value and Model Analysis</h4>
              <div className="text-2xl font-bold mb-2">{finSrc.value_and_model_score}/5</div>
              <p className="text-sm text-muted-foreground">{finSrc.value_and_model_basis}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Funding Readiness</h4>
              <div className="text-2xl font-bold mb-2">{finSrc.funding_readiness_score}/5</div>
              <p className="text-sm text-muted-foreground">{finSrc.funding_readiness_basis}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <Card>
        <CardHeader>
          <CardTitle>Key Performance Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {kpis.map((kpi: string, index: number) => (
              <p key={index} className="text-sm">• {kpi}</p>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}