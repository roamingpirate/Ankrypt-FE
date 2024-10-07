import React , {useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Grid2 as Grid, Paper, Container, Icon} from '@mui/material';
import { useProjectInfo } from '../utility/ProjectContext';




const ProgressBox = ({currentStage,handleNext}) => {

  return(
    <Grid container spacing={2} >
        <Box sx={{...style.ProgressIcon, backgroundColor:(currentStage >= 1)?'#9EF5EB':'white'}}
             onClick={()=>{(currentStage>=1) && handleNext(1)}}>
          <EditNoteOutlinedIcon sx={{ fontSize: 25 }} />
        </Box>
        <Grid size={4}>
          <Box sx={{...style.ProgressIcon, backgroundColor:(currentStage >= 2)?'#9EF5EB':'white'}}
               onClick={()=>{(currentStage>=2) && handleNext(2)}}>
            <PlayArrowOutlinedIcon sx={{fontSize:25}}/>
          </Box>
        </Grid>
        <Grid size={4}>
          <Box sx={{...style.ProgressIcon, backgroundColor:(currentStage >= 3)?'#9EF5EB':'white'}}
               onClick={()=>{(currentStage>=3) && handleNext(3)}}>
           <DownloadOutlinedIcon sx={{fontSize:25}}/>
          </Box>
        </Grid>
    </Grid>
  )
}
 

const Header = () => {
  const {currentStage,setCurrentStage,save,saveContentToServer,resetContent,handleNext} = useProjectInfo();



  return (
    <div style={{display: 'flex',flexDirection:'row',alignItems: 'center',borderBottom: '1px solid black',padding: 5, flexWrap: 'wrap'}}>
          <IconButton
            size="large"
            aria-label="menu"
            sx={{ mr: 1}}
          >
            <MenuIcon />
          </IconButton>
          <Typography sx={{  fontFamily:"Kaushan Script",fontSize: 25,marginRight: '30%'}}>
                Ankrypt
          </Typography>
          <ProgressBox currentStage={currentStage} handleNext={handleNext}/>
          <div style={{display:'flex', justifyContent:'flex-end',flexGrow:1,marginRight:'20px'}}>
            { save &&
              <>
              <IconButton aria-label="reset" sx={{ mr: 1}} onClick={() => resetContent()}><RestartAltIcon /></IconButton>
              <Button variant="contained" sx={{backgroundColor:'#51c4b7',marginRight: 2}}  onClick={()=>saveContentToServer()}>Save</Button>
              </>
            }
           { (currentStage != 3) &&
            <Button variant="contained" sx={{backgroundColor:'#3F3A39'}}  onClick={()=>handleNext(currentStage+1)}>Next</Button>
           }
          </div>
    </div>
  )
}

export default Header;


const style = {
  ProgressIcon: {
    borderRadius: 1,
    border: 1,
    height: '35px',
    width: '35px',
    display: 'flex',
    alignItems: 'center', 
    justifyContent: 'center'    
  }
}

