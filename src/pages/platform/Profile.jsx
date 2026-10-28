import { useMemo, useState } from "react";
import { useAuth } from "../../auth/AuthContext.jsx";

export default function Profile() {
  const { user } = useAuth();
  const initial = useMemo(
    () => ({
      name: user?.name || "",
      email: user?.email || "",
      industry: user?.industry || "",
      functionRole: user?.functionRole || user?.function || "",
      missions: user?.missions || "",
      bio: user?.bio || "",
    }),
    [user]
  );
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(initial);
  const [saved, setSaved] = useState(initial);

  function onChange(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onSave(e) {
    e.preventDefault();
    setSaved(form);
    setEditing(false);
  }

  function onCancel() {
    setForm(saved);
    setEditing(false);
  }

  if (!editing) {
    return (
      <div className="card" style={{ maxWidth: "36rem" }}>
        <div className="project-edit-toolbar">
          <div>
            <p className="num">Your profile</p>
            <h2>{saved.name || "Fellow"}</h2>
            <p className="lede">{saved.email}</p>
          </div>
          <button className="btn" type="button" onClick={() => setEditing(true)}>
            Edit profile
          </button>
        </div>
        <p>
          <strong>Industry:</strong> {saved.industry || "Not set"}
        </p>
        <p>
          <strong>Function:</strong> {saved.functionRole || "Not set"}
        </p>
        <p>
          <strong>Missions:</strong> {saved.missions || "Not set"}
        </p>
        <p style={{ marginTop: "0.8rem" }}>{saved.bio || "No bio yet."}</p>
      </div>
    );
  }

  return (
    <form className="card" style={{ maxWidth: "36rem" }} onSubmit={onSave}>
      <p className="num">Edit profile</p>
      <h2>Update your details</h2>
      <label className="ws-block">
        Name
        <input value={form.name} onChange={(e) => onChange("name", e.target.value)} />
      </label>
      <label className="ws-block">
        Email
        <input value={form.email} disabled />
      </label>
      <label className="ws-block">
        Industry
        <input value={form.industry} onChange={(e) => onChange("industry", e.target.value)} />
      </label>
      <label className="ws-block">
        Function
        <input value={form.functionRole} onChange={(e) => onChange("functionRole", e.target.value)} />
      </label>
      <label className="ws-block">
        Missions
        <input value={form.missions} onChange={(e) => onChange("missions", e.target.value)} />
      </label>
      <label className="ws-block">
        Bio
        <textarea value={form.bio} onChange={(e) => onChange("bio", e.target.value)} rows={4} />
      </label>
      <div className="chip-row" style={{ marginTop: "1rem" }}>
        <button className="btn" type="submit">
          Save profile
        </button>
        <button className="btn ghost" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
