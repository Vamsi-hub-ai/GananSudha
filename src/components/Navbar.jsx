import React, { useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingCart, ChevronDown, User, LogOut } from 'lucide-react';
import { DataContext } from '../context/DataContext';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, currentCustomer, currentPandit, logout } = useContext(DataContext);

  return (
    <div className="navbar-wrapper">
      <div className="container-box">
        <nav className="navbar">
        <Link to="/" className="nav-brand">
          <img src="/assets/logo.jpeg" alt="Gnana Sudha" style={{ height: '80px', objectFit: 'contain' }} />
        </Link>
        
        <div className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          <div className="nav-dropdown">
            <span className="nav-link" style={{ cursor: 'pointer' }}>Services <ChevronDown size={14} /></span>
            <div className="dropdown-menu">
              <Link to="/poojas">Pooja's</Link>
              <Link to="/pandit">Pandit</Link>
            </div>
          </div>
          <Link to="/shop" className={`nav-link ${location.pathname === '/shop' ? 'active' : ''}`}>Shop</Link>
          <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
        </div>

        <div className="nav-actions">
          <button className="icon-btn" onClick={() => navigate('/cart')}>
            <ShoppingCart size={18} />
            {cart.length > 0 && <span className="icon-badge">{cart.length}</span>}
          </button>
          
          {currentCustomer || currentPandit ? (
            <div className="nav-dropdown">
              <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <User size={16} /> 
                {currentCustomer ? currentCustomer.name : currentPandit.name} <ChevronDown size={14} />
              </button>
              <div className="dropdown-menu" style={{ right: 0, left: 'auto', minWidth: '150px' }}>
                {currentCustomer && <Link to="/profile">My Profile</Link>}
                <Link to="/admin">Admin Setup</Link>
                <span onClick={(e) => { logout(); navigate('/'); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d32f2f', padding: '10px 16px', cursor: 'pointer' }}>
                  <LogOut size={14} /> Logout
                </span>
              </div>
            </div>
          ) : (
            <button className="btn-primary" onClick={() => navigate('/login')}>Login</button>
          )}
        </div>
        </nav>
      </div>
    </div>
  );
}
