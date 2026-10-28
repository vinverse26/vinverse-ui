export default function ChatPanel({ messages, draft, setDraft, onSend, sending, header, footer }) {
  return (
    <div className="chat">
      {header || null}
      <div className="chat-log">
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>
            <small>{m.role === "master" ? "Master consultant" : "You"}</small>
            <p>{m.text}</p>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Describe the problem, a client meeting, or the outcome you need..."
          disabled={sending}
        />
        <button className="btn" type="button" onClick={onSend} disabled={sending}>
          {sending ? "..." : "Send"}
        </button>
      </div>
      {footer || null}
    </div>
  );
}
