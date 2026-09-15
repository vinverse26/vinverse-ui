import { useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";
import OfferBand from "../components/OfferBand.jsx";

const services = [
  {
    id: "advisory",
    label: "Advisory",
    title: "Become AI-native - with a clear path, not a pile of tools.",
    body: "We help leadership teams see where AI creates real value, what to leave human, and how to move from experiments to an operating model that sticks.",
    items: [
      "AI opportunity assessment and use-case discovery",
      "Transformation roadmap toward an AI-native enterprise",
      "Technology and vendor assessment (build, buy, or partner)",
      "Operating model, governance, and implementation advisory",
    ],
    gridClass: "grid-4",
  },
  {
    id: "solutions",
    label: "Solutions",
    title: "Design, build, and implement AI that works in the business.",
    body: "We deliver high-quality product and engineering - from workflow tools to full applications - and stay technology-agnostic so you get the best fit, not a forced stack.",
    items: [
      "Product design and UX for AI-powered experiences",
      "Custom development and system integration",
      "Implementation, configuration, and orchestration across tools",
      "Partnering with specialized AI providers when they are the better component",
    ],
    gridClass: "grid-4",
  },
  {
    id: "fractional-cto",
    label: "Fractional CTO",
    title: "Senior technical leadership, when and as you need it.",
    body: "We act as your CTO bench - architecture, hiring guidance, vendor choices, roadmap, and delivery oversight - without a full-time hire until you're ready.",
    items: [
      "Technical strategy and architecture decisions",
      "Product and engineering roadmap",
      "Team structure, hiring, and vendor selection",
      "Delivery oversight and risk management on critical builds",
      "End-to-end product development - from the screens people use to the systems that run behind them",
    ],
    gridClass: "grid-3",
  },
  {
    id: "startup-booster",
    label: "Start-up Booster",
    title: "You own the idea. We own design through delivery.",
    body: "For inventors and founders who want to stay focused on the problem and the market. We take product and technology end to end - proof of concept to enterprise-grade - so you are not assembling a full tech org before you need one.",
    items: [
      "Product design and proof-of-concept validation",
      "Full-stack web applications (front to back)",
      "iOS app development",
      "Scaling from prototype to production-ready systems",
    ],
    gridClass: "grid-4",
  },
];

export default function Services() {
  const [activeId, setActiveId] = useState(services[0].id);
  const active = services.find((s) => s.id === activeId) || services[0];

  return (
    <>
      <PageHero
        className="page-hero-compact"
        kicker="Services"
        title="Unlock the value an AI-native company can create"
        lede="We help you see where AI can transform the business - and we walk the full journey with you, from the first decision to an operating model that works."
      />

      <div className="service-switcher">
        <div className="wrap">
          <nav className="service-tabs" aria-label="Service offerings">
            {services.map((s) => (
              <button
                key={s.id}
                type="button"
                className={s.id === activeId ? "service-tab active" : "service-tab"}
                aria-pressed={s.id === activeId}
                onClick={() => setActiveId(s.id)}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <section className="section section-compact">
        <div className="wrap">
          <div className="section-head">
            <p className="kicker">{active.label}</p>
            <h2>{active.title}</h2>
            <p className="lede">{active.body}</p>
          </div>
          <div className={active.gridClass}>
            {active.items.map((item, i) => (
              <article className="card" key={item}>
                <div className="num">{String(i + 1).padStart(2, "0")}</div>
                <h3>{item}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-compact">
        <div className="wrap">
          <div className="section-head">
            <p className="lede">
              Not sure which engagement fits? Start with a short discovery conversation - we'll recommend Advisory,
              Solutions, Fractional CTO, Start-up Booster, or a mix.
            </p>
            <div className="actions" style={{ marginTop: "1.2rem" }}>
              <Link className="btn ghost" to="/contact">
                Start a conversation
              </Link>
            </div>
          </div>
        </div>
      </section>

      <OfferBand />
    </>
  );
}
