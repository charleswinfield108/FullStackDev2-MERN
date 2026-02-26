import { NavLink, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('authToken');

  function handleLogout() {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    navigate('/admin/login');
  }

  return (
    <nav className="navbar">
      <NavLink className="nav-brand" to="/admin">
        <img
          alt="Rocket logo"
          className="nav-logo"
          src={`${import.meta.env.BASE_URL}assets/rocketLogo.png`}
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
        <NavLink className="btn btn-primary" to="/admin/create">
          Create Agent
        </NavLink>
      </div>
    </nav>
  );
}
