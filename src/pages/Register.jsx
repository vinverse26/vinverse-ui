import { useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";
import { registerFellow } from "../api/auth.js";

export default function Register() {
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <>
        <PageHero kicker="Register" title="Request received." />
        <section className="section">
          <div className="wrap contact-panel">
            <p className="lede">
              Once an admin approves your request, you will receive an email with login details.
            </p>
            <div className="actions" style={{ marginTop: "1.6rem" }}>
              <Link className="btn ghost" to="/products/collective-intelligence">
                Back to product
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        kicker="Register"
        title="Request access to the platform."
        lede="Access is invite-only. Submit your details and an admin will review the request."
      />
      <section className="section">
        <div className="wrap contact-panel">
          <form
            className="form"
            onSubmit={async (e) => {
              e.preventDefault();
              const data = Object.fromEntries(new FormData(e.currentTarget).entries());
              await registerFellow({ ...data, requestedAt: new Date().toISOString() });
              setDone(true);
            }}
          >
            <label>
              Name
              <input name="name" required />
            </label>
            <label>
              Email
              <input name="email" type="email" required />
            </label>
            <label>
              Phone number
              <input name="phone" type="tel" required />
            </label>
            <button className="btn" type="submit">
              Register
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
