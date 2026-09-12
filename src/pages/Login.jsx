import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";
import { useAuth } from "../auth/AuthContext.jsx";
import { exchangeGoogleCredential } from "../api/auth.js";

export default function Login() {
  const googleSlot = useRef(null);
  const { login } = useAuth();
  const navigate = useNavigate();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notRegistered, setNotRegistered] = useState(false);

  async function finish(credential) {
    setBusy(true);
    setError("");
    setNotRegistered(false);
    try {
      const session = await exchangeGoogleCredential(credential);
      login(session.user, session.token);
      navigate("/platform");
    } catch (err) {
      setError(err.message || "Google sign-in failed.");
      setNotRegistered(err.status === 403);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (!clientId) return undefined;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      if (!window.google?.accounts?.id || !googleSlot.current) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => finish(response.credential),
      });
      window.google.accounts.id.renderButton(googleSlot.current, {
        theme: "filled_black",
        size: "large",
        text: "signin_with",
        width: 320,
      });
    };
    document.body.appendChild(script);
    return () => script.remove();
  }, [clientId]);

  return (
    <>
      <PageHero
        kicker="Login"
        title="Continue with Google."
        lede="Approved Fellows sign in with Google and enter the Collective Intelligence Platform."
      />
      <section className="section">
        <div className="wrap contact-panel">
          <div ref={googleSlot} className="google-official" />

          {!clientId ? (
            <button type="button" className="google-btn" disabled={busy} onClick={() => finish(null)}>
              <span className="google-mark" aria-hidden="true">
                G
              </span>
              {busy ? "Signing in…" : "Continue with Google"}
            </button>
          ) : null}

          {error ? (
            <p className="note">
              {error}
              {notRegistered ? (
                <>
                  {" "}
                  <Link to="/register">Register here</Link>.
                </>
              ) : null}
            </p>
          ) : null}
        </div>
      </section>
    </>
  );
}
