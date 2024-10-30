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
import { useNavigate } from 'react-router-dom';

const ProjectPath = ({ projectName, projectId }) => {
  const navigate = useNavigate();

  const handleAncriptClick = () => {
      navigate('/');
  };

  const handleStudioClick = () => {
      navigate('/studio');
  };

  const handleProjectNameClick = () => {
      navigate(`/app/${projectId}`);
  };

  return (
      <Typography sx={{ fontFamily: "Oswald", fontSize: 25, marginRight: '30%' }}>
          <span onClick={handleAncriptClick} style={{ cursor: 'pointer', color: 'inherit' }}>
              ancript
          </span>/
          <span onClick={handleStudioClick} style={{ cursor: 'pointer', color: 'inherit' }}>
              studio
          </span>/
          <span onClick={handleProjectNameClick} style={{ cursor: 'pointer', color: 'inherit' }}>
              {projectName}
          </span>
      </Typography>
  );
};



const ProgressBox = ({currentStage,handleNext}) => {

  return(
    <Grid container spacing={2} >
        <Paper elevation={3} sx={{...style.ProgressIcon, backgroundColor:(currentStage >= 1)?'#9EF5EB':'white'}}
             onClick={()=>{(currentStage>=1) && handleNext(1)}}>
          <EditNoteOutlinedIcon sx={{ fontSize: 25 }} />
        </Paper>
        <Grid size={4}>
          <Paper elevation={3} sx={{...style.ProgressIcon, backgroundColor:(currentStage >= 2)?'#9EF5EB':'white'}}
               onClick={()=>{(currentStage>=2) && handleNext(2)}}>
            <PlayArrowOutlinedIcon sx={{fontSize:25}}/>
          </Paper>
        </Grid>
        <Grid size={4}>
          <Paper elevation={3} sx={{...style.ProgressIcon, backgroundColor:(currentStage >= 3)?'#9EF5EB':'white'}}
               onClick={()=>{(currentStage>=3) && handleNext(3)}}>
           <DownloadOutlinedIcon sx={{fontSize:25}}/>
          </Paper>
        </Grid>
    </Grid>
  )
}
 

const Header = () => {
  const {currentStage,setCurrentStage,save,saveContentToServer,resetContent,handleNext, projectName,projectId} = useProjectInfo();
  //const projectName = 'My Interesting Project';


  return (
    <div style={{display: 'flex',flexDirection:'row',alignItems: 'center',padding: 5, flexWrap: 'wrap'}}>
          <IconButton
            size="large"
            aria-label="menu"
            sx={{ mr: 1}}
          >
            <MenuIcon />
          </IconButton>
          {/* <Typography sx={{  fontFamily:"Oswald",fontSize: 25,marginRight: '30%'}}>
                ancript/studio/{projectName}
          </Typography> */}
          <ProjectPath projectName={projectName} projectId={projectId} />
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
   // border: 1,
    height: '35px',
    width: '35px',
    display: 'flex',
    alignItems: 'center', 
    justifyContent: 'center'    
  }
}

