import { Link } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";

export default function Register() {
  return (
    <>
      <PageHero
        className="page-hero-compact auth-hero"
        kicker="Register"
        title="Request access to the platform."
      >
        <p className="lede auth-lede">
          Access is invite-only, send an email to{" "}
          <a className="mail" href="mailto:register@vinverse.ai">
            register@vinverse.ai
          </a>{" "}
          to request access.
        </p>
        <div className="actions" style={{ marginTop: "1.2rem" }}>
          <Link className="btn ghost" to="/login">
            Back to login
          </Link>
        </div>
      </PageHero>
    </>
  );
}
