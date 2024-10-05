import React from 'react';
import ScriptInputPage from './component/ScriptInputSection';
import AnimationPage from './component/AnimationSection';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AnkryptCreatorPage from './pages/AnkryptCreatorPage';
 

const App = () => {
  return (
       <>
       <BrowserRouter>
       <Routes>
        <Route index element = {<AnkryptCreatorPage/>}/>
       </Routes>
       </BrowserRouter>
       </>
  )
}


export default App;




