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
    <div>
      <nav className="flex justify-between items-center mb-6">
        <NavLink to="/admin">
          <img
            alt="Rocket logo"
            className="h-10 inline"
            src={`${import.meta.env.BASE_URL}assets/rocketLogo.png`}
          />
        </NavLink>

        <div className="flex items-center gap-3">
          {token ? (
            <button
              className="inline-flex items-center justify-center whitespace-nowrap text-md 
            font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 
            focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border 
            border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
              type="button"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <NavLink
              className="inline-flex items-center justify-center whitespace-nowrap text-md 
            font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 
            focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border 
            border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
              to="/admin/login"
            >
              Login
            </NavLink>
          )}
          <NavLink
            className="inline-flex items-center justify-center whitespace-nowrap text-md 
          font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 
          focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border 
          border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
            to="/admin/create"
          >
            Create Agent
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
