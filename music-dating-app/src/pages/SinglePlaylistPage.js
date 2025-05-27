import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import CommentForm from '../components/comments/CommentForm';
import CommentList from '../components/comments/CommentList';
// App.css is imported in App.js

const SinglePlaylistPage = () => {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchPlaylist = async () => {
      setLoading(true);
      setError('');
      try {
        const playlistDocRef = doc(db, "playlists", playlistId);
        const docSnap = await getDoc(playlistDocRef);

        if (docSnap.exists()) {
          setPlaylist({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Playlist not found.");
        }
      } catch (err) {
        console.error("Error fetching playlist:", err);
        setError("Failed to load playlist. Please try again later.");
      }
      setLoading(false);
    };

    if (playlistId) {
      fetchPlaylist();
    }
  }, [playlistId]);

  if (loading) {
    return <div className="loading-container"><p>Loading playlist details...</p></div>;
  }

  if (error) {
    return <div className="page-container"><p className="form-error" style={{textAlign: 'center'}}>{error}</p></div>;
  }

  if (!playlist) {
    // This case might be redundant if error is always set, but good as a fallback
    return <div className="page-container"><p style={{textAlign: 'center'}}>Playlist not found.</p></div>;
  }

  const embedUrl = `https://www.youtube.com/embed/videoseries?list=${playlist.youtubePlaylistId}`;

  return (
    // Using page-container for consistent padding and max-width
    <div className="page-container single-playlist-page"> 
      {/* single-playlist-title class is in App.css for h1 styling */}
      <h1 className="single-playlist-title">{playlist.title || 'Untitled Playlist'}</h1> 
      <p className="single-playlist-meta">
        Shared by: {playlist.userDisplayName || 'Anonymous User'}
        {playlist.createdAt && <span> on {playlist.createdAt.toDate().toLocaleDateString()}</span>}
      </p>
      
      {playlist.description && (
        <p className="single-playlist-description">{playlist.description}</p>
      )}

      {playlist.youtubePlaylistId ? (
        <div className="youtube-player-container">
          <iframe
            className="youtube-player-iframe"
            src={embedUrl}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <p style={{ textAlign: 'center', margin: '20px 0' }}>YouTube Playlist ID not found for this entry.</p>
      )}

      <div className="comments-section">
        {/* comments-title class is in App.css for h3 styling */}
        <h3 className="comments-title">Community Discussion</h3> 
        <CommentList playlistId={playlistId} />
        {currentUser ? (
          <CommentForm playlistId={playlistId} />
        ) : (
          <p style={{ textAlign: 'center', marginTop: '20px' }}>
            Please <Link to="/login">log in</Link> to leave a comment.
          </p>
        )}
      </div>
    </div>
  );
};

export default SinglePlaylistPage;
