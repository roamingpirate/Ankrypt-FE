import { Typography,Paper,Box,Button, useMediaQuery } from "@mui/material";
import { WhatsApp, Instagram, Facebook, Star } from "@mui/icons-material";
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import { useProjectInfo } from "../../hooks/ProjectContext";
import React, {useEffect, useState} from 'react';
import { fetchVideoRecordStatus, updateSpeakerList } from "../../api/projectApi";
import ExperienceRecorder from "../../canvas/ExperienceRecorder";
import { PlayerController, usePlayer } from "../../canvas/hooks/usePlayer";
import { startConversionPolling, uploadWebmVideo } from "../../canvas/utility/videoConversion";


const CanvasViewBox = ({setVideoWebmBlob,setIsProcessed}) => {

    const {canavsLoaded,canavsLoadingMessage} = useProjectInfo();
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
            <ExperienceRecorder setVideoWebmBlob={setVideoWebmBlob} setIsProcessed={setIsProcessed}/>
        </Paper>
        </PlayerController>
        </>
      );
      
}


const VideoStatus = ({ status }) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const statusMessages = {
    processing: {
      title: "Your Video is Getting Processed",
      description: "Don't switch tabs as it will pause recording.",
    },
    converting: {
      title: "Video is getting Converted",
      description: "It will be ready very soon 😄",
    },
  };

  const { title, description } = statusMessages[status] || {};

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
        width: '100%',
        color: "#ffffff",
        p: 3,
      }}
    >
      <Typography
        variant="h6"
        fontFamily="monospace"
        sx={{
          mb: 4,
          color: "gray.200",
          textAlign: "center",
          fontSize: isMobile ? '1rem' : '1.25rem',  // Adjusted for mobile
        }}
      >
        {title}
      </Typography>

      <div className="downloadloader"></div>

      <Typography
        variant="body2"
        fontFamily="monospace"
        sx={{
          mt: 6,
          color: "gray.400",
          fontSize: isMobile ? '0.75rem' : '0.875rem',  // Adjusted for mobile
          textAlign: "center",
        }}
      >
        {description}
      </Typography>
    </Box>
  );
};





const Download = ({ videoURL }) => {
  const { projectName } = useProjectInfo();
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = videoURL;
    link.download = `ankit.mp4`;
    link.click();
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
        <Typography
          variant="h6"
          gutterBottom
          fontWeight="bold"
          sx={{
            fontSize: isMobile ? '1rem' : '1.25rem',  // Adjusted for mobile
          }}
        >
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
            px: { xs: 2, sm: 4 },
            py: 1.5,
            fontWeight: "bold",
            textTransform: "none",
          }}
        >
          Download
        </Button>
      </Paper>
    </Box>
  );
};


const StartRecording = ({ setIsRecording }) => {
  const isMobile = useMediaQuery('(max-width:600px)');
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
        sx={{
          mb: 4,
          color: "gray.200",
          textAlign: "center",
          fontSize: isMobile ? '1rem' : '1.25rem',  // Adjusted for mobile
        }}
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
};


const DownloadSection = () => {

    const [isProcessed,setIsProcessed] = useState(false);
    const [isConverted,setIsConverted] = useState(false);
    const [isLoading,setIsLoading] = useState(true);
    const [videoURL,setVideoURL] = useState(undefined);
    const [videoWebmBlob,setVideoWebmBlob] = useState(undefined);
    const {isRecording,setIsRecording, projectId} =useProjectInfo(true);

    const getLink = async () => {
      const link = await startConversionPolling(projectId);
      setVideoURL(link);
      setIsConverted(true);
    }

    useEffect(() => {
      const videoStatus = async () => {
        const status = await fetchVideoRecordStatus(projectId);
        if(status)
        {
          setIsProcessed(true);
          getLink();
        }
        setIsLoading(false);
      }
       videoStatus();
    },[])

    useEffect(() => {
      if(videoWebmBlob) {
         const uploadVideo = async () => {
            await uploadWebmVideo(videoWebmBlob,projectId)
            const link = await startConversionPolling(projectId);
            setVideoURL(link);
            setIsConverted(true)
         }  
         uploadVideo();
      }
    },[videoWebmBlob]);

    useEffect(() => {
      return () => {setIsRecording(false);}
    },[]);

    if (isLoading) {
      return (
        <div className="flex justify-center items-center bg-[#262525] sm:bg-gray-800 h-full">
          <div className="loader"></div>
        </div>
      );
    }
    

    return (
      <>
          <div className="flex justify-center items-center bg-[#262525] sm:bg-gray-800 h-full">
            <div className="flex w-[100%] h-[500px] max-w-3xl bg-gray-700 rounded-xl">
              {/* Video Box */}
              <div className="w-1/2 p-4 md:p-0 bg-gray-200 flex justify-center items-center rounded-l-xl bg-gradient-to-br from-[#2e2e3a] to-[#1a1a24]">
                  <CanvasViewBox setVideoWebmBlob={setVideoWebmBlob} setIsProcessed={setIsProcessed}/>
              </div>
              {/* Video Download */}
                <div className="w-1/2 flex justify-center items-center">
                  {
                    isProcessed? (isConverted? <Download videoURL={videoURL}/> : <VideoStatus status="converting" />) : (isRecording? <VideoStatus status="processing" /> : <StartRecording setIsRecording={setIsRecording}/>)
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
    zIndex: 5,
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
    height:'85%',
  }
}

export default DownloadSection;