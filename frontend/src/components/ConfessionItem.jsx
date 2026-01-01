import { useState } from 'react'
import ReactionBar from './ReactionBar';
import CommentSection from './CommentSection';
import './ConfessionItem.css'

const ConfessionItem = ({ confession, onLike, onShare, currentUser }) => {
  const [showComments, setShowComments] = useState(false);

  // Data bridge for ReactionBar
  const reactionData = {
    heart: confession.likes || 0
  };

  // Logic bridge for ReactionBar
  const handleReactBridge = (reactionId, delta) => {
    onLike(confession.id, delta);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Just now';

    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

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
        <div className="confession-meta" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="confession-icon" style={{ fontSize: '1.5rem' }}>🤫</span>
          <div className="confession-info">
            <span className="confession-author" style={{ fontWeight: 'bold', display: 'block' }}>
              {confession.userId ? `Anonymous #${confession.userId}` : 'Anonymous'}
            </span>
            <span className="confession-time" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {formatDate(confession.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <div className="confession-content" style={{ margin: '1rem 0' }}>
        <p className="confession-text" style={{ fontSize: '1.1rem', color: 'var(--text-color)', lineHeight: '1.6' }}>
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
          reactions={reactionData}
          onReact={handleReactBridge}
        />

        <div style={{ display: 'flex', gap: '1rem' }}>
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
            {/* We remove the count for now because the list API doesn't include it yet */}
            {showComments ? 'Hide Advice' : 'Give Advice'}
          </button>
          
          <button 
             onClick={onShare}
             style={{
               background: 'transparent',
               border: 'none',
               color: 'var(--text-secondary)',
               cursor: 'pointer'
             }}
             title="Share"
          >
            🔗
          </button>
        </div>
      </div>

      {showComments && (
        <CommentSection
          // FIX: Pass the ID so CommentSection can GET the data
          confessionId={confession.id}
          currentUser={currentUser}
        />
      )}
    </div>
  )
}

export default ConfessionItem