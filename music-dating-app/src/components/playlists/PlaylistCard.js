import React from 'react';
import { Link } from 'react-router-dom';
// App.css should be imported in App.js or index.js, so classes are globally available

// Generic Music Icon (can stay as a simple component or be an SVG/img)
const MusicIcon = () => (
  <div className="playlist-card-icon">
    ♪
  </div>
);

const PlaylistCard = ({ playlist }) => {
  if (!playlist) {
    return null;
  }

  const { id, title, userDisplayName, youtubePlaylistId } = playlist;

  // The hover effect is now handled by CSS in App.css (.playlist-card:hover)
  // No need for isHovered state or inline hover styles.

  return (
    <Link to={`/playlist/${id}`} className="playlist-card">
      <div> {/* Content part */}
        <MusicIcon />
        <h3 className="playlist-card-title">{title || 'Untitled Playlist'}</h3>
      </div>
      <div> {/* Footer part */}
        <p className="playlist-card-user">Shared by: {userDisplayName || 'Anonymous User'}</p>
        {youtubePlaylistId && (
          <p className="playlist-card-id"><small>ID: {youtubePlaylistId}</small></p>
        )}
      </div>
    </Link>
  );
};

export default PlaylistCard;
