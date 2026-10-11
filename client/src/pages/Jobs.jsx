import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, CATEGORIES } from '../api';

export default function Jobs() {
  const [jobs, setJobs] = useState(null);
  const [category, setCategory] = useState('');
  const [q, setQ] = useState('');

  useEffect(() => {
    setJobs(null);
    const qs = new URLSearchParams({ ...(q && { q }), ...(category && { category }) });
    api(`/jobs?${qs}`).then(setJobs).catch(() => setJobs([]));
  }, [q, category]);

  return (
    <div className="wrap pad">
      <h2>Open jobs</h2>
      <div className="filters">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search jobs" />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>
      {!jobs && <p className="muted">Loading...</p>}
      {jobs?.length === 0 && <p className="muted">No open jobs right now. Check back soon.</p>}
      <div className="list">
        {jobs?.map((j) => (
          <Link key={j._id} to={`/jobs/${j._id}`} className="card row-card">
            <div>
              <h3>{j.title}</h3>
              <p className="muted">{j.category} · posted by {j.client?.name}</p>
              <div className="tags">{j.skills.map((s) => <span key={s} className="chip">{s}</span>)}</div>
            </div>
            <strong>₹{j.budget.toLocaleString('en-IN')}</strong>
          </Link>
        ))}
      </div>
    </div>
  );
}
