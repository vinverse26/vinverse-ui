import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatPanel from "../../platform/ChatPanel.jsx";
import { useProjects } from "../../platform/ProjectsContext.jsx";

export default function MasterConsultant() {
  const navigate = useNavigate();
  const {
    projects,
    globalMessages,
    draft,
    setDraft,
    sending,
    sendGlobal,
    attachOpen,
    setAttachOpen,
    attachTarget,
    setAttachTarget,
    attachExistingId,
    setAttachExistingId,
    handleAttachToProject,
  } = useProjects();
  const [newName, setNewName] = useState("");

  const canAdd = attachTarget === "new" ? newName.trim().length > 0 : Boolean(attachExistingId);

  function onCancel() {
    setAttachOpen(false);
    setAttachTarget("new");
    setAttachExistingId("");
    setNewName("");
  }

  async function onAttach() {
    if (!canAdd) return;
    const result = await handleAttachToProject(attachTarget === "new" ? newName : "");
    setNewName("");
    if (result?.id) {
      navigate(`/platform/projects/${result.id}?mode=edit`);
    }
  }

  return (
    <div className="chat-page">
      <div className="chat-toolbar">
        <button className="btn ghost" type="button" onClick={() => (attachOpen ? onCancel() : setAttachOpen(true))}>
          Add chat to a project
        </button>
      </div>
      {attachOpen ? (
        <div className="attach-panel card">
          <p className="num">Add this chat history</p>
          <div className="attach-options">
            <label>
              <input
                type="radio"
                name="attach"
                checked={attachTarget === "new"}
                onChange={() => setAttachTarget("new")}
              />{" "}
              New project
            </label>
            {attachTarget === "new" ? (
              <input
                type="text"
                className="attach-name"
                placeholder="Project name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
              />
            ) : null}
            <label>
              <input
                type="radio"
                name="attach"
                checked={attachTarget === "existing"}
                onChange={() => setAttachTarget("existing")}
              />{" "}
              Existing project{" "}
              <select
                value={attachTarget === "new" ? "" : attachExistingId}
                onChange={(e) => {
                  setAttachTarget("existing");
                  setAttachExistingId(e.target.value);
                }}
              >
                <option value="">Select...</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="chip-row attach-actions">
            <button className="btn" type="button" onClick={onAttach} disabled={!canAdd}>
              Add
            </button>
            <button className="btn ghost" type="button" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </div>
      ) : null}
      <ChatPanel
        messages={globalMessages}
        draft={draft}
        setDraft={setDraft}
        onSend={sendGlobal}
        sending={sending}
      />
    </div>
  );
}
