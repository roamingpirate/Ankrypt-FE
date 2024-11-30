import { Typography, CircularProgress, Grid2, Paper,Box,Button, IconButton, Tooltip,Modal, } from "@mui/material";
import { WhatsApp, Instagram, Facebook, Star } from "@mui/icons-material";
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import { useProjectInfo } from "../../utility/ProjectContext";
import { BorderRight, } from "@mui/icons-material";
import React, {useEffect, useState} from 'react';
import AvatarSelector from '../AvatarSelector';
import { updateSpeakerList } from "../../api/projectApi";
import zIndex from "@mui/material/styles/zIndex";
import ExperienceRecorder from "../../canvas/ExperienceRecorder";
import { PlayerController, usePlayer } from "../../canvas/hooks/usePlayer";


const CanvasViewBox = ({setVideoURL}) => {

    const {canavsLoaded,canavsLoadingMessage,speakerList, setSpeakerList,setCanvasLoaded,projectId} = useProjectInfo();
    const [open,setOpen] = useState(false);
    const [experienceLoaded, setExperienceLoaded] = useState(true);

    if(!canavsLoaded)
    {
        return (
            <div style={{display:'flex',flexDirection:'column',height:'100%',alignItems:'center',justifyContent:'center'}}>
                <div class="loader"></div>
                <Typography style={{height: '25px', fontFamily:'karma', fontSize:'14px',padding:'10px',fontWeight:'600'}}>
                    {canavsLoadingMessage}
                </Typography>
            </div> 
        )
    }

    const Loader = () => {
       return ( 
       <Paper elevation={5} style={{display:'grid', width:'80%', aspectRatio: '4/5', margin:'7px',backgroundColor:'white', borderRadius:'10px'}}>
              <div className='flex flex-col justify-center items-center bg-[#181414]'>
                  <div class="loader"></div>
              </div>   
       </Paper>
       )
    }

    return (
        <>
        <PlayerController>
        <Paper 
          elevation={3} 
          style={{
            display: 'flex', 
            aspectRatio: '4/5',
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',  
            borderRadius: '10px', 
            position: 'relative'
          }}
        >
          { experienceLoaded ?<ExperienceRecorder setVideoURL={setVideoURL}/> : <Loader/>}
        </Paper>
          </PlayerController>
        </>
      );
      
}


const VideoProcess = () => {
  return (
    <Box
      className="flex rounded-r-lg"
      sx={{
        minHeight: "500px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#121212",
        color: "#ffffff",
        p: 3,
      }}
    >
      <Typography
        variant="h6"
        fontFamily="monospace"
        sx={{ mb: 4, color: "gray.200", textAlign: "center" }}
      >
        Your Video is Getting Processed
      </Typography>

      <div className="downloadloader"></div>

      <Typography
        variant="body2"
        fontFamily="monospace"
        sx={{
          mt: 6,
          color: "gray.400",
          fontSize: "0.875rem",
          textAlign: "center",
        }}
      >
        Don't switch tabs as it will pause recording.
      </Typography>
    </Box>
  );
};



const Download = ({videoURL}) => {

  const {projectName} = useProjectInfo();

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = videoURL;
    link.download = `${projectName}.webm`; 
    link.click();
    URL.revokeObjectURL(videoURL);
  };

  return (
    <Box
      className="flex flex-col justify-center items-center rounded-r-lg"
      sx={{
        minHeight: "100%",
        backgroundColor: "#121212",
        color: "#ffffff",
        textAlign: "center",
        p: 3,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          backgroundColor: "#1E1E1E",
          borderRadius: "16px",
          padding: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" gutterBottom fontWeight="bold">
          Your Video is Ready to Download!
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={handleDownload}
          sx={{
            mt: 2,
            mb: 4,
            borderRadius: "24px",
            px: {xs:2,sm:4},
            py: 1.5,
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          Download
        </Button>

        {/* <Typography variant="subtitle1" gutterBottom>
          Share Your Video
        </Typography>

        <Box display="flex" justifyContent="center" gap={2} mt={2}>
         
          <IconButton
            href="https://wa.me"
            target="_blank"
            sx={{
              color: "#25D366",
              "&:hover": { backgroundColor: "rgba(37, 211, 102, 0.1)" },
            }}
          >
            <WhatsApp fontSize="large" />
          </IconButton>

         
          <IconButton
            href="https://instagram.com"
            target="_blank"
            sx={{
              color: "#E1306C",
              "&:hover": { backgroundColor: "rgba(225, 48, 108, 0.1)" },
            }}
          >
            <Instagram fontSize="large" />
          </IconButton>

         
          <IconButton
            href="https://facebook.com"
            target="_blank"
            sx={{
              color: "#1877F2",
              "&:hover": { backgroundColor: "rgba(24, 119, 242, 0.1)" },
            }}
          >
            <Facebook fontSize="large" />
          </IconButton>
        </Box> */}
      </Paper>
    </Box>
  );
};

const StartRecording = ({setIsRecording}) => {
  return (
    <Box
      className="flex rounded-r-lg"
      sx={{
        minHeight: "500px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#121212",
        color: "#ffffff",
        p: 3,
      }}
    >
      <Typography
        variant="h6"
        fontFamily="monospace"
        sx={{ mb: 4, color: "gray.200", textAlign: "center" }}
      >
        Click Below To Start Video Creation
      </Typography>
      <Button
          variant="contained"
          color="primary"
          onClick={() => setIsRecording(true)}
          sx={{
            mt: 2,
            mb: 4,
            borderRadius: "24px",
            px: 4,
            py: 1.5,
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          Start
        </Button>
    </Box>
  );
}

const DownloadSection = () => {

    const [isProcessed,setIsProcessed] = useState(false);
    const [videoURL,setVideoURL] = useState(undefined);
    const {isRecording,setIsRecording} =useProjectInfo(true);

    useEffect(() => {
      if(videoURL) {
          setIsProcessed(true);
      }
    },[videoURL])

    useEffect(() => {
      return () => {setIsRecording(false);}
    },[]);
          return (
            <>
                <div className="flex justify-center items-center bg-[#262525] sm:bg-gray-800 h-full">
                  <div className="flex w-[100%] h-[500px] max-w-3xl bg-gray-700 rounded-xl">
                    {/* Video Box */}
                    <div className="w-1/2 p-4 md:p-0 bg-gray-200 flex justify-center items-center rounded-l-xl bg-gradient-to-br from-[#2e2e3a] to-[#1a1a24]">
                       <CanvasViewBox setVideoURL={setVideoURL}/>
                    </div>
                    {/* Video Download */}
                      <div className="w-1/2 flex justify-center items-center">
                        {
                          isProcessed? <Download videoURL={videoURL}/> : isRecording? <VideoProcess/> : <StartRecording setIsRecording={setIsRecording}/>
                        }
                    </div>
                  </div>
                </div>
            </>
          );
}

const styles = {
  AvatarSelectorModal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    //border: '0.5px solid grey',
    zIndex: 5,
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
    height:'85%',
  }
}

export default DownloadSection;