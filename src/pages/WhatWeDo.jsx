import { useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";

const pillars = [
  {
    id: "services",
    kicker: "Services",
    title: "Put AI to work in the company you already run.",
    body: "Advisory, implementation, fractional technical leadership, and end-to-end build support - so leadership can see where AI transforms the business and stay on the journey until the new way of working holds.",
    includes: [
      { label: "Advisory", to: "/services?service=advisory" },
      { label: "Solutions", to: "/services?service=solutions" },
      { label: "Fractional CTO", to: "/services?service=fractional-cto" },
      { label: "Start-up Booster", to: "/services?service=startup-booster" },
    ],
    to: "/services",
    cta: "View services",
  },
  {
    id: "products",
    kicker: "Products",
    title: "Give the enterprise an intelligence layer it can decide and operate on.",
    body: "Organizational Intelligence gives leaders - and everyone in the firm - decision support with real business acumen. The Collective Intelligence Platform turns complex questions into structured decisions. The AI-Native Enterprise Platform is the operating layer.",
    includes: [
      { label: "Organizational Intelligence", to: "/products#organizational-intelligence" },
      { label: "Collective Intelligence Platform", to: "/products#collective-intelligence" },
      { label: "AI-Native Enterprise Platform", to: "/products#ai-native-enterprise" },
    ],
    to: "/products",
    cta: "View products",
  },
];

export default function WhatWeDo() {
  const [activeId, setActiveId] = useState(pillars[0].id);
  const active = pillars.find((p) => p.id === activeId) || pillars[0];

  return (
    <>
      <PageHero
        className="page-hero-compact"
        kicker="What we do"
        title="What we do"
        lede="We help organizations become AI-native. That means two kinds of work: services that move the business, and products that become the intelligence layer it runs on."
      />

      <div className="pillar-switcher">
        <div className="wrap">
          <div className="pillar-bar" role="tablist" aria-label="What we do">
            {pillars.map((p) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={p.id === activeId}
                className={p.id === activeId ? "pillar-bar-segment active" : "pillar-bar-segment"}
                onClick={() => setActiveId(p.id)}
              >
                {p.kicker}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="section section-compact alt">
        <div className="wrap">
          <div className="section-head what-we-do-head">
            <p className="kicker">{active.kicker}</p>
            <h2>{active.title}</h2>
            <p className="lede">{active.body}</p>
          </div>

          <div className="what-includes">
            <p className="what-includes-label">Includes</p>
            <nav className="service-tabs" aria-label={active.kicker}>
              {active.includes.map((item) => (
                <Link className="service-tab" to={item.to} key={item.label}>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="actions" style={{ marginTop: "1.5rem" }}>
            <Link className="btn ghost" to={active.to}>
              {active.cta}
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-compact">
        <div className="wrap">
          <div className="section-head what-we-do-head">
            <p className="lede">
              Services create the path. Products make it durable. If you are not sure which door to use, start with a
              short conversation.
            </p>
            <div className="actions" style={{ marginTop: "1.2rem" }}>
              <Link className="btn ghost" to="/contact">
                Start a conversation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
