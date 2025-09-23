import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './components/NavigationBar';
import ProductManagement from './components/ProductManagement';
import OrderProcessing from './components/OrderProcessing';
import SalesHistory from './components/SalesHistory';
import './App.css';

function App() {
  return (
    <Router>
      <NavigationBar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<ProductManagement />} />
          <Route path="/products" element={<ProductManagement />} />
          <Route path="/order" element={<OrderProcessing />} />
          <Route path="/history" element={<SalesHistory />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
