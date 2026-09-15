import { Link } from "react-router-dom";

export default function OfferBand({ showHome = false }) {
  return (
    <>
      <section className="section section-compact alt">
        <div className="wrap">
          <div className="offer-band">
            <p className="quote">
              We offer Advisory so the opportunity is clear, Implementation so the change is real, and Products so the
              business can operate as AI-native - with a higher order of intelligence.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-compact">
        <div className="wrap">
          <div className="offer-band">
            <div className="actions home-cta-row" style={{ marginTop: 0 }}>
              <Link className="btn ghost" to="/products">
                Products
              </Link>
              <Link className="btn ghost" to="/services">
                Services
              </Link>
              <Link className="btn ghost" to="/careers">
                Join the journey
              </Link>
              {showHome ? (
                <Link className="btn ghost" to="/">
                  Home
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
