import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import { restoreUser } from './store/sessionReducer';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import TrackUploadForm from './components/TrackUploadForm';
import Stream from './components/Stream';

function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} sessionUser={sessionUser} />
      {!sessionUser && <LandingPage />}
      {isLoaded && (
        <Switch>
          <Route exact path="/stream">
            <Stream />
          </Route>
          <Route exact path="/upload">
            <TrackUploadForm />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
