import { Typography, CircularProgress, Grid2, Paper, IconButton, Tooltip,Modal, } from "@mui/material";
import Experience  from "../../canvas/Experience"
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import { useProjectInfo } from "../../utility/ProjectContext";
import { BorderRight, } from "@mui/icons-material";
import React, {useEffect, useState} from 'react';
import AvatarSelector from '../AvatarSelector';
import { updateSpeakerList } from "../../api/projectApi";


const CanvasViewBox = () => {

    const {canavsLoaded,canavsLoadingMessage,speakerList, setSpeakerList,setCanvasLoaded,projectId} = useProjectInfo();
    const [open,setOpen] = useState(false);
    const [experienceLoaded, setExperienceLoaded] = useState(true);

    if(!canavsLoaded)
    {
        return (
            <div style={{display:'flex',flexDirection:'column',height:'100%',alignItems:'center',justifyContent:'center'}}>
                <CircularProgress size={30}/>
                <Typography style={{height: '25px', fontFamily:'karma', fontSize:'14px',padding:'10px',fontWeight:'600'}}>
                    {canavsLoadingMessage}
                </Typography>
            </div> 
        )
    }

    const Loader = () => {
       return ( 
       <Paper elevation={5} style={{display:'grid', width:'82%', aspectRatio: '4/5', margin:'7px',backgroundColor:'white', borderRadius:'10px'}}>
            <CircularProgress style={{margin: 'auto'}} size={30}/>
       </Paper>
       )
    }

    return (
        <>
        <Paper 
          elevation={3} 
          style={{
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            padding: '10px', 
            margin: '10px', 
            borderRadius: '10px', 
            position: 'relative'
          }}
        >
            <Tooltip title={"Edit Avatar"}>
            <IconButton style={{backgroundColor:'#3F3A39',position: 'absolute',top: '10px',right: '10px',}} onClick={() => {setOpen(true);setExperienceLoaded(false)}} >
            <DesignServicesIcon style={{fontSize:'20px',color:'white'}}/>
          </IconButton>
          </Tooltip>
          { experienceLoaded ?<Experience/> : <Loader/>}
        </Paper>
        
                <Modal  open={open}
                onClose={async () => {setOpen(false); updateSpeakerList(projectId,speakerList); setExperienceLoaded(true)  }}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                BackdropProps={{
                  style: { backgroundColor: 'rgba(0, 0, 0, 0.05)' }, 
                }}>
                  <Grid2 style={styles.AvatarSelectorModal}>
                      <AvatarSelector speakerList={speakerList} setSpeakerList={setSpeakerList} disabled={true}/>
                  </Grid2>
              </Modal>
        </>
      );
      
}

const styles = {
    AvatarSelectorModal: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor:'white',
        borderRadius:'15px',
        //border: '0.5px solid grey',
        zIndex: 5,
        boxShadow: 24,
        pt: 2,
        px: 4,
        pb: 3,
        width: '50%',
        height:'80%',
      }
}

export default CanvasViewBox;