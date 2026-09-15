export default function PageHero({ kicker, title, lede, children, className = "" }) {
  const classes = ["page-hero", className].filter(Boolean).join(" ");
  return (
    <section className={classes}>
      <div className="wrap">
        <p className="kicker">{kicker}</p>
        <h1>{title}</h1>
        {lede ? <p className="lede">{lede}</p> : null}
        {children}
      </div>
    </section>
  );
}
