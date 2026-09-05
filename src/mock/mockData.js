export const seedUser = {
  id: 'u1',
  email: 'admin@vinverse.ai',
  role: 'admin',
  display_name: 'Vinverse Admin',
}

export const seedProjects = [
  {
    id: 'p1',
    name: 'AI Strategy for Company X',
    status: 'active',
    created_at: '2026-08-20T10:00:00Z',
  },
  {
    id: 'p2',
    name: 'India Market Entry',
    status: 'active',
    created_at: '2026-08-25T14:30:00Z',
  },
]

export const seedProjectStates = {
  p1: {
    version_number: 3,
    change_summary: 'Applied Master Consultant proposed changes',
    created_at: '2026-09-01T09:00:00Z',
    state: {
      problem: 'Determine whether Company X should adopt an AI-first product strategy over the next 3 years.',
      objective: 'Identify the highest-leverage AI investments that grow revenue without overextending capital.',
      desired_outcome: 'A board-ready recommendation with a phased investment plan.',
      stakeholders: ['CEO', 'Board', 'VP Engineering', 'VP Product'],
      decision_makers: ['CEO', 'Board'],
      constraints: ['Limited AI engineering talent', 'Regulatory uncertainty in target markets', 'Capital ceiling of $8M for year 1'],
      assumptions: ['Competitors will accelerate AI investment in the next 12 months', 'Customer willingness to pay for AI features is unproven'],
      key_questions: [
        'What is the realistic market size for AI-enabled features?',
        'How intense is competitive pressure over the next 3 years?',
        'What level of investment is required to be credible?',
      ],
      evidence: ['Industry_Report_2026.pdf — market growing 16% YoY', 'Internal customer survey — 41% interested in AI features'],
      hypotheses: ['A focused AI feature set could differentiate the product within 18 months'],
      analysis: 'Market growth and competitive intensity both favor early investment, but talent constraints are the binding limiter.',
      recommendations: ['Invest in a dedicated AI team of 6-8 engineers', 'Launch one AI-differentiated feature within 2 quarters'],
      decisions: [],
      actions: ['Draft a hiring plan for the AI team', 'Scope the first AI feature with Product'],
    },
  },
  p2: {
    version_number: 1,
    change_summary: 'Project created',
    created_at: '2026-08-25T14:30:00Z',
    state: {
      problem: 'Whether Company X should enter the Indian AI market.',
    },
  },
}

export const seedDocuments = {
  p1: [
    { id: 'd1', filename: 'Industry_Report_2026.pdf', created_at: '2026-08-28T11:00:00Z' },
    { id: 'd2', filename: 'Customer_Survey_Results.txt', created_at: '2026-08-30T09:15:00Z' },
  ],
  p2: [],
}

export const seedMembers = {
  p1: [
    { user_id: 'u1', email: 'admin@vinverse.ai', display_name: 'Vinverse Admin', project_role: 'owner' },
    { user_id: 'u2', email: 'priya@vinverse.ai', display_name: 'Priya Shah', project_role: 'manager' },
    { user_id: 'u3', email: 'sam@vinverse.ai', display_name: 'Sam Torres', project_role: 'fellow' },
  ],
  p2: [
    { user_id: 'u1', email: 'admin@vinverse.ai', display_name: 'Vinverse Admin', project_role: 'owner' },
  ],
}

export const seedHistory = {
  p1: [
    { version_number: 3, change_summary: 'Applied Master Consultant proposed changes', created_at: '2026-09-01T09:00:00Z' },
    { version_number: 2, change_summary: 'Added evidence from Customer_Survey_Results.txt', created_at: '2026-08-30T09:20:00Z' },
    { version_number: 1, change_summary: 'Project created', created_at: '2026-08-20T10:00:00Z' },
  ],
  p2: [
    { version_number: 1, change_summary: 'Project created', created_at: '2026-08-25T14:30:00Z' },
  ],
}

// ---- Admin: users & invitations ----
export const seedAllUsers = [
  { id: 'u1', email: 'admin@vinverse.ai', display_name: 'Vinverse Admin', role: 'admin', joined_at: '2026-08-01T09:00:00Z' },
  { id: 'u2', email: 'priya@vinverse.ai', display_name: 'Priya Shah', role: 'project_manager', joined_at: '2026-08-10T09:00:00Z' },
  { id: 'u3', email: 'sam@vinverse.ai', display_name: 'Sam Torres', role: 'intelligence_fellow', joined_at: '2026-08-12T09:00:00Z' },
  { id: 'u4', email: 'lena@vinverse.ai', display_name: 'Lena Ortiz', role: 'intelligence_fellow', joined_at: '2026-08-18T09:00:00Z' },
]

export const seedInvitations = [
  { id: 'inv1', email: 'dre@vinverse.ai', role: 'intelligence_fellow', accepted: false, created_at: '2026-09-02T09:00:00Z' },
  { id: 'inv2', email: 'priya@vinverse.ai', role: 'project_manager', accepted: true, created_at: '2026-08-09T09:00:00Z' },
]

// ---- Project Components & Perspectives ----
export const seedComponents = {
  p1: [
    {
      id: 'c1',
      title: 'Market & Competitive Analysis',
      status: 'in_review',
      assignees: [
        { user_id: 'u3', display_name: 'Sam Torres', perspective_id: 'ps1' },
        { user_id: 'u4', display_name: 'Lena Ortiz', perspective_id: 'ps2' },
      ],
    },
    {
      id: 'c2',
      title: 'Talent & Org Readiness',
      status: 'unassigned',
      assignees: [],
    },
  ],
  p2: [],
}

export const seedPerspectives = {
  c1: [
    {
      id: 'ps1',
      fellow: 'Sam Torres',
      summary: 'Market growth is strong (18% CAGR) but competitive intensity is high — 4 well-funded entrants in the last year.',
      key_numbers: { market_growth: '18%', competitive_intensity: 'High' },
    },
    {
      id: 'ps2',
      fellow: 'Lena Ortiz',
      summary: 'Market growth is more moderate (11% CAGR) once regional segmentation is applied; competition concentrated in enterprise tier only.',
      key_numbers: { market_growth: '11%', competitive_intensity: 'Moderate (enterprise only)' },
    },
  ],
}

// ---- Change Proposals (as a separate reviewable object, not just inline chat) ----
export const seedProposals = {
  p1: [
    {
      id: 'cp1',
      project_id: 'p1',
      component: 'Market & Competitive Analysis',
      author: 'Sam Torres',
      what_changed: 'Market growth assumption',
      why: 'New industry report shows higher growth than originally assumed',
      evidence: 'Industry_Report_2026.pdf, page 12',
      confidence: 'High',
      status: 'pending',
      created_at: '2026-09-03T10:00:00Z',
    },
    {
      id: 'cp2',
      project_id: 'p1',
      component: 'Talent & Org Readiness',
      author: 'Master Consultant',
      what_changed: 'Added a new constraint: hiring timeline risk',
      why: 'Conversation with the fellow surfaced a 6-month minimum hiring lead time for senior AI engineers',
      evidence: 'Conversation on 2026-09-02',
      confidence: 'Medium',
      status: 'pending',
      created_at: '2026-09-02T16:00:00Z',
    },
  ],
  p2: [],
}

// ---- Opportunities (fellow marketplace) ----
export const seedOpportunities = [
  {
    id: 'op1',
    project_name: 'AI Strategy for Company X',
    component: 'Talent & Org Readiness',
    required_expertise: ['Org design', 'Technical recruiting'],
    match_percent: 88,
  },
  {
    id: 'op2',
    project_name: 'India Market Entry',
    component: 'Regulatory landscape',
    required_expertise: ['Market analysis', 'India regulatory'],
    match_percent: 74,
  },
  {
    id: 'op3',
    project_name: 'AI Strategy for Company X',
    component: 'Competitive benchmarking',
    required_expertise: ['AI strategy', 'Competitive intelligence'],
    match_percent: 91,
  },
]
