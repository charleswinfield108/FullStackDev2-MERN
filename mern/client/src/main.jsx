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

const StaticLandingRedirect = () => {
  React.useEffect(() => {
    window.location.replace('/index.html');
  }, []);

  return null;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <StaticLandingRedirect />,
  },
  {
    path: '/admin',
    element: (
      <RequireAuth>
        <App />
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: <RecordList />,
      },
      {
        path: 'create',
        element: <Record />,
      },
      {
        path: 'edit/:id',
        element: <Record />,
      },
    ],
  },
  {
    path: '/admin/login',
    element: <Login />,
  },
  {
    path: '/admin/unauthorized',
    element: <Unauthorized />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
