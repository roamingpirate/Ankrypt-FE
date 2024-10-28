import React from 'react';
import ScriptInputPage from './component/ScriptInputSection';
import AnimationPage from './component/AnimationSection';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AnkryptCreatorPage from './pages/AnkryptCreatorPage';
import  { CanvasRecorder }  from './pages/CanvasRecordPage';
import { PlayerController } from './canvas/hooks/usePlayer';
import LandingPage from './pages/LandingPage';
import { ProjectInfoProvider } from './utility/ProjectContext';
 

const App = () => {
  return (
       <>
       <BrowserRouter>
       <Routes>
        <Route path="/app" element = {<ProjectInfoProvider><AnkryptCreatorPage/></ProjectInfoProvider>}/>
        {/* <Route index element = { <PlayerController><CanvasRecorder/></PlayerController>}/> */}
        <Route index element = {<LandingPage/>}/>
       </Routes>
       </BrowserRouter>
       </>
  )
}


export default App;




