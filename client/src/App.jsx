import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Protected from './components/Protected';
import Home from './pages/Home';
import { Login, Register } from './pages/Auth';
import Gigs from './pages/Gigs';
import GigDetail from './pages/GigDetail';
import PostGig from './pages/PostGig';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import PostJob from './pages/PostJob';
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/gigs" element={<Gigs />} />
          <Route path="/gigs/new" element={<Protected role="freelancer"><PostGig /></Protected>} />
          <Route path="/gigs/:id" element={<GigDetail />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/new" element={<Protected role="client"><PostJob /></Protected>} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
          <Route path="*" element={<p className="wrap pad">Page not found.</p>} />
        </Routes>
      </main>
      <footer className="foot"><div className="wrap">ProConnect. Hire and get hired.</div></footer>
    </>
  );
}
