import { Link } from "react-router-dom";

const stages = [
  { n: "01", t: "Traditional", d: "People, process, and software as separate layers." },
  { n: "02", t: "AI-Enabled", d: "Tools added onto existing work. Useful, still peripheral." },
  { n: "03", t: "AI-Integrated", d: "AI enters workflows, decisions, and customer systems." },
  { n: "04", t: "AI-Native", d: "Humans and AI operate as one system. Our destination." },
];

const businesses = [
  { n: "A", t: "AI Advisory", s: "Relationships + understanding", d: "Help companies see where AI creates meaningful value — strategy, opportunity assessment, roadmaps, and operating model." },
  { n: "B", t: "AI Solutions", s: "Implementation + revenue", d: "Build, integrate, partner, configure, and orchestrate. Technology-agnostic. The best solution for the business." },
  { n: "C", t: "Proprietary Products", s: "IP + recurring revenue", d: "Productize recurring high-value problems discovered in the field — organizational intelligence, AI-native operations, collective decisions." },
];

const steps = ["Understand", "Identify", "Advise", "Build", "Learn", "Productize", "Scale"];

const flywheel = [
  "More companies",
  "More business problems",
  "More industry intelligence",
  "More AI use cases",
  "More solutions",
  "More relationships",
  "More proprietary knowledge",
  "Better products",
];

const sectors = [
  "Financial services",
  "Healthcare",
  "Technology",
  "Consumer",
  "Industrial",
  "Energy",
  "Professional services",
  "Education",
  "Public sector",
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-bg" />
        <div className="wrap hero-content">
          <p className="kicker">Vinverse</p>
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

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <p className="kicker">The shift</p>
            <h2>AI is changing more than tasks. It is changing how companies organize.</h2>
          </div>
          <div className="grid-4">
            {stages.map((s) => (
              <article className="card" key={s.n}>
                <div className="num">{s.n}</div>
                <h3>{s.t}</h3>
                <p>{s.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap grid-2">
          <div>
            <p className="kicker">Method</p>
            <h2>We start with real businesses and real problems.</h2>
            <p className="lede" style={{ marginTop: "1rem" }}>
              Not a product in search of a market. A continuous loop from the field to the platform.
            </p>
            <div className="steps">
              {steps.map((step, i) => (
                <div className="step" key={step}>
                  <i>{i + 1}</i>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
          <img className="split-image" src="/images/progression.jpg" alt="From traditional rooms to an AI-native space" />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <p className="kicker">The business</p>
            <h2>Three businesses that reinforce each other.</h2>
          </div>
          <div className="grid-3">
            {businesses.map((b) => (
              <article className="card" key={b.n}>
                <div className="num">{b.n}</div>
                <h3>{b.t}</h3>
                <p className="teal">{b.s}</p>
                <p style={{ marginTop: "0.7rem" }}>{b.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap grid-2">
          <div>
            <p className="kicker">Flywheel</p>
            <h2>Every engagement compounds.</h2>
            <p className="lede" style={{ margin: "1rem 0 1.4rem" }}>
              Learning becomes capability. Capability becomes products. Products bring more companies.
            </p>
            <ul className="flywheel-list">
              {flywheel.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <img className="split-image" src="/images/flywheel.jpg" alt="Intelligence flywheel" />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <p className="kicker">Market</p>
            <h2>Broad opportunity. Focused entry.</h2>
            <p className="lede">
              We start where we have relationships, credibility, and domain knowledge — then expand as capabilities mature.
            </p>
          </div>
          <div className="sectors">
            {sectors.map((s) => (
              <span className="chip" key={s}>
                {s}
              </span>
            ))}
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
