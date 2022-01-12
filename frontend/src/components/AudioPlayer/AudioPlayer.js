import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteTrack, editTrack } from '../../store/trackReducer';
import prefixCORS from '../../utils/prefixCORS';
import TrackUploadForm from '../TrackUploadForm';
import PlayButton from './PlayButton';
import PauseButton from './PauseButton';
import AudioElement from './AudioElement';
import TrackDetails from './TrackDetails';
import TrackArtwork from './TrackArtwork';
import ProgressBar from './ProgressBar';
import TrackButtons from './TrackButtons';
import './AudioPlayer.css';
import source from '../../assets/images/14. Chuck Person - Lightening Strikes.mp3';

const AudioPlayer = ({ track }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [seekTime, setSeekTime] = useState(0);
  const audio = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      audio.current.play();
    } else {
      audio.current.pause();
    }
  }, [isPlaying]);

  // useEffect(() => {
  //   setDuration(audio.current.duration);
  // }, [audio]);

  // useEffect(() => {
  //   setCurrentTime(audio.current.currentTime);
  // }, [audio.current.currentTime]);

  const user = track.User;
  const sessionUser = useSelector((state) => state.session.user);
  const dispatch = useDispatch();

  const handleLoadedMetadata = () => setDuration(audio.current.duration);
  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleTimeUpdate = () => setCurrentTime(audio.current.currentTime);

  const handleDelete = () =>
    dispatch(deleteTrack(track.id, sessionUser.id)).catch(async (response) => {
      const data = await response.json();
      return data;
    });

  // const handleEdit = () => history.push(`/tracks/${track.id}/edit`);
  const handleEdit = () => <TrackUploadForm formState={track} />;

  // const handleEdit = async () => await dispatch(editTrack(track));

  // const togglePlay = () => setIsPlaying(!isPlaying);
  let testSrc =
    'https://traxcloud-react-project.s3.amazonaws.com/14.+Chuck+Person+-+Lightening+Strikes.mp3';
  // console.log('audio', audio);
  return (
    <div className={`music-player track-${track.id}`}>
      <TrackArtwork
        className="track-artwork artwork-large"
        src={prefixCORS(track.artworkUrl)}
        title={track.title}
      />
      {isPlaying ? (
        <PauseButton onClick={handlePause} />
      ) : (
        <PlayButton onClick={handlePlay} />
      )}
      <TrackDetails
        displayName={user.displayName}
        userId={user.id}
        title={track.title}
        trackId={track.id}
      />
      <audio
        // src={testSrc}
        // src={prefixCORS(track.trackUrl)}
        // src={track.trackUrl}
        src={prefixCORS(testSrc)}
        crossOrigin="true"
        ref={audio}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
      {/* <AudioElement trackUrl={track.trackUrl} ref={audio} /> */}
      <ProgressBar duration={duration} currentTime={currentTime} />
      <TrackButtons
        sessionId={sessionUser.id}
        userId={user.id}
        handleEdit={handleEdit}
        track={track}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default AudioPlayer;
