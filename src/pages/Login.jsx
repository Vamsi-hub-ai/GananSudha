import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import { Mail, Lock, User } from 'lucide-react';
import '../App.css';

export default function Login() {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { unifiedLogin, loginWithGoogle } = useContext(DataContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await unifiedLogin(loginId, password);
    
    if (result) {
      if (result.type === 'admin') {
        navigate('/admin');
      } else if (result.type === 'customer') {
        navigate('/profile');
      } else if (result.type === 'pandit') {
        navigate('/');
      }
    } else {
      setError('Invalid ID or password. Please try again.');
    }
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  return (
    <div className="section-padding" style={{ display: 'flex', justifyContent: 'center', minHeight: '60vh', alignItems: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '40px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src="/assets/logo.jpeg" alt="Gnana Sudha" style={{ height: '80px', objectFit: 'contain', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '24px', margin: '0' }}>Welcome Back</h2>
          <p style={{ color: '#666', margin: '8px 0 0 0', fontSize: '14px' }}>Log in to access your account</p>
        </div>
        
        {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '4px', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label>Login ID</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', color: '#666' }} />
              <input type="text" className="form-control" value={loginId} onChange={e => setLoginId(e.target.value)} placeholder="Email or Username" required style={{ paddingLeft: '40px' }} />
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', color: '#666' }} />
              <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required style={{ paddingLeft: '40px' }} />
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px' }}>Log In</button>
          
          <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#eee' }}></div>
            <span style={{ padding: '0 16px', color: '#999', fontSize: '14px' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: '#eee' }}></div>
          </div>
          
          <button type="button" onClick={handleGoogleLogin} className="btn-outline-action" style={{ width: '100%', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: '1px solid #ddd', background: '#fff', color: '#333', cursor: 'pointer', fontWeight: '500' }}>
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '20px', height: '20px' }} />
            Continue with Google
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '16px', color: '#666' }}>
          Don't have an account? <Link to="/register" style={{ color: '#E95221' }}>Sign up</Link>
        </div>
      </div>
    </div>
  );
}
