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
