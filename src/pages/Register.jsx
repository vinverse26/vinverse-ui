import { useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";
import { registerFellow } from "../api/auth.js";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null); // { ok, message } | null

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.email.trim()) {
      setResult({ ok: false, message: "Email is required." });
      return;
    }
    setBusy(true);
    setResult(null);
    try {
      const res = await registerFellow({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        requestedAt: new Date().toISOString(),
      });
      setResult({ ok: true, message: res.message || "Request recorded. Admin approval required." });
      setForm({ name: "", email: "", phone: "" });
    } catch (err) {
      setResult({ ok: false, message: err.message || "Could not submit your request. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageHero
      className="page-hero-compact auth-hero"
      kicker="Register"
      title="Request access to the platform."
      lede="Access is invite-only. Tell us who you are and an approved Fellow will review your request."
    >
      {result?.ok ? (
        <div className="auth-actions">
          <p className="auth-note">{result.message}</p>
          <div className="actions" style={{ marginTop: "1.2rem" }}>
            <Link className="btn ghost" to="/login">
              Back to login
            </Link>
          </div>
        </div>
      ) : (
        <form className="form auth-form" onSubmit={submit}>
          <label>
            Name
            <input type="text" value={form.name} onChange={update("name")} placeholder="Your full name" autoComplete="name" />
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={update("email")}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>
          <label>
            Phone (optional)
            <input type="tel" value={form.phone} onChange={update("phone")} placeholder="+1 555 000 0000" autoComplete="tel" />
          </label>

          {result && !result.ok ? <p className="auth-note auth-note-alert">{result.message}</p> : null}

          <div className="actions" style={{ marginTop: "0.4rem" }}>
            <button className="btn" type="submit" disabled={busy}>
              {busy ? "Submitting…" : "Request access"}
            </button>
            <Link className="btn ghost" to="/login">
              Back to login
            </Link>
          </div>

          <p className="auth-note">
            Prefer email? Write to{" "}
            <a className="mail" href="mailto:register@vinverse.ai">
              register@vinverse.ai
            </a>
            .
          </p>
        </form>
      )}
    </PageHero>
  );
}
