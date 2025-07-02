import React from 'react';
import PlaylistForm from '../components/playlists/PlaylistForm';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom'; // For redirecting if not logged in
// App.css is imported in App.js and provides global styling

const SharePlaylistPage = () => {
  const { currentUser } = useAuth();

  // Route protection is primarily in App.js.
  // This is a secondary check; if a non-logged-in user somehow reaches this,
  // they'll be redirected. This also handles the case where currentUser might still be loading.
  if (!currentUser) {
    // This message might briefly show if currentUser is null during initial load,
    // before App.js redirects based on loading state.
    // A more robust solution might involve checking auth loading state here too.
    // For now, relying on App.js's loading check and route protection is the primary guard.
    // If still not logged in (e.g. direct navigation attempt), redirect.
    return <Navigate to="/login" replace />;
  }

  return (
    // Using page-container for consistent padding and max-width
    <div className="page-container">
      {/* Form title is handled within PlaylistForm using h2 and .form-container styling */}
      {/* We can add a general page title here if desired, styled by h1 from App.css */}
      <h1>Share Your YouTube Playlist</h1>
      <p style={{textAlign: 'center', marginBottom: '20px'}}>
        Found an awesome playlist? Share it with the MusicVerse community!
      </p>
      <PlaylistForm />
    </div>
  );
};

export default SharePlaylistPage;
