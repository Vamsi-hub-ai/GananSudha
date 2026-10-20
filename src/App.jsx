import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import Videos from './pages/Videos';
import DevotionalWelcomePopup from './components/DevotionalWelcomePopup';
import PageSEO from './components/PageSEO';
import { DataProvider, DataContext } from './context/DataContext';
import { LanguageProvider } from './context/LanguageContext';
import './App.css';

function AdminRoute({ children }) {
  const { currentAdmin, currentCustomer } = useContext(DataContext);
  if (!currentAdmin || currentCustomer) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <LanguageProvider>
      <DataProvider>
        <PageSEO />
        <DevotionalWelcomePopup />
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
        <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
        <Route path="/videos" element={<Layout><Videos /></Layout>} />
        <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      </Routes>
      </DataProvider>
    </LanguageProvider>
  );
}

export default App;
