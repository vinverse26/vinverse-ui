import { useState, useRef, useEffect } from 'react'
import * as chatService from '../services/chatService'

export default function MasterConsultantPanel({ projectId, onProposedChanges }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [conversationId, setConversationId] = useState(null)
  const [sending, setSending] = useState(false)
  const [lastProposal, setLastProposal] = useState(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages])

  const send = async () => {
    if (!input.trim() || sending) return
    const userMessage = input.trim()
    setMessages((m) => [...m, { role: 'user', content: userMessage }])
    setInput('')
    setSending(true)
    try {
      const data = await chatService.sendChat(projectId, userMessage, conversationId)
      setConversationId(data.conversation_id)
      setMessages((m) => [...m, { role: 'assistant', content: data.reply }])
      if (data.proposed_state_changes) {
        setLastProposal(data.proposed_state_changes)
        onProposedChanges?.(data.proposed_state_changes)
      }
    } catch (err) {
      setMessages((m) => [...m, { role: 'assistant', content: 'Something went wrong reaching the Master Consultant. Please try again.' }])
    } finally {
      setSending(false)
    }
  }

  const acceptProposal = async () => {
    if (!lastProposal || !projectId) return
    await chatService.applyStateChanges(projectId, lastProposal)
    setLastProposal(null)
    setMessages((m) => [...m, { role: 'assistant', content: 'Changes applied to the project state.' }])
  }

  return (
    <div className="consultant-panel">
      <h3 style={{ marginTop: 0 }}>Master Consultant</h3>
      <div className="consultant-messages" ref={scrollRef}>
        {messages.length === 0 && (
          <div style={{ color: '#8892b0', fontSize: '0.85rem' }}>
            {projectId
              ? 'Ask about this project — "Analyze the competitive landscape", "Challenge our assumptions", "Why did you reach this conclusion?"'
              : 'Ask across your projects — "What projects am I working on?", "Find projects where my expertise is relevant."'}
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>{m.content}</div>
        ))}
        {lastProposal && (
          <div className="proposed-changes">
            <strong>Proposed project state changes:</strong>
            <pre>{JSON.stringify(lastProposal, null, 2)}</pre>
            <button className="link-btn" onClick={acceptProposal}>Accept changes</button>
          </div>
        )}
      </div>
      <div className="chat-input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Type a message..."
          disabled={sending}
        />
        <button onClick={send} disabled={sending}>{sending ? '...' : 'Send'}</button>
      </div>
    </div>
  )
}
