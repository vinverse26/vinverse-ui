import { Link } from "react-router-dom";
import OfferBand from "../components/OfferBand.jsx";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-bg" />
        <div className="wrap hero-content">
          <h1>Building the intelligence layer for the next generation of organizations.</h1>
          <p className="lede">
            We help businesses, public institutions, and communities harness AI and collective human expertise -
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

      <OfferBand />
    </>
  );
}
