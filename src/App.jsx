import React from 'react';
import ScriptInputPage from './component/ScriptInputSection';
import AnimationPage from './component/AnimationSection';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AnkryptCreatorPage from './pages/AnkryptCreatorPage';
import { CanvasRecorder } from './pages/CanvasRecordPage';
import { PlayerController } from './canvas/hooks/usePlayer';
import LandingPage from './pages/LandingPage';
import { ProjectInfoProvider } from './utility/ProjectContext';
import { Auth0Provider } from '@auth0/auth0-react';
import AncryptApp from './pages/AncryptApp';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const App = () => {
  return (
    <Auth0Provider
      domain="dev-jotogpqqkknlenek.us.auth0.com"
      clientId="Ba9ZqDXnY69zuxoNeVgeehy8l3o4ZBXx"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route
              path="/app/:projectId"
              element={
                <ProjectInfoProvider>
                  <AnkryptCreatorPage />
                </ProjectInfoProvider>
              }
            />
            <Route path="/studio" element={<AncryptApp />} />
            <Route index element={<LandingPage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Auth0Provider>
  );
};

export default App;
