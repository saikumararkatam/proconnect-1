import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AuthForm({ mode }) {
  const { login, register } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '', role: 'client' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      mode === 'login' ? await login({ email: f.email, password: f.password }) : await register(f);
      nav('/dashboard');
    } catch (e2) { setErr(e2.message); }
    setBusy(false);
  };

  return (
    <div className="wrap narrow pad">
      <h2>{mode === 'login' ? 'Log in to ProConnect' : 'Create your ProConnect account'}</h2>
      <form onSubmit={submit} className="form">
        {mode === 'register' && (
          <>
            <label>Full name<input required value={f.name} onChange={set('name')} /></label>
            <label>I want to
              <select value={f.role} onChange={set('role')}>
                <option value="client">Hire freelancers</option>
                <option value="freelancer">Work as a freelancer</option>
              </select>
            </label>
          </>
        )}
        <label>Email<input type="email" required value={f.email} onChange={set('email')} /></label>
        <label>Password<input type="password" required minLength={6} value={f.password} onChange={set('password')} /></label>
        {err && <p className="error">{err}</p>}
        <button className="btn btn-primary" disabled={busy}>{mode === 'login' ? 'Log in' : 'Create account'}</button>
      </form>
      <p className="muted">
        {mode === 'login' ? <>New here? <Link to="/register">Create an account</Link></> : <>Already a member? <Link to="/login">Log in</Link></>}
      </p>
    </div>
  );
}

export const Login = () => <AuthForm mode="login" />;
export const Register = () => <AuthForm mode="register" />;
