import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-bg" />
        <div className="wrap hero-content">
          <h1>Building the intelligence layer for the next generation of organizations.</h1>
          <p className="lede">
            We help businesses, public institutions, and communities harness AI and collective human expertise —
            so every organization can access the intelligence it needs to thrive.
          </p>
          <div className="actions">
            <Link className="btn" to="/what-we-do">
              What we do
            </Link>
            <Link className="btn ghost" to="/contact">
              Start a conversation
            </Link>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap">
          <p className="quote">
            Advisory so the opportunity is clear. Implementation so it is real. Products so the company can keep operating that way.
          </p>
          <div className="actions" style={{ marginTop: "2rem" }}>
            <Link className="btn" to="/products">
              Product horizons
            </Link>
            <Link className="btn ghost" to="/careers">
              Join the journey
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
