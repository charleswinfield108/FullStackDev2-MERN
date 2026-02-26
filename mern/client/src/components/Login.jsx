import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/admin';

  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        navigate('/admin/unauthorized', { replace: true });
        return;
      }

      const data = await response.json();
      localStorage.removeItem('authToken');
      sessionStorage.setItem('authToken', data.token);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="login-page">
      <img
        alt="Rocket logo"
        className="login-logo"
        src="/assets/rocketLogo.png"
      />
      <div className="login-orb login-orb--one" aria-hidden="true" />
      <div className="login-orb login-orb--two" aria-hidden="true" />
      <div className="login-orb login-orb--three" aria-hidden="true" />

      <div className="login-content">
        <div className="login-hero">
          <p className="login-eyebrow">Admin Access</p>
          <h1>Agent Console</h1>
          <p className="login-lede">
            Sign in to manage agents, monitor sales, and review fee performance
            across regions.
          </p>
          <div className="login-tags">
            <span>Verified team only</span>
            <span>Audit-ready logs</span>
            <span>Real-time updates</span>
          </div>
        </div>

        <div className="login-card">
          <h2>Welcome back</h2>
          <p className="login-subtitle">Use your admin credentials.</p>
          <form className="login-form" onSubmit={onSubmit}>
            <label className="login-label" htmlFor="email">
              Email
            </label>
            <input
              className="login-input"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@agency.com"
              value={form.email}
              onChange={(event) => updateForm({ email: event.target.value })}
              required
            />

            <label className="login-label" htmlFor="password">
              Password
            </label>
            <input
              className="login-input"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(event) => updateForm({ password: event.target.value })}
              required
            />

            <div className="login-row">
              <label className="login-checkbox">
                <input type="checkbox" name="remember" />
                Remember me
              </label>
              <span className="login-help">Need help? Contact ops.</span>
            </div>

            {error ? <p className="login-error">{error}</p> : null}

            <button className="login-button" type="submit" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
