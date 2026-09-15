import PageHero from "../components/PageHero.jsx";
import OfferBand from "../components/OfferBand.jsx";

export default function Contact() {
  return (
    <>
      <PageHero
        className="page-hero-compact auth-hero"
        kicker="Contact"
        title="Tell us the problem worth solving."
        lede="Companies, founders, and Fellows all start the same way: an ambitious goal, and a short conversation."
      >
        <div className="contact-panel auth-form">
          <p className="lede">
            Write to{" "}
            <a className="mail" href="mailto:ideas@vinverse.ai">
              ideas@vinverse.ai
            </a>
            .
          </p>
        </div>
      </PageHero>
      <OfferBand showHome />
    </>
  );
}
