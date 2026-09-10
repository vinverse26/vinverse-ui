import PageHero from "../components/PageHero.jsx";

const advisory = [
  "AI strategy",
  "AI opportunity assessment",
  "Use-case discovery",
  "Transformation roadmap",
  "Technology assessment",
  "Vendor and startup discovery",
  "Implementation advisory",
  "AI operating model",
];

const solutions = [
  { t: "Build", d: "Custom AI applications and workflows." },
  { t: "Integrate", d: "Connect enterprise systems with AI capabilities." },
  { t: "Partner", d: "Bring in specialized AI technology providers." },
  { t: "Configure", d: "Adapt existing platforms to the business." },
  { t: "Orchestrate", d: "Combine multiple AI capabilities into one workflow." },
];

export default function Services() {
  return (
    <>
      <PageHero
        kicker="Services"
        title="Credible work today. Compounding intelligence tomorrow."
        lede="Advisory creates relationships and understanding. Solutions create implementation experience. Together they reveal the products worth building."
      />

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <p className="kicker">Advisory</p>
            <h2>Help companies see where AI creates value.</h2>
          </div>
          <div className="grid-4">
            {advisory.map((item, i) => (
              <article className="card" key={item}>
                <div className="num">{String(i + 1).padStart(2, "0")}</div>
                <h3>{item}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap">
          <div className="section-head">
            <p className="kicker">Solutions</p>
            <h2>Find the best solution for the business.</h2>
            <p className="lede">
              We remain technology-agnostic. If another company has the superior component, we recommend, integrate, or partner around it.
            </p>
          </div>
          <div className="grid-3">
            {solutions.map((s) => (
              <article className="card" key={s.t}>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid-2">
          <img className="split-image" src="/images/team.jpg" alt="Working session" />
          <div>
            <p className="kicker">Typical questions</p>
            <h2>Where should AI enter the firm first?</h2>
            <div className="card" style={{ marginTop: "1.2rem" }}>
              <p>Where can AI create value — and what should remain human?</p>
              <p style={{ marginTop: "0.7rem" }}>What should we build, buy, or partner for?</p>
              <p style={{ marginTop: "0.7rem" }}>What should we do first?</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
