import { Link } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";

export default function About() {
  return (
    <>
      <PageHero className="page-hero-compact" kicker="About Us" title="Built by people who have had to exercise specialist judgment." />

      <section className="section section-compact">
        <div className="wrap">
          <div className="section-head what-we-do-head">
            <p className="lede">
              Vinverse is being built by people who have worked in markets, quantitative finance, and technology - across sectors and geographies - including at firms such as J.P. Morgan, Morgan Stanley, and Citi. We have helped manage billions in
              assets, scale investment businesses, and take millions of cost and complexity out of institutions through
              M&A, process change, and technology.
            </p>
            <p className="lede" style={{ marginTop: "1.1rem" }}>
              We know what specialist judgment looks like because we have had to exercise it. General-purpose models
              still fall short of that bar. Vinverse exists to close it: intelligence that understands the business,
              supports decisions across the firm, and helps the enterprise operate as AI-native.
            </p>
          </div>
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
