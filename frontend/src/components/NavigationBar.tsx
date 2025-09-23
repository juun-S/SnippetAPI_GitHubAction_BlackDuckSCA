import React from 'react';
import { Link } from 'react-router-dom';

const NavigationBar: React.FC = () => {
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
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar;
