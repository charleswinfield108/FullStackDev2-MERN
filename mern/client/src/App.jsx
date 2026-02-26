import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

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
