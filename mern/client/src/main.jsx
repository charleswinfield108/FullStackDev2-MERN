// Main Application Entry Point
// Sets up React Router with all application routes and their protection rules
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Login from './components/Login';
import RequireAuth from './components/RequireAuth';
import Unauthorized from './components/Unauthorized';
import Record from './components/Record';
import RecordList from './components/RecordList';
import './index.css';

// Redirect component that sends users from root to static landing page
const StaticLandingRedirect = () => {
  React.useEffect(() => {
    window.location.replace('/index.html'); // Redirect to static homepage
  }, []);

  return null;
};

// Configure all application routes
const router = createBrowserRouter([
  {
    // Root path redirects to static landing page
    path: '/',
    element: <StaticLandingRedirect />,
  },
  {
    // Protected admin dashboard - requires authentication
    path: '/admin',
    element: (
      <RequireAuth>
        <App />
      </RequireAuth>
    ),
    // Child routes accessible from admin dashboard
    children: [
      {
        index: true, // Shows RecordList at /admin
        element: <RecordList />,
      },
      {
        path: 'create', // Create new agent at /admin/create
        element: <Record />,
      },
      {
        path: 'edit/:id', // Edit agent at /admin/edit/:id
        element: <Record />,
      },
    ],
  },
  {
    // Public login page
    path: '/admin/login',
    element: <Login />,
  },
  {
    // Error page for unauthorized access
    path: '/admin/unauthorized',
    element: <Unauthorized />,
  },
]);

// Render React app to DOM
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
