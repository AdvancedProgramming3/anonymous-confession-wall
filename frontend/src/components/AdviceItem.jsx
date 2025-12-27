import { useState } from 'react'
import './AdviceItem.css'

const AdviceItem = ({ advice, onLike }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    })
  }

  const handleLike = async () => {
    if (isAnimating) return
    
    setIsAnimating(true)
    setIsLiked(!isLiked)
    
    try {
      await onLike(advice.id)
    } catch (error) {
      setIsLiked(false)
    } finally {
      setTimeout(() => setIsAnimating(false), 300)
    }
  }

  return (
    <div className="advice-item card animate-fade-in">
      <div className="advice-header">
        <div className="advice-icon">💡</div>
        <div className="advice-meta">
          <span className="advice-author">{advice.author}</span>
          <span className="advice-date">{formatDate(advice.createdAt)}</span>
        </div>
        <div className="advice-stats">
          <span className="advice-likes">
            <span className="likes-icon">❤️</span>
            {advice.likes + (isLiked ? 1 : 0)}
          </span>
        </div>
      </div>
      
      <div className="advice-content">
        <p className="advice-text">{advice.content}</p>
      </div>
      
      <div className="advice-actions">
        <button 
          className={`like-btn ${isLiked ? 'liked' : ''} ${isAnimating ? 'animating' : ''}`}
          onClick={handleLike}
          aria-label={isLiked ? 'Unlike this advice' : 'Like this advice'}
          disabled={isAnimating}
        >
          <span className="like-icon">❤️</span>
          {isLiked ? 'Liked' : 'Like'}
        </button>
        <button className="save-btn" aria-label="Save this advice">
          <span className="save-icon">⭐</span>
          Save
        </button>
      </div>
    </div>
  )
}

export default AdviceItem