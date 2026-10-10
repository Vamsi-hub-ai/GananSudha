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

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      padding: '40px 20px',
      background: 'url("/assets/hero_bg.png") center/cover no-repeat fixed, linear-gradient(135deg, #FFFBF7 0%, #EFE4DC 100%)',
      position: 'relative'
    }}>
      <style>{`
        .login-split-container {
          display: flex;
          width: 100%;
          max-width: 900px;
          background: #FFFFFF;
          border-radius: 24px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          position: relative;
          min-height: 600px;
        }
        .login-left-panel {
          width: 45%;
          position: relative;
          background: url('/assets/login_bg.jpg') center/cover no-repeat;
          border-top-right-radius: 60px;
          border-bottom-right-radius: 0px;
          padding: 40px;
          display: flex;
          flex-direction: column;
          border-right: 4px solid rgba(255, 255, 255, 0.4);
        }
        .login-left-panel::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(180deg, rgba(255, 251, 247, 0.85) 0%, rgba(255, 251, 247, 0.4) 40%, transparent 100%);
          border-top-left-radius: 24px;
          pointer-events: none;
        }
        .left-content {
          position: relative;
          z-index: 10;
        }
        .welcome-text-large {
          font-family: 'Cinzel', serif;
          font-size: 42px;
          font-weight: 700;
          color: #2B1D14;
          line-height: 1.1;
          margin: 0;
        }
        .back-text-large {
          font-family: 'Cinzel', serif;
          font-size: 42px;
          font-weight: 700;
          color: #C53018;
          line-height: 1.1;
          margin: 0;
        }
        .lotus-divider {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 20px 0;
        }
        .lotus-divider.left-aligned {
          justify-content: flex-start;
          width: 140px;
        }
        .lotus-line {
          flex: 1;
          height: 1px;
          background: #D4AF37;
        }
        .lotus-icon {
          margin: 0 10px;
          color: #D4AF37;
        }
        .left-subtitle {
          color: #5E4C44;
          font-size: 14px;
          line-height: 1.6;
          margin-top: 10px;
          font-weight: 500;
        }
        
        .login-right-panel {
          width: 55%;
          padding: 50px 60px;
          display: flex;
          flex-direction: column;
          background: #FFFFFF;
        }
        @media (max-width: 800px) {
          .login-split-container {
            flex-direction: column;
          }
          .login-left-panel {
            width: 100%;
            border-top-right-radius: 24px;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            min-height: 250px;
          }
          .login-right-panel {
            width: 100%;
            padding: 30px;
          }
        }
        
        .input-group {
          margin-bottom: 20px;
          position: relative;
        }
        .input-group label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #2B1D14;
          margin-bottom: 8px;
        }
        .styled-input {
          width: 100%;
          padding: 12px 14px 12px 42px;
          border: 1px solid #EFE4DC;
          border-radius: 8px;
          font-size: 14px;
          color: #2B1D14;
          transition: all 0.2s;
        }
        .styled-input:focus {
          outline: none;
          border-color: #D4AF37;
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
        }
        .styled-input::placeholder {
          color: #9B8B84;
        }
        .input-icon {
          position: absolute;
          left: 14px;
          top: 36px;
          color: #5E4C44;
        }
        .eye-icon {
          position: absolute;
          right: 14px;
          top: 36px;
          color: #5E4C44;
          cursor: pointer;
        }
        
        .login-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(90deg, #b82b15 0%, #d83d22 100%);
          color: white;
          border: none;
          border-radius: 24px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 12px rgba(197, 48, 24, 0.3);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(197, 48, 24, 0.4);
        }
        
        .or-divider {
          display: flex;
          align-items: center;
          margin: 24px 0;
        }
        .or-divider::before, .or-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #EFE4DC;
        }
        .or-text {
          padding: 0 16px;
          color: #9B8B84;
          font-size: 12px;
          font-weight: 500;
        }
        
        .google-btn {
          width: 100%;
          padding: 12px;
          background: #FFFFFF;
          border: 1px solid #EFE4DC;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #5E4C44;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          transition: background 0.2s;
        }
        .google-btn:hover {
          background: #FFFBF7;
        }
        
        .signup-box {
          background: #FFFBF7;
          border-radius: 8px;
          padding: 16px;
          text-align: center;
          margin-top: 24px;
          font-size: 13px;
          color: #5E4C44;
        }
        .signup-link {
          color: #C53018;
          font-weight: 600;
          text-decoration: none;
        }
        .signup-link:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="login-split-container">
        {/* Left Panel */}
        <div className="login-left-panel">
          <div className="left-content">
            <h1 className="welcome-text-large">Welcome</h1>
            <h1 className="back-text-large">Back</h1>
            
            <div className="lotus-divider left-aligned">
              <div className="lotus-line"></div>
              <svg className="lotus-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 3C12 3 14 7 14 10C14 13 12 16 12 16C12 16 10 13 10 10C10 7 12 3 12 3Z"/>
                <path d="M12 16C12 16 16 15 19 12C22 9 20 6 20 6C20 6 17 8 14 10C12 11.5 12 16 12 16Z"/>
                <path d="M12 16C12 16 8 15 5 12C2 9 4 6 4 6C4 6 7 8 10 10C12 11.5 12 16 12 16Z"/>
                <path d="M12 16C12 16 16 18 20 18C23 18 22 21 22 21C22 21 19 20 15 19C13 18.5 12 16 12 16Z"/>
                <path d="M12 16C12 16 8 18 4 18C1 18 2 21 2 21C2 21 5 20 9 19C11 18.5 12 16 12 16Z"/>
              </svg>
              <div className="lotus-line"></div>
            </div>
            
            <p className="left-subtitle">
              Continue your spiritual journey<br/>
              with Gnana Sudha.<br/>
              Access your bookings,<br/>
              consultations and more.
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="login-right-panel">
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <img src="/assets/logo.jpeg" alt="Gnana Sudha" style={{ height: '70px', objectFit: 'contain', borderRadius: '50%', marginBottom: '16px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
            <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '26px', color: '#2B1D14', margin: '0 0 8px 0', fontWeight: '700' }}>Welcome Back</h2>
            
            <div className="lotus-divider" style={{ width: '120px', margin: '0 auto 12px auto' }}>
              <div className="lotus-line"></div>
              <svg className="lotus-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 3C12 3 14 7 14 10C14 13 12 16 12 16C12 16 10 13 10 10C10 7 12 3 12 3Z"/>
                <path d="M12 16C12 16 16 15 19 12C22 9 20 6 20 6C20 6 17 8 14 10C12 11.5 12 16 12 16Z"/>
                <path d="M12 16C12 16 8 15 5 12C2 9 4 6 4 6C4 6 7 8 10 10C12 11.5 12 16 12 16Z"/>
                <path d="M12 16C12 16 16 18 20 18C23 18 22 21 22 21C22 21 19 20 15 19C13 18.5 12 16 12 16Z"/>
                <path d="M12 16C12 16 8 18 4 18C1 18 2 21 2 21C2 21 5 20 9 19C11 18.5 12 16 12 16Z"/>
              </svg>
              <div className="lotus-line"></div>
            </div>
            
            <p style={{ color: '#9B8B84', fontSize: '14px', margin: 0 }}>Log in to access your account</p>
          </div>
          
          {error && (
            <div style={{ color: '#c62828', background: '#ffebee', padding: '10px', borderRadius: '6px', fontSize: '13px', textAlign: 'center', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="input-group">
              <label>Email or Username</label>
              <Mail size={18} className="input-icon" />
              <input 
                type="text" 
                className="styled-input" 
                value={loginId} 
                onChange={e => setLoginId(e.target.value)} 
                placeholder="Enter your email or username" 
                required 
              />
            </div>
            
            <div className="input-group" style={{ marginBottom: '8px' }}>
              <label>Password</label>
              <Lock size={18} className="input-icon" />
              <input 
                type={showPassword ? "text" : "password"} 
                className="styled-input" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="Enter your password"
                required 
              />
              <svg onClick={togglePasswordVisibility} className="eye-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {showPassword ? (
                  <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </>
                ) : (
                  <>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </>
                )}
              </svg>
            </div>
            
            <div style={{ textAlign: 'right', marginBottom: '20px' }}>
              <Link to="/forgot-password" style={{ color: '#C53018', fontSize: '12px', fontWeight: '600', textDecoration: 'none' }}>Forgot Password?</Link>
            </div>
            
            <button type="submit" className="login-btn">
              Log In
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
            
            <div className="or-divider">
              <span className="or-text">OR</span>
            </div>
            
            <button type="button" onClick={handleGoogleLogin} className="google-btn">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" style={{ width: '20px', height: '20px' }} />
              Continue with Google
            </button>
          </form>
          
          <div className="signup-box">
            Don't have an account? <Link to="/register" className="signup-link">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
