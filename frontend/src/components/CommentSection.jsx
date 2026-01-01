import React, { useState, useEffect } from 'react';
import { adviceAPI } from '../services/api';

const CommentSection = ({ confessionId, currentUser }) => {
    // State is now managed inside this component
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // This hook runs when the component is shown, triggering the API call
    useEffect(() => {
        loadComments();
    }, [confessionId]); // Re-run if the confession ID ever changes

    const loadComments = async () => {
        try {
            setIsLoading(true);
            const data = await adviceAPI.getByConfessionId(confessionId);
            setComments(data);
        } catch (error) {
            console.error("Failed to load comments:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginRedirect = () => {
        window.location.href = '/login';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !currentUser) return;

        setIsSubmitting(true);
        try {
            await adviceAPI.create(newComment, confessionId);
            await loadComments(); // Refresh list to show the new comment
            setNewComment('');
        } catch (error) {
            console.error("Failed to post comment:", error);
            alert("Failed to post comment. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="comment-section" style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                Advice & Comments ({comments.length})
            </h4>

            {isLoading ? (
                <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-secondary)' }}>Loading...</div>
            ) : (
                <div className="comments-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                    {comments.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.9rem' }}>
                            No advice yet. Be the first to help!
                        </p>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.id} className="comment" style={{
                                background: 'var(--bg-input)',
                                padding: '0.75rem', borderRadius: '8px',
                                border: '1px solid var(--border-color)'
                            }}>
                                <p style={{ margin: 0, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                                    {comment.content}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                    <span>{comment.userId ? `Anonymous #${comment.userId}` : 'Anonymous'}</span>
                                    <span>{formatDate(comment.createdAt)}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            <form onSubmit={handleSubmit} className="comment-form" style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={currentUser ? "Add your advice/comment..." : "Login to comment"}
                    disabled={!currentUser || isSubmitting}
                    style={{
                        flex: 1, padding: '0.75rem', borderRadius: '8px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-input)', color: 'var(--text-color)'
                    }}
                />
                <button
                    type="submit"
                    disabled={!newComment.trim() || isSubmitting}
                    style={{
                        background: 'var(--primary-color)', color: 'var(--primary-text)',
                        border: 'none', padding: '0.5rem 1rem', borderRadius: '8px',
                        cursor: 'pointer', opacity: (!newComment.trim() || isSubmitting) ? 0.7 : 1
                    }}
                >
                    {isSubmitting ? '...' : 'Post'}
                </button>
            </form>
        </div>
    );
};

export default CommentSection;