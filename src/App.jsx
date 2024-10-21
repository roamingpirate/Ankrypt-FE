import React from 'react';
import ScriptInputPage from './component/ScriptInputSection';
import AnimationPage from './component/AnimationSection';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AnkryptCreatorPage from './pages/AnkryptCreatorPage';
import  CanvasRecorder  from './pages/canvasRecordPage';
 

const App = () => {
  return (
       <>
       <BrowserRouter>
       <Routes>
        {/* <Route index element = {<AnkryptCreatorPage/>}/> */}
        <Route index element = {<CanvasRecorder/>}/>
       </Routes>
       </BrowserRouter>
       </>
  )
}


export default App;




