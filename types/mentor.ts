export interface Student {
  id: string
  name: string
  email: string
  avatar?: string
  department: string
  year: number
  ideasCount: number
}

export interface Idea {
  id: string
  studentId: string
  name: string
  description: string
  tags: string[]
  rawFiles: FileData[]
  formattedFile: Record<string, any>
  feedback: Record<string, any>
  comments: Comment[] // Updated from string[] to Comment[]
  transcribe: Record<string, any>
  mentorRemarks: {
    Score: number
    potentialCategory: "High" | "Medium" | "Low"
  }
  createdAt: String
  marketAnalysis?: MarketAnalysis
  llmAnalysis?: LLMAnalysis // Added LLM analysis field
  feasibilityAnalysis?: FeasibilityAnalysis // Added feasibility analysis field
  // New overview field from API
  overview?: {
    title: string
    description: string
    tags: string[]
    uploadedFiles: Array<{
      name: string
      url: string
      publicId: string
      uploadDate: string
      _id: string
    }>
    transcribe: any[]
    formatedFile: Record<string, any>
  }
}

export interface FileData {
  id: string
  name: string
  type: string
  size: number
  url: string
}

export interface MarketAnalysis {
  marketSize: number
  competitorCount: number
  growthRate: number
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
  feasibilityScore: number
  marketTrends: TrendData[]
}

export interface TrendData {
  period: string
  value: number
  category: string
}

export interface Mentor {
  id: string
  name: string
  email: string
  department: string
  students: Student[]
}

export interface LLMAnalysis {
  overall_confidence: number
  problem_and_market_score: number
  value_and_model_score: number
  team_and_traction_score: number
  funding_readiness_score: number
  strengths: string[]
  weaknesses: string[]
  prioritized_actions: string[]
  red_flags: string[]
  risk_assessment: string
  automated_feedback: string | null
  extracted_kpis: string[]
}

export interface Comment {
  id: string
  text: string
  timestamp: Date
}

export interface FeasibilityAnalysis {
  marketFeasibility: {
    targetMarket: {
      description: string
      size: number
      demographics: string[]
    }
    marketSize: number
    growthPotential: number
    competition: {
      count: number
      mainCompetitors: string[]
      competitiveAdvantage: string[]
    }
    pricingStrategy: {
      model: string
      priceRange: string
      salesChannels: string[]
    }
  }
  financialFeasibility: {
    startupCosts: {
      total: number
      breakdown: { category: string; amount: number }[]
    }
    operationalCosts: {
      monthly: number
      breakdown: { category: string; amount: number }[]
    }
    revenueProjections: {
      year1: number
      year2: number
      year3: number
      year4: number
      year5: number
    }
    fundingNeeds: {
      amount: number
      sources: string[]
    }
    breakEvenPoint: {
      months: number
      unitsOrRevenue: number
    }
  }
  technicalFeasibility: {
    technologyScore: number
    requiredTechnology: string[]
    teamExpertise: number
    scalabilityScore: number
    integrationComplexity: number
    developmentTimeline: {
      phase: string
      duration: string
      status: "pending" | "in-progress" | "completed"
    }[]
  }
  organizationalFeasibility: {
    managementScore: number
    teamStrength: number
    leadershipExperience: string[]
    nonFinancialResources: string[]
    intellectualProperty: {
      patents: number
      trademarks: number
      copyrights: number
    }
  }
  legalRegulatoryFeasibility: {
    complianceScore: number
    requiredLicenses: string[]
    regulatoryCompliance: string[]
    intellectualPropertyRisks: string[]
  }
  riskAssessment: {
    financialRisks: { risk: string; probability: number; impact: number }[]
    marketRisks: { risk: string; probability: number; impact: number }[]
    operationalRisks: { risk: string; probability: number; impact: number }[]
    overallRiskScore: number
  }
}
