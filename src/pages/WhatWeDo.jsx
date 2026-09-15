import { Link } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";

const pillars = [
  {
    id: "services",
    kicker: "Services",
    title: "Put AI to work in the company you already run.",
    body: "Advisory, implementation, fractional technical leadership, and end-to-end build support - so leadership can see where AI transforms the business and stay on the journey until the new way of working holds.",
    includes: ["Advisory", "Solutions", "Fractional CTO", "Start-up Booster"],
    to: "/services",
    cta: "View services",
  },
  {
    id: "products",
    kicker: "Products",
    title: "Give the enterprise an intelligence layer it can decide and operate on.",
    body: "Organizational Intelligence gives leaders - and everyone in the firm - decision support with real business acumen. The Collective Intelligence Platform turns complex questions into structured decisions. The AI-Native Enterprise Platform is the operating layer.",
    includes: [
      "Organizational Intelligence",
      "Collective Intelligence Platform",
      "AI-Native Enterprise Platform",
    ],
    to: "/products",
    cta: "View products",
  },
];

export default function WhatWeDo() {
  return (
    <>
      <PageHero
        className="page-hero-compact"
        kicker="What we do"
        title="What we do"
        lede="We help organizations become AI-native. That means two kinds of work: services that move the business, and products that become the intelligence layer it runs on."
      />

      {pillars.map((pillar, index) => (
        <section
          key={pillar.id}
          className={index % 2 === 0 ? "section section-compact" : "section section-compact alt"}
        >
          <div className="wrap">
            <div className="section-head what-we-do-head">
              <p className="kicker">{pillar.kicker}</p>
              <h2>{pillar.title}</h2>
              <p className="lede">{pillar.body}</p>
            </div>

            <div className="what-includes">
              <p className="what-includes-label">Includes</p>
              <div className="what-includes-list">
                {pillar.includes.map((item) => (
                  <span className="what-chip" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="actions" style={{ marginTop: "1.5rem" }}>
              <Link className="btn" to={pillar.to}>
                {pillar.cta}
              </Link>
            </div>
          </div>
        </section>
      ))}

      <section className="section section-compact">
        <div className="wrap">
          <div className="section-head what-we-do-head">
            <p className="lede">
              Services create the path. Products make it durable. If you are not sure which door to use, start with a
              short conversation.
            </p>
            <div className="actions" style={{ marginTop: "1.2rem" }}>
              <Link className="btn" to="/contact">
                Start a conversation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
