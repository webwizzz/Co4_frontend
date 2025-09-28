"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import FeasibilityAnalysisView from "@/components/ui/mentor/feasibility-analysis-view"
import CommentsSection from "@/components/ui/mentor/comments-section"
import LLMAnalysisView from "@/components/ui/mentor/llm-analysis-view"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Comment, Idea } from "@/types/mentor"
import { AlertTriangle, ArrowLeft, CheckCircle, FileText, TrendingDown, TrendingUp } from "lucide-react"

interface IdeaAnalysisViewProps {
  idea: Idea
  onBack: () => void
}

export default function IdeaAnalysisView({ idea, onBack }: IdeaAnalysisViewProps) {
  // keep a local mutable copy so we can update UI when analysis is performed
  // Normalize incoming comments. Backend may return:
  // - an array of comment objects
  // - an array of plain strings (e.g. ["hello","VHGBJNK"])
  // - a JSON string containing an array
  const normalizeComments = (comments: any[] | string | undefined) => {
    if (!comments) return [] as Comment[]

    // If server returned a JSON string, try to parse it
    if (typeof comments === 'string') {
      try {
        const parsed = JSON.parse(comments)
        return normalizeComments(parsed)
      } catch (e) {
        // treat as single-string comment
        return [{ id: `c${Date.now()}`, text: comments, timestamp: new Date() } as Comment]
      }
    }

    if (!Array.isArray(comments)) return [] as Comment[]

    return comments.map((c: any, idx: number) => {
      // If the item is a plain string, convert to a Comment with defaults
      if (typeof c === 'string') {
        return {
          id: `c_str_${idx}_${Date.now()}`,
          text: c,
          author: 'Anonymous',
          authorRole: 'mentor',
          timestamp: new Date(),
          isVisible: true,
        } as Comment
      }

      // If it's already an object, normalize missing fields
      return {
        id: c.id || `c_obj_${idx}_${Date.now()}`,
        text: c.text || String(c),
        author: c.author || c.name || 'Anonymous',
        authorRole: c.authorRole || c.role || 'mentor',
        timestamp: c && c.timestamp ? new Date(c.timestamp) : new Date(),
        isVisible: typeof c.isVisible === 'boolean' ? c.isVisible : true,
      } as Comment
    }) as Comment[]
  }

  const [localIdea, setLocalIdea] = useState<Idea>({ ...idea, comments: normalizeComments((idea as any).comments) })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [commentsLoading, setCommentsLoading] = useState(false)

  console.log('IdeaAnalysisView rendering with idea:', localIdea);
  console.log('Overview data:', localIdea.overview);
  console.log('LLM Analysis data:', localIdea.llmAnalysis);
  console.log('Feasibility Analysis data:', localIdea.feasibilityAnalysis);

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

  // Access marketAnalysis safely since it's optional
  const marketAnalysis = localIdea.marketAnalysis || {}

  const handleAddComment = (text: string, isVisible: boolean) => {
    // UI-level temporary state handled by caller; perform API POST to create comment
    // Show optimistic UI only after successful response from backend
    ;(async () => {
      try {
        setAnalysisError(null)
        // disable button in UI by returning a Promise; the caller can also manage its own loading
        const mentorIdFromStorage = typeof window !== 'undefined' ? (localStorage.getItem('mentorId') || '') : ''
        const payload = {
          projectId: localIdea.id,
          comment: text,
        }

        // Provide basic feedback via console and UI error state
        const res = await fetch('http://localhost:8000/api/mentor/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          const body = await res.text()
          throw new Error(body || 'Failed to create comment')
        }

        const data = await res.json()
        console.log('Comment API response:', data)

        // Build comment object to insert into localIdea.comments
        const returned = data.comment || {}
        const createdComment: Comment = {
          id: `c${Date.now()}`,
          text: returned.text || text,
          timestamp: returned.timestamp ? new Date(returned.timestamp) : new Date(),
        }

        setLocalIdea(prev => ({ ...prev, comments: [...(prev.comments || []), createdComment] }))
      } catch (err: any) {
        console.error('Error adding comment:', err)
        setAnalysisError(err?.message || String(err))
      }
    })()
  }

  const handlePerformAnalysis = async () => {
    setAnalysisError(null)
    setIsAnalyzing(true)
    try {
      const response = await fetch(`http://localhost:8000/api/mentor/analysis/${localIdea.id}`)
      if (!response.ok) {
        const err = await response.text()
        throw new Error(err || 'Analysis API failed')
      }
      const data = await response.json()
      console.log('Analysis API response:', data)

      // Normalize feasibility payload before merging so the FeasibilityAnalysisView
      // always receives the expected shape and we avoid runtime errors.
      const normalizeFeasibility = (payload: any) => {
        if (!payload || typeof payload !== 'object') return undefined

        // helpers
        const safeNumber = (v: any, fallback = 0) => (typeof v === 'number' && !Number.isNaN(v) ? v : fallback)
        const safeArray = (v: any) => (Array.isArray(v) ? v : [])
        const parseINR = (s: any) => {
          if (typeof s === 'number') return s
          if (!s) return 0
          const str = String(s)
          const m = str.match(/[\d,]+/g)
          if (!m) return 0
          const digits = m.join('').replace(/,/g, '')
          const n = Number(digits)
          return Number.isNaN(n) ? 0 : n
        }

        // Source shapes
        const marketSrc = payload.market_feasibility || payload.market || {}
        const techSrc = payload.technical_feasibility || payload.technical || {}
        const finSrc = payload.financial_feasibility || payload.financial || {}
        const kpis = safeArray(payload.kpis || [])

        // Map KPI strings to numbers when possible
        const findKPI = (labelRegex: RegExp) => {
          const found = kpis.find((k: any) => typeof k === 'string' && labelRegex.test(k))
          return found ? parseINR(found) : 0
        }

        const totalSetup = findKPI(/total business setup cost/i) || parseINR(finSrc.startup_costs || finSrc.startup_costs_total || finSrc.startupCosts?.total)
        const loanReq = findKPI(/loan requirement/i) || parseINR(finSrc.loan_requirement || finSrc.funding_need || finSrc.fundingNeeds?.amount)
        const monthlyFixed = findKPI(/estimated fixed costs per month/i) || parseINR(finSrc.estimated_fixed_costs_monthly || finSrc.operationalCosts?.monthly)
        const expectedMonthlySales = findKPI(/expected total value of sales per month/i) || parseINR(finSrc.expected_monthly_sales || finSrc.revenueProjections?.month)

        const monthlySales = expectedMonthlySales || 0
        const year1 = monthlySales * 12

        // Parse materials/technologies from technical basis if any
        const requiredTech = [] as string[]
        if (typeof techSrc.technical_feasibility_basis === 'string') {
          // split by commas and common separators
          techSrc.technical_feasibility_basis.split(/[;,\n]/).forEach((s: string) => { const t = s.trim(); if (t) requiredTech.push(t) })
        } else if (typeof techSrc.technical_feasibility_feedback === 'string') {
          techSrc.technical_feasibility_feedback.split(/[;,\n]/).forEach((s: string) => { const t = s.trim(); if (t) requiredTech.push(t) })
        }

        return {
          marketFeasibility: {
            targetMarket: {
              description: marketSrc.market_feasibility_feedback || marketSrc.market_feasibility_basis || marketSrc.description || '',
              size: safeNumber(marketSrc.market_size || marketSrc.marketSize || 0),
              demographics: safeArray(marketSrc.demographics || []),
            },
            marketSize: safeNumber(marketSrc.market_size || marketSrc.marketSize || 0),
            growthPotential: safeNumber(marketSrc.growth_potential || marketSrc.growthPotential || 0),
            competition: {
              count: 0,
              mainCompetitors: [],
              competitiveAdvantage: [],
            },
            pricingStrategy: {
              model: '',
              priceRange: '',
              salesChannels: [],
            }
          },
          financialFeasibility: {
            startupCosts: {
              total: totalSetup || 0,
              breakdown: [],
            },
            operationalCosts: {
              monthly: monthlyFixed || 0,
              breakdown: [],
            },
            revenueProjections: {
              year1: year1 || 0,
              year2: Math.round(year1 * 1.1) || 0,
              year3: Math.round(year1 * 1.2) || 0,
              year4: Math.round(year1 * 1.3) || 0,
              year5: Math.round(year1 * 1.5) || 0,
            },
            fundingNeeds: {
              amount: loanReq || 0,
              sources: [],
            },
            breakEvenPoint: {
              months: 0,
              unitsOrRevenue: 0,
            }
          },
          technicalFeasibility: {
            technologyScore: 0,
            requiredTechnology: requiredTech,
            teamExpertise: 0,
            scalabilityScore: 0,
            integrationComplexity: 0,
            developmentTimeline: [],
          },
          organizationalFeasibility: {
            managementScore: 0,
            teamStrength: 0,
            leadershipExperience: [],
            nonFinancialResources: [],
            intellectualProperty: { patents: 0, trademarks: 0, copyrights: 0 }
          },
          legalRegulatoryFeasibility: {
            complianceScore: 0,
            requiredLicenses: [],
            regulatoryCompliance: [],
            intellectualPropertyRisks: []
          },
          riskAssessment: {
            financialRisks: [],
            marketRisks: [],
            operationalRisks: [],
            overallRiskScore: 0,
          }
        }
      }

      // Prefer an explicit feasibility object when provided by API, otherwise use top-level payload
      const payload = data.feasibility || data.financial_feasibility || data
      const normalizedFeasibility = normalizeFeasibility(payload)

      // Update localIdea with returned analysis data. Cast to any because API shape may differ.
      setLocalIdea(prev => ({
        ...prev,
        llmAnalysis: (data.llmAnalysis as any) ?? prev.llmAnalysis,
        feasibilityAnalysis: normalizedFeasibility ?? prev.feasibilityAnalysis,
      }))
    } catch (err: any) {
      console.error('Error performing analysis:', err)
      setAnalysisError(err?.message || String(err))
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Fetch existing comments for this project on mount (and when project id changes)
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!localIdea?.id) return

    let mounted = true
    const load = async () => {
      try {
        setCommentsLoading(true)
        const res = await fetch(`http://localhost:8000/api/mentor/comments/${localIdea.id}`)
        if (!res.ok) {
          const text = await res.text()
          throw new Error(text || `Failed to fetch comments: ${res.status}`)
        }
        const data = await res.json()
        console.log(data.comments)
        let raw = data?.comments || []
        if (typeof raw === 'string') {
          try { raw = JSON.parse(raw) } catch (e) { raw = [raw] }
        }
        const normalized = normalizeComments(Array.isArray(raw) ? raw : [])
        if (mounted) setLocalIdea(prev => ({ ...prev, comments: normalized }))
      } catch (err: any) {
        console.error('Error fetching comments:', err)
        if (mounted) setAnalysisError(err?.message || String(err))
      } finally {
        if (mounted) setCommentsLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [localIdea?.id])

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
              <h1 className="text-3xl font-bold text-foreground mb-2">{localIdea.name}</h1>
              <p className="text-muted-foreground text-lg">{localIdea.description}</p>
            </div>
            <div className="flex flex-col items-end space-y-2">
              {localIdea.mentorRemarks && localIdea.mentorRemarks.potentialCategory && (
                <Badge className={getPotentialColor(localIdea.mentorRemarks.potentialCategory)}>
                  {localIdea.mentorRemarks.potentialCategory} Potential
                </Badge>
              )}
              {/* Show Perform Analysis button when either analysis is missing */}
              {(!localIdea.llmAnalysis || !localIdea.feasibilityAnalysis) && (
                <div className="flex items-center space-x-2">
                  <Button onClick={handlePerformAnalysis} disabled={isAnalyzing}>
                    {isAnalyzing ? 'Analyzing…' : 'Perform Analysis'}
                  </Button>
                </div>
              )}
              {analysisError && <div className="text-sm text-red-600">{analysisError}</div>}
            </div>
          </div>

          {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
            {(localIdea.tags || []).map((tag, index) => (
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
                    <h4 className="font-semibold mb-2">Title</h4>
                    <p className="text-muted-foreground">{localIdea.overview?.title || localIdea.name}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-muted-foreground">{localIdea.overview?.description || localIdea.description}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {(localIdea.overview?.tags || localIdea.tags || []).map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Files Attached</h4>
                    <div className="space-y-2">
                      {(localIdea.overview?.uploadedFiles || []).length > 0 ? (
                        localIdea.overview?.uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center text-sm">
                            <FileText className="h-4 w-4 mr-2 flex-shrink-0 text-muted-foreground" />
                            <a 
                              href={file.url} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="text-blue-600 hover:underline flex items-center"
                            >
                              <span>{file.name}</span>
                              <span className="ml-2 text-xs text-muted-foreground">
                                {file.uploadDate ? new Date(file.uploadDate).toLocaleDateString() : ''}
                              </span>
                            </a>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">
                          {(localIdea.rawFiles || []).length} files
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-auto max-h-[600px]">
                <CardHeader>
                  <CardTitle>Standard Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {localIdea.overview?.formatedFile && (
                    <div className="space-y-4">
                      {Object.entries(localIdea.overview.formatedFile).map(([key, value]) => (
                        value && (
                          <div key={key}>
                            <h4 className="font-semibold mb-2 capitalize">{key.replace(/_/g, ' ')}</h4>
                            <p className="text-muted-foreground whitespace-pre-wrap">{typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}</p>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="llm-analysis" className="space-y-6">
            {localIdea.llmAnalysis ? (
              <LLMAnalysisView analysis={localIdea.llmAnalysis} />
            ) : (
              <div className="p-4 bg-muted rounded">No LLM analysis available. Click "Perform Analysis" to run automated analysis.</div>
            )}
          </TabsContent>

          <TabsContent value="feasibility" className="space-y-6">
            {localIdea.feasibilityAnalysis ? (
              <FeasibilityAnalysisView analysis={localIdea.feasibilityAnalysis} />
            ) : (
              <div className="p-4 bg-muted rounded">No feasibility analysis available. Click "Perform Analysis" to run automated analysis.</div>
            )}
          </TabsContent>
                  <TabsContent value="mentor-comment" className="space-y-6">
                    <CommentsSection comments={localIdea.comments || []} onAddComment={handleAddComment} />
                  </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}