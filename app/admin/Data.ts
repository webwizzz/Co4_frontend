// Centralized dummy data for mentors, students, and ideas

export interface Mentor {
  id: number;
  name: string;
  status: string;
}

export interface Student {
  id: number;
  name: string;
  status: string;
  report: "Best" | "Mediocre" | "Low";
  assignedMentor: string;
}

// Expanded Idea interface to match business plan schema
type RawFile = {
  name: string;
  url: string;
  publicId: string;
  uploadDate: { $date: string };
  _id: { $oid: string };
};

type MentorRemarks = {
  Score: number;
  potentialCategory: string;
};

type FormattedFile = {
  title: string;
  tagline: string | null;
  vision: string | null;
  mission: string | null;
  language: string;
  stage: string;
  summary: string | null;
  problem_and_customer: string;
  solution_and_features: string;
  market_and_competitors: string;
  channels_and_revenue: string;
  operations_and_team: string;
  traction_and_funding: string;
  risks_and_mitigation: string | null;
  social_and_environmental_impact: string | null;
};

type Feedback = {
  submission_id: string;
  feedback_timestamp: string;
  current_strength_level: string;
  overall_completeness: number;
  high_priority_improvements: any[];
  medium_priority_improvements: any[];
  low_priority_improvements: any[];
  next_steps_this_week: string[];
  research_assignments: string[];
  questions_to_answer: string[];
  what_youre_doing_well: string[];
  motivational_note: string;
  estimated_hours_to_improve: number;
};

export interface Idea {
  id: number;
  title: string;
  description: string;
  status: "Approved" | "Pending" | "Rejected";
  tags?: string[];
  rawFiles?: RawFile[];
  comments?: any[];
  mentorRemarks?: MentorRemarks;
  createdAt?: { $date: string };
  updatedAt?: { $date: string };
  transcribe?: string;
  formattedFile?: FormattedFile;
  feedback?: Feedback;
}

export const mentors: Mentor[] = [
  { id: 1, name: "Priya Sharma", status: "Pending" },
  { id: 2, name: "Amit Patel", status: "Active" },
  { id: 3, name: "Neha Gupta", status: "Active" },
];

export const students: Student[] = [
  { id: 1, name: "Ravi Kumar", status: "Active", report: "Best", assignedMentor: "Priya Sharma" },
  { id: 2, name: "Asha Singh", status: "Active", report: "Mediocre", assignedMentor: "Priya Sharma" },
  { id: 3, name: "Rahul Verma", status: "Active", report: "Low", assignedMentor: "Priya Sharma" },
  { id: 4, name: "Simran Kaur", status: "Active", report: "Best", assignedMentor: "Priya Sharma" },
];

export const ideas: Idea[] = [
  {
    id: 1,
    title: "Business Plan",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    status: "Approved",
    tags: ["startup", "market"],
    rawFiles: [
      {
        name: "sample_odia_2.pdf",
        url: "https://res.cloudinary.com/dzhthc1g9/image/upload/v1758988129/raw-files/students/68d7b4818e42b4d2d38b86a0/1758988115163_0_sample_odia_2.pdf",
        publicId: "raw-files/students/68d7b4818e42b4d2d38b86a0/1758988115163_0_sample_odia_2",
        uploadDate: { $date: "2025-09-27T15:48:49.270Z" },
        _id: { $oid: "68d807619a044bc9e2dfe9c2" }
      }
    ],
    comments: [],
    mentorRemarks: {
      Score: 8,
      potentialCategory: "High"
    },
    createdAt: { $date: "2025-09-27T15:48:49.274Z" },
    updatedAt: { $date: "2025-09-27T15:48:49.274Z" },
    transcribe: '[{"page_number": 1, "text_content": ["Skilled in", "ODISHA", "TATA", "STRIVES", "Bright Futura", "Deviant of the Trans", "Accelerated Entrepreneurship Development Program for Nano Unicorns", "ନାନୋ ୟୁନିକର୍ମ ପାଇଁ ତ୍ବରିତ ଉଦ୍ୟୋଗ ବିକାଶ କାର୍ଯ୍ୟକ୍ରମ", "Business Plan", "ବ୍ୟବସାୟ ଯୋଜନା", "Participant Profile", "ଅଂଶଗ୍ରହଣକାରୀଙ୍କର ପ୍ରୋଫାଇଲ", "Name", "ନାମ", "Education", "ଶିକ୍ଷା", "Panesh Kuman Nayak", "graduation (B.SC statistic Hons)", "Address", "ଠିକଣା", "Phone Number", "ଫୋନ୍ ନମ୍ବର", "Email ID", "ଇମେଲ୍ ଆଇଡ଼ି", "Product/Service", "ଉଟପାଦ / ସେବା", "Name of your business and logo.", "ଆପଣଙ୍କ ବ୍ୟବସାୟ ର ନାମ ଓ ଲୋଗୋ।", "Is there anyone who is supporting you", "Stc)", "in the business? (friends, family etc.)", "କଣ କେହି ଅଛନ୍ତି ଯିଏ ଆପଣଙ୍କୁ", "ଆପଣଙ୍କର ବ୍ୟବସାୟ ରେ ସମର୍ଥନ", "କରୁଛନ୍ତି? (ବନ୍ଧୁଗାଁ, ପରିବାର ବର୍ଗ ଇତ୍ୟାଦି)", "Main product/service that you want", "to provide", "ଆପଣ ପ୍ରଦାନ କରିବାକୁ ଚାହୁଁଥ‌ିବା ମୁଖ୍ୟ", "ଉତ୍ପାଦ । ସେବା", "Shree Ganesh Welding & Fabrica-", "tion. #177", "members", "Fred", "Yes, Family members, friends, I", "etc.", "aletal welding (gate, grill,,", "door etc.)"], "full_text": "Skilled in\nODISHA\nTATA\nSTRIVES\nBright Futura\nDeviant of the Trans\nAccelerated Entrepreneurship Development Program for Nano Unicorns\nନାନୋ ୟୁନିକର୍ମ ପାଇଁ ତ୍ବରିତ ଉଦ୍ୟୋଗ ବିକାଶ କାର୍ଯ୍ୟକ୍ରମ\nBusiness Plan\nବ୍ୟବସାୟ ଯୋଜନା\nParticipant Profile\nଅଂଶଗ୍ରହଣକାରୀଙ୍କର ପ୍ରୋଫାଇଲ\nName\nନାମ\nEducation\nଶିକ୍ଷା\nPanesh Kuman Nayak\ngraduation (B.SC statistic Hons)\nAddress\nଠିକଣା\nPhone Number\nଫୋନ୍ ନମ୍ବର\nEmail ID\nଇମେଲ୍ ଆଇଡ଼ି\nProduct/Service\nଉଟପାଦ / ସେବା\nName of your business and logo.\nଆପଣଙ୍କ ବ୍ୟବସାୟ ର ନାମ ଓ ଲୋଗୋ।\nIs there anyone who is supporting you\nStc)\nin the business? (friends, family etc.)\nକଣ କେହି ଅଛନ୍ତି ଯିଏ ଆପଣଙ୍କୁ\nଆପଣଙ୍କର ବ୍ୟବସାୟ ରେ ସମର୍ଥନ\nକରୁଛନ୍ତି? (ବନ୍ଧୁଗାଁ, ପରିବାର ବର୍ଗ ଇତ୍ୟାଦି)\nMain product/service that you want\nto provide\nଆପଣ ପ୍ରଦାନ କରିବାକୁ ଚାହୁଁଥ‌ିବା ମୁଖ୍ୟ\nଉତ୍ପାଦ । ସେବା\nShree Ganesh Welding & Fabrica-\ntion. #177\nmembers\nFred\nYes, Family members, friends, I\netc.\naletal welding (gate, grill,,\ndoor etc.)", "has_content": true, "detected_languages": ["Devanagari_Script", "Odia", "Latin_Script"]}]',
    formattedFile: {
      title: "Shree Ganesh Welding & Fabrication",
      tagline: null,
      vision: null,
      mission: "To provide the best metal products.",
      language: "English",
      stage: "Early-stage, progressing through setup, sustenance (2-7 months), and expansion (8-12 months) phases.",
      summary: null,
      problem_and_customer: "Customers in nearby villages and contractors need fabricated metal products like gates, grills, and doors. They seek quality products, timely delivery, and correct pricing.",
      solution_and_features: "The business will provide metal welding and fabrication services for items such as gates, grills, and doors. Key features include providing the best metal products, offering perfect size and design, and free transport within a 5km radius.",
      market_and_competitors: "Competitors exist in the market. The business aims to differentiate itself through perfect product size and design, quality products, timely delivery, and correct pricing. Pricing will be competitive, as indicated by 'Price a delivery Competitor 0102 67/19 price'.",
      channels_and_revenue: "Customers will be reached through advertisements, banners, posters, online marketing, Facebook, and direct phone contact. Expected monthly sales are approximately Rupees 57,833 during the sustenance phase and Rupees 60,550 during the expansion phase. The business aims for a profit of 2,00,000 after 1 year.",
      operations_and_team: "The business will be supported by family members and friends. Required infrastructure includes a room (office/shop), storage space, electricity, and a phone. Raw materials such as iron material, aluminium, electrodes, and welding equipment will be sourced from a new wholesale market. Transport will be required for raw materials and finished products. The business plans to set up a shop/office in a village location (AT/PO - Kusiapal, Kendrapara) due to local demand and accessibility. Employees will be hired, as indicated by 'labour Salary' in running costs.",
      traction_and_funding: "The total estimated business setup cost for the first month is Rs. 3,62,000. A loan requirement of Rupees 1,62,000 is identified for the setup phase. For the business expansion phase, a loan requirement of 42,500 Rupees is noted.",
      risks_and_mitigation: null,
      social_and_environmental_impact: null
    },
    feedback: {
      submission_id: "BP_001",
      feedback_timestamp: "2025-09-27T18:04:15.010032Z",
      current_strength_level: "Beginner",
      overall_completeness: 40,
      high_priority_improvements: [
        {
          section: "Problem Your Service Resolves",
          priority: "High",
          current_issue: "The business plan does not clearly articulate which specific problems or pain points of customers your welding and fabrication service will resolve.",
          specific_action: "Clearly define the specific challenges or needs that your target customers (village people, contractors) face regarding welding and fabrication services, and how your business directly addresses these.",
          why_important: "A clear understanding of the customer's problem is fundamental. It helps you position your service, attract the right customers, and ensure your offerings are truly valuable.",
          resources_needed: "Conduct customer interviews, observe current market gaps, analyze common complaints about existing services."
        },
        {
          section: "Unique Selling Proposition (USP)",
          priority: "High",
          current_issue: "While you mentioned 'Best wetal product provide' and 'Free transport within skry radius, Quality product, within time delivery, correct price', these are generic and lack specific differentiation from competitors.",
          specific_action: "Identify and articulate a truly unique selling proposition. What makes Shree Ganesh Welding & Fabrication distinctly better or different? Is it a specialized skill, a unique material, exceptional speed, a specific guarantee, or a niche focus?",
          why_important: "A strong USP is crucial for standing out in a competitive market. It gives customers a compelling reason to choose your service over others and helps in targeted marketing.",
          resources_needed: "In-depth competitor analysis, brainstorming sessions, customer feedback on what they value most."
        },
        {
          section: "Market Research Findings",
          priority: "High",
          current_issue: "The section 'What have you found about your customers through market research?' is left unanswered, indicating a lack of documented research.",
          specific_action: "Actively conduct primary market research. This involves talking directly to potential customers (village residents, local contractors) to understand their needs, preferences, budget, and current experiences with welding services. Document your findings.",
          why_important: "Market research validates your business idea and assumptions. It provides concrete data to inform your service offerings, pricing, and marketing strategies, reducing risk and increasing the likelihood of success.",
          resources_needed: "Interview guides, survey questionnaires, local community forums, direct conversations."
        },
        {
          section: "Competitive Advantage",
          priority: "High",
          current_issue: "The plan does not clearly explain 'How is your product/service better than your competitors?' beyond general statements.",
          specific_action: "Based on your competitor research, clearly outline the specific advantages your business offers. For example, if competitors are slow, highlight your 'within time delivery' with a specific timeframe. If they are expensive, show how your 'correct price' offers better value.",
          why_important: "Understanding and articulating your competitive advantage allows you to effectively communicate your value to customers and develop strategies to outperform rivals.",
          resources_needed: "Detailed analysis of competitor services, pricing, customer reviews, and operational efficiency."
        },
        {
          section: "Financial Projections (Annexures A, B, C)",
          priority: "High",
          current_issue: "The financial calculations across the setup, sustenance, and expansion phases are incomplete, inconsistent, and difficult to interpret due to messy entries and unclear figures (e.g., '350% | —', '3,018,0008,000', '2577,8331000').",
          specific_action: "Thoroughly review and revise all financial annexures. Provide clear, itemized costs for every expense. Ensure all calculations for totals, deficits, loan requirements, monthly fixed costs, sales, and unit prices are accurate, transparent, and easy to follow. Clearly state your initial personal investment.",
          why_important: "Accurate and transparent financial projections are critical for assessing the viability of your business, securing funding, managing cash flow, and making informed business decisions. Inaccurate figures can lead to significant operational challenges.",
          resources_needed: "Spreadsheet software (e.g., Google Sheets, Excel), local market price research for materials, labor, and utilities, potentially consulting with a local accountant or business advisor."
        },
        {
          section: "Promotion Plan - Purpose of Business",
          priority: "High",
          current_issue: "The stated purpose 'Best wetal product provide' is too generic and doesn't fully capture the essence or impact of your business.",
          specific_action: "Refine your business purpose to be more specific, inspiring, and reflective of the unique value and positive impact Shree Ganesh Welding & Fabrication aims to deliver to its customers and the community.",
          why_important: "A clear and compelling business purpose guides all your strategic decisions, motivates your team, and helps customers understand the core mission of your business.",
          resources_needed: null
        }
      ],
      medium_priority_improvements: [
        {
          section: "Target Customer Segmentation",
          priority: "Medium",
          current_issue: "While 'Near village people, Contractor' is a good start, the plan lacks deeper insights into these customer segments.",
          specific_action: "Develop detailed customer profiles (personas) for both 'village people' and 'contractors'. Consider their specific needs, typical projects, budget ranges, decision-making processes, and how they currently seek out welding services.",
          why_important: "A deeper understanding of your customer segments allows for more precise targeting in your marketing efforts, development of tailored services, and ultimately, higher customer satisfaction and loyalty.",
          resources_needed: "Customer interviews, demographic data for your target area, online research on contractor needs."
        },
        {
          section: "Pricing Strategy",
          priority: "Medium",
          current_issue: "The pricing strategy is vague, with only 'Yes, Price a' and 'Competitor 0102 67/19 price' mentioned, without a clear approach.",
          specific_action: "Develop a comprehensive pricing strategy. Will you use cost-plus pricing, value-based pricing, or competitive pricing? Justify your chosen strategy in relation to your costs, perceived value, and competitor pricing. Clearly state how you will price common services.",
          why_important: "A well-defined pricing strategy is crucial for profitability and market positioning. It ensures your prices are competitive, cover your costs, and reflect the value you offer.",
          resources_needed: "Competitor pricing research, detailed cost analysis for each service, understanding customer willingness to pay."
        },
        {
          section: "Operational Plan (Infrastructure, Employees, Location Justification)",
          priority: "Medium",
          current_issue: "The details for infrastructure are basic, employee needs are unspecified, and the justification for your chosen location is missing.",
          specific_action: "Provide a more detailed list of all specific equipment and tools required. Define the roles, responsibilities, and necessary skills for any employees you plan to hire. Clearly explain why 'Kusiapal, Kendrapara' is the optimal location for your business, considering factors like customer accessibility, proximity to suppliers, and local demand.",
          why_important: "A thorough operational plan ensures you have all necessary resources, a clear staffing strategy, and a strategically chosen location to run your business efficiently and effectively.",
          resources_needed: "Equipment catalogs, local real estate market analysis, supplier contacts, job descriptions for potential employees."
        },
        {
          section: "Marketing Strategy",
          priority: "Medium",
          current_issue: "While promotional methods are listed, a cohesive marketing strategy explaining how these methods will be used to achieve business goals is missing.",
          specific_action: "Outline a clear marketing strategy that details how you will utilize 'Advertisement, Banner, poster, Facebook, direct phone contact' to reach your specific target customers, communicate your unique selling proposition, and drive sales. Include a budget for promotional activities.",
          why_important: "A well-structured marketing strategy ensures your promotional efforts are coordinated, cost-effective, and focused on attracting and retaining customers, leading to consistent business growth.",
          resources_needed: "Examples of successful local marketing campaigns, social media marketing guides, local advertising costs."
        }
      ],
      low_priority_improvements: [],
      next_steps_this_week: [
        "Conduct 3-5 informal interviews with potential customers (village residents, local contractors) to understand their specific welding needs and current challenges.",
        "Research at least 2-3 local welding and fabrication competitors to understand their services, pricing, and customer base.",
        "Begin refining the 'Problem your service resolves' and 'Unique Selling Proposition' sections of your business plan based on your initial customer and competitor research."
      ],
      research_assignments: [
        "**Local Market Analysis**: Investigate the current demand for welding and fabrication services in Kusiapal, Kendrapara, and surrounding villages. Are there any underserved niches or specific types of work in high demand?",
        "**Supplier Research**: Identify at least three potential suppliers for your raw materials (iron, aluminum, electrodes) and welding equipment. Compare their prices, delivery terms, and product quality.",
        "**Pricing Benchmarking**: Find out the average pricing for common welding jobs (e.g., gate repair, grill fabrication, custom metalwork) in your local area to inform your own pricing strategy.",
        "**Permits and Licenses**: Research any local government permits, licenses, or certifications required to operate a welding and fabrication business in your region."
      ],
      questions_to_answer: [
        "What specific skill or advantage do I possess that no other local welder in my area has?",
        "How can I tangibly demonstrate the 'quality product, within time delivery, correct price' to my customers?",
        "What is the absolute minimum monthly revenue I need to cover my fixed costs and draw a basic salary for myself?",
        "What are the most common types of welding and fabrication jobs in my target area, and how can I specialize or excel in them?",
        "For potential customers: What are your biggest frustrations or challenges when hiring a welder?",
        "For potential customers: How important are factors like speed, quality, and price to you when choosing a welding service?",
        "For potential customers: Where do you currently go for welding services, and what do you like/dislike about them?"
      ],
      what_youre_doing_well: [
        "You have clearly identified your core product/service: Shree Ganesh Welding & Fabrication, offering metal welding (gates, grills, doors).",
        "You have identified potential target customers: near village people and contractors.",
        "You acknowledge the presence of competitors in the market.",
        "You have started to think about the necessary resources like raw materials (iron, aluminum, electrode, welding equipment) and infrastructure (room, electricity, phone).",
        "You have a clear financial goal of 2,00,000 profit after 1 year.",
        "You've considered various promotional methods like advertisements, banners, posters, Facebook, and direct phone contact.",
        "You've identified family and friends as a support system, which is valuable for any new venture."
      ],
      motivational_note: "You've made a great start by outlining your business idea and identifying key areas. Entrepreneurship is a journey of continuous learning and refinement. Keep up the excellent work, and don't be afraid to dig deeper into each section. Every piece of research and every question you answer brings you closer to a robust and successful business!",
      estimated_hours_to_improve: 18
    }
  },
  {
    id: 2,
    title: "Business Plan",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    status: "Approved",
    tags: ["startup", "market"],
    rawFiles: [
      {
        name: "sample_odia_2.pdf",
        url: "https://res.cloudinary.com/dzhthc1g9/image/upload/v1758988129/raw-files/students/68d7b4818e42b4d2d38b86a0/1758988115163_0_sample_odia_2.pdf",
        publicId: "raw-files/students/68d7b4818e42b4d2d38b86a0/1758988115163_0_sample_odia_2",
        uploadDate: { $date: "2025-09-27T15:48:49.270Z" },
        _id: { $oid: "68d807619a044bc9e2dfe9c2" }
      }
    ],
    comments: [],
    mentorRemarks: {
      Score: 8,
      potentialCategory: "High"
    },
    createdAt: { $date: "2025-09-27T15:48:49.274Z" },
    updatedAt: { $date: "2025-09-27T15:48:49.274Z" },
    transcribe: '[{"page_number": 1, "text_content": ["Skilled in", "ODISHA", "TATA", "STRIVES", "Bright Futura", "Deviant of the Trans", "Accelerated Entrepreneurship Development Program for Nano Unicorns", "ନାନୋ ୟୁନିକର୍ମ ପାଇଁ ତ୍ବରିତ ଉଦ୍ୟୋଗ ବିକାଶ କାର୍ଯ୍ୟକ୍ରମ", "Business Plan", "ବ୍ୟବସାୟ ଯୋଜନା", "Participant Profile", "ଅଂଶଗ୍ରହଣକାରୀଙ୍କର ପ୍ରୋଫାଇଲ", "Name", "ନାମ", "Education", "ଶିକ୍ଷା", "Panesh Kuman Nayak", "graduation (B.SC statistic Hons)", "Address", "ଠିକଣା", "Phone Number", "ଫୋନ୍ ନମ୍ବର", "Email ID", "ଇମେଲ୍ ଆଇଡ଼ି", "Product/Service", "ଉଟପାଦ / ସେବା", "Name of your business and logo.", "ଆପଣଙ୍କ ବ୍ୟବସାୟ ର ନାମ ଓ ଲୋଗୋ।", "Is there anyone who is supporting you", "Stc)", "in the business? (friends, family etc.)", "କଣ କେହି ଅଛନ୍ତି ଯିଏ ଆପଣଙ୍କୁ", "ଆପଣଙ୍କର ବ୍ୟବସାୟ ରେ ସମର୍ଥନ", "କରୁଛନ୍ତି? (ବନ୍ଧୁଗାଁ, ପରିବାର ବର୍ଗ ଇତ୍ୟାଦି)", "Main product/service that you want", "to provide", "ଆପଣ ପ୍ରଦାନ କରିବାକୁ ଚାହୁଁଥ‌ିବା ମୁଖ୍ୟ", "ଉତ୍ପାଦ । ସେବା", "Shree Ganesh Welding & Fabrica-", "tion. #177", "members", "Fred", "Yes, Family members, friends, I", "etc.", "aletal welding (gate, grill,,", "door etc.)"], "full_text": "Skilled in\nODISHA\nTATA\nSTRIVES\nBright Futura\nDeviant of the Trans\nAccelerated Entrepreneurship Development Program for Nano Unicorns\nନାନୋ ୟୁନିକର୍ମ ପାଇଁ ତ୍ବରିତ ଉଦ୍ୟୋଗ ବିକାଶ କାର୍ଯ୍ୟକ୍ରମ\nBusiness Plan\nବ୍ୟବସାୟ ଯୋଜନା\nParticipant Profile\nଅଂଶଗ୍ରହଣକାରୀଙ୍କର ପ୍ରୋଫାଇଲ\nName\nନାମ\nEducation\nଶିକ୍ଷା\nPanesh Kuman Nayak\ngraduation (B.SC statistic Hons)\nAddress\nଠିକଣା\nPhone Number\nଫୋନ୍ ନମ୍ବର\nEmail ID\nଇମେଲ୍ ଆଇଡ଼ି\nProduct/Service\nଉଟପାଦ / ସେବା\nName of your business and logo.\nଆପଣଙ୍କ ବ୍ୟବସାୟ ର ନାମ ଓ ଲୋଗୋ।\nIs there anyone who is supporting you\nStc)\nin the business? (friends, family etc.)\nକଣ କେହି ଅଛନ୍ତି ଯିଏ ଆପଣଙ୍କୁ\nଆପଣଙ୍କର ବ୍ୟବସାୟ ରେ ସମର୍ଥନ\nକରୁଛନ୍ତି? (ବନ୍ଧୁଗାଁ, ପରିବାର ବର୍ଗ ଇତ୍ୟାଦି)\nMain product/service that you want\nto provide\nଆପଣ ପ୍ରଦାନ କରିବାକୁ ଚାହୁଁଥ‌ିବା ମୁଖ୍ୟ\nଉତ୍ପାଦ । ସେବା\nShree Ganesh Welding & Fabrica-\ntion. #177\nmembers\nFred\nYes, Family members, friends, I\netc.\naletal welding (gate, grill,,\ndoor etc.)", "has_content": true, "detected_languages": ["Devanagari_Script", "Odia", "Latin_Script"]}]',
    formattedFile: {
      title: "Shree Ganesh Welding & Fabrication",
      tagline: null,
      vision: null,
      mission: "To provide the best metal products.",
      language: "English",
      stage: "Early-stage, progressing through setup, sustenance (2-7 months), and expansion (8-12 months) phases.",
      summary: null,
      problem_and_customer: "Customers in nearby villages and contractors need fabricated metal products like gates, grills, and doors. They seek quality products, timely delivery, and correct pricing.",
      solution_and_features: "The business will provide metal welding and fabrication services for items such as gates, grills, and doors. Key features include providing the best metal products, offering perfect size and design, and free transport within a 5km radius.",
      market_and_competitors: "Competitors exist in the market. The business aims to differentiate itself through perfect product size and design, quality products, timely delivery, and correct pricing. Pricing will be competitive, as indicated by 'Price a delivery Competitor 0102 67/19 price'.",
      channels_and_revenue: "Customers will be reached through advertisements, banners, posters, online marketing, Facebook, and direct phone contact. Expected monthly sales are approximately Rupees 57,833 during the sustenance phase and Rupees 60,550 during the expansion phase. The business aims for a profit of 2,00,000 after 1 year.",
      operations_and_team: "The business will be supported by family members and friends. Required infrastructure includes a room (office/shop), storage space, electricity, and a phone. Raw materials such as iron material, aluminium, electrodes, and welding equipment will be sourced from a new wholesale market. Transport will be required for raw materials and finished products. The business plans to set up a shop/office in a village location (AT/PO - Kusiapal, Kendrapara) due to local demand and accessibility. Employees will be hired, as indicated by 'labour Salary' in running costs.",
      traction_and_funding: "The total estimated business setup cost for the first month is Rs. 3,62,000. A loan requirement of Rupees 1,62,000 is identified for the setup phase. For the business expansion phase, a loan requirement of 42,500 Rupees is noted.",
      risks_and_mitigation: null,
      social_and_environmental_impact: null
    },
    feedback: {
      submission_id: "BP_001",
      feedback_timestamp: "2025-09-27T18:04:15.010032Z",
      current_strength_level: "Beginner",
      overall_completeness: 40,
      high_priority_improvements: [],
      medium_priority_improvements: [],
      low_priority_improvements: [],
      next_steps_this_week: [],
      research_assignments: [],
      questions_to_answer: [],
      what_youre_doing_well: [],
      motivational_note: "You've made a great start by outlining your business idea and identifying key areas. Entrepreneurship is a journey of continuous learning and refinement. Keep up the excellent work, and don't be afraid to dig deeper into each section. Every piece of research and every question you answer brings you closer to a robust and successful business!",
      estimated_hours_to_improve: 18
    }
  }
];
