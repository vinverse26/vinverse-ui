import api from '../api'
import { USE_MOCK } from './authService'
import { mockListUsers, mockListInvitations, mockCreateInvitation, mockRevokeInvitation } from '../mock/mockStore'

export async function listUsers() {
  if (USE_MOCK) return mockListUsers()
  const res = await api.get('/admin/users')
  return res.data
}

export async function listInvitations() {
  if (USE_MOCK) return mockListInvitations()
  const res = await api.get('/admin/invitations')
  return res.data
}

export async function createInvitation(email, role) {
  if (USE_MOCK) return mockCreateInvitation(email, role)
  const res = await api.post('/auth/invite', { email, role })
  return res.data
}

export async function revokeInvitation(invitationId) {
  if (USE_MOCK) return mockRevokeInvitation(invitationId)
  const res = await api.delete(`/admin/invitations/${invitationId}`)
  return res.data
}
