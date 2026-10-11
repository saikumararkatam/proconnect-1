import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

function ProfileForm() {
  const { user, setUser } = useAuth();
  const [f, setF] = useState({ title: user.title || '', bio: user.bio || '', skills: (user.skills || []).join(', '), hourlyRate: user.hourlyRate || 0 });
  const [saved, setSaved] = useState(false);
  const set = (k) => (e) => { setSaved(false); setF({ ...f, [k]: e.target.value }); };
  const save = async (e) => {
    e.preventDefault();
    const d = await api('/auth/me', { method: 'PUT', body: { ...f, hourlyRate: +f.hourlyRate } });
    setUser(d.user); setSaved(true);
  };
  return (
    <form onSubmit={save} className="form panel">
      <h3>Your profile</h3>
      <label>Professional title<input value={f.title} onChange={set('title')} placeholder="Full-stack developer" /></label>
      <label>About you<textarea rows={4} value={f.bio} onChange={set('bio')} /></label>
      <label>Skills (comma separated)<input value={f.skills} onChange={set('skills')} /></label>
      <label>Hourly rate (₹)<input type="number" min="0" value={f.hourlyRate} onChange={set('hourlyRate')} /></label>
      <button className="btn btn-primary">Save profile</button>
      {saved && <p className="ok">Profile saved.</p>}
    </form>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const isFreelancer = user.role === 'freelancer';
  const [gigs, setGigs] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [jobs, setJobs] = useState([]);

  const load = () => {
    if (isFreelancer) {
      api('/gigs/mine').then(setGigs);
      api('/proposals/mine').then(setProposals);
    } else api('/jobs/mine').then(setJobs);
  };
  useEffect(load, []);

  const removeGig = async (id) => { await api(`/gigs/${id}`, { method: 'DELETE' }); load(); };

  return (
    <div className="wrap pad">
      <h2>Welcome, {user.name}</h2>
      {isFreelancer ? (
        <div className="two-col">
          <div>
            <h3>My services</h3>
            {gigs.length === 0 && <p className="muted">No services yet. <Link to="/gigs/new">Offer your first service</Link>.</p>}
            {gigs.map((g) => (
              <div key={g._id} className="card row-card">
                <Link to={`/gigs/${g._id}`}>{g.title}</Link>
                <button className="btn btn-ghost" onClick={() => removeGig(g._id)}>Delete</button>
              </div>
            ))}
            <h3>My proposals</h3>
            {proposals.length === 0 && <p className="muted">No proposals yet. <Link to="/jobs">Browse open jobs</Link>.</p>}
            {proposals.map((p) => (
              <div key={p._id} className="card row-card">
                <Link to={`/jobs/${p.job?._id}`}>{p.job?.title}</Link>
                <span className={`status ${p.status}`}>{p.status}</span>
              </div>
            ))}
          </div>
          <ProfileForm />
        </div>
      ) : (
        <>
          <h3>My jobs</h3>
          {jobs.length === 0 && <p className="muted">You have not posted a job. <Link to="/jobs/new">Post your first job</Link>.</p>}
          {jobs.map((j) => (
            <Link key={j._id} to={`/jobs/${j._id}`} className="card row-card">
              <span>{j.title}{j.hiredFreelancer && <span className="muted"> · hired {j.hiredFreelancer.name}</span>}</span>
              <span className={`status ${j.status}`}>{j.status.replace('_', ' ')}</span>
            </Link>
          ))}
        </>
      )}
    </div>
  );
}
