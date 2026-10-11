import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';

export default function GigDetail() {
  const { id } = useParams();
  const [gig, setGig] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => { api(`/gigs/${id}`).then(setGig).catch((e) => setErr(e.message)); }, [id]);
  if (err) return <p className="wrap pad error">{err}</p>;
  if (!gig) return <p className="wrap pad muted">Loading...</p>;

  return (
    <div className="wrap pad two-col">
      <article>
        <span className="chip">{gig.category}</span>
        <h2>{gig.title}</h2>
        <p className="pre">{gig.description}</p>
        <div className="tags">{gig.tags.map((t) => <span key={t} className="chip">{t}</span>)}</div>
      </article>
      <aside className="panel">
        <h3>₹{gig.price.toLocaleString('en-IN')}</h3>
        <p className="muted">Delivered in {gig.deliveryDays} days</p>
        <hr />
        <strong>{gig.freelancer.name}</strong>
        <p className="muted">{gig.freelancer.title}</p>
        <p>{gig.freelancer.bio}</p>
      </aside>
    </div>
  );
}
