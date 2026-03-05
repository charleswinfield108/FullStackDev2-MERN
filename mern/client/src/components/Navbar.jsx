import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout(); // Call auth context logout function
    navigate('/admin/login');
  }

  return (
    <nav className="navbar">
      <NavLink className="nav-brand" to="/admin/home">
        <img
          alt="Rocket logo"
          className="nav-logo"
          src="/assets/rocketLogo.png"
        />
      </NavLink>

      <div className="nav-actions">
        {user ? (
          <>
            <span style={{ marginRight: '1rem', color: '#666', fontWeight: '500' }}>
              Welcome, {user.first_name}
            </span>
            <button className="btn btn-outline" type="button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <NavLink className="btn btn-outline" to="/admin/login">
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
}
