import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSingleTrack } from '../../store/trackReducer';
import { setPlaylist } from '../../actions/playerActions';
import AudioPlayer, { PlayerFooter } from '../../components/AudioPlayer';
import TrackArtwork from '../../components/TrackArtwork';
import UserCard from '../../components/UserCard';
import CommentField from '../../components/CommentField';
import CommentsList from '../../components/CommentsList';
import './SingleTrackPage.css';

const SingleTrackPage = () => {
  const dispatch = useDispatch();
  const { trackId } = useParams();
  const { playlist } = useSelector((state) => state.player);
  const track = useSelector((state) => state.tracks[trackId]);
  const sessionUser = useSelector((state) => state.session.user);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const fetchedTrack = await dispatch(fetchSingleTrack(+trackId));

        if (!playlist.length) {
          dispatch(setPlaylist([fetchedTrack.id]));
        }

        setLoading(false);
      } catch (err) {
        console.log('error fetching tracks', err);
      }
    })();
  }, [dispatch, trackId, playlist.length]);

  return (
    !isLoading && (
      <div className="page-container single-track-page">
        <div className="single-track-container">
          <AudioPlayer
            trackId={trackId}
            size="large"
            withArtwork={false}
            withFooter={false}
            withCommentField={false}
          />
          <TrackArtwork className="artwork-large" trackId={trackId} />
        </div>
        <div className="single-track-page-main">
          {sessionUser && (
            <CommentField
              trackId={trackId}
              duration={track.duration}
              height={40}
            />
          )}
          <PlayerFooter trackId={trackId} />
          <div className="single-track-page-main-row">
            <UserCard user={track?.User} size="medium" avatarSize="large" />
            <CommentsList />
          </div>
        </div>
      </div>
    )
  );
};

export default SingleTrackPage;
