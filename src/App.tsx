import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import ProductPage from './components/ProductPage'; // Product page where users can view products
import AdminPage from './components/AdminPage';   // Admin page (for example, where products can be managed)
import './App.css';

function App() {
  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<ProductPage />} /> {/* Product page accessible to everyone */}
          <Route path="/login" element={<LoginPage />} /> {/* Login page */}
          {/* Guard the Admin route to ensure only logged-in users can access it */}
          <Route path="/admin" element={<AdminPage />} /> {/* Admin page, protected */}
        </Routes>
      </div>
    </>
  );
};

export default App;