import { NavLink } from 'react-router-dom';

export default function Unauthorized() {
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
          <p className="login-eyebrow">Access denied</p>
          <h1>Unauthorized</h1>
          <p className="login-lede">
            You must be a Rocket Elevators employee to access this application.
            Please sign in with a registered account.
          </p>
          <div className="login-tags">
            <span>Employees only</span>
            <span>Restricted access</span>
            <span>Identity required</span>
          </div>
        </div>

        <div className="login-card">
          <h2>Sign in required</h2>
          <p className="login-subtitle">
            Your account was not recognized or your session expired.
          </p>
          <NavLink className="login-button" to="/admin/login">
            Go to Login
          </NavLink>
        </div>
      </div>
    </section>
  );
}
