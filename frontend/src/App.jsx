import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';

// Page Components
function ConfessPage() {
  return (
    <div className="page">
      <h2>Confess Your Thoughts</h2>
      <div className="confess-container">
        <form className="confess-form">
          <textarea 
            placeholder="What's on your mind? Share your thoughts anonymously..."
            rows="6"
            className="confess-textarea"
          />
          <div className="form-footer">
            <span className="anonymous-note">Posting as Anonymous</span>
            <button type="submit" className="submit-btn">Submit Confession</button>
          </div>
        </form>
        
        <div className="recent-confessions">
          <h3>Recent Confessions</h3>
          <div className="confession-card">
            <p>"I finally told my family about my career change after months of hesitation."</p>
            <span className="confession-time">2 hours ago</span>
          </div>
          <div className="confession-card">
            <p>"I've been pretending to be happy at work, but I'm actually struggling with burnout."</p>
            <span className="confession-time">5 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdvicePage() {
  return (
    <div className="page">
      <h2>Advice Corner</h2>
      <div className="advice-container">
        <div className="give-advice">
          <h3>Give Advice</h3>
          <textarea 
            placeholder="Share your wisdom with others..."
            rows="4"
            className="advice-textarea"
          />
          <button className="advice-btn">Post Advice</button>
        </div>
        
        <div className="advice-feed">
          <h3>Recent Advice</h3>
          <div className="advice-card">
            <p>"Remember that it's okay to not have everything figured out. Progress, not perfection."</p>
            <span className="advice-author">- WiseOwl</span>
          </div>
          <div className="advice-card">
            <p>"Take small steps every day. Consistency beats intensity in the long run."</p>
            <span className="advice-author">- JourneyMan</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginPage() {
  const handleLogin = (e) => {
    e.preventDefault();
    // Handle login logic here
    alert('Login functionality would go here');
  };

  return (
    <div className="page auth-page">
      <h2>Login</h2>
      <form className="auth-form" onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Username or Email</label>
          <input 
            type="text" 
            id="username" 
            placeholder="Enter your username or email"
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            placeholder="Enter your password"
            required 
          />
        </div>
        <button type="submit" className="auth-btn">Login</button>
        <p className="auth-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </div>
  );
}

function RegisterPage() {
  const handleRegister = (e) => {
    e.preventDefault();
    // Handle registration logic here
    alert('Registration functionality would go here');
  };

  return (
    <div className="page auth-page">
      <h2>Register</h2>
      <form className="auth-form" onSubmit={handleRegister}>
        <div className="form-group">
          <label htmlFor="reg-username">Username</label>
          <input 
            type="text" 
            id="reg-username" 
            placeholder="Choose a username"
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            placeholder="Enter your email"
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="reg-password">Password</label>
          <input 
            type="password" 
            id="reg-password" 
            placeholder="Create a password"
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input 
            type="password" 
            id="confirm-password" 
            placeholder="Confirm your password"
            required 
          />
        </div>
        <button type="submit" className="auth-btn">Create Account</button>
        <p className="auth-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
}

// Main App Component
function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">Confess & Advise</h1>
          <p className="tagline">Share anonymously. Support each other.</p>
          
          <nav className="navigation">
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/" className="nav-link">Confessions</Link>
              </li>
              <li className="nav-item">
                <Link to="/advice" className="nav-link">Advice</Link>
              </li>
              <li className="nav-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">Register</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<ConfessPage />} />
          <Route path="/advice" element={<AdvicePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>© 2024 Confess & Advise. All rights reserved.</p>
          <p className="disclaimer">All confessions are anonymous. Be kind and respectful to others.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;