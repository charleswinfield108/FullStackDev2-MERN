import { NavLink, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = sessionStorage.getItem('authToken');

  function handleLogout() {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
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
        {token ? (
          <button className="btn btn-outline" type="button" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <NavLink className="btn btn-outline" to="/admin/login">
            Login
          </NavLink>
        )}
        {location.pathname !== '/admin/home' && location.pathname !== '/admin/transaction' && location.pathname !== '/admin/report' && (
          <NavLink className="btn btn-primary" to="/admin/create">
            Create Agent
          </NavLink>
        )}
      </div>
    </nav>
  );
}
