import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, CATEGORIES } from '../api';

export default function PostGig() {
  const nav = useNavigate();
  const [f, setF] = useState({ title: '', description: '', category: CATEGORIES[0], price: '', deliveryDays: '', tags: '' });
  const [err, setErr] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const g = await api('/gigs', { method: 'POST', body: { ...f, price: +f.price, deliveryDays: +f.deliveryDays } });
      nav(`/gigs/${g._id}`);
    } catch (e2) { setErr(e2.message); }
  };

  return (
    <div className="wrap narrow pad">
      <h2>Offer a service</h2>
      <form onSubmit={submit} className="form">
        <label>Service title<input required value={f.title} onChange={set('title')} placeholder="I will build your React website" /></label>
        <label>Category<select value={f.category} onChange={set('category')}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label>What you will deliver<textarea required rows={6} value={f.description} onChange={set('description')} /></label>
        <div className="row">
          <label>Price (₹)<input type="number" min="1" required value={f.price} onChange={set('price')} /></label>
          <label>Delivery (days)<input type="number" min="1" required value={f.deliveryDays} onChange={set('deliveryDays')} /></label>
        </div>
        <label>Tags (comma separated)<input value={f.tags} onChange={set('tags')} placeholder="react, mongodb, api" /></label>
        {err && <p className="error">{err}</p>}
        <button className="btn btn-primary">Publish service</button>
      </form>
    </div>
  );
}
