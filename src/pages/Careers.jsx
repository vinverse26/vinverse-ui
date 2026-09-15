import { Link } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";

export default function Careers() {
  return (
    <>
      <PageHero
        className="page-hero-compact"
        kicker="Careers"
        title="Build the firm that helps organizations become AI-native."
      />
      <section className="section section-compact">
        <div className="wrap career-panel">
          <p className="lede">
            If you know an industry or a function deeply and want to put that knowledge to work on real AI problems, we want to hear from you.
          </p>
          <p className="lede" style={{ marginTop: "1.1rem" }}>
            If you want to be part of the early team, write to{" "}
            <a className="mail" href="mailto:careers@vinverse.ai">
              careers@vinverse.ai
            </a>
            .
          </p>
          <div className="actions home-cta-row" style={{ marginTop: "1.5rem" }}>
            <Link className="btn ghost" to="/contact">
              Start a conversation
            </Link>
            <Link className="btn ghost" to="/">
              Home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
