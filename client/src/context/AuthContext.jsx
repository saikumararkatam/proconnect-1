import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem('pc_token')) return setLoading(false);
    api('/auth/me')
      .then((d) => setUser(d.user))
      .catch(() => localStorage.removeItem('pc_token'))
      .finally(() => setLoading(false));
  }, []);

  const authenticate = async (path, body) => {
    const d = await api(path, { method: 'POST', body });
    localStorage.setItem('pc_token', d.token);
    setUser(d.user);
  };

  const value = {
    user, setUser, loading,
    login: (b) => authenticate('/auth/login', b),
    register: (b) => authenticate('/auth/register', b),
    logout: () => { localStorage.removeItem('pc_token'); setUser(null); },
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
