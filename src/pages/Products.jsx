import PageHero from "../components/PageHero.jsx";

const products = [
  {
    n: "01",
    t: "Organizational Intelligence",
    s: "A world model of the firm",
    d: "Move from AI that knows documents toward AI that understands the business — structure, processes, decisions, information, and how the organization changes over time.",
  },
  {
    n: "02",
    t: "AI-Native Enterprise Platform",
    s: "An operating layer",
    d: "Workflows, agents, human + AI collaboration, enterprise integration, orchestration, monitoring, and intelligent action.",
  },
  {
    n: "03",
    t: "Collective Intelligence",
    s: "A decision platform",
    d: "Decompose complex problems. Combine AI, domain expertise, human judgment, data, and analysis into a structured decision — not a single answer.",
  },
];

const phases = [
  { n: "01", t: "Discover", d: "Understand businesses and AI opportunities." },
  { n: "02", t: "Deliver", d: "Help companies implement." },
  { n: "03", t: "Learn", d: "See the patterns that repeat." },
  { n: "04", t: "Productize", d: "Build around what recurs." },
  { n: "05", t: "Platform", d: "An AI operating layer." },
  { n: "06", t: "Scale", d: "Help organizations become AI-native." },
];

export default function Products() {
  return (
    <>
      <PageHero
        kicker="Products"
        title="Three horizons — observed, then built."
        lede="Strategy: observe, validate, repeat, productize. We describe the destination. The proprietary route stays inside the firm."
      />

      <section className="section">
        <div className="wrap">
          <div className="grid-3">
            {products.map((p) => (
              <article className="card" key={p.n}>
                <div className="num">{p.n}</div>
                <h3>{p.t}</h3>
                <p className="teal">{p.s}</p>
                <p style={{ marginTop: "0.85rem" }}>{p.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="wrap">
          <div className="section-head">
            <p className="kicker">Roadmap</p>
            <h2>A company built in sequence — not claimed in advance.</h2>
          </div>
          <div className="grid-3">
            {phases.map((p) => (
              <article className="card" key={p.n}>
                <div className="phase">Phase {p.n}</div>
                <h3>{p.t}</h3>
                <p>{p.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
