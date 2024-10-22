import React from 'react';
import ScriptInputPage from './component/ScriptInputSection';
import AnimationPage from './component/AnimationSection';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AnkryptCreatorPage from './pages/AnkryptCreatorPage';
import  { CanvasRecorder }  from './pages/CanvasRecordPage';
import { PlayerController } from './canvas/hooks/usePlayer';
 

const App = () => {
  return (
       <>
       <BrowserRouter>
       <Routes>
        {/* <Route index element = {<AnkryptCreatorPage/>}/> */}
        <Route index element = { <PlayerController><CanvasRecorder/></PlayerController>}/>
       </Routes>
       </BrowserRouter>
       </>
  )
}


export default App;




