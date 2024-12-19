import React , {useState} from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Grid2 as Grid, Paper, Container, Icon, CircularProgress, Tooltip} from '@mui/material';
import { useProjectInfo } from '../hooks/ProjectContext';
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
    <div className="ml-2 sm:ml-0 sm:mr-[10%] md:mr-[30%]">
      <Typography  sx={{ fontFamily: "Oswald", fontSize: 25, color: 'white'}}>
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
  </div>
  );
};



const ProgressBox = ({currentStage,handleNext}) => {

  const {showTooltip} = useProjectInfo();

  return(
    <Grid container spacing={2} >
        {/* <Tooltip title="Click to go Back" open={showTooltip && (currentStage > 1)} placement="left" arrow> */}
        <Paper elevation={3} sx={{...style.ProgressIcon, backgroundColor:(currentStage >= 1)?'#51c4b7':'white'}}
             onClick={()=>{(currentStage>=1) && handleNext(1)}}>
          <EditNoteOutlinedIcon sx={{ fontSize: 25, color:'black' }} />
        </Paper>
        {/* </Tooltip> */}
        <Grid size={4}>
          <Paper elevation={3} sx={{...style.ProgressIcon, backgroundColor:(currentStage >= 2)?'#51c4b7':'white'}}
               onClick={()=>{(currentStage>=2) && handleNext(2)}}>
            <PlayArrowOutlinedIcon sx={{fontSize:25, color:'black'}}/>
          </Paper>
        </Grid>
        <Grid size={4}>
          <Paper elevation={3} sx={{...style.ProgressIcon, backgroundColor:(currentStage >= 3)?'#51c4b7':'white'}}
               onClick={()=>{(currentStage>=3) && handleNext(3)}}>
           <DownloadOutlinedIcon sx={{fontSize:25, color:'black'}}/>
          </Paper>
        </Grid>
    </Grid>
  )
}


const Header = () => {
  const { currentStage, setCurrentStage, save, saveDisabled, saveContentToServer, resetContent, handleNext, projectName, projectId,setCurrentActive } = useProjectInfo();

  return (
    <div className="border-b-[0.5px] pt-1.5 sm:pb-1.5 flex-wrap bg-[#1e1f20]">
        <div className='flex flex-row items-center'>
        <div className="hidden sm:block">
          <IconButton
            size="large"
            aria-label="menu"
            sx={{ mr: 1, color: 'white' }}
          >
            <MenuIcon />
          </IconButton>
        </div>

        <ProjectPath projectName={projectName} projectId={projectId} />
        <div className="hidden sm:block">
          <ProgressBox currentStage={currentStage} handleNext={handleNext} />
        </div>

        <div className="flex justify-end flex-grow mr-5">
          {save && (
            <>
              <IconButton aria-label="reset" sx={{ mr: 1 }} onClick={() => resetContent()}>
                <RestartAltIcon />
              </IconButton>
              <Button
                disabled={saveDisabled}
                variant="contained"
                sx={{
                  backgroundColor: saveDisabled ? '#9e9e9e' : '#51c4b7',
                  marginRight: 2,
                  display: 'flex',
                  alignItems: 'center',
                }}
                onClick={() => saveContentToServer()}
              >
                {saveDisabled ? (
                  <>
                    <CircularProgress size={20} sx={{ color: 'white', marginRight: 1 }} />
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </Button>
            </>
          )}
          {currentStage !== 3 && (
            <div
              onClick={() => {handleNext(currentStage + 1); setCurrentActive(0)}}
              className="p-[2px] rounded-3xl bg-gradient-to-r from-[#2b5876] to-[#4e4376] flex justify-center items-center"
            >
              <div className="text-center">
                <button className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold m-[1px] py-2 px-4 rounded-3xl">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
       </div>
        <div className="flex sm:hidden justify-center items-center mt-2 border-t-[1px] p-2 border-white w-full bg-gray-800 ">
            <ProgressBox currentStage={currentStage} handleNext={handleNext} />
        </div>
    </div>
  );
};


export default Header;


const style = {
  ProgressIcon: {
    borderRadius: 1,
    height: '35px',
    width: '35px',
    display: 'flex',
    alignItems: 'center', 
    justifyContent: 'center'    
  }
}

