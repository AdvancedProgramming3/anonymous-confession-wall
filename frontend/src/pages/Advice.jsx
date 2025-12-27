import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { adviceAPI, mockData } from '../services/api'
import AdviceItem from '../components/AdviceItem'
import './Advice.css'

const Advice = () => {
  const [adviceList, setAdviceList] = useState([])
  const [newAdvice, setNewAdvice] = useState('')
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [useMockData, setUseMockData] = useState(false)
  const [filter, setFilter] = useState('all')
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    fetchAdvice()
  }, [])

  const fetchAdvice = async () => {
    setLoading(true)
    setError(null)
    
    try {
      let data
      if (useMockData) {
        // Use mock data for development
        data = mockData.advice
      } else {
        // Use real API
        data = await adviceAPI.getAll()
      }
      setAdviceList(data)
    } catch (err) {
      console.error('Failed to fetch advice:', err)
      setError('Failed to load advice. Please try again.')
      
      // Fallback to mock data
      setUseMockData(true)
      setAdviceList(mockData.advice)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!newAdvice.trim()) {
      setError('Please write some advice before posting')
      return
    }
    
    if (!isAuthenticated) {
      setError('Please login to share advice')
      return
    }
    
    setPosting(true)
    setError(null)
    setSuccess(null)
    
    try {
      let newAdviceItem
      if (useMockData) {
        // Mock advice creation
        newAdviceItem = {
          id: adviceList.length + 1,
          content: newAdvice,
          likes: 0,
          createdAt: new Date().toISOString(),
          author: 'Anonymous'
        }
      } else {
        // Real API call
        newAdviceItem = await adviceAPI.create(newAdvice)
      }
      
      setAdviceList([newAdviceItem, ...adviceList])
      setNewAdvice('')
      setSuccess('Advice shared successfully!')
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error('Failed to share advice:', err)
      setError('Failed to share advice. Please try again.')
    } finally {
      setPosting(false)
    }
  }

  const handleLike = async (adviceId) => {
    if (!isAuthenticated) {
      setError('Please login to like advice')
      return
    }
    
    try {
      if (useMockData) {
        // Mock like functionality
        setAdviceList(adviceList.map(advice => 
          advice.id === adviceId 
            ? { ...advice, likes: advice.likes + 1 }
            : advice
        ))
      } else {
        // Real API call
        await adviceAPI.like(adviceId)
        fetchAdvice() // Refresh to get updated likes
      }
    } catch (err) {
      console.error('Failed to like advice:', err)
      setError('Failed to like advice. Please try again.')
    }
  }

  const handleSave = async (advice) => {
    if (!isAuthenticated) {
      setError('Please login to save advice')
      return
    }
    
    // In a real app, this would call an API endpoint
    try {
      // For now, just show success message
      setSuccess('Advice saved to your collection!')
      setTimeout(() => setSuccess(null), 2000)
    } catch (err) {
      setError('Failed to save advice')
    }
  }

  const getFilteredAdvice = () => {
    if (filter === 'popular') {
      return [...adviceList].sort((a, b) => b.likes - a.likes)
    }
    return adviceList
  }

  if (loading) {
    return (
      <div className="advice-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading wisdom...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="advice-page">
      <div className="advice-container container">
        <div className="advice-header animate-fade-in">
          <h1>Words of Wisdom</h1>
          <p className="page-subtitle">Share and receive advice from the community</p>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="alert error-alert animate-slide-in">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
            <button 
              className="alert-close"
              onClick={() => setError(null)}
              aria-label="Close error message"
            >
              ×
            </button>
          </div>
        )}
        
        {success && (
          <div className="alert success-alert animate-slide-in">
            <span className="alert-icon">✅</span>
            <span>{success}</span>
          </div>
        )}

        {/* Advice Stats */}
        <div className="advice-stats card animate-slide-in">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{adviceList.length}</div>
              <div className="stat-label">Total Advice</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">
                {adviceList.reduce((sum, advice) => sum + advice.likes, 0)}
              </div>
              <div className="stat-label">Total Likes</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">
                {Math.round(adviceList.reduce((sum, advice) => sum + advice.likes, 0) / Math.max(adviceList.length, 1))}
              </div>
              <div className="stat-label">Avg. Likes</div>
            </div>
          </div>
          {useMockData && (
            <div className="mock-notice">
              <span className="notice-icon">💡</span>
              <span>Showing demo data. Connect to backend for real data.</span>
            </div>
          )}
        </div>

        {/* Advice Form */}
        {isAuthenticated && (
          <div className="advice-form-container card animate-slide-in">
            <div className="form-header">
              <h3>Share Your Wisdom</h3>
              <div className="form-subtitle">
                <span className="inspiration-badge">💭 Inspire Others</span>
                <span className="character-limit">Max 300 characters</span>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="advice-form">
              <div className="form-group">
                <textarea
                  value={newAdvice}
                  onChange={(e) => setNewAdvice(e.target.value)}
                  placeholder="What wisdom would you like to share with the community?"
                  className="advice-textarea"
                  maxLength={300}
                  disabled={posting}
                  rows={3}
                />
                <div className="textarea-footer">
                  <div className="character-counter">
                    <span className={`char-count ${newAdvice.length >= 250 ? 'warning' : ''}`}>
                      {newAdvice.length}
                    </span>
                    <span>/ 300</span>
                  </div>
                  <div className="hint-text">
                    Keep it short, meaningful, and uplifting
                  </div>
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setNewAdvice('')}
                  disabled={posting || !newAdvice.trim()}
                >
                  Clear
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                  disabled={posting || !newAdvice.trim()}
                >
                  {posting ? (
                    <>
                      <span className="loading-spinner"></span>
                      Sharing...
                    </>
                  ) : 'Share Advice'}
                </button>
              </div>
            </form>
            
            <div className="form-footer">
              <div className="inspiration-note">
                <span className="note-icon">🌟</span>
                <span>Your advice could make someone's day better. Share positivity!</span>
              </div>
            </div>
          </div>
        )}

        {/* Filter Controls */}
        <div className="filter-controls animate-fade-in">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Advice
            </button>
            <button 
              className={`filter-btn ${filter === 'popular' ? 'active' : ''}`}
              onClick={() => setFilter('popular')}
            >
              Most Popular
            </button>
            <button 
              className="refresh-btn"
              onClick={fetchAdvice}
              disabled={loading}
            >
              {loading ? 'Refreshing...' : '🔄 Refresh'}
            </button>
          </div>
        </div>

        {/* Advice List */}
        <div className="advice-list-container animate-fade-in">
          {getFilteredAdvice().length === 0 ? (
            <div className="empty-state card">
              <div className="empty-state-icon">💭</div>
              <h3 className="empty-state-title">No Advice Yet</h3>
              <p className="empty-state-description">
                {isAuthenticated 
                  ? 'Be the first to share some wisdom with the community.'
                  : 'Login to see advice and share your own wisdom.'
                }
              </p>
              {!isAuthenticated && (
                <a href="/login" className="btn btn-primary">
                  Login to Continue
                </a>
              )}
            </div>
          ) : (
            <div className="advice-grid">
              {getFilteredAdvice().map((advice, index) => (
                <AdviceItem
                  key={advice.id}
                  advice={advice}
                  onLike={() => handleLike(advice.id)}
                  onSave={() => handleSave(advice)}
                  animationDelay={index * 0.1}
                />
              ))}
            </div>
          )}
          
          {getFilteredAdvice().length > 0 && (
            <div className="list-footer">
              <div className="footer-note">
                <span className="footer-icon">📚</span>
                <span>New wisdom is added daily. Come back tomorrow for more!</span>
              </div>
              <div className="share-invitation">
                <p>Have more wisdom to share? Your words could inspire someone today!</p>
                {!isAuthenticated && (
                  <a href="/login" className="btn btn-secondary">
                    Login to Share
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Advice