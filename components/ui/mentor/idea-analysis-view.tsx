"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CommentsSection from "@/components/ui/mentor/comments-section"
import FeasibilityAnalysisView from "@/components/ui/mentor/feasibility-analysis-view"
import LLMAnalysisView from "@/components/ui/mentor/llm-analysis-view"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Comment, Idea } from "@/types/mentor"
import { motion } from "framer-motion"
import { FileText } from "lucide-react"
import { useEffect, useState } from "react"

interface IdeaAnalysisViewProps {
  idea: Idea
  onBack?: () => void
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
    if (typeof comments === "string") {
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
      if (typeof c === "string") {
        return {
          id: `c_str_${idx}_${Date.now()}`,
          text: c,
          author: "Anonymous",
          authorRole: "mentor",
          timestamp: new Date(),
          isVisible: true,
        } as Comment
      }

      // If it's already an object, normalize missing fields
      return {
        id: c.id || `c_obj_${idx}_${Date.now()}`,
        text: c.text || String(c),
        author: c.author || c.name || "Anonymous",
        authorRole: c.authorRole || c.role || "mentor",
        timestamp: c && c.timestamp ? new Date(c.timestamp) : new Date(),
        isVisible: typeof c.isVisible === "boolean" ? c.isVisible : true,
      } as Comment
    }) as Comment[]
  }

  const [localIdea, setLocalIdea] = useState<Idea>({ ...idea, comments: normalizeComments((idea as any).comments) })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [commentsLoading, setCommentsLoading] = useState(false)

  console.log("IdeaAnalysisView rendering with idea:", localIdea)
  console.log("Overview data:", localIdea.overview)
  console.log("LLM Analysis data:", localIdea.llmAnalysis)
  console.log("Feasibility Analysis data:", localIdea.feasibilityAnalysis)

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
        const mentorIdFromStorage = typeof window !== "undefined" ? localStorage.getItem("mentorId") || "" : ""
        const payload = {
          projectId: localIdea.id,
          comment: text,
        }

        // Provide basic feedback via console and UI error state
        const res = await fetch("http://localhost:8000/api/mentor/comments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          const body = await res.text()
          throw new Error(body || "Failed to create comment")
        }

        const data = await res.json()
        console.log("Comment API response:", data)

        // Build comment object to insert into localIdea.comments
        const returned = data.comment || {}
        const createdComment: Comment = {
          id: `c${Date.now()}`,
          text: returned.text || text,
          timestamp: returned.timestamp ? new Date(returned.timestamp) : new Date(),
        }

        setLocalIdea((prev) => ({ ...prev, comments: [...(prev.comments || []), createdComment] }))
      } catch (err: any) {
        console.error("Error adding comment:", err)
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
        throw new Error(err || "Analysis API failed")
      }
      const data = await response.json()
      console.log("Analysis API response:", data)

      // Normalize feasibility payload before merging so the FeasibilityAnalysisView
      // always receives the expected shape and we avoid runtime errors.
      const normalizeFeasibility = (payload: any) => {
        if (!payload || typeof payload !== "object") return undefined

        // helpers
        const safeNumber = (v: any, fallback = 0) => (typeof v === "number" && !Number.isNaN(v) ? v : fallback)
        const safeArray = (v: any) => (Array.isArray(v) ? v : [])
        const parseINR = (s: any) => {
          if (typeof s === "number") return s
          if (!s) return 0
          const str = String(s)
          const m = str.match(/[\d,]+/g)
          if (!m) return 0
          const digits = m.join("").replace(/,/g, "")
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
          const found = kpis.find((k: any) => typeof k === "string" && labelRegex.test(k))
          return found ? parseINR(found) : 0
        }

        const totalSetup =
          findKPI(/total business setup cost/i) ||
          parseINR(finSrc.startup_costs || finSrc.startup_costs_total || finSrc.startupCosts?.total)
        const loanReq =
          findKPI(/loan requirement/i) ||
          parseINR(finSrc.loan_requirement || finSrc.funding_need || finSrc.fundingNeeds?.amount)
        const monthlyFixed =
          findKPI(/estimated fixed costs per month/i) ||
          parseINR(finSrc.estimated_fixed_costs_monthly || finSrc.operationalCosts?.monthly)
        const expectedMonthlySales =
          findKPI(/expected total value of sales per month/i) ||
          parseINR(finSrc.expected_monthly_sales || finSrc.revenueProjections?.month)

        const monthlySales = expectedMonthlySales || 0
        const year1 = monthlySales * 12

        // Parse materials/technologies from technical basis if any
        const requiredTech = [] as string[]
        if (typeof techSrc.technical_feasibility_basis === "string") {
          // split by commas and common separators
          techSrc.technical_feasibility_basis.split(/[;,\n]/).forEach((s: string) => {
            const t = s.trim()
            if (t) requiredTech.push(t)
          })
        } else if (typeof techSrc.technical_feasibility_feedback === "string") {
          techSrc.technical_feasibility_feedback.split(/[;,\n]/).forEach((s: string) => {
            const t = s.trim()
            if (t) requiredTech.push(t)
          })
        }

        return {
          marketFeasibility: {
            targetMarket: {
              description:
                marketSrc.market_feasibility_feedback ||
                marketSrc.market_feasibility_basis ||
                marketSrc.description ||
                "",
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
              model: "",
              priceRange: "",
              salesChannels: [],
            },
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
            },
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
            intellectualProperty: { patents: 0, trademarks: 0, copyrights: 0 },
          },
          legalRegulatoryFeasibility: {
            complianceScore: 0,
            requiredLicenses: [],
            regulatoryCompliance: [],
            intellectualPropertyRisks: [],
          },
          riskAssessment: {
            financialRisks: [],
            marketRisks: [],
            operationalRisks: [],
            overallRiskScore: 0,
          },
        }
      }

      // Prefer an explicit feasibility object when provided by API, otherwise use top-level payload
      const payload = data.feasibility || data.financial_feasibility || data
      const normalizedFeasibility = normalizeFeasibility(payload)

      // Update localIdea with returned analysis data. Cast to any because API shape may differ.
      setLocalIdea((prev) => ({
        ...prev,
        llmAnalysis: (data.llmAnalysis as any) ?? prev.llmAnalysis,
        feasibilityAnalysis: normalizedFeasibility ?? prev.feasibilityAnalysis,
      }))
    } catch (err: any) {
      console.error("Error performing analysis:", err)
      setAnalysisError(err?.message || String(err))
    } finally {
      setIsAnalyzing(false)
    }
  }

  console.log('Rendering IdeaAnalysisView with localIdea:', localIdea.formattedFile.student)

  // Fetch existing comments for this project on mount (and when project id changes)
  useEffect(() => {
    if (typeof window === "undefined") return
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
        if (typeof raw === "string") {
          try {
            raw = JSON.parse(raw)
          } catch (e) {
            raw = [raw]
          }
        }
        const normalized = normalizeComments(Array.isArray(raw) ? raw : [])
        if (mounted) setLocalIdea((prev) => ({ ...prev, comments: normalized }))
      } catch (err: any) {
        console.error("Error fetching comments:", err)
        if (mounted) setAnalysisError(err?.message || String(err))
      } finally {
        if (mounted) setCommentsLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [localIdea?.id])

  const tagCount = (localIdea.overview?.tags || localIdea.tags || []).length
  const fileCount =
    (localIdea.overview?.uploadedFiles?.length ?? 0) > 0
      ? localIdea.overview!.uploadedFiles!.length
      : (localIdea.rawFiles || []).length
  const commentCount = (localIdea.comments || []).length
  const hasLLM = Boolean(localIdea.llmAnalysis)
  const hasFeasibility = Boolean(localIdea.feasibilityAnalysis)

  // Modal state for SWOT popup
  const [showSwot, setShowSwot] = useState(false)

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Stat cards: Score, LLM, Feasibility, Potential */}
        <motion.section
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* 1. Overall Score (Mentor, editable) */}
          <motion.div
            whileHover={{ y: -4, scale: 1.025 }}
            whileTap={{ scale: 0.99 }}
            className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 ring-2 ring-blue-200 dark:ring-blue-800 p-8 min-h-[180px] flex flex-col items-center justify-center shadow-lg"
          >
            <div className="text-lg text-blue-700 dark:text-blue-200 font-semibold mb-2">Overall Score</div>
            <input
              type="number"
              min={0}
              max={10}
              step={0.1}
              value={localIdea.mentorRemarks?.Score ?? ''}
              onChange={e => {
                let newScore = Number(e.target.value);
                if (isNaN(newScore)) newScore = 0;
                newScore = Math.max(0, Math.min(10, newScore));
                setLocalIdea(prev => ({
                  ...prev,
                  mentorRemarks: {
                    ...prev.mentorRemarks,
                    Score: newScore
                  } as Idea['mentorRemarks']
                }));
                // TODO: Optionally, send update to backend here
              }}
              className="mt-1 text-6xl font-extrabold tabular-nums text-blue-700 dark:text-blue-200 text-center bg-transparent border-none outline-none w-32 focus:ring-2 focus:ring-blue-400"
              style={{ appearance: 'textfield' }}
            />
            <span className="text-2xl font-normal text-blue-700 dark:text-blue-200">/10</span>
          </motion.div>

          {/* 2. LLM Analysis Rating */}
          <motion.div
            whileHover={{ y: -4, scale: 1.025 }}
            whileTap={{ scale: 0.99 }}
            className="rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 ring-2 ring-purple-200 dark:ring-purple-800 p-8 min-h-[180px] flex flex-col items-center justify-center shadow-lg"
          >
            <div className="text-lg text-purple-700 dark:text-purple-200 font-semibold mb-2">LLM Rating</div>
            <div className="text-base text-purple-800 dark:text-purple-300 mb-1">Overall Confidence</div>
            <div className="mt-1 text-6xl font-extrabold tabular-nums text-purple-700 dark:text-purple-200">
              {localIdea.llmAnalysis?.overall_confidence !== undefined ? `${localIdea.llmAnalysis.overall_confidence}/10` : '—'}
            </div>
          </motion.div>

          {/* 3. SWAT Card */}
          <motion.div
            whileHover={{ y: -4, scale: 1.025 }}
            whileTap={{ scale: 0.99 }}
            className="cursor-pointer rounded-2xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 ring-2 ring-green-200 dark:ring-green-800 p-8 min-h-[180px] flex flex-col items-center justify-center shadow-lg hover:ring-4 hover:ring-green-400 transition-all"
            onClick={() => setShowSwot(true)}
          >
            <div className="text-lg text-green-700 dark:text-green-200 font-semibold mb-2">SWOT</div>
            <div className="mt-1 text-5xl font-extrabold tabular-nums text-green-700 dark:text-green-200">View</div>
            <div className="mt-2 text-sm text-green-800 dark:text-green-300">Click to see summary</div>
          </motion.div>

          {/* SWOT Modal */}
          {showSwot && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 max-w-md w-full relative">
                <button
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-900 dark:hover:text-white text-2xl font-bold"
                  onClick={() => setShowSwot(false)}
                  aria-label="Close"
                >
                  ×
                </button>
                <h2 className="text-2xl font-bold mb-4 text-green-700 dark:text-green-300">SWOT Summary</h2>
                <ul className="space-y-2 text-base">
                  <li><span className="font-semibold text-green-700">Strengths:</span> {localIdea.llmAnalysis?.strengths?.length ?? 0}</li>
                  <li><span className="font-semibold text-red-700">Weaknesses:</span> {localIdea.llmAnalysis?.weaknesses?.length ?? 0}</li>
                  <li><span className="font-semibold text-blue-700">Opportunities:</span> {localIdea.llmAnalysis?.prioritized_actions?.length ?? 0}</li>
                  <li><span className="font-semibold text-yellow-700">Threats:</span> {localIdea.llmAnalysis?.red_flags?.length ?? 0}</li>
                </ul>
                <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">(Numbers show count of items in each category. For details, see LLM Analysis tab.)</div>
              </div>
            </div>
          )}

          {/* 4. Potential (Mentor editable) */}
          <motion.div
            whileHover={{ y: -4, scale: 1.025 }}
            whileTap={{ scale: 0.99 }}
            className={(() => {
              const potential = localIdea.mentorRemarks?.potentialCategory;
              if (potential === 'High') return 'rounded-2xl bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 ring-2 ring-red-300 dark:ring-red-800 p-8 min-h-[180px] flex flex-col items-center justify-center shadow-lg';
              if (potential === 'Medium') return 'rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 ring-2 ring-orange-300 dark:ring-orange-800 p-8 min-h-[180px] flex flex-col items-center justify-center shadow-lg';
              if (potential === 'Low') return 'rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 ring-2 ring-yellow-200 dark:ring-yellow-800 p-8 min-h-[180px] flex flex-col items-center justify-center shadow-lg';
              return 'rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 ring-2 ring-gray-200 dark:ring-gray-800 p-8 min-h-[180px] flex flex-col items-center justify-center shadow-lg';
            })()}
          >
            <div className={(() => {
              const potential = localIdea.mentorRemarks?.potentialCategory;
              if (potential === 'High') return 'text-red-700 dark:text-red-200 font-semibold mb-2';
              if (potential === 'Medium') return 'text-orange-700 dark:text-orange-200 font-semibold mb-2';
              if (potential === 'Low') return 'text-yellow-700 dark:text-yellow-200 font-semibold mb-2';
              return 'text-gray-700 dark:text-gray-200 font-semibold mb-2';
            })()}>Potential</div>
            <select
              className={(() => {
                const potential = localIdea.mentorRemarks?.potentialCategory;
                if (potential === 'High') return 'mt-2 text-xl font-bold rounded-lg border-2 border-red-400 dark:border-red-700 bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400';
                if (potential === 'Medium') return 'mt-2 text-xl font-bold rounded-lg border-2 border-orange-400 dark:border-orange-700 bg-orange-50 dark:bg-orange-900 text-orange-800 dark:text-orange-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400';
                if (potential === 'Low') return 'mt-2 text-xl font-bold rounded-lg border-2 border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400';
                return 'mt-2 text-xl font-bold rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400';
              })()}
              value={localIdea.mentorRemarks?.potentialCategory || ''}
              onChange={e => {
                const newPotential = e.target.value as 'High' | 'Medium' | 'Low';
                setLocalIdea(prev => ({
                  ...prev,
                  mentorRemarks: {
                    ...prev.mentorRemarks,
                    potentialCategory: newPotential
                  }
                }))
                // TODO: Optionally, send update to backend here
              }}
            >
              <option value="">Select</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </motion.div>
        </motion.section>

        {/* Analysis Tabs */}
        <Tabs defaultValue="overview" className="mb-8">
          <div className="flex flex-col items-stretch">
            {/* Simplify TabsList styling */}
            <TabsList className="flex w-full overflow-hidden rounded-2xl bg-muted border-b-2 border-primary/20 shadow-sm">
              <TabsTrigger
                value="overview"
                className="flex-1 py-4 px-6 text-center text-base font-medium text-foreground/80 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors rounded-t-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="llm-analysis"
                className="flex-1 py-4 px-6 text-center text-base font-medium text-foreground/80 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                LLM Analysis
              </TabsTrigger>
              <TabsTrigger
                value="feasibility"
                className="flex-1 py-4 px-6 text-center text-base font-medium text-foreground/80 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                Feasibility Analysis
              </TabsTrigger>
              <TabsTrigger
                value="mentor-comment"
                className="flex-1 py-4 px-6 text-center text-base font-medium text-foreground/80 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-colors rounded-tr-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                Mentor Comment
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground text-balance">Idea Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-foreground">Title</h4>
                      <p className="text-muted-foreground">{localIdea.overview?.title || localIdea.name}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-foreground">Description</h4>
                      <p className="text-muted-foreground">
                        {localIdea.overview?.description || localIdea.description}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-foreground">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {(localIdea.overview?.tags || localIdea.tags || []).map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-foreground">Files Attached</h4>
                      <div className="space-y-2">
                        {(localIdea.overview?.uploadedFiles || []).length > 0 ? (
                          localIdea.overview?.uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center text-sm">
                              <FileText className="h-4 w-4 mr-2 flex-shrink-0 text-muted-foreground" />
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-primary hover:underline flex items-center"
                              >
                                <span>{file.name}</span>
                                <span className="ml-2 text-xs text-muted-foreground">
                                  {file.uploadDate ? new Date(file.uploadDate).toLocaleDateString() : ""}
                                </span>
                              </a>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted-foreground">{(localIdea.rawFiles || []).length} files</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
                <Card className="bg-card border-border overflow-auto max-h-[600px]">
                  <CardHeader>
                    <CardTitle className="text-foreground text-balance">Standard Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {localIdea.overview?.formatedFile && (
                      <div className="space-y-4">
                        {Object.entries(localIdea.overview.formatedFile).map(([key, value]) =>
                          value ? (
                            <div key={key}>
                              <h4 className="font-semibold mb-2 capitalize text-foreground">
                                {key.replace(/_/g, " ")}
                              </h4>
                              <p className="text-muted-foreground whitespace-pre-wrap">
                                {typeof value === "object" ? JSON.stringify(value, null, 2) : String(value)}
                              </p>
                            </div>
                          ) : null,
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="llm-analysis" className="space-y-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
              {localIdea.llmAnalysis ? (
                <LLMAnalysisView analysis={localIdea.llmAnalysis} />
              ) : (
                <div className="p-4 bg-muted rounded-md text-foreground/80">
                  No LLM analysis available. Click {'"Perform Analysis"'} to run automated analysis.
                </div>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="feasibility" className="space-y-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
              {localIdea.feasibilityAnalysis ? (
                <FeasibilityAnalysisView analysis={localIdea.feasibilityAnalysis} />
              ) : (
                <div className="p-4 bg-muted rounded-md text-foreground/80">
                  No feasibility analysis available. Click {'"Perform Analysis"'} to run automated analysis.
                </div>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="mentor-comment" className="space-y-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
              <CommentsSection comments={localIdea.comments || []} onAddComment={handleAddComment} />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

