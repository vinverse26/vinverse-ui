import { useProjects } from "../../platform/ProjectsContext.jsx";

const FELLOW_CARDS = [
  ["Strategy", "Problem framing and decision architecture"],
  ["Finance", "Investment, pricing, and financial impact"],
  ["Operations", "Operating model and delivery risk"],
];

export default function Fellows() {
  const { projects, invite } = useProjects();
  const defaultProjectId = projects[0]?.id;

  return (
    <div>
      <h2>Find matching Fellows</h2>
      <p className="lede">Search and invite expertise for the work at hand.</p>
      <div className="grid-3" style={{ marginTop: "1.2rem" }}>
        {FELLOW_CARDS.map(([title, detail]) => (
          <article className="card" key={title}>
            <h3>{title}</h3>
            <p>{detail}</p>
            <p
              className="card-cta"
              role="button"
              onClick={() => invite(defaultProjectId, title)}
            >
              Invite to project
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
