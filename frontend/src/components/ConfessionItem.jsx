import { useState } from 'react'
import './ConfessionItem.css'

const ConfessionItem = ({ confession, onLike }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: diffDays > 365 ? 'numeric' : undefined
    })
  }

  const handleLike = async () => {
    if (isAnimating) return
    
    setIsAnimating(true)
    setIsLiked(!isLiked)
    
    try {
      await onLike(confession.id)
    } catch (error) {
      setIsLiked(false)
    } finally {
      setTimeout(() => setIsAnimating(false), 300)
    }
  }

  return (
    <div className="confession-item card animate-fade-in">
      <div className="confession-header">
        <div className="confession-meta">
          <span className="confession-icon">🤫</span>
          <div className="confession-info">
            <span className="confession-author">Anonymous</span>
            <span className="confession-time">{formatDate(confession.createdAt)}</span>
          </div>
        </div>
        <div className="confession-stats">
          <span className="likes-count">
            <span className="likes-icon">❤️</span>
            {confession.likes + (isLiked ? 1 : 0)}
          </span>
        </div>
      </div>
      
      <div className="confession-content">
        <p className="confession-text">{confession.content}</p>
      </div>
      
      <div className="confession-actions">
        <button 
          className={`like-btn ${isLiked ? 'liked' : ''} ${isAnimating ? 'animating' : ''}`}
          onClick={handleLike}
          aria-label={isLiked ? 'Unlike this confession' : 'Like this confession'}
          disabled={isAnimating}
        >
          <span className="like-btn-icon">❤️</span>
          <span className="like-btn-text">{isLiked ? 'Liked' : 'Like'}</span>
        </button>
        <button className="share-btn" aria-label="Share this confession">
          <span className="share-icon">📤</span>
          <span className="share-text">Share</span>
        </button>
      </div>
    </div>
  )
}

export default ConfessionItem