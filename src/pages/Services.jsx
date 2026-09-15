import { useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";

const services = [
  {
    id: "advisory",
    label: "Advisory",
    title: "Unlock the value an AI-native company can create.",
    body: "We help leadership see where AI belongs, what should stay human, and how to move from experiments to an operating model that holds - a path, not a pile of tools.",
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
    title: "Design, build, and put AI into the work of the firm.",
    body: "From workflow tools to full applications - product, engineering, and integration, with no forced stack. You get the fit that serves the business.",
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
    title: "You own the company. We help you build it.",
    body: "You stay on the idea and the market. We take product and technology from proof of concept to something you can run - without standing up a full tech org first.",
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
        title="The engagement that matches the job: advice, build, leadership, or all three."
        lede="We help companies see where AI should transform the business, implement what follows, step in as technical leadership, and take products from idea to production when you do not yet want a full tech organization."
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
</>
  );
}
