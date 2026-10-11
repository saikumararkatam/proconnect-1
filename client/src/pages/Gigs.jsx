import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api, CATEGORIES } from '../api';

export default function Gigs() {
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const category = params.get('category') || '';
  const [gigs, setGigs] = useState(null);
  const [text, setText] = useState(q);

  useEffect(() => {
    setGigs(null);
    const qs = new URLSearchParams({ ...(q && { q }), ...(category && { category }) });
    api(`/gigs?${qs}`).then(setGigs).catch(() => setGigs([]));
  }, [q, category]);

  return (
    <div className="wrap pad">
      <h2>Find services</h2>
      <div className="filters">
        <form onSubmit={(e) => { e.preventDefault(); setParams({ ...(text && { q: text }), ...(category && { category }) }); }}>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Search services" />
        </form>
        <select value={category} onChange={(e) => setParams({ ...(q && { q }), ...(e.target.value && { category: e.target.value }) })}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      {!gigs && <p className="muted">Loading...</p>}
      {gigs?.length === 0 && <p className="muted">No services match yet. Try another search.</p>}
      <div className="grid">
        {gigs?.map((g) => (
          <Link to={`/gigs/${g._id}`} key={g._id} className="card">
            <span className="chip">{g.category}</span>
            <h3>{g.title}</h3>
            <p className="muted">by {g.freelancer?.name}</p>
            <div className="card-foot"><span>{g.deliveryDays}-day delivery</span><strong>₹{g.price.toLocaleString('en-IN')}</strong></div>
          </Link>
        ))}
      </div>
    </div>
  );
}
