import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import axios from 'axios';
import NavigationBar from './components/NavigationBar';
import ProductManagement from './components/ProductManagement';
import OrderProcessing from './components/OrderProcessing';
import SalesHistory from './components/SalesHistory';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Layout for protected routes
const AppLayout = () => (
  <>
    <NavigationBar />
    <div className="container mt-4">
      <Outlet />
    </div>
  </>
);

function App() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<ProductManagement />} />
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/order" element={<OrderProcessing />} />
            <Route path="/history" element={<SalesHistory />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
