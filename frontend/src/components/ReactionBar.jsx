import React, { useState } from 'react';

const REACTION_TYPES = [
    { id: 'heart', emoji: '❤️', label: 'Love', color: 'var(--heart-color)' }
];

const ReactionBar = ({ reactions = {}, onReact }) => {
    // Local state to track user's selection (simulated for now)
    const [selectedReaction, setSelectedReaction] = useState(null);

    const handleReaction = (typeId) => {
        // If clicking same reaction, remove it (toggle off)
        if (selectedReaction === typeId) {
            setSelectedReaction(null);
            onReact(typeId, -1); // Decrement
        } else {
            // If switching reaction
            if (selectedReaction) {
                onReact(selectedReaction, -1); // Decrement old
            }
            setSelectedReaction(typeId);
            onReact(typeId, 1); // Increment new
        }
    };

    return (
        <div className="reaction-bar" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {REACTION_TYPES.map((type) => {
                const count = reactions[type.id] || 0;
                const isSelected = selectedReaction === type.id;

                return (
                    <button
                        key={type.id}
                        onClick={() => handleReaction(type.id)}
                        className={`reaction-btn ${isSelected ? 'selected' : ''}`}
                        aria-label={`React with ${type.label}`}
                        style={{
                            background: isSelected ? 'rgba(0,0,0,0.05)' : 'transparent',
                            border: isSelected ? `1px solid ${type.color}` : '1px solid transparent',
                            borderRadius: '20px',
                            padding: '4px 8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.2s ease',
                            color: 'var(--text-color)' // Ensure text is visible in dark mode
                        }}
                    >
                        <span style={{ fontSize: '1.2rem' }}>{type.emoji}</span>
                        <span style={{
                            fontSize: '0.9rem',
                            fontWeight: isSelected ? 'bold' : 'normal',
                            color: isSelected ? type.color : 'inherit'
                        }}>
                            {count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default ReactionBar;
