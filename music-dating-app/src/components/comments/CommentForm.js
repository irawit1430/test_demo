import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { db } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
// App.css is imported in App.js and provides global form styling via .form-container etc.

const CommentForm = ({ playlistId }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { currentUser } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!currentUser) {
      setError('You must be logged in to comment.'); // This should ideally not be shown due to the check below
      return;
    }

    if (!text.trim()) {
      setError('Comment cannot be empty.');
      return;
    }

    setSubmitting(true);

    try {
      const commentObject = {
        text: text.trim(),
        playlistId: playlistId,
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email,
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, "comments"), commentObject);
      setText('');
      // console.log('Comment submitted successfully!');
    } catch (err) {
      console.error("Error submitting comment:", err);
      setError('Failed to submit comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!currentUser) {
    // This part is now handled in SinglePlaylistPage.js,
    // but as a fallback or if used elsewhere:
    return (
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        Please <Link to="/login">log in</Link> to leave a comment.
      </p>
    );
  }

  return (
    // Using form-container for consistent form styling, but applying a variant for comments
    // Or we can use a more specific class if App.css defines one, e.g., .comment-form-container
    <div className="form-container" style={{maxWidth: 'none', margin: '20px 0', padding: '15px'}}>
      <form onSubmit={handleSubmit}>
        {/* <h4>Leave a Comment</h4>  Styling for h4 is in App.css */}
        {error && <p className="form-error">{error}</p>}
        <div>
          {/* No label needed if placeholder is clear enough, or add <label htmlFor="comment-text">Your Comment:</label> */}
          <textarea
            id="comment-text" // Added id for potential label
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your comment..."
            rows="3"
            required
          />
        </div>
        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Comment'}
        </button>
      </form>
    </div>
  );
};

export default CommentForm;
