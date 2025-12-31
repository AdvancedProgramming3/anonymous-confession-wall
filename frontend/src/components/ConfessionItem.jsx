import { useState } from 'react'
import ReactionBar from './ReactionBar';
import CommentSection from './CommentSection';
import './ConfessionItem.css'

const ConfessionItem = ({ confession, onReact, onComment, currentUser }) => {
  const [showComments, setShowComments] = useState(false);

  const formatDate = (dateString) => {
    // Handle both ISO strings and "2 hours ago" type strings for legacy/hardcoded data
    if (!dateString) return '';
    if (dateString.includes('ago')) return dateString;

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Fallback

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

  // Handle adding a comment locally to cascade up
  const handleAddComment = (text) => {
    onComment(confession.id, text);
  };

  // Handle reaction locally to cascade up
  const handleReact = (reactionId, delta) => {
    onReact(confession.id, reactionId, delta);
  };

  return (
    <div className="confession-item card animate-fade-in" style={{
      marginBottom: '1.5rem',
      background: 'var(--card-bg)',
      borderRadius: 'var(--border-radius)',
      padding: '1.5rem',
      boxShadow: 'var(--shadow)',
      borderLeft: '4px solid var(--primary-color)'
    }}>
      <div className="confession-header">
        <div className="confession-meta">
          <span className="confession-icon">🤫</span>
          <div className="confession-info">
            <span className="confession-author" style={{ fontWeight: 'bold' }}>
              {confession.author || 'Anonymous'}
            </span>
            <span className="confession-time">{formatDate(confession.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="confession-content" style={{ margin: '1rem 0' }}>
        <p className="confession-text" style={{ fontSize: '1.1rem', color: 'var(--text-color)' }}>
          {confession.content}
        </p>
      </div>

      <div className="confession-actions" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        borderTop: '1px solid var(--border-color)',
        paddingTop: '1rem'
      }}>
        <ReactionBar
          reactions={confession.reactions}
          onReact={handleReact}
        />

        <button
          className="comment-toggle-btn"
          onClick={() => setShowComments(!showComments)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--primary-color)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}
        >
          <span>💬</span>
          {showComments ? 'Hide Comments' : `Comments(${(confession.comments || []).length})`}
        </button>
      </div>

      {showComments && (
        <CommentSection
          comments={confession.comments}
          onAddComment={handleAddComment}
          currentUser={currentUser}
        />
      )}
    </div>
  )
}

export default ConfessionItem
