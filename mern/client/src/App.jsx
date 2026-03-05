import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-container">
        <Outlet />
      </main>
    </div>
  );
};
export default App;
