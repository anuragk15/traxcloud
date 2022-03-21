import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { PlaybackButton } from '../AudioPlayer';
import TrackArtwork from '../TrackArtwork';
import Overlay from '../Overlay';
import './PlayableTile.css';

const TileSignature = ({ trackId, title, displayName, userId }) => {
  return (
    <>
      <Link className="tile-title" to={`/tracks/${trackId}`}>
        {title}
      </Link>
      <Link className="tile-artist" to={`/users/${userId}`}>
        {displayName}
      </Link>
    </>
  );
};

const PlayableTile = ({
  className,
  trackId,
  playbackClass = '',
  playbackSize = 'medium',
}) => {
  const { isPlaying, currentTrackId } = useSelector((state) => state.player);
  const track = useSelector((state) => state.tracks[trackId]);
  const [showOverlay, setShowOverlay] = useState(false);

  const isSelected = isPlaying && currentTrackId === trackId;

  // if player is active, overlay should be visible
  useEffect(() => {
    if (isSelected) setShowOverlay(true);
    else setShowOverlay(false);
  }, [isSelected]);

  const onMouseEnter = () => setShowOverlay(true);
  const onMouseLeave = () => {
    if (!isSelected) {
      setShowOverlay(false);
    }
  };

  return (
    <div className={`playable-tile ${className}`}>
      <div
        className={`${className} playable-tile-art`}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {showOverlay && (
          <Overlay className="artwork-overlay absolute">
            <PlaybackButton
              trackId={trackId}
              className={`${playbackClass} responsive`}
            />
          </Overlay>
        )}
        <TrackArtwork trackId={trackId} />
      </div>
      <div className="tile-signature">
        <TileSignature
          trackId={trackId}
          userId={track?.userId}
          title={track?.title}
          displayName={track?.User?.displayName}
        />
      </div>
    </div>
  );
};

export default PlayableTile;
