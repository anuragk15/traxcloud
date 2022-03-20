import { useEffect, useRef, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSeeking, setWaveform } from '../../actions/playerActions';
import usePlay from '../../hooks/usePlay';
import WaveSurfer from 'wavesurfer.js';
import Slider from '../Slider';
import { Overlay } from '../TrackArtwork';
import { options } from './options';

const Waveform = ({ trackId }) => {
  const dispatch = useDispatch();
  const track = useSelector((state) => state.tracks[trackId]);
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const { seekPosition, currentTime, isPlaying, incrementPlayCount } =
    useSelector((state) => state.player);
  const { selectTrack, isSelected, setPlay } = usePlay(trackId);

  // Initialize waveform
  useEffect(() => {
    wavesurfer.current = WaveSurfer.create({
      progressColor: '#f50',
      waveColor: '#8c8c8c',
      backend: 'MediaElement',
      responsive: true,
      interact: true,
      container: waveformRef.current,
      barGap: 2,
      barWidth: 2,
      cursorColor: 'transparent',
    });

    wavesurfer.current.load(track.trackUrl);
    wavesurfer.current.setMute(true);

    return () => wavesurfer.current.destroy();
  }, [track.trackUrl]);

  useEffect(() => {
    if (isSelected) {
      wavesurfer.current.seekTo(seekPosition || 0);
    }
  }, [isSelected, seekPosition]);

  // Send waveform ref to store
  useEffect(() => {
    if (isSelected && isPlaying) {
      dispatch(setWaveform(wavesurfer));
    }
  }, [isSelected, isPlaying]);

  const onSeek = (e) => {
    // Synthetic mouse event doesn't have offsetX property
    const offsetX =
      e.clientX - waveformRef.current.getBoundingClientRect().left;
    const offsetWidth = waveformRef.current.offsetWidth;

    // calculate mouse event position and time to seek to
    const position = offsetX / offsetWidth;
    const time = track?.duration * position;

    dispatch(setSeeking(position, time));
  };

  const onMouseDown = (e) => {
    if (!isSelected) {
      selectTrack();
    }
    onSeek(e);
    setPlay();
  };

  return (
    <div
      className="waveform-container"
      ref={waveformRef}
      onMouseDown={onMouseDown}
    ></div>
  );
};

export default Waveform;
