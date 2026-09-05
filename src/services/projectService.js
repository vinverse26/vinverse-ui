import api from '../api'
import { USE_MOCK } from './authService'
import {
  mockListProjects, mockCreateProject, mockGetProject, mockGetProjectState,
  mockGetHistory, mockListDocuments, mockAddDocument, mockListMembers, mockAddMember,
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
