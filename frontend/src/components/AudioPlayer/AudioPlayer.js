import { useSelector, useDispatch } from 'react-redux';
import { isCurrentTrack } from '../../utils';
import Waveform from '../Waveform';
import TrackArtwork from '../TrackArtwork';
import {
  PlaybackButton,
  TrackActions,
  TrackDetails,
  TrackHeader,
  ProgressBar,
} from '.';

import './AudioPlayer.css';

const AudioPlayer = ({
  trackId,
  size,
  withArtwork = false,
  withHeader = false,
}) => {
  const track = useSelector((state) => state.tracks[trackId]);
  const { currentTrackId } = useSelector((state) => state.player);
  const isCurrent = isCurrentTrack(+trackId, currentTrackId);

  return (
    <div className={`player track-${track.id} player-${size}`}>
      {withHeader && <TrackHeader trackId={trackId} />}
      <div className="player-main">
        {withArtwork && (
          <div className="player-artwork">
            <TrackArtwork
              className={`track-artwork artwork-${size}`}
              trackId={trackId}
            />
          </div>
        )}
        <div className="player-content">
          <div className="player-header">
            <PlaybackButton size={size} trackId={trackId} />
            <TrackDetails trackId={track.id} size={size} />
          </div>
          <Waveform audio={track.trackUrl}/>
          <ProgressBar trackId={trackId} isCurrent={isCurrent} />
          <TrackActions trackId={trackId} />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
