import { Link } from "react-router-dom";
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
    t: "Collective Intelligence Platform",
    s: "A decision platform for Intelligence Fellows",
    d: "Decompose complex problems. Combine AI, domain expertise, human judgment, data, and analysis into a structured decision — not a single answer.",
    to: "/login",
  },
  {
    n: "03",
    t: "AI-Native Enterprise Platform",
    s: "An operating layer",
    d: "Workflows, agents, human + AI collaboration, enterprise integration, orchestration, monitoring, and intelligent action.",
  },
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
            {products.map((p) => {
              const inner = (
                <>
                  <div className="num">{p.n}</div>
                  <h3>{p.t}</h3>
                  <p className="teal">{p.s}</p>
                  <p style={{ marginTop: "0.85rem" }}>{p.d}</p>
                  {p.to ? <p className="card-cta">Open product →</p> : null}
                </>
              );
              return p.to ? (
                <Link className="card card-link" to={p.to} key={p.n}>
                  {inner}
                </Link>
              ) : (
                <article className="card" key={p.n}>
                  {inner}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
