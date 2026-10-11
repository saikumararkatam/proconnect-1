import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../api';

export default function Home() {
  const [q, setQ] = useState('');
  const nav = useNavigate();
  const search = (e) => { e.preventDefault(); nav(`/gigs?q=${encodeURIComponent(q)}`); };

  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <h1>Hire a pro for the work you keep putting off.</h1>
            <p className="lead">Post a job and get proposals, or browse ready-to-buy services from freelancers who ship.</p>
            <form onSubmit={search} className="search">
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Try &quot;logo design&quot; or &quot;React developer&quot;" />
              <button className="btn btn-accent">Search services</button>
            </form>
            <div className="cta-row">
              <Link to="/register" className="btn btn-primary">Start hiring</Link>
              <Link to="/register" className="btn btn-outline">Start freelancing</Link>
            </div>
          </div>
          <ul className="cat-board">
            {CATEGORIES.map((c) => (
              <li key={c}><Link to={`/gigs?category=${encodeURIComponent(c)}`}>{c}</Link></li>
            ))}
          </ul>
        </div>
      </section>
      <section className="wrap steps">
        <div><h3>Clients post a job</h3><p>Describe the work and set a budget. Proposals arrive in your dashboard.</p></div>
        <div><h3>Freelancers send proposals</h3><p>Pitch your approach, price and delivery time. Or list a service people can buy straight away.</p></div>
        <div><h3>Hire and finish the work</h3><p>Accept the best proposal, track the job, and mark it complete when it is delivered.</p></div>
      </section>
    </>
  );
}
