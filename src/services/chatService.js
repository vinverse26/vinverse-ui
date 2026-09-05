import api from '../api'
import { USE_MOCK } from './authService'
import { mockChat, mockApplyStateChanges } from '../mock/mockStore'

export async function sendChat(projectId, message, conversationId) {
  if (USE_MOCK) return mockChat(projectId, message, conversationId)
  const url = projectId ? `/projects/${projectId}/chat` : '/chat'
  const res = await api.post(url, { message, conversation_id: conversationId })
  return res.data
}

export async function applyStateChanges(projectId, changes) {
  if (USE_MOCK) return mockApplyStateChanges(projectId, changes)
  const res = await api.post(`/projects/${projectId}/state/apply`, changes)
  return res.data
}
