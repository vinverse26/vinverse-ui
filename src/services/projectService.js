import api from '../api'
import { USE_MOCK } from './authService'
import {
  mockListProjects, mockCreateProject, mockGetProject, mockGetProjectState,
  mockGetHistory, mockListDocuments, mockAddDocument, mockListMembers, mockAddMember,
  mockListComponents, mockCreateComponent, mockAssignComponent, mockListPerspectives,
  mockListProposals, mockReviewProposal, mockListOpportunities, mockVolunteer,
} from '../mock/mockStore'

export async function listProjects() {
  if (USE_MOCK) return mockListProjects()
  const res = await api.get('/projects')
  return res.data
}

export async function createProject(name, problemStatement) {
  if (USE_MOCK) return mockCreateProject(name, problemStatement)
  const res = await api.post('/projects', { name, problem_statement: problemStatement })
  return res.data
}

export async function getProject(projectId) {
  if (USE_MOCK) return mockGetProject(projectId)
  const res = await api.get(`/projects/${projectId}`)
  return res.data
}

export async function getProjectState(projectId) {
  if (USE_MOCK) return mockGetProjectState(projectId)
  const res = await api.get(`/projects/${projectId}/state`)
  return res.data
}

export async function getHistory(projectId) {
  if (USE_MOCK) return mockGetHistory(projectId)
  const res = await api.get(`/projects/${projectId}/history`)
  return res.data
}

export async function listDocuments(projectId) {
  if (USE_MOCK) return mockListDocuments(projectId)
  const res = await api.get(`/projects/${projectId}/documents`)
  return res.data
}

export async function addDocument(projectId, filename, contentText) {
  if (USE_MOCK) return mockAddDocument(projectId, filename, contentText)
  const res = await api.post(`/projects/${projectId}/documents`, { filename, content_text: contentText })
  return res.data
}

export async function listMembers(projectId) {
  if (USE_MOCK) return mockListMembers(projectId)
  const res = await api.get(`/projects/${projectId}/members`)
  return res.data
}

export async function addMember(projectId, email, role) {
  if (USE_MOCK) return mockAddMember(projectId, email, role)
  const res = await api.post(`/projects/${projectId}/members`, { email, role })
  return res.data
}

// ---- Components & Perspectives ----
export async function listComponents(projectId) {
  if (USE_MOCK) return mockListComponents(projectId)
  const res = await api.get(`/projects/${projectId}/components`)
  return res.data
}

export async function createComponent(projectId, title) {
  if (USE_MOCK) return mockCreateComponent(projectId, title)
  const res = await api.post(`/projects/${projectId}/components`, { title })
  return res.data
}

export async function assignComponent(projectId, componentId, userDisplayName) {
  if (USE_MOCK) return mockAssignComponent(projectId, componentId, userDisplayName)
  const res = await api.post(`/projects/${projectId}/components/${componentId}/assign`, { display_name: userDisplayName })
  return res.data
}

export async function listPerspectives(componentId) {
  if (USE_MOCK) return mockListPerspectives(componentId)
  const res = await api.get(`/components/${componentId}/perspectives`)
  return res.data
}

// ---- Change Proposals ----
export async function listProposals(projectId) {
  if (USE_MOCK) return mockListProposals(projectId)
  const res = await api.get(`/projects/${projectId}/proposals`)
  return res.data
}

export async function reviewProposal(projectId, proposalId, decision) {
  if (USE_MOCK) return mockReviewProposal(projectId, proposalId, decision)
  const res = await api.post(`/projects/${projectId}/proposals/${proposalId}/review`, { decision })
  return res.data
}

// ---- Opportunities ----
export async function listOpportunities() {
  if (USE_MOCK) return mockListOpportunities()
  const res = await api.get('/opportunities')
  return res.data
}

export async function volunteer(opportunityId) {
  if (USE_MOCK) return mockVolunteer(opportunityId)
  const res = await api.post(`/opportunities/${opportunityId}/volunteer`)
  return res.data
}
