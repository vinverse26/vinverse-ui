import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";

const products = [
  {
    id: "organizational-intelligence",
    n: "01",
    t: "Organizational Intelligence",
    s: "From answers to intelligent decisions.",
    d: "Most AI replies to a prompt. This layer gives leaders - and the rest of the firm - decision support with business acumen: what is happening, what it means, and what to do.",
  },
  {
    id: "collective-intelligence",
    n: "02",
    t: "Collective Intelligence Platform",
    s: "A decision platform for Intelligence Fellows.",
    d: "Hard problems are split across the right expertise - human and machine - then brought back as a structured decision the organization can stand behind.",
    to: "/login",
  },
  {
    id: "ai-native-enterprise",
    n: "03",
    t: "AI-Native Enterprise Platform",
    s: "The business, at your fingertips.",
    d: "Run the company as a single, intelligible system - visible, responsive, and close at hand - rather than as a stack of tools only specialists can operate.",
  },
];

export default function Products() {
  const location = useLocation();

  useEffect(() => {
    const id = location.hash.replace(/^#/, "");
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [location.hash]);

  const activeId = location.hash.replace(/^#/, "");

  return (
    <>
      <PageHero
        className="page-hero-compact"
        kicker="Products"
        title="Three products. One destination: the AI-native enterprise."
      />

      <section className="section section-compact">
        <div className="wrap">
          <div className="grid-3">
            {products.map((p) => {
              const highlighted = p.id === activeId;
              const className = [
                "card",
                p.to ? "card-link" : "",
                highlighted ? "card-target" : "",
              ]
                .filter(Boolean)
                .join(" ");

              const inner = (
                <>
                  <div className="num">{p.n}</div>
                  <h3>{p.t}</h3>
                  <p className="teal">{p.s}</p>
                  <p style={{ marginTop: "0.85rem" }}>{p.d}</p>
                  {p.to ? <p className="card-cta">Open product</p> : null}
                </>
              );

              return p.to ? (
                <Link className={className} to={p.to} key={p.id} id={p.id}>
                  {inner}
                </Link>
              ) : (
                <article className={className} key={p.id} id={p.id}>
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
