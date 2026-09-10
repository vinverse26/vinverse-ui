export default function PageHero({ kicker, title, lede }) {
  return (
    <section className="page-hero">
      <div className="wrap">
        <p className="kicker">{kicker}</p>
        <h1>{title}</h1>
        {lede ? <p className="lede">{lede}</p> : null}
      </div>
    </section>
  );
}
