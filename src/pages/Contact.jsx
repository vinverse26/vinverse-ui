import PageHero from "../components/PageHero.jsx";

export default function Contact() {
  return (
    <>
      <PageHero
        className="page-hero-compact auth-hero"
        kicker="Contact"
        title="Tell us the problem worth solving."
        lede="Whether you are exploring AI for your organization, building complementary technology, or thinking with us - start here."
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
    </>
  );
}
