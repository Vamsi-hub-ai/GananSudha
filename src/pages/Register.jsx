import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DataContext } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Lock, User } from 'lucide-react';
import '../App.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { registerCustomer, loginWithGoogle } = useContext(DataContext);
  const { t, isTelugu } = useLanguage();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    const result = await registerCustomer({ name, email, password });
    
    if (result.success) {
      navigate('/profile');
    } else {
      setError(result.message);
    }
  };

  const handleGoogleLogin = () => {
    loginWithGoogle();
  };

  return (
    <div className="section-padding" style={{ display: 'flex', justifyContent: 'center', minHeight: '60vh', alignItems: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '40px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img src="/assets/logo.jpeg" alt="Gnana Sudha" style={{ height: '80px', objectFit: 'contain', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '24px', margin: '0' }}>{t('auth.register_title') || (isTelugu ? 'ఖాతాను సృష్టించండి' : 'Create Account')}</h2>
        </div>
        
        {error && <div style={{ background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '4px', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label>{t('auth.full_name') || (isTelugu ? 'పూర్తి పేరు' : 'Full Name')}</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <User size={18} style={{ position: 'absolute', left: '12px', color: '#666' }} />
              <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required placeholder={isTelugu ? 'మీ పూర్తి పేరు నమోదు చేయండి' : 'Enter your full name'} style={{ paddingLeft: '40px' }} />
            </div>
          </div>
          <div className="form-group">
            <label>{t('auth.email') || (isTelugu ? 'ఈమెయిల్ చిరునామా' : 'Email Address')}</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', color: '#666' }} />
              <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required placeholder={isTelugu ? 'మీ ఈమెయిల్ నమోదు చేయండి' : 'Enter your email'} style={{ paddingLeft: '40px' }} />
            </div>
          </div>
          <div className="form-group">
            <label>{t('auth.password') || (isTelugu ? 'పాస్‌వర్డ్' : 'Password')}</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', color: '#666' }} />
              <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required placeholder={isTelugu ? 'పాస్‌వర్డ్ నమోదు చేయండి' : 'Enter password'} style={{ paddingLeft: '40px' }} />
            </div>
          </div>
          
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '8px' }}>
            {t('auth.create_account_btn') || (isTelugu ? 'ఖాతాను సృష్టించండి' : 'Sign Up')}
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', margin: '8px 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#eee' }}></div>
            <span style={{ padding: '0 16px', color: '#999', fontSize: '14px' }}>{isTelugu ? 'లేదా' : 'OR'}</span>
            <div style={{ flex: 1, height: '1px', background: '#eee' }}></div>
          </div>
          
          <button type="button" onClick={handleGoogleLogin} className="btn-outline-action" style={{ width: '100%', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: '1px solid #ddd', background: '#fff', color: '#333', cursor: 'pointer', fontWeight: '500' }}>
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '20px', height: '20px' }} />
            {isTelugu ? 'గూగుల్‌తో కొనసాగించండి' : 'Continue with Google'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: '16px', color: '#666' }}>
          {t('auth.have_account') || (isTelugu ? 'ఇప్పటికే ఖాతా ఉందా?' : 'Already have an account?')}{' '}
          <Link to="/login" style={{ color: '#E95221', fontWeight: 600 }}>
            {t('auth.login_link') || (isTelugu ? 'ఇక్కడ లాగిన్ అవ్వండి' : 'Log in')}
          </Link>
        </div>
      </div>
    </div>
  );
}
