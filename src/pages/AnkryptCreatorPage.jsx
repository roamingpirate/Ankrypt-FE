import React, {useEffect,useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Grid2 as Grid, Paper, Container, Snackbar, CircularProgress } from '@mui/material';
import Header from '../studio/Header';
import ScriptInputSection from '../studio/ScriptInputSection';
import AnimationSection from '../studio/AnimationSection';
import { useProjectInfo } from '../hooks/ProjectContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import DownloadSection from '../studio/animationSectionComponent/VideoDownloadSection';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

 

const AnkryptCreatorPage = () => {
  const {currentStage,alert,setAlert,alertMessage, isPageLoading, error,setShowTooltip,currentActive,setCurrentActive} = useProjectInfo();
  const {isAuthenticated, loginWithPopup} = useAuth0();
  
  const navigate = useNavigate();

  const handleLeftArrowClick = () => {
    setCurrentActive(0);
  };

  const handleRightArrowClick = () => {
    setCurrentActive(1);
  };

  useEffect(() => {
    // Store the original viewport content
    const originalViewport = document
      .querySelector('meta[name="viewport"]')
      ?.getAttribute('content');

    // Set viewport to desktop mode if on mobile
    if (window.innerWidth < 768) {
      const metaViewport = document.querySelector('meta[name="viewport"]');
      if (metaViewport) {
       // metaViewport.setAttribute('content', 'width=1024');
      }
    }

    // Restore the original viewport when the component unmounts
    return () => {
      const metaViewport = document.querySelector('meta[name="viewport"]');
      if (metaViewport && originalViewport) {
        metaViewport.setAttribute('content', originalViewport);
      }
    };
  }, []);



  const renderSection = () => {
        switch(currentStage)
        {
          case 1: 
            return <ScriptInputSection currentActive={currentActive}/>;
          case 2:
            return <AnimationSection currentActive={currentActive}/>;
          default:
            return <DownloadSection currentActive={currentActive}/>
        }
  }

  const WaitScreen = () => {
    return (
        <div className='flex flex-col justify-center items-center h-screen bg-[#16222A]'>
            <div class="loader"></div>
        </div>   
    )
  };

  if(isPageLoading){
    return (
      <WaitScreen/>
    )
  }

  if(error != ""){
      return (
        <div className='flex flex-col justify-center items-center h-screen'>
            <p className='font-medium text-gray-800 font-karma text-lg'>{error}</p>
            {!isAuthenticated  ?
              <div 
              onClick={() => loginWithPopup()}
              className="bg-gray-800 text-white rounded-xl mt-4 p-3 hover:cursor-pointer" 
              >
                  <p>Log In</p>
              </div>:
              <div 
              onClick={() => navigate('/')}
              className="bg-gray-800 text-white rounded-xl mt-4 p-3 hover:cursor-pointer" 
              >
                  <p>Go to Home</p>
              </div> 
            }
        </div>
      )
  }
  

  return (
       <Box sx={{position:'relative', height:'100vh',display: 'flex',flexDirection: 'column',width:'100%'}} onClick={() =>setShowTooltip(false)}>
         <Header/>
        {renderSection()}
          <Snackbar
          open={alert}
          autoHideDuration={3000} // Automatically close after 3 seconds
          onClose={() => {setAlert(false)}}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Position at bottom-center
        >
          <Typography sx={{backgroundColor:'#3F3A39',color:'white',padding:'10px',borderRadius:'7px'}}>{alertMessage}</Typography>
          </Snackbar>
          
        {currentActive === 1 && currentStage != 3 &&(
          <div onClick={handleLeftArrowClick} className='absolute bottom-[10%] right-4 flex justify-center items-center bg-[#51c4b7] p-1 rounded-lg md:invisible'>
          <ArrowBackIcon
            className="bg-gray-800 rounded-[10px] p-2 border-white border-[1px] shadow-lg text-white cursor-pointer md:invisible "
            style={{ fontSize: "30px" }}
          />
          <p className='font-mono font-medium text-sm p-2'> {currentStage == 1? 'Generate Script' : 'Watch Video'}</p>
          </div>
        )}

        {currentActive === 0 && currentStage !=3 &&(
          <div onClick={handleRightArrowClick} className='absolute bottom-[10%] left-4 flex justify-center items-center bg-[#51c4b7] p-1 rounded-lg md:invisible'>
          <p className='font-mono text-sm font-medium p-2'> {currentStage == 1? 'View Script' : 'View Animation Script'} </p>
          <ArrowForwardIcon
            className="bg-gray-800 rounded-[10px] p-2 border-white border-[1px] shadow-lg text-white cursor-pointer md:invisible"
            style={{ fontSize: "30px" }}
          />
          </div>
        )}
       </Box>
  )
}


export default AnkryptCreatorPage;




