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
            <Link className="btn" to="/services">
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
            Today we help companies understand AI. Tomorrow we help them implement it. Next, operate with it.
            Ultimately, become AI-native.
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
