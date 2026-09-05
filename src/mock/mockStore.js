import {
  seedUser, seedProjects, seedProjectStates, seedDocuments, seedMembers, seedHistory,
} from './mockData'

// Mutable in-memory store, seeded on load. Resets on page refresh — that's fine
// for a UI-review prototype; swap VITE_USE_MOCK off once the real backend is ready.
let currentUser = null
let projects = [...seedProjects]
let projectStates = { ...seedProjectStates }
let documents = JSON.parse(JSON.stringify(seedDocuments))
let members = JSON.parse(JSON.stringify(seedMembers))
let history = JSON.parse(JSON.stringify(seedHistory))
let invitations = {}
let conversations = {} // conversationId -> { turns: number, projectId }
let nextId = 100

const delay = (ms = 350) => new Promise((res) => setTimeout(res, ms))
const newId = (prefix) => `${prefix}${nextId++}`

// ---- Scripted Master Consultant behavior ----
// Follows the interview flow from the design doc: clarify -> structure -> confirm.
function scriptedConsultantReply(turnIndex, userMessage, hasExistingState) {
  if (hasExistingState) {
    // Ongoing conversation on an already-structured project
    return {
      reply: `Good input. Based on "${userMessage.slice(0, 60)}${userMessage.length > 60 ? '…' : ''}", I'd suggest we revisit the assumptions around market growth and competitive intensity. I've drafted a small update to Key Questions — take a look below.`,
      proposed_state_changes: {
        key_questions: [
          'What is the realistic market size for AI-enabled features?',
          'How intense is competitive pressure over the next 3 years?',
          'What level of investment is required to be credible?',
          'How does this new input change our risk assessment?',
        ],
      },
    }
  }

  if (turnIndex === 0) {
    return {
      reply: "Before I structure the analysis, I'd like to understand what decision you're trying to make. A few questions:\n\n1. What decision needs to be made?\n2. Who will make the decision?\n3. What is the time horizon?\n4. What constraints exist?\n5. What does success look like?",
      proposed_state_changes: null,
    }
  }
  if (turnIndex === 1) {
    return {
      reply: "Thanks — here's my understanding of the problem so far:\n\nDECISION: " + userMessage.slice(0, 120) + "\nDECISION MAKER: (to confirm)\nTIME HORIZON: (to confirm)\n\nIs this an accurate representation of the problem, or would you like to adjust anything before I lock in the initial project state?",
      proposed_state_changes: {
        problem: userMessage,
        objective: 'To be refined with the fellow',
        key_questions: [
          'What are the primary constraints on this decision?',
          'Who else needs to be consulted?',
          'What does success look like within the time horizon?',
        ],
      },
    }
  }
  return {
    reply: "Understood — I've locked that in as the initial Project State. You can see it now in the Workspace tab. From here, upload any supporting documents and I'll flag anything that changes our assumptions.",
    proposed_state_changes: {
      assumptions: ['Initial framing approved by the fellow'],
    },
  }
}

// ---- Auth ----
export async function mockLogin(email, _password) {
  await delay()
  currentUser = { ...seedUser, email }
  return { access_token: 'mock-token' }
}

export async function mockRegister(email, _password, displayName) {
  await delay()
  currentUser = { ...seedUser, id: newId('u'), email, display_name: displayName || email, role: 'intelligence_fellow' }
  return { access_token: 'mock-token' }
}

export async function mockGetMe() {
  await delay(150)
  if (!currentUser) currentUser = seedUser
  return currentUser
}

export async function mockUpdateProfile(payload) {
  await delay()
  currentUser = { ...currentUser, display_name: payload.display_name ?? currentUser.display_name }
  return { message: 'Profile updated (mock)' }
}

export function mockLogout() {
  currentUser = null
}

// ---- Projects ----
export async function mockListProjects() {
  await delay()
  return projects
}

export async function mockCreateProject(name, problemStatement) {
  await delay()
  const id = newId('p')
  const project = { id, name, status: 'active', created_at: new Date().toISOString() }
  projects = [project, ...projects]
  projectStates[id] = {
    version_number: 1,
    change_summary: 'Project created',
    created_at: new Date().toISOString(),
    state: problemStatement ? { problem: problemStatement } : {},
  }
  documents[id] = []
  members[id] = [{ user_id: currentUser?.id || 'u1', email: currentUser?.email, display_name: currentUser?.display_name, project_role: 'owner' }]
  history[id] = [{ version_number: 1, change_summary: 'Project created', created_at: new Date().toISOString() }]
  return project
}

export async function mockGetProject(projectId) {
  await delay()
  return projects.find((p) => p.id === projectId)
}

export async function mockGetProjectState(projectId) {
  await delay()
  return projectStates[projectId] || { version_number: 0, state: {}, change_summary: '', created_at: new Date().toISOString() }
}

export async function mockGetHistory(projectId) {
  await delay()
  return history[projectId] || []
}

export async function mockListDocuments(projectId) {
  await delay()
  return documents[projectId] || []
}

export async function mockAddDocument(projectId, filename, _contentText) {
  await delay()
  const doc = { id: newId('d'), filename, created_at: new Date().toISOString() }
  documents[projectId] = [...(documents[projectId] || []), doc]
  return doc
}

export async function mockListMembers(projectId) {
  await delay()
  return members[projectId] || []
}

export async function mockAddMember(projectId, email, role) {
  await delay()
  const member = { user_id: newId('u'), email, display_name: email.split('@')[0], project_role: role }
  members[projectId] = [...(members[projectId] || []), member]
  return { message: 'Member added (mock)' }
}

// ---- Chat / Master Consultant ----
export async function mockChat(projectId, message, conversationId) {
  await delay(600)
  const convoId = conversationId || newId('c')
  if (!conversations[convoId]) conversations[convoId] = { turns: 0, projectId }
  const convo = conversations[convoId]

  const hasExistingState = projectId && projectStates[projectId] && Object.keys(projectStates[projectId].state || {}).length > 2
  const result = scriptedConsultantReply(convo.turns, message, hasExistingState)
  convo.turns += 1

  return { conversation_id: convoId, reply: result.reply, proposed_state_changes: result.proposed_state_changes }
}

export async function mockApplyStateChanges(projectId, changes) {
  await delay()
  const current = projectStates[projectId] || { version_number: 0, state: {} }
  const newState = { ...current.state, ...changes }
  const newVersion = {
    version_number: (current.version_number || 0) + 1,
    state: newState,
    change_summary: 'Applied Master Consultant proposed changes',
    created_at: new Date().toISOString(),
  }
  projectStates[projectId] = newVersion
  history[projectId] = [
    { version_number: newVersion.version_number, change_summary: newVersion.change_summary, created_at: newVersion.created_at },
    ...(history[projectId] || []),
  ]
  return { message: 'Project state updated', version_number: newVersion.version_number }
}

// ---- Invitations (admin/PM only in the real backend) ----
export async function mockCreateInvitation(email, role) {
  await delay()
  invitations[email] = { role, accepted: false }
  return { message: 'Invitation created (mock)', invitation_id: newId('inv') }
}
