import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <header className="nav">
      <div className="wrap nav-row">
        <Link to="/" className="logo">Pro<span>Connect</span></Link>
        <nav className="nav-links">
          <NavLink to="/gigs">Find services</NavLink>
          <NavLink to="/jobs">Browse jobs</NavLink>
          {user?.role === 'freelancer' && <NavLink to="/gigs/new">Offer a service</NavLink>}
          {user?.role === 'client' && <NavLink to="/jobs/new">Post a job</NavLink>}
        </nav>
        <div className="nav-auth">
          {user ? (
            <>
              <Link to="/dashboard" className="btn btn-ghost">{user.name.split(' ')[0]}</Link>
              <button className="btn btn-ghost" onClick={() => { logout(); nav('/'); }}>Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Log in</Link>
              <Link to="/register" className="btn btn-primary">Join free</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
