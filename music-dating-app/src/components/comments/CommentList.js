import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
// App.css is imported in App.js and provides global styling

const CommentList = ({ playlistId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!playlistId) {
      setLoading(false);
      setError("No playlist ID provided to fetch comments.");
      return;
    }

    setLoading(true);
    setError('');

    const commentsQuery = query(
      collection(db, "comments"),
      where("playlistId", "==", playlistId),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(commentsQuery, (querySnapshot) => {
      const commentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(commentsData);
      setLoading(false);
    }, (err) => {
      console.error("Error listening to comments:", err);
      setError("Failed to load comments. Please try refreshing.");
      setLoading(false);
    });

    return () => unsubscribe();

  }, [playlistId]);

  if (loading) {
    // Can use a generic loading text or a spinner component if available
    return <p style={{textAlign: 'center', margin: '20px 0'}}>Loading comments...</p>;
  }

  if (error) {
    return <p className="form-error" style={{textAlign: 'center', margin: '20px 0'}}>{error}</p>;
  }

  if (comments.length === 0) {
    return <p style={{textAlign: 'center', margin: '20px 0'}}>No comments yet. Be the first to comment!</p>;
  }

  return (
    // No specific wrapper class needed unless more styling is desired for the list itself
    // The .comment class from App.css will style individual comments
    <div>
      {/* The "Comments" title is now h3 in SinglePlaylistPage with class comments-title */}
      {comments.map(comment => (
        <div key={comment.id} className="comment">
          <p>
            <strong className="comment-user">{comment.userName || 'Anonymous'}</strong>
            <small className="comment-date"> ({comment.createdAt?.toDate().toLocaleString()})</small>
          </p>
          <p className="comment-text">{comment.text}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
