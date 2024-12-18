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
  const {currentStage,alert,setAlert,alertMessage, isPageLoading, error,setShowTooltip,currentActive,setCurrentActive,handleNext,script} = useProjectInfo();
  const {isAuthenticated, loginWithPopup} = useAuth0();
  
  const navigate = useNavigate();

  const handleLeftArrowClick = () => {
    setCurrentActive(0);
  };

  const handleRightArrowClick = () => {
    setCurrentActive(1);
  };

  useEffect(() => {
      if(currentStage == 1 && script.length !=0)
      {
        setCurrentActive(1);
      }
  }, [script]);



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
          
        {currentActive === 1 && currentStage != 3 && (script.length != 0)&& (
          <>
          <div onClick={handleLeftArrowClick} className='absolute bottom-[10%] left-4 md:invisible'>
          <div className='flex justify-center items-center bg-[#51c4b7] p-[1px] px-1 rounded-lg md:invisible'>
          <ArrowBackIcon
            className="bg-gray-800 rounded-sm border-white border-[1px] shadow-lg text-white cursor-pointer md:invisible "
            style={{ fontSize: "20px" }}
          />
          <p className='font-mono font-medium text-[12px] p-2'> {currentStage == 1? 'Generate Script' : 'Watch Video'}</p>
          </div>
          </div>
          <div
              onClick={() => {handleNext(currentStage + 1); setCurrentActive(0)}}
              className="p-[2px] absolute bottom-[10%] right-4 rounded-3xl bg-gradient-to-r from-[#2b5876] to-[#4e4376] w-[100px] md:invisible"
            >
              <div className="text-center w-[100%]">
                <button className="bg-gray-900 hover:bg-gray-800 text-white text-[12px] font-bold m-[1px] py-2 px-4 rounded-3xl">
                  Next Stage
                </button>
              </div>
            </div> 
            </>
        )}

        {currentActive === 0 && currentStage !=3 && (script.length != 0) &&(
          <>
          <div onClick={handleRightArrowClick} className='absolute bottom-[10%] left-4 flex justify-center items-center bg-[#51c4b7]  p-[1px] px-1 rounded-lg md:invisible'>
          <p className='font-mono text-[12px] font-medium p-2'> {currentStage == 1? 'View Script' : 'Edit Animation Script'} </p>
          <ArrowForwardIcon
            className="bg-gray-800 rounded-sm border-white border-[1px] shadow-lg text-white cursor-pointer md:invisible"
            style={{ fontSize: "20px" }}
          />
          </div>
          <div
              onClick={() => {handleNext(currentStage + 1); setCurrentActive(0)}}
              className="p-[2px]  absolute bottom-[10%] right-4 rounded-3xl bg-gradient-to-r from-[#2b5876] to-[#4e4376] w-[100px] md:invisible"
            >
              <div className="text-center w-[100%]">
                <button className="bg-gray-900 hover:bg-gray-800 text-white text-[12px] font-bold m-[1px] py-2 px-4 rounded-3xl">
                  Next Stage
                </button>
              </div>
            </div> 
          </>
        )}
       </Box>
  )
}


export default AnkryptCreatorPage;




