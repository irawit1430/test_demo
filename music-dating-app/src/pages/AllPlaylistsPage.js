import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import PlaylistCard from '../components/playlists/PlaylistCard';
// App.css is imported in App.js

const AllPlaylistsPage = () => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlaylists = async () => {
      setLoading(true);
      setError('');
      try {
        const playlistsCollectionRef = collection(db, "playlists");
        const q = query(playlistsCollectionRef, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);

        const playlistsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPlaylists(playlistsData);

      } catch (err) {
        console.error("Error fetching playlists:", err);
        setError("Failed to load playlists. Please try again later.");
      }
      setLoading(false);
    };

    fetchPlaylists();
  }, []);

  if (loading) {
    // Using loading-container class from App.css
    return <div className="loading-container"><p>Loading playlists...</p></div>;
  }

  if (error) {
    // Basic error styling
    return <div className="page-container"><p style={{ color: 'red', textAlign: 'center' }}>{error}</p></div>;
  }

  if (playlists.length === 0) {
    return <div className="page-container"><p style={{ textAlign: 'center' }}>No playlists have been shared yet. Be the first!</p></div>;
  }

  return (
    // Using page-container for consistent padding and max-width
    <div className="page-container">
      <h1>Browse All Playlists</h1> {/* Default h1 styling from App.css */}
      {/* Using playlists-grid-container for flex/grid layout from App.css */}
      <div className="playlists-grid-container">
        {playlists.map(playlist => (
          <PlaylistCard key={playlist.id} playlist={playlist} />
        ))}
      </div>
    </div>
  );
};

export default AllPlaylistsPage;
