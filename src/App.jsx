import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminDashboard from './pages/AdminDashboard';
import Layout from './components/Layout';
import Poojas from './pages/Poojas';
import Pandit from './pages/Pandit';
import Contact from './pages/Contact';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Register from './pages/Register';
import RegisterPandit from './pages/RegisterPandit';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CustomerProfile from './pages/CustomerProfile';
import ProductDetail from './pages/ProductDetail';
import { DataProvider } from './context/DataContext';
import './App.css';

function App() {
  return (
    <DataProvider>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/poojas" element={<Layout><Poojas /></Layout>} />
        <Route path="/pandit" element={<Layout><Pandit /></Layout>} />
        <Route path="/shop" element={<Layout><Shop /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/register" element={<Layout><Register /></Layout>} />
        <Route path="/register-pandit" element={<Layout><RegisterPandit /></Layout>} />
        <Route path="/cart" element={<Layout><Cart /></Layout>} />
        <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
        <Route path="/profile" element={<Layout><CustomerProfile /></Layout>} />
        <Route path="/admin/*" element={<AdminDashboard />} />
      </Routes>
    </DataProvider>
  );
}

export default App;
