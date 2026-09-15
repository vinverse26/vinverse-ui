import PageHero from "../components/PageHero.jsx";
import OfferBand from "../components/OfferBand.jsx";

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
            We are looking for domain experts from every industry and sector to join an early Intelligence Fellow
            network - and be part of this journey.
          </p>
          <p className="lede" style={{ marginTop: "1.1rem" }}>
            If that sounds like you, write to{" "}
            <a className="mail" href="mailto:careers@vinverse.ai">
              careers@vinverse.ai
            </a>
            .
          </p>
        </div>
      </section>
      <OfferBand />
    </>
  );
}
