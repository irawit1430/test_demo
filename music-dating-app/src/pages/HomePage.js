import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom'; // Import Link for call to action
// App.css is imported in App.js and provides global styling

const HomePage = () => {
  const { currentUser } = useAuth();

  // Logout button is in App.js navbar, so no need for handleLogout here.

  return (
    <div className="page-container" style={{ textAlign: 'center' }}>
      <h1>Welcome to MusicVerse!</h1>

      {currentUser ? (
        <div>
          <p style={{ fontSize: '1.2em', marginBottom: '20px' }}>
            Hello, {currentUser.displayName || currentUser.email}!
          </p>
          <p>Ready to share your taste or discover new music?</p>
          <div style={{ marginTop: '30px' }}>
            <Link to="/share-playlist" className="btn" style={{ marginRight: '10px' }}>Share a Playlist</Link>
            <Link to="/playlists" className="btn">Browse Playlists</Link>
          </div>
        </div>
      ) : (
        <div>
          <p style={{ fontSize: '1.1em', marginBottom: '25px' }}>
            Connect with others through the universal language of music. <br />
            Share your favorite playlists, discover new tunes, and find your next music soulmate.
          </p>
          <p style={{ marginBottom: '30px' }}>
            Please <Link to="/login">log in</Link> or <Link to="/signup">sign up</Link> to join the community.
          </p>
          <Link to="/playlists" className="btn">Browse Playlists as Guest</Link>
        </div>
      )}
    </div>
  );
};

export default HomePage;
