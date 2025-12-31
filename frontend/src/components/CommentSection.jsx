import React, { useState } from 'react';

const CommentSection = ({ comments = [], onAddComment, currentUser }) => {
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Use simple alert navigation for now if not using router hook
    // In a real component we'd pass navigate or use wrapper
    const handleLoginRedirect = () => {
        window.location.href = '/login';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        // Auth check should be redundant if UI is disabled, but good for safety
        if (!currentUser) return;

        setIsSubmitting(true);
        // Simulate API delay
        setTimeout(() => {
            onAddComment(newComment);
            setNewComment('');
            setIsSubmitting(false);
        }, 500);
    };

    return (
        <div className="comment-section" style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Comments ({comments.length})</h4>

            <div className="comments-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                {comments.length === 0 && <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.9rem' }}>No comments yet. Be the first to advise!</p>}
                {comments.map((comment) => (
                    <div key={comment.id} className="comment" style={{
                        background: 'var(--bg-color)',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        fontSize: '0.95rem'
                    }}>
                        <p style={{ margin: 0, color: 'var(--text-color)' }}>{comment.text}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            <span>{comment.author || 'Anonymous'}</span>
                            <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="comment-form" style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={currentUser ? "Add your advice/comment..." : "Login to comment"}
                    disabled={!currentUser}
                    style={{
                        flex: 1,
                        padding: '0.5rem',
                        borderRadius: '4px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-color)',
                        color: 'var(--text-color)',
                        outline: 'none'
                    }}
                />
                {currentUser ? (
                    <button
                        type="submit"
                        disabled={!newComment.trim() || isSubmitting}
                        style={{
                            background: 'var(--primary-color)',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            cursor: (!newComment.trim() || isSubmitting) ? 'not-allowed' : 'pointer',
                            opacity: (!newComment.trim() || isSubmitting) ? 0.7 : 1,
                        }}
                    >
                        Post
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleLoginRedirect}
                        style={{
                            background: 'var(--secondary-color)',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Login
                    </button>
                )}
            </form>
        </div>
    );
};

export default CommentSection;
