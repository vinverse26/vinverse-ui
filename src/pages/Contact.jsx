import PageHero from "../components/PageHero.jsx";

export default function Contact() {
  return (
    <>
      <PageHero
        kicker="Contact"
        title="Tell us the problem worth solving."
        lede="Whether you are exploring AI for your organization, building complementary technology, or thinking with us — start here."
      />
      <section className="section">
        <div className="wrap contact-panel">
          <p className="lede">
            Write to{" "}
            <a className="mail" href="mailto:ideas@vinverse.ai">
              ideas@vinverse.ai
            </a>
            .
          </p>

          <form
            className="form"
            onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              const subject = encodeURIComponent(data.get("topic") || "Vinverse inquiry");
              const body = encodeURIComponent(
                `Name: ${data.get("name")}\nEmail: ${data.get("email")}\nOrganization: ${data.get("org")}\n\n${data.get("message")}`
              );
              window.location.href = `mailto:ideas@vinverse.ai?subject=${subject}&body=${body}`;
            }}
          >
            <label>
              Name
              <input name="name" required />
            </label>
            <label>
              Email
              <input name="email" type="email" required />
            </label>
            <label>
              Organization
              <input name="org" />
            </label>
            <label>
              Topic
              <select name="topic" defaultValue="AI advisory">
                <option>AI advisory</option>
                <option>AI solutions</option>
                <option>Partnership</option>
                <option>Other</option>
              </select>
            </label>
            <label>
              Message
              <textarea name="message" required />
            </label>
            <button className="btn" type="submit">
              Send Email
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
