import { Link } from "react-router-dom";

export default function OfferBand({ alt = true }) {
  return (
    <section className={alt ? "section section-compact alt" : "section section-compact"}>
      <div className="wrap">
        <div className="offer-band">
          <p className="quote">
            We offer Advisory so the opportunity is clear, Implementation so the change is real, and Products so the
            business can operate as AI-native - with a higher order of intelligence.
          </p>
          <div className="actions home-cta-row">
            <Link className="btn ghost" to="/products">
              Products
            </Link>
            <Link className="btn ghost" to="/services">
              Services
            </Link>
            <Link className="btn ghost" to="/careers">
              Join the journey
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
