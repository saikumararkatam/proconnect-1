import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, CATEGORIES } from '../api';

export default function PostJob() {
  const nav = useNavigate();
  const [f, setF] = useState({ title: '', description: '', category: CATEGORIES[0], budget: '', skills: '' });
  const [err, setErr] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const j = await api('/jobs', { method: 'POST', body: { ...f, budget: +f.budget } });
      nav(`/jobs/${j._id}`);
    } catch (e2) { setErr(e2.message); }
  };

  return (
    <div className="wrap narrow pad">
      <h2>Post a job</h2>
      <form onSubmit={submit} className="form">
        <label>Job title<input required value={f.title} onChange={set('title')} /></label>
        <label>Category<select value={f.category} onChange={set('category')}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label>Describe the work<textarea required rows={6} value={f.description} onChange={set('description')} /></label>
        <label>Budget (₹)<input type="number" min="1" required value={f.budget} onChange={set('budget')} /></label>
        <label>Skills needed (comma separated)<input value={f.skills} onChange={set('skills')} /></label>
        {err && <p className="error">{err}</p>}
        <button className="btn btn-primary">Post job</button>
      </form>
    </div>
  );
}
