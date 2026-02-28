// Login Component - Handles admin user authentication
// This component provides a login form for Rocket Elevators agents to access the admin console
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Login() {
  // State management
  const [form, setForm] = useState({ email: '', password: '' }); // Form input values
  const [error, setError] = useState(''); // Error message display
  const [isLoading, setIsLoading] = useState(false); // Loading state during authentication
  
  // Router hooks
  const navigate = useNavigate(); // Navigate to different routes
  const location = useLocation(); // Get current location and previous page info
  const redirectTo = location.state?.from?.pathname || '/admin'; // Redirect to previous page or dashboard

  // Updates form fields when user types
  function updateForm(value) {
    setForm((prev) => ({ ...prev, ...value }));
  }

  // Handles form submission - authenticates user with backend
  async function onSubmit(event) {
    event.preventDefault();
    setError(''); // Clear previous errors
    setIsLoading(true); // Show loading state

    try {
      // Send login credentials to backend
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      // Handle authentication failure
      if (!response.ok) {
        navigate('/admin/unauthorized', { replace: true });
        return;
      }

      // Handle successful authentication
      const data = await response.json();
      localStorage.removeItem('authToken'); // Clear any old tokens
      sessionStorage.setItem('authToken', data.token); // Store new token for this session
      navigate(redirectTo, { replace: true }); // Redirect to dashboard or previous page
    } catch (err) {
      setError(err.message || 'Login failed'); // Display error to user
    } finally {
      setIsLoading(false); // Clear loading state
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
