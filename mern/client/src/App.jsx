import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { ToastContainer } from './components/ToastContainer';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-container">
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  );
};
export default App;
