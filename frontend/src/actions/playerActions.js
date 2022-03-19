/* ----- ACTION TYPES ----- */
export const ON_LOAD = 'player/onLoad';
export const SET_TRACK = 'player/setTrack';
export const SET_REFERENCE = 'player/setReference';
export const TOGGLE_PLAYPAUSE = 'player/togglePlay';
export const PLAY_TRACK = 'player/playTrack';
export const PAUSE_TRACK = 'player/pauseTrack';
export const UPDATE_TIME = 'player/updateTime';
export const UPDATE_VOLUME = 'player/updateVolume';
export const END_PLAYBACK = 'player/endPlayback';
export const SET_SEEKING = 'player/setSeeking';

/* ----- ACTIONS ----- */
export const onLoad = (duration) => ({
  type: ON_LOAD,
  duration,
});

export const setTrack = (trackId) => ({
  type: SET_TRACK,
  trackId,
});

export const setReference = (ref) => ({
  type: SET_REFERENCE,
  ref,
});

export const playTrack = (trackId, index, currentTime = 0) => ({
  type: PLAY_TRACK,
  trackId,
  index,
  currentTime,
});

export const pauseTrack = () => ({
  type: PAUSE_TRACK,
});

export const endPlayback = () => ({
  type: END_PLAYBACK,
});

export const updateTime = (currentTime) => ({
  type: UPDATE_TIME,
  currentTime,
});

export const updateVolume = (volume, isMuted) => ({
  type: UPDATE_VOLUME,
  isMuted,
  volume,
});

export const setSeeking = (position) => ({
  type: SET_SEEKING,
  position,
});

// export const playTrack = (trackId, index, currentTime = 0) => ({

// })

export const playNext = (nextTrackId, nextIndex) => (dispatch) => {
  if (nextIndex !== null) {
    dispatch(setTrack(nextTrackId, nextIndex));
    dispatch(playTrack(nextTrackId, nextIndex));
  }
};

export const playPrevious = (previousId, previousIndex) => (dispatch) => {
  if (previousIndex !== null) {
    dispatch(setTrack(previousId, previousIndex));
    dispatch(playTrack(previousId, previousIndex));
  }
};
