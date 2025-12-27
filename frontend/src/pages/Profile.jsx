import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import './Profile.css'

const Profile = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [userStats, setUserStats] = useState({
    confessionsCount: 0,
    adviceCount: 0,
    likesGiven: 0,
    joinedDate: new Date().toISOString()
  })

  useEffect(() => {
    if (user) {
      // In a real app, you would fetch user stats from the backend
      // For now, we'll use mock data
      setUserStats({
        confessionsCount: Math.floor(Math.random() * 10),
        adviceCount: Math.floor(Math.random() * 5),
        likesGiven: Math.floor(Math.random() * 50),
        joinedDate: user.createdAt || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      })
    }
  }, [user])

  if (!isAuthenticated) {
    return (
      <div className="profile-page">
        <div className="not-logged-in container">
          <div className="login-prompt card animate-fade-in">
            <div className="prompt-icon">🔒</div>
            <h2>Profile Locked</h2>
            <p className="prompt-description">
              Please log in to view and manage your profile.
            </p>
            <div className="prompt-actions">
              <a href="/login" className="btn btn-primary">
                Login
              </a>
              <a href="/register" className="btn btn-secondary">
                Sign Up
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calculateAccountAge = () => {
    const joined = new Date(userStats.joinedDate)
    const now = new Date()
    const diffTime = Math.abs(now - joined)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''}`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? 's' : ''}`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) !== 1 ? 's' : ''}`
    return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) !== 1 ? 's' : ''}`
  }

  const handleAccountDelete = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setLoading(true)
      // In a real app, you would call an API endpoint to delete the account
      setTimeout(() => {
        logout()
        setLoading(false)
      }, 1000)
    }
  }

  return (
    <div className="profile-page">
      <div className="profile-container container">
        {/* Profile Header */}
        <div className="profile-header card animate-fade-in">
          <div className="header-content">
            <div className="avatar-section">
              <div className="avatar">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="avatar-badge">
                <span className="badge-icon">👑</span>
                <span className="badge-text">Member</span>
              </div>
            </div>
            
            <div className="user-info">
              <h1 className="username">{user?.username}</h1>
              <p className="user-email">{user?.email}</p>
              <div className="user-meta">
                <span className="meta-item">
                  <span className="meta-icon">📅</span>
                  Joined {formatDate(userStats.joinedDate)}
                </span>
                <span className="meta-item">
                  <span className="meta-icon">⏳</span>
                  {calculateAccountAge()} on platform
                </span>
              </div>
            </div>
            
            <div className="header-actions">
              <button className="btn btn-secondary edit-profile-btn">
                <span className="btn-icon">✏️</span>
                Edit Profile
              </button>
              <button 
                className="btn btn-primary logout-btn"
                onClick={logout}
                disabled={loading}
              >
                <span className="btn-icon">🚪</span>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="stats-overview animate-slide-in">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-icon">🤫</div>
                <div className="stat-details">
                  <div className="stat-value">{userStats.confessionsCount}</div>
                  <div className="stat-label">Confessions</div>
                </div>
              </div>
              <div className="stat-progress">
                <div 
                  className="progress-bar"
                  style={{ width: `${Math.min(userStats.confessionsCount * 10, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-icon">💡</div>
                <div className="stat-details">
                  <div className="stat-value">{userStats.adviceCount}</div>
                  <div className="stat-label">Advice Shared</div>
                </div>
              </div>
              <div className="stat-progress">
                <div 
                  className="progress-bar"
                  style={{ width: `${Math.min(userStats.adviceCount * 20, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-icon">❤️</div>
                <div className="stat-details">
                  <div className="stat-value">{userStats.likesGiven}</div>
                  <div className="stat-label">Likes Given</div>
                </div>
              </div>
              <div className="stat-progress">
                <div 
                  className="progress-bar"
                  style={{ width: `${Math.min(userStats.likesGiven * 2, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-content">
                <div className="stat-icon">🌟</div>
                <div className="stat-details">
                  <div className="stat-value">
                    {userStats.confessionsCount + userStats.adviceCount}
                  </div>
                  <div className="stat-label">Total Contributions</div>
                </div>
              </div>
              <div className="stat-progress">
                <div 
                  className="progress-bar"
                  style={{ width: `${Math.min((userStats.confessionsCount + userStats.adviceCount) * 10, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="profile-tabs animate-slide-in">
          <div className="tabs-nav">
            <button 
              className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <span className="tab-icon">📊</span>
              Overview
            </button>
            <button 
              className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
              onClick={() => setActiveTab('activity')}
            >
              <span className="tab-icon">📝</span>
              Activity
            </button>
            <button 
              className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <span className="tab-icon">⚙️</span>
              Settings
            </button>
            <button 
              className={`tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
              onClick={() => setActiveTab('privacy')}
            >
              <span className="tab-icon">🔒</span>
              Privacy
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content animate-fade-in">
          {activeTab === 'overview' && (
            <div className="overview-content card">
              <h3>Activity Summary</h3>
              <div className="summary-stats">
                <div className="summary-item">
                  <span className="summary-label">Recent Activity</span>
                  <span className="summary-value">Today</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Most Active Time</span>
                  <span className="summary-value">Evening</span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Favorite Category</span>
                  <span className="summary-value">Confessions</span>
                </div>
              </div>
              
              <div className="achievements">
                <h4>Achievements</h4>
                <div className="achievement-list">
                  <div className="achievement-item unlocked">
                    <span className="achievement-icon">🏆</span>
                    <div className="achievement-details">
                      <div className="achievement-title">First Confession</div>
                      <div className="achievement-description">Shared your first anonymous confession</div>
                    </div>
                  </div>
                  <div className="achievement-item unlocked">
                    <span className="achievement-icon">💡</span>
                    <div className="achievement-details">
                      <div className="achievement-title">Wise Words</div>
                      <div className="achievement-description">Shared helpful advice with the community</div>
                    </div>
                  </div>
                  <div className="achievement-item locked">
                    <span className="achievement-icon">❤️</span>
                    <div className="achievement-details">
                      <div className="achievement-title">Community Supporter</div>
                      <div className="achievement-description">Give 100 likes to unlock</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="activity-content card">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">🤫</div>
                  <div className="activity-details">
                    <div className="activity-title">Shared a confession</div>
                    <div className="activity-time">2 hours ago</div>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">💡</div>
                  <div className="activity-details">
                    <div className="activity-title">Posted advice</div>
                    <div className="activity-time">1 day ago</div>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">❤️</div>
                  <div className="activity-details">
                    <div className="activity-title">Liked 3 confessions</div>
                    <div className="activity-time">2 days ago</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-content card">
              <h3>Account Settings</h3>
              
              <div className="settings-section">
                <h4>Profile Information</h4>
                <div className="settings-form">
                  <div className="form-group">
                    <label>Username</label>
                    <input 
                      type="text" 
                      className="form-control"
                      defaultValue={user?.username}
                      disabled
                    />
                    <div className="form-hint">Username cannot be changed</div>
                  </div>
                  
                  <div className="form-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      className="form-control"
                      defaultValue={user?.email}
                    />
                  </div>
                  
                  <button className="btn btn-primary">
                    Update Profile
                  </button>
                </div>
              </div>
              
              <div className="settings-section">
                <h4>Password</h4>
                <div className="settings-form">
                  <div className="form-group">
                    <label>Current Password</label>
                    <input type="password" className="form-control" />
                  </div>
                  
                  <div className="form-group">
                    <label>New Password</label>
                    <input type="password" className="form-control" />
                  </div>
                  
                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input type="password" className="form-control" />
                  </div>
                  
                  <button className="btn btn-primary">
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="privacy-content card">
              <h3>Privacy & Security</h3>
              
              <div className="privacy-section">
                <h4>Privacy Settings</h4>
                <div className="privacy-options">
                  <label className="privacy-option">
                    <input type="checkbox" defaultChecked />
                    <span>Show my activity to other users</span>
                  </label>
                  
                  <label className="privacy-option">
                    <input type="checkbox" defaultChecked />
                    <span>Allow notifications</span>
                  </label>
                  
                  <label className="privacy-option">
                    <input type="checkbox" />
                    <span>Make profile public</span>
                  </label>
                </div>
              </div>
              
              <div className="privacy-section">
                <h4>Data Management</h4>
                <div className="data-actions">
                  <button className="btn btn-secondary">
                    Export My Data
                  </button>
                  <button className="btn btn-secondary">
                    Clear Activity History
                  </button>
                </div>
              </div>
              
              <div className="danger-zone">
                <h4>Danger Zone</h4>
                <p className="danger-warning">
                  ⚠️ These actions are permanent and cannot be undone.
                </p>
                <div className="danger-actions">
                  <button 
                    className="btn btn-danger"
                    onClick={handleAccountDelete}
                    disabled={loading}
                  >
                    {loading ? 'Deleting...' : 'Delete My Account'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="profile-footer animate-fade-in">
          <div className="footer-content">
            <div className="help-section">
              <h4>Need Help?</h4>
              <div className="help-links">
                <a href="/faq" className="help-link">FAQ</a>
                <a href="/contact" className="help-link">Contact Support</a>
                <a href="/feedback" className="help-link">Send Feedback</a>
              </div>
            </div>
            
            <div className="community-section">
              <h4>Community</h4>
              <p>You're part of a community of {Math.floor(Math.random() * 1000) + 500} anonymous supporters.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile