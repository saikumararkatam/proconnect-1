import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [f, setF] = useState({ coverLetter: '', bid: '', deliveryDays: '' });
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const isOwner = user?.role === 'client' && job && String(job.client?._id) === String(user._id);

  const load = async () => {
    try {
      const j = await api(`/jobs/${id}`);
      setJob(j);
      if (user?.role === 'client' && String(j.client._id) === String(user._id))
        setProposals(await api(`/jobs/${id}/proposals`));
    } catch (e) { setErr(e.message); }
  };
  useEffect(() => { load(); }, [id, user?._id]);

  const send = async (e) => {
    e.preventDefault(); setErr(''); setMsg('');
    try {
      await api('/proposals', { method: 'POST', body: { jobId: id, ...f, bid: +f.bid, deliveryDays: +f.deliveryDays } });
      setMsg('Proposal sent. The client will review it.');
    } catch (e2) { setErr(e2.message); }
  };

  const hire = async (pid) => { await api(`/proposals/${pid}/accept`, { method: 'PUT' }); load(); };
  const complete = async () => { await api(`/jobs/${id}/complete`, { method: 'PUT' }); load(); };

  if (err && !job) return <p className="wrap pad error">{err}</p>;
  if (!job) return <p className="wrap pad muted">Loading...</p>;
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  return (
    <div className="wrap pad two-col">
      <article>
        <span className="chip">{job.category}</span> <span className={`status ${job.status}`}>{job.status.replace('_', ' ')}</span>
        <h2>{job.title}</h2>
        <p className="muted">Posted by {job.client?.name}</p>
        <p className="pre">{job.description}</p>
        <div className="tags">{job.skills.map((s) => <span key={s} className="chip">{s}</span>)}</div>

        {isOwner && (
          <section>
            <h3>Proposals ({proposals.length})</h3>
            {job.status === 'in_progress' && <button className="btn btn-accent" onClick={complete}>Mark job as completed</button>}
            {proposals.length === 0 && <p className="muted">No proposals yet.</p>}
            {proposals.map((p) => (
              <div key={p._id} className="card">
                <strong>{p.freelancer.name}</strong> <span className="muted">{p.freelancer.title}</span>
                <p className="pre">{p.coverLetter}</p>
                <div className="card-foot">
                  <span>₹{p.bid.toLocaleString('en-IN')} · {p.deliveryDays} days · {p.status}</span>
                  {job.status === 'open' && <button className="btn btn-primary" onClick={() => hire(p._id)}>Hire</button>}
                </div>
              </div>
            ))}
          </section>
        )}
      </article>

      <aside className="panel">
        <h3>₹{job.budget.toLocaleString('en-IN')}</h3>
        <p className="muted">Client budget</p>
        {user?.role === 'freelancer' && job.status === 'open' && (
          <form onSubmit={send} className="form">
            <label>Cover letter<textarea required rows={5} value={f.coverLetter} onChange={set('coverLetter')} /></label>
            <label>Your bid (₹)<input type="number" min="1" required value={f.bid} onChange={set('bid')} /></label>
            <label>Delivery (days)<input type="number" min="1" required value={f.deliveryDays} onChange={set('deliveryDays')} /></label>
            {err && <p className="error">{err}</p>}
            {msg && <p className="ok">{msg}</p>}
            <button className="btn btn-primary">Send proposal</button>
          </form>
        )}
        {!user && <p><Link to="/login">Log in</Link> as a freelancer to send a proposal.</p>}
      </aside>
    </div>
  );
}
