import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const NavigationBar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">POS System</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/products">상품 관리</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/order">주문 처리</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/history">판매 내역</Link>
            </li>
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item">
              <button className="btn btn-outline-secondary" onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
