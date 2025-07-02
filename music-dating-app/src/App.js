import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import SharePlaylistPage from './pages/SharePlaylistPage';
import AllPlaylistsPage from './pages/AllPlaylistsPage';
import SinglePlaylistPage from './pages/SinglePlaylistPage';
import { useAuth } from './contexts/AuthContext';
import { auth } from './services/firebase';
import './App.css'; // Import App.css

// Inline styles for hover effects will be removed or handled by CSS if possible
// For simplicity, we'll remove the JS-based hover for nav links and rely on CSS :hover in App.css

function App() {
  const { currentUser, loading } = useAuth();
  // const [hoveredLink, setHoveredLink] = React.useState(null); // Removed for CSS hover

  const handleLogout = async () => {
    try {
      await auth.signOut();
      // User is signed out
      // You might want to redirect to login page or update UI further
      console.log("User logged out");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Router>
      <div>
        <nav className="navbar"> {/* Use className for App.css */}
          <Link to="/" className="navbar-brand">MusicVerse</Link>
          <div className="navbar-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/playlists" className="nav-link">Browse Playlists</Link>

            {!currentUser && (
              <>
                <Link to="/signup" className="nav-link">Sign Up</Link>
                <Link to="/login" className="nav-link">Login</Link>
              </>
            )}
            {currentUser && (
              <>
                <Link to="/share-playlist" className="nav-link">Share Playlist</Link>
                <button
                  onClick={handleLogout}
                  className="btn logout-btn" // Use btn and logout-btn classes
                >Logout</button>
              </>
            )}
          </div>
        </nav>

        {loading ? (
          <div className="loading-container"> {/* Use className */}
            <p>Loading MusicVerse...</p>
          </div>
        ) : (
          <div className="main-content-area" style={{paddingTop: '20px'}}> {/* Keep padding or manage via CSS */}
            <Routes>
              <Route
                path="/signup"
                element={!currentUser ? <SignUpPage /> : <Navigate to="/" />}
              />
              <Route
                path="/login"
                element={!currentUser ? <LoginPage /> : <Navigate to="/" />}
              />
              <Route
                path="/share-playlist"
                element={currentUser ? <SharePlaylistPage /> : <Navigate to="/login" />}
              />
              <Route path="/playlists" element={<AllPlaylistsPage />} />
              <Route path="/playlist/:playlistId" element={<SinglePlaylistPage />} />
              <Route
                path="/"
                element={<HomePage />}
              />
            </Routes>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
