import { Link } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";

const pillars = [
  { t: "Master consultant", d: "A virtual expert works with Fellows to frame the problem, ask follow-up questions, and keep work aligned to the objective." },
  { t: "Project workspace", d: "Each project has a living document Fellows can structure, section, version, and delegate." },
  { t: "Fellow network", d: "Match expertise to the problem. Invite, assign, clone, and synthesize multiple perspectives." },
  { t: "Structured decisions", d: "Break a question into domains — market, risk, economics, operations — then combine the answers." },
];

export default function CollectiveIntelligence() {
  return (
    <>
      <PageHero
        kicker="Product"
        title="Collective Intelligence Platform"
        lede="A workspace where Intelligence Fellows and a master consultant solve complex problems together — then turn that work into a structured decision."
      />

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <p className="kicker">Overview</p>
            <h2>Not a single AI answer. A decision process.</h2>
            <p className="lede">
              Fellows create a project, upload context, and work with the master consultant to define the objective.
              The platform helps decompose the work, invite the right expertise, version contributions, and synthesize
              a final outcome.
            </p>
          </div>
          <div className="grid-2" style={{ marginBottom: "2rem" }}>
            <img className="split-image" src="/images/team.jpg" alt="Fellows working a decision problem" />
            <div className="card">
              <p className="num">How it works</p>
              <p>1. Create a project and describe the problem.</p>
              <p style={{ marginTop: "0.7rem" }}>2. Upload documents. The master consultant interviews you to lock context.</p>
              <p style={{ marginTop: "0.7rem" }}>3. Invite Fellows, split work into sub-projects, and assign owners.</p>
              <p style={{ marginTop: "0.7rem" }}>4. Work section by section. Version changes. Synthesize the outcome.</p>
            </div>
          </div>
          <div className="grid-4">
            {pillars.map((p) => (
              <article className="card" key={p.t}>
                <h3>{p.t}</h3>
                <p>{p.d}</p>
              </article>
            ))}
          </div>
          <div className="actions" style={{ marginTop: "2.2rem" }}>
            <Link className="btn" to="/register">
              Register
            </Link>
            <Link className="btn ghost" to="/login">
              Login
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
