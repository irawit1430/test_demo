import React, { useState } from 'react';
import { db } from '../../services/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
// App.css is imported in App.js and provides global form styling via .form-container etc.

const PlaylistForm = () => {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { currentUser } = useAuth();

  const extractPlaylistId = (url) => {
    const regex = /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/playlist\?list=([a-zA-Z0-9_-]+)(?:&.*)?$/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!currentUser) {
      setError("You must be logged in to share a playlist."); // Should be caught by page protection mostly
      return;
    }

    if (!playlistUrl) {
      setError('Playlist URL is required.');
      return;
    }

    const playlistId = extractPlaylistId(playlistUrl);

    if (!playlistId) {
      setError('Invalid YouTube Playlist URL. Please make sure it is a valid playlist link (e.g., https://www.youtube.com/playlist?list=...).');
      return;
    }

    try {
      const playlistObject = {
        youtubePlaylistId: playlistId,
        title: title.trim() || `Shared Playlist by ${currentUser.displayName || currentUser.email || 'User'}`,
        description: description.trim(),
        submittedBy: currentUser.uid,
        userDisplayName: currentUser.displayName || currentUser.email,
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, "playlists"), playlistObject);
      setSuccessMessage(`Playlist shared successfully!`);
      setPlaylistUrl('');
      setTitle('');
      setDescription('');
    } catch (e) {
      console.error("Error adding document: ", e);
      setError("Failed to submit playlist. Please try again. Error: " + e.message);
    }
  };

  return (
    // Using form-container for consistent form styling
    <div className="form-container"> 
      <form onSubmit={handleSubmit}>
        <h2>Share a YouTube Playlist</h2> {/* Default h2 styling from App.css */}
        {error && <p className="form-error">{error}</p>}
        {successMessage && <p className="form-success">{successMessage}</p>}
        
        <div>
          <label htmlFor="playlistUrl">YouTube Playlist URL:</label>
          <input
            type="url"
            id="playlistUrl"
            value={playlistUrl}
            onChange={(e) => setPlaylistUrl(e.target.value)}
            required
            placeholder="https://www.youtube.com/playlist?list=YOUR_PLAYLIST_ID"
          />
        </div>
        
        <div>
          <label htmlFor="title">Playlist Title (Optional):</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My Awesome Mix"
          />
        </div>
        
        <div>
          <label htmlFor="description">Description (Optional):</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A short description of your playlist..."
            rows="4" // Increased rows slightly
          />
        </div>
        
        {/* Using btn class for consistent button styling */}
        <button type="submit" className="btn">Share Playlist</button> 
      </form>
    </div>
  );
};

export default PlaylistForm;
