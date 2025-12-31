import React, { useState, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ThemeProvider, ThemeContext, useTheme } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import ThemeToggle from './components/ThemeToggle';
import ConfessionItem from './components/ConfessionItem';
import './App.css';

// Initial Mock Data
const INITIAL_CONFESSIONS = [
  {
    id: 1,
    content: "I finally told my family about my career change after months of hesitation.",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    author: "Anonymous #4821",
    reactions: { heart: 5, thumb: 2 },
    comments: [
      { id: 1, text: "Proud of you! That takes courage.", author: "Anonymous #9312", createdAt: new Date().toISOString() }
    ]
  },
  {
    id: 2,
    content: "I've been pretending to be happy at work, but I'm actually struggling with burnout.",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    author: "Anonymous #1539",
    reactions: { cry: 8, heart: 3 },
    comments: []
  }
];

// Page Components
function ConfessPage() {
  const [confessions, setConfessions] = useState(INITIAL_CONFESSIONS);
  const [newConfession, setNewConfession] = useState('');
  const { user } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newConfession.trim()) return;

    if (!user) {
      alert("Please login to post a confession!");
      navigate('/login');
      return;
    }

    const confession = {
      id: Date.now(),
      content: newConfession,
      createdAt: new Date().toISOString(),
      author: user.anonymousId,
      reactions: {},
      comments: []
    };

    setConfessions([confession, ...confessions]);
    setNewConfession('');
  };

  const handleReact = (id, reactionId, delta) => {
    setConfessions(prev => prev.map(confession => {
      if (confession.id === id) {
        const currentCount = confession.reactions[reactionId] || 0;
        return {
          ...confession,
          reactions: {
            ...confession.reactions,
            [reactionId]: Math.max(0, currentCount + delta)
          }
        };
      }
      return confession;
    }));
  };

  const handleComment = (id, text) => {
    setConfessions(prev => prev.map(confession => {
      if (confession.id === id) {
        return {
          ...confession,
          comments: [
            ...confession.comments,
            {
              id: Date.now(),
              text,
              author: user ? user.anonymousId : 'Anonymous',
              createdAt: new Date().toISOString()
            }
          ]
        };
      }
      return confession;
    }));
  };

  return (
    <div className="confess-page fade-in">
      {/* Intro Section */}
      <section className="intro-section" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2>Share Your Secrets, Anonymously</h2>
        <p>A safe space to unburden your mind completely anonymously.</p>
      </section>

      <div className="confess-container">
        {/* Post Form */}
        <div className="card form-card">
          <form onSubmit={handleSubmit} className="confess-form">
            <textarea
              className="confess-textarea"
              placeholder={user ? "What's on your mind? (Your identity is hidden)" : "Please login to share your secret..."}
              value={newConfession}
              onChange={(e) => setNewConfession(e.target.value)}
              disabled={!user}
            />
            <div className="form-footer">
              <span className="anonymous-note">
                <span style={{ fontSize: '1.2rem', marginRight: '0.5rem' }}>🔒</span>
                {user ? `Posting as ${user.anonymousId}` : 'Login required to post'}
              </span>
              <button
                type="submit"
                className="submit-btn"
                disabled={!newConfession.trim() || !user}
                style={{ opacity: user ? 1 : 0.6 }}
              >
                Confess
              </button>
            </div>
            {!user && (
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Login</Link> or <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Register</Link> to participate.
              </div>
            )}
          </form>
        </div>

        {/* Confession Feed */}
        <div className="recent-confessions">
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>Recent Confessions</h3>
          {confessions.map(confession => (
            <ConfessionItem
              key={confession.id}
              confession={confession}
              onReact={handleReact}
              onComment={handleComment}
              currentUser={user}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="page auth-page">
      <h2>Login</h2>
      <form className="auth-form" onSubmit={handleLogin}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    try {
      await register(username, email, password);
      navigate('/');
    } catch (error) {
      alert(error.message);
    }
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="reg-password">Password</label>
          <input
            type="password"
            id="reg-password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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

function AppContent() {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  // ... rest of function


  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-mode' : '';
  }, [theme]);

  // Handle logout via context
  const handleLogout = () => {
    logout();
    window.location.href = '/'; // Force clear/redirect
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 className="logo">Confess & Advise</h1>
              <p className="tagline">Share anonymously. Support each other.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <ThemeToggle />
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{user.anonymousId}</span>
                  <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textDecoration: 'underline' }}>Logout</button>
                </div>
              ) : (
                <div className="auth-nav">
                  <Link to="/login" style={{ color: 'inherit', marginRight: '0.5rem' }}>Login</Link>
                </div>
              )}
            </div>
          </div>

          <nav className="navigation">
            <ul className="nav-menu">
              <li className="nav-item">
                <Link to="/" className="nav-link">Confessions</Link>
              </li>
              {!user && (
                <>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/register" className="nav-link">Register</Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<ConfessPage />} />
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

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
