import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { confessionsAPI, mockData } from '../services/api'
import ConfessionItem from '../components/ConfessionItem'
import './Confessions.css'

const Confessions = () => {
  const [confessions, setConfessions] = useState([])
  const [newConfession, setNewConfession] = useState('')
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [useMockData, setUseMockData] = useState(false)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    fetchConfessions()
  }, [])

  const fetchConfessions = async () => {
    setLoading(true)
    setError(null)
    
    try {
      let data
      if (useMockData) {
        data = mockData.confessions
      } else {
        data = await confessionsAPI.getAll()
      }
      setConfessions(data)
    } catch (err) {
      console.error('Failed to fetch confessions:', err)
      setError('Failed to load confessions. Please try again.')
      
      setUseMockData(true)
      setConfessions(mockData.confessions)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!newConfession.trim()) {
      setError('Please write something before posting')
      return
    }
    
    if (!isAuthenticated) {
      setError('Please login to post a confession')
      return
    }
    
    setPosting(true)
    setError(null)
    setSuccess(null)
    
    try {
      if (useMockData) {
        const newPost = {
          id: confessions.length + 1,
          content: newConfession,
          likes: 0,
          createdAt: new Date().toISOString(),
          isAnonymous: true,
          userId: 1
        }
        setConfessions([newPost, ...confessions])
      } else {
        await confessionsAPI.create(newConfession)
        
        await fetchConfessions()
      }
      
      setNewConfession('')
      setSuccess('Confession posted successfully!')
      
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error('Failed to post confession:', err)
      setError('Failed to post confession. Please try again.')
    } finally {
      setPosting(false)
    }
  }

  const handleLike = async (confessionId, delta = 1) => {
    if (!isAuthenticated) {
      setError('Please login to like confessions')
      return
    }
    
    setConfessions(currentConfessions => 
      currentConfessions.map(confession => 
        confession.id === confessionId 
          ? { ...confession, likes: Math.max(0, (confession.likes || 0) + delta) }
          : confession
      )
    )
    
    try {
      if (!useMockData) {
        if (delta > 0) {
          await confessionsAPI.like(confessionId)
        } else {
          await confessionsAPI.unlike(confessionId)
        }
      }
    } catch (err) {
      console.error('Failed to update like:', err)
      
      setConfessions(currentConfessions => 
        currentConfessions.map(confession => 
          confession.id === confessionId 
            ? { ...confession, likes: (confession.likes || 0) - delta }
            : confession
        )
      )
    }
  }

  const handleShare = async (confession) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Anonymous Confession',
          text: confession.content,
          url: window.location.href,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(confession.content)
        .then(() => {
          setSuccess('Confession copied to clipboard!')
          setTimeout(() => setSuccess(null), 2000)
        })
        .catch(() => {
          setError('Failed to copy confession')
        })
    }
  }

  if (loading) {
    return (
      <div className="confessions-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading confessions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="confessions-page">
      <div className="confessions-container container">
        <div className="confessions-header animate-fade-in">
          <h1>Confessions</h1>
          <p className="page-subtitle">Share anonymously, connect genuinely</p>
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

        {/* Confession Form */}
        {isAuthenticated && (
          <div className="confession-form-container card animate-slide-in">
            <div className="form-header">
              <h3>Share Your Secret</h3>
              <div className="form-subtitle">
                <span className="privacy-badge">🔒 Anonymous</span>
                <span className="character-limit">Max 500 characters</span>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="confession-form">
              <div className="form-group">
                <textarea
                  value={newConfession}
                  onChange={(e) => setNewConfession(e.target.value)}
                  placeholder="What's on your mind? Share it anonymously..."
                  className="confession-textarea"
                  maxLength={500}
                  disabled={posting}
                  rows={4}
                />
                <div className="textarea-footer">
                  <div className="character-counter">
                    <span className={`char-count ${newConfession.length >= 450 ? 'warning' : ''}`}>
                      {newConfession.length}
                    </span>
                    <span>/ 500</span>
                  </div>
                  <div className="hint-text">
                    {newConfession.length === 0 && 'Type your confession here...'}
                    {newConfession.length > 0 && newConfession.length < 100 && 'Keep going...'}
                    {newConfession.length >= 100 && newConfession.length < 300 && 'Good length!'}
                    {newConfession.length >= 300 && 'Consider being concise'}
                  </div>
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setNewConfession('')}
                  disabled={posting || !newConfession.trim()}
                >
                  Clear
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                  disabled={posting || !newConfession.trim()}
                >
                  {posting ? (
                    <>
                      <span className="loading-spinner"></span>
                      Posting...
                    </>
                  ) : 'Post Confession'}
                </button>
              </div>
            </form>
            
            <div className="form-footer">
              <div className="privacy-note">
                <span className="note-icon">ℹ️</span>
                <span>Your confession is completely anonymous. No personal information is stored.</span>
              </div>
            </div>
          </div>
        )}

        {/* Confessions List */}
        <div className="confessions-list-container animate-fade-in">
          <div className="list-header">
            <h2>Recent Confessions</h2>
            <div className="list-stats">
              <span className="confessions-count">
                <span className="count-icon">📝</span>
                {confessions.length} {confessions.length === 1 ? 'confession' : 'confessions'}
              </span>
              {useMockData && (
                <span className="mock-data-badge">Demo Data</span>
              )}
            </div>
          </div>
          
          {confessions.length === 0 ? (
            <div className="empty-state card">
              <div className="empty-state-icon">🤫</div>
              <h3 className="empty-state-title">No Confessions Yet</h3>
              <p className="empty-state-description">
                {isAuthenticated 
                  ? 'Be the first to share your thoughts. Your secret is safe with us.'
                  : 'Login to see confessions and share your own.'
                }
              </p>
              {!isAuthenticated && (
                <a href="/login" className="btn btn-primary">
                  Login to Continue
                </a>
              )}
            </div>
          ) : (
            <div className="confessions-list">
              {confessions.map((confession) => (
                <ConfessionItem
                  key={confession.id}
                  confession={confession}
                  onLike={handleLike}
                  onShare={() => handleShare(confession)}
                  currentUser={isAuthenticated ? {} : null}
                />
              ))}
            </div>
          )}
          
          {confessions.length > 0 && (
            <div className="load-more-container">
              <button 
                className="btn btn-secondary"
                onClick={fetchConfessions}
                disabled={loading}
              >
                {loading ? 'Refreshing...' : 'Refresh Confessions'}
              </button>
              <div className="list-footer-note">
                <span className="footer-icon">💫</span>
                <span>New confessions appear at the top</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Confessions