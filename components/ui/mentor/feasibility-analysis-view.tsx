"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { FeasibilityAnalysis } from "@/types/mentor"
import {
    AlertTriangle,
    Building,
    CheckCircle,
    DollarSign,
    Scale,
    Shield,
    Target,
    Zap
} from "lucide-react"
import { Bar, BarChart, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface FeasibilityAnalysisViewProps {
  analysis: FeasibilityAnalysis
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

// Custom tooltip formatter for financial data
const formatCurrency = (value: number) => `$${(value / 1000).toFixed(0)}K`
const formatPercentage = (value: number) => `${value.toFixed(1)}%`

export default function FeasibilityAnalysisView({ analysis }: FeasibilityAnalysisViewProps) {
  // Prepare data for charts
  const startupCostsData = analysis.financialFeasibility.startupCosts.breakdown.map(item => ({
    name: item.category,
    value: item.amount
  }))

  const operationalCostsData = analysis.financialFeasibility.operationalCosts.breakdown.map(item => ({
    name: item.category,
    value: item.amount
  }))

  const revenueProjectionsData = [
    { year: 'Year 1', revenue: analysis.financialFeasibility.revenueProjections.year1 },
    { year: 'Year 2', revenue: analysis.financialFeasibility.revenueProjections.year2 },
    { year: 'Year 3', revenue: analysis.financialFeasibility.revenueProjections.year3 },
    { year: 'Year 4', revenue: analysis.financialFeasibility.revenueProjections.year4 },
    { year: 'Year 5', revenue: analysis.financialFeasibility.revenueProjections.year5 },
  ]

  const riskData = [
    { category: 'Financial', score: 100 - analysis.riskAssessment.financialRisks.reduce((acc, risk) => acc + (risk.probability * risk.impact / 100), 0) / analysis.riskAssessment.financialRisks.length },
    { category: 'Market', score: 100 - analysis.riskAssessment.marketRisks.reduce((acc, risk) => acc + (risk.probability * risk.impact / 100), 0) / analysis.riskAssessment.marketRisks.length },
    { category: 'Operational', score: 100 - analysis.riskAssessment.operationalRisks.reduce((acc, risk) => acc + (risk.probability * risk.impact / 100), 0) / analysis.riskAssessment.operationalRisks.length },
  ]

  const feasibilityScores = [
    { area: 'Market', score: analysis.marketFeasibility.growthPotential },
    { area: 'Financial', score: (analysis.financialFeasibility.revenueProjections.year3 / 1000000) * 20 },
    { area: 'Technical', score: analysis.technicalFeasibility.technologyScore },
    { area: 'Organizational', score: analysis.organizationalFeasibility.managementScore },
    { area: 'Legal', score: analysis.legalRegulatoryFeasibility.complianceScore },
  ]

  return (
    <div className="space-y-8">
      {/* Overall Feasibility Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Target className="h-4 w-4 mr-2" />
              Market
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysis.marketFeasibility.growthPotential}%</div>
            <Progress value={analysis.marketFeasibility.growthPotential} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Financial
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(analysis.financialFeasibility.revenueProjections.year3 / 1000).toFixed(0)}K</div>
            <p className="text-xs text-muted-foreground">Year 3 Revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Zap className="h-4 w-4 mr-2" />
              Technical
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysis.technicalFeasibility.technologyScore}%</div>
            <Progress value={analysis.technicalFeasibility.technologyScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Building className="h-4 w-4 mr-2" />
              Organizational
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysis.organizationalFeasibility.managementScore}%</div>
            <Progress value={analysis.organizationalFeasibility.managementScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Scale className="h-4 w-4 mr-2" />
              Legal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysis.legalRegulatoryFeasibility.complianceScore}%</div>
            <Progress value={analysis.legalRegulatoryFeasibility.complianceScore} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Market Feasibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Market Feasibility
          </CardTitle>
          <CardDescription>
            Analysis of market demand, size, and competitive landscape
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Target Market</h4>
              <p className="text-sm text-muted-foreground mb-3">{analysis.marketFeasibility.targetMarket.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Market Size:</span>
                  <span className="text-sm font-medium">{(analysis.marketFeasibility.targetMarket.size / 1000000).toFixed(1)}M users</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">TAM:</span>
                  <span className="text-sm font-medium">${analysis.marketFeasibility.marketSize}B</span>
                </div>
              </div>
              <div className="mt-4">
                <h5 className="font-medium mb-2">Demographics</h5>
                <div className="flex flex-wrap gap-2">
                  {analysis.marketFeasibility.targetMarket.demographics.map((demo, index) => (
                    <Badge key={index} variant="outline">{demo}</Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Competition Analysis</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Direct Competitors:</span>
                  <Badge variant="secondary">{analysis.marketFeasibility.competition.count}</Badge>
                </div>
                <div>
                  <span className="text-sm font-medium">Main Competitors:</span>
                  <div className="mt-2 space-y-1">
                    {analysis.marketFeasibility.competition.mainCompetitors.map((competitor, index) => (
                      <div key={index} className="text-sm text-muted-foreground">• {competitor}</div>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium">Competitive Advantages:</span>
                  <div className="mt-2 space-y-1">
                    {analysis.marketFeasibility.competition.competitiveAdvantage.map((advantage, index) => (
                      <div key={index} className="text-sm text-green-600 flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {advantage}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Pricing Strategy</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm font-medium">Model:</span>
                <p className="text-sm text-muted-foreground">{analysis.marketFeasibility.pricingStrategy.model}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Price Range:</span>
                <p className="text-sm text-muted-foreground">{analysis.marketFeasibility.pricingStrategy.priceRange}</p>
              </div>
              <div>
                <span className="text-sm font-medium">Sales Channels:</span>
                <div className="mt-1">
                  {analysis.marketFeasibility.pricingStrategy.salesChannels.map((channel, index) => (
                    <Badge key={index} variant="outline" className="mr-1 mb-1">{channel}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Feasibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Financial Feasibility
          </CardTitle>
          <CardDescription>
            Comprehensive financial analysis including costs, revenue projections, and funding requirements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Startup Costs Chart */}
            <div>
              <h4 className="font-semibold mb-3">Startup Costs Breakdown</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={startupCostsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {startupCostsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [formatCurrency(value), 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">${(analysis.financialFeasibility.startupCosts.total / 1000).toFixed(0)}K</div>
                <p className="text-sm text-muted-foreground">Total Startup Investment</p>
              </div>
            </div>

            {/* Revenue Projections Chart */}
            <div>
              <h4 className="font-semibold mb-3">Revenue Projections</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueProjectionsData}>
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [formatCurrency(value), 'Revenue']} />
                    <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold">${(analysis.financialFeasibility.revenueProjections.year5 / 1000).toFixed(0)}K</div>
                <p className="text-sm text-muted-foreground">Projected Year 5 Revenue</p>
              </div>
            </div>
          </div>

          {/* Key Financial Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Monthly OpEx</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">${(analysis.financialFeasibility.operationalCosts.monthly / 1000).toFixed(0)}K</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Funding Needed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">${(analysis.financialFeasibility.fundingNeeds.amount / 1000).toFixed(0)}K</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Break-even</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{analysis.financialFeasibility.breakEvenPoint.months}M</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">ROI Year 3</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-green-600">
                  {(((analysis.financialFeasibility.revenueProjections.year3 - (analysis.financialFeasibility.operationalCosts.monthly * 36)) / analysis.financialFeasibility.startupCosts.total) * 100).toFixed(0)}%
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Technical Feasibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2" />
            Technical Feasibility
          </CardTitle>
          <CardDescription>
            Assessment of technical requirements, team capabilities, and development timeline
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Technology Scores</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Technology Readiness</span>
                    <span className="text-sm font-medium">{analysis.technicalFeasibility.technologyScore}%</span>
                  </div>
                  <Progress value={analysis.technicalFeasibility.technologyScore} />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Team Expertise</span>
                    <span className="text-sm font-medium">{analysis.technicalFeasibility.teamExpertise}%</span>
                  </div>
                  <Progress value={analysis.technicalFeasibility.teamExpertise} />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Scalability</span>
                    <span className="text-sm font-medium">{analysis.technicalFeasibility.scalabilityScore}%</span>
                  </div>
                  <Progress value={analysis.technicalFeasibility.scalabilityScore} />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Required Technologies</h4>
              <div className="space-y-2">
                {analysis.technicalFeasibility.requiredTechnology.map((tech, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">{tech}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Development Timeline</h4>
              <div className="space-y-2">
                {analysis.technicalFeasibility.developmentTimeline.map((phase, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      {phase.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500 mr-2" />}
                      {phase.status === 'in-progress' && <Zap className="h-4 w-4 text-yellow-500 mr-2" />}
                      {phase.status === 'pending' && <AlertTriangle className="h-4 w-4 text-gray-400 mr-2" />}
                      <span className="text-sm">{phase.phase}</span>
                    </div>
                    <Badge variant={
                      phase.status === 'completed' ? 'default' : 
                      phase.status === 'in-progress' ? 'secondary' : 'outline'
                    }>
                      {phase.duration}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Risk Assessment
          </CardTitle>
          <CardDescription>
            Comprehensive analysis of potential risks and mitigation strategies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Risk Categories</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={riskData}>
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [formatPercentage(value), 'Score']} />
                    <Bar dataKey="score" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">High-Impact Risks</h4>
              <div className="space-y-3">
                {[...analysis.riskAssessment.financialRisks, ...analysis.riskAssessment.marketRisks, ...analysis.riskAssessment.operationalRisks]
                  .sort((a, b) => (b.probability * b.impact) - (a.probability * a.impact))
                  .slice(0, 5)
                  .map((risk, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-medium">{risk.risk}</span>
                        <Badge variant={
                          risk.probability * risk.impact > 4000 ? 'destructive' :
                          risk.probability * risk.impact > 2500 ? 'secondary' : 'outline'
                        }>
                          {((risk.probability * risk.impact) / 100).toFixed(0)}% Risk Score
                        </Badge>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Probability: {risk.probability}%</span>
                        <span>Impact: {risk.impact}%</span>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{analysis.riskAssessment.overallRiskScore}%</div>
            <p className="text-sm text-muted-foreground">Overall Risk Score</p>
          </div>
        </CardContent>
      </Card>

      {/* Organizational & Legal Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="h-5 w-5 mr-2" />
              Organizational Feasibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-2xl font-bold">{analysis.organizationalFeasibility.managementScore}%</div>
                <p className="text-sm text-muted-foreground">Management Score</p>
              </div>
              <div>
                <div className="text-2xl font-bold">{analysis.organizationalFeasibility.teamStrength}%</div>
                <p className="text-sm text-muted-foreground">Team Strength</p>
              </div>
            </div>
            
            <div>
              <h5 className="font-medium mb-2">Leadership Experience</h5>
              <div className="space-y-1">
                {analysis.organizationalFeasibility.leadershipExperience.map((exp, index) => (
                  <div key={index} className="text-sm text-muted-foreground flex items-center">
                    <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                    {exp}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h5 className="font-medium mb-2">Intellectual Property</h5>
              <div className="flex justify-between text-sm">
                <span>Patents: {analysis.organizationalFeasibility.intellectualProperty.patents}</span>
                <span>Trademarks: {analysis.organizationalFeasibility.intellectualProperty.trademarks}</span>
                <span>Copyrights: {analysis.organizationalFeasibility.intellectualProperty.copyrights}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Scale className="h-5 w-5 mr-2" />
              Legal & Regulatory
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-2xl font-bold text-green-600">{analysis.legalRegulatoryFeasibility.complianceScore}%</div>
              <p className="text-sm text-muted-foreground">Compliance Score</p>
            </div>

            <div>
              <h5 className="font-medium mb-2">Required Licenses</h5>
              <div className="space-y-1">
                {analysis.legalRegulatoryFeasibility.requiredLicenses.map((license, index) => (
                  <Badge key={index} variant="outline" className="mr-1 mb-1">{license}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h5 className="font-medium mb-2">Regulatory Compliance</h5>
              <div className="space-y-1">
                {analysis.legalRegulatoryFeasibility.regulatoryCompliance.map((regulation, index) => (
                  <div key={index} className="text-sm text-muted-foreground flex items-center">
                    <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                    {regulation}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}