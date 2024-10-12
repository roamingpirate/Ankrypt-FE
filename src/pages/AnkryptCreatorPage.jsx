import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Grid2 as Grid, Paper, Container, Snackbar } from '@mui/material';
import Header from '../component/Header';
import ScriptInputSection from '../component/ScriptInputSection';
import AnimationSection from '../component/AnimationSection';
import { useProjectInfo } from '../utility/ProjectContext';

 

const AnkryptCreatorPage = () => {
  const {currentStage,alert,setAlert,alertMessage} = useProjectInfo();

  const renderSection = () => {
        switch(currentStage)
        {
          case 1: 
            return <ScriptInputSection/>;
          case 2:
            return <AnimationSection/>;
          default:
            return <ScriptInputSection/>
        }
  }

  return (
       <Box sx={{height:'100vh',display: 'flex',flexDirection: 'column',width:'100%'}}>
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
       </Box>
  )
}


export default AnkryptCreatorPage;




