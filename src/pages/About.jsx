import { Link } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";
import OfferBand from "../components/OfferBand.jsx";

export default function About() {
  return (
    <>
      <PageHero
        className="page-hero-compact"
        kicker="About Us"
        title="Building Vinverse to help organizations become AI-native."
        lede="Born at Cornell. Built for the world. We are building a company that starts with real businesses and real problems - then advises, implements, and productizes the intelligence layer organizations need to thrive."
      />

      <section className="section section-compact">
        <div className="wrap">
          <div className="section-head what-we-do-head">
            <p className="kicker">The work</p>
            <h2>Services that move the business. Products that become the layer it runs on.</h2>
            <p className="lede">
              Through Advisory, Solutions, Fractional CTO, and Start-up Booster, we help leadership see where AI
              transforms the company and stay on the journey until the new way of working holds. In parallel, Vinverse
              is building Organizational Intelligence, the Collective Intelligence Platform, and the AI-Native Enterprise
              Platform.
            </p>
          </div>
          <div className="actions" style={{ marginTop: "1.5rem" }}>
            <Link className="btn ghost" to="/what-we-do">
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
