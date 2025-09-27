import type { FeasibilityAnalysis, Idea, LLMAnalysis, MarketAnalysis, Mentor, Student } from "@/types/mentor"

export const mockMarketAnalysis: MarketAnalysis = {
  marketSize: 2.5,
  competitorCount: 15,
  growthRate: 12.5,
  strengths: [
    "Innovative AI-powered approach",
    "Strong technical foundation",
    "Clear value proposition",
    "Scalable architecture",
  ],
  weaknesses: [
    "Limited market research",
    "High development costs",
    "Dependency on third-party APIs",
    "Lack of user testing",
  ],
  opportunities: [
    "Growing demand for AI solutions",
    "Potential partnerships with universities",
    "Government funding for innovation",
    "International market expansion",
  ],
  threats: ["Established competitors", "Regulatory changes", "Technology obsolescence", "Economic downturn impact"],
  feasibilityScore: 7.8,
  marketTrends: [
    { period: "Q1 2024", value: 100, category: "Market Interest" },
    { period: "Q2 2024", value: 125, category: "Market Interest" },
    { period: "Q3 2024", value: 150, category: "Market Interest" },
    { period: "Q4 2024", value: 180, category: "Market Interest" },
    { period: "Q1 2025", value: 220, category: "Market Interest" },
  ],
}

export const mockFeasibilityAnalysis: FeasibilityAnalysis = {
  marketFeasibility: {
    targetMarket: {
      description: "Students, faculty, and visitors navigating large university campuses",
      size: 5000000,
      demographics: ["College Students (18-25)", "Faculty/Staff (25-65)", "Campus Visitors", "International Students"]
    },
    marketSize: 2.5,
    growthPotential: 85,
    competition: {
      count: 12,
      mainCompetitors: ["Google Maps", "Apple Maps", "Mapbox", "Campus-specific apps"],
      competitiveAdvantage: ["AR Integration", "Real-time accessibility features", "Campus-specific optimization"]
    },
    pricingStrategy: {
      model: "Freemium with institutional licensing",
      priceRange: "$10,000-50,000 per campus per year",
      salesChannels: ["Direct sales to universities", "Educational technology distributors", "Online marketplace"]
    }
  },
  financialFeasibility: {
    startupCosts: {
      total: 150000,
      breakdown: [
        { category: "Development", amount: 80000 },
        { category: "Equipment & Software", amount: 25000 },
        { category: "Legal & Compliance", amount: 15000 },
        { category: "Marketing & Branding", amount: 20000 },
        { category: "Operational Setup", amount: 10000 }
      ]
    },
    operationalCosts: {
      monthly: 25000,
      breakdown: [
        { category: "Development Team", amount: 15000 },
        { category: "Infrastructure & Hosting", amount: 3000 },
        { category: "Sales & Marketing", amount: 4000 },
        { category: "Operations", amount: 2000 },
        { category: "Contingency", amount: 1000 }
      ]
    },
    revenueProjections: {
      year1: 75000,
      year2: 250000,
      year3: 500000,
      year4: 850000,
      year5: 1200000
    },
    fundingNeeds: {
      amount: 500000,
      sources: ["Angel investors", "Venture capital", "Government grants", "University partnerships"]
    },
    breakEvenPoint: {
      months: 18,
      unitsOrRevenue: 300000
    }
  },
  technicalFeasibility: {
    technologyScore: 78,
    requiredTechnology: ["AR Framework (ARKit/ARCore)", "Real-time mapping APIs", "Cloud infrastructure", "Mobile development", "AI/ML for pathfinding"],
    teamExpertise: 75,
    scalabilityScore: 82,
    integrationComplexity: 65,
    developmentTimeline: [
      { phase: "MVP Development", duration: "3 months", status: "completed" },
      { phase: "Beta Testing", duration: "2 months", status: "in-progress" },
      { phase: "Market Launch", duration: "1 month", status: "pending" },
      { phase: "Scale & Optimize", duration: "6 months", status: "pending" }
    ]
  },
  organizationalFeasibility: {
    managementScore: 72,
    teamStrength: 80,
    leadershipExperience: ["10+ years in mobile development", "5+ years in AR/VR", "Previous startup experience", "University partnerships"],
    nonFinancialResources: ["University lab access", "Student testing groups", "Faculty advisors", "Alumni network"],
    intellectualProperty: {
      patents: 2,
      trademarks: 1,
      copyrights: 3
    }
  },
  legalRegulatoryFeasibility: {
    complianceScore: 88,
    requiredLicenses: ["Business license", "Software distribution license"],
    regulatoryCompliance: ["GDPR compliance", "FERPA compliance", "Accessibility standards (ADA)", "Data privacy regulations"],
    intellectualPropertyRisks: ["Patent infringement from mapping technologies", "Trademark conflicts with existing navigation apps"]
  },
  riskAssessment: {
    financialRisks: [
      { risk: "Higher than expected development costs", probability: 60, impact: 75 },
      { risk: "Slower revenue growth", probability: 45, impact: 80 },
      { risk: "Difficulty securing funding", probability: 35, impact: 90 }
    ],
    marketRisks: [
      { risk: "Low adoption by universities", probability: 40, impact: 85 },
      { risk: "Competition from tech giants", probability: 70, impact: 70 },
      { risk: "Technology becoming obsolete", probability: 25, impact: 95 }
    ],
    operationalRisks: [
      { risk: "Key team member departure", probability: 30, impact: 70 },
      { risk: "Technical difficulties with AR", probability: 50, impact: 60 },
      { risk: "Scalability issues", probability: 35, impact: 65 }
    ],
    overallRiskScore: 58
  }
}

export const mockLLMAnalysis: LLMAnalysis = {
  overall_confidence: 0.5,
  problem_and_market_score: 3,
  value_and_model_score: 4,
  team_and_traction_score: 2,
  funding_readiness_score: 4,
  strengths: [
    "Clear product/service definition (metal fabrication of items like grills, gates, ladders, boxes, tables).",
    "Identified target customer segments including construction companies, restaurants, retail stores, home builders, and contractors.",
    "Strong value proposition focusing on high quality materials and workmanship, reliability, competitive pricing, expert technicians, a problem-solving approach, continuous improvement, warranty, and free delivery within 10km.",
    "Detailed initial financial projections for the setup phase and the first year of operations (sustenance and expansion phases).",
    "Identified key resources (shop, machinery, power, water, phone) and raw material suppliers (local distributors, hardware stores, wholesale metal market).",
    "Commitment to continuous improvement and attention to customer problems.",
  ],
  weaknesses: [
    "Lack of detailed market sizing and segmentation for the identified customer base.",
    "The claim of 'No competitors around Ekme' is a significant assertion that lacks detailed justification and suggests insufficient competitive analysis or a very limited geographic scope that needs explicit clarification.",
    "Limited information on the founder's specific expertise in metal fabrication or prior entrepreneurial experience.",
    "No explicit evidence of market validation or initial traction (e.g., pre-orders, customer interviews, pilot projects).",
    "The pricing strategy of being 'below competitors' while simultaneously offering 'high quality' needs further justification to ensure long-term profitability and sustainability.",
    "Assumptions for achieving target sales and desired profits are not elaborated upon, making the financial projections less robust.",
    "The promotion plan is basic (posters, social media, word of mouth) with a very small budget (Rs. 500), which may be insufficient for effective market penetration.",
  ],
  prioritized_actions: [
    "Conduct thorough market research to validate the 'no competitors' claim, accurately size the market, and identify specific customer needs and pain points in the target area.",
    "Develop a detailed competitive analysis, including pricing strategies, strengths, and weaknesses of existing players in the broader region.",
    "Refine the pricing strategy to ensure profitability while maintaining competitiveness, clearly articulating how 'high quality' and 'below competitors' will be balanced.",
    "Provide a more robust sales forecast with clear assumptions and methodologies to support the projected revenue and profit figures.",
    "Detail the founder's and any key team members' relevant experience and skills in metal fabrication and business management to bolster confidence in execution.",
    "Outline initial market validation efforts (e.g., customer interviews, small pilot projects, pre-orders) to demonstrate early customer interest and demand.",
    "Expand the promotion plan with a more realistic budget and specific tactics for effectively reaching target customer segments.",
  ],
  red_flags: [
    "The unsubstantiated claim of 'No competitors around Ekme' raises concerns about the thoroughness of market research.",
    "A very low promotion budget (Rs. 500) for a new business is unrealistic and suggests a lack of understanding of marketing needs.",
    "Lack of specific details regarding the founder's direct expertise in metal fabrication, which is the core business.",
  ],
  risk_assessment:
    "Moderate to High Risk. The business operates in a traditional industry with identified demand. However, the lack of detailed market analysis, competitive understanding, and initial traction, combined with a potentially unsustainable pricing strategy and a very limited marketing budget, significantly increases the risk. The reliance on a substantial loan without robust, detailed sales projections adds financial risk. Success heavily depends on the founder's unstated expertise and ability to execute on the quality and service promises.",
  automated_feedback: null,
  extracted_kpis: [
    "Total Business Setup Cost (First Month): Rs. 410,000",
    "Loan Requirement for Business Setup Phase: Rs. 210,000",
    "Estimated Fixed Costs per month (Sustenance Phase): Rs. 28,900",
    "Desired Profit per month (Sustenance Phase): Rs. 15,000",
    "Expected Total Value of Sales per month (Sustenance Phase): Rs. 43,900",
    "Unit Price (Sustenance Phase): Rs. 1,464",
    "Loan Requirement for Business Sustenance Phase (2-7 months): Rs. 173,400",
    "Expected Profit at end of Sustenance Phase: Rs. 90,000",
    "Estimated Fixed Costs per month (Expansion Phase): Rs. 33,200",
    "Desired Profit per month (Expansion Phase): Rs. 17,000",
    "Expected Total Value of Sales per month (Expansion Phase): Rs. 50,200",
    "Unit Price (Expansion Phase): Rs. 1,674",
    "Loan Requirement for Business Expansion Phase (8-12 months): Rs. 166,000",
    "Planned number of employees: 2",
  ],
}

export const mockIdeas: Idea[] = [
  {
    id: "1",
    studentId: "s1",
    name: "Metal Fabrication Business",
    description:
      "A comprehensive metal fabrication business focusing on custom grills, gates, ladders, boxes, and tables for construction companies, restaurants, and retail stores.",
    tags: ["Manufacturing", "Metal Fabrication", "Construction", "Business"],
    rawFiles: [
      { id: "f1", name: "business-plan.pdf", type: "application/pdf", size: 2048000, url: "/files/business-plan.pdf" },
      {
        id: "f2",
        name: "financial-projections.xlsx",
        type: "application/xlsx",
        size: 1024000,
        url: "/files/financial-projections.xlsx",
      },
    ],
    formattedFile: {},
    feedback: {},
    comments: [
      {
        id: "c1",
        text: "Great business concept with clear target market identification. However, the competitive analysis needs strengthening.",
        author: "Dr. Sarah Thompson",
        authorRole: "mentor",
        timestamp: new Date("2024-01-16T10:30:00"),
        isVisible: true,
      },
      {
        id: "c2",
        text: "The financial projections look promising, but consider increasing the marketing budget significantly.",
        author: "Dr. Sarah Thompson",
        authorRole: "mentor",
        timestamp: new Date("2024-01-16T14:15:00"),
        isVisible: true,
      },
      {
        id: "c3",
        text: "Internal note: Student shows good understanding of operations but lacks market validation evidence.",
        author: "Dr. Sarah Thompson",
        authorRole: "mentor",
        timestamp: new Date("2024-01-16T16:45:00"),
        isVisible: false,
      },
    ],
    transcribe: {},
    mentorRemarks: {
      Score: 6.5,
      potentialCategory: "Medium",
    },
    submittedAt: new Date("2024-01-15"),
    marketAnalysis: mockMarketAnalysis,
    llmAnalysis: mockLLMAnalysis,
    feasibilityAnalysis: mockFeasibilityAnalysis,
  },
  {
    id: "2",
    studentId: "s1",
    name: "Smart Campus Navigation",
    description:
      "AR-based navigation system for university campuses with real-time updates and accessibility features.",
    tags: ["AR", "Navigation", "Accessibility", "Mobile"],
    rawFiles: [
      { id: "f3", name: "design.figma", type: "application/figma", size: 1024000, url: "/files/design.figma" },
    ],
    formattedFile: {},
    feedback: {},
    comments: [
      {
        id: "c1",
        text: "Innovative use of AR",
        author: "Dr. Smith",
        authorRole: "mentor" as const,
        timestamp: new Date("2024-02-02"),
        isVisible: true
      },
      {
        id: "c2", 
        text: "Consider battery optimization",
        author: "Dr. Smith",
        authorRole: "mentor" as const,
        timestamp: new Date("2024-02-03"),
        isVisible: true
      }
    ],
    transcribe: {},
    mentorRemarks: {
      Score: 7.2,
      potentialCategory: "Medium",
    },
    submittedAt: new Date("2024-02-01"),
    marketAnalysis: {
      ...mockMarketAnalysis,
      marketSize: 1.2,
      competitorCount: 8,
      feasibilityScore: 6.5,
    },
    feasibilityAnalysis: mockFeasibilityAnalysis,
  },
  {
    id: "3",
    studentId: "s2",
    name: "Sustainable Energy Monitor",
    description: "IoT-based system for monitoring and optimizing energy consumption in residential buildings.",
    tags: ["IoT", "Sustainability", "Energy", "Smart Home"],
    rawFiles: [],
    formattedFile: {},
    feedback: {},
    comments: [
      {
        id: "c3",
        text: "Addresses important environmental concerns",
        author: "Dr. Smith", 
        authorRole: "mentor" as const,
        timestamp: new Date("2024-02-04"),
        isVisible: true
      },
      {
        id: "c4",
        text: "Hardware costs might be high",
        author: "Dr. Smith",
        authorRole: "mentor" as const,
        timestamp: new Date("2024-02-05"),
        isVisible: true
      }
    ],
    transcribe: {},
    mentorRemarks: {
      Score: 7.8,
      potentialCategory: "High",
    },
    submittedAt: new Date("2024-01-28"),
    marketAnalysis: {
      ...mockMarketAnalysis,
      marketSize: 3.8,
      competitorCount: 25,
      feasibilityScore: 8.2,
    },
    feasibilityAnalysis: mockFeasibilityAnalysis,
  },
]

export const mockStudents: Student[] = [
  {
    id: "s1",
    name: "Alice Johnson",
    email: "alice.johnson@university.edu",
    avatar: "/placeholder-gdcur.png",
    department: "Computer Science",
    year: 3,
    ideasCount: 2,
  },
  {
    id: "s2",
    name: "Bob Smith",
    email: "bob.smith@university.edu",
    avatar: "/placeholder-cn9yy.png",
    department: "Engineering",
    year: 4,
    ideasCount: 1,
  },
  {
    id: "s3",
    name: "Carol Davis",
    email: "carol.davis@university.edu",
    avatar: "/placeholder-df7lv.png",
    department: "Business",
    year: 2,
    ideasCount: 3,
  },
  {
    id: "s4",
    name: "David Wilson",
    email: "david.wilson@university.edu",
    avatar: "/student-david-studying.png",
    department: "Design",
    year: 3,
    ideasCount: 1,
  },
]

export const mockMentor: Mentor = {
  id: "m1",
  name: "Dr. Sarah Thompson",
  email: "sarah.thompson@university.edu",
  department: "Innovation Lab",
  students: mockStudents,
}
