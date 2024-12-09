import { Canvas} from "@react-three/fiber";
import {PerspectiveCamera } from "@react-three/drei";
import React, { useEffect,useRef,useState } from "react";
import { Podcast1 } from "./components/Scenes/PodcastScene1";
import { usePlayer } from './hooks/usePlayer'
import { Grid2, Paper,IconButton, useMediaQuery} from "@mui/material";
import PauseIcon from '@mui/icons-material/Pause';
import { useProjectInfo } from "../hooks/ProjectContext";
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error Boundary Caught an Error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}


const RecordingController = ({ canvasRef, setVideoWebmBlob,setIsProcessed}) => {
    const { setVideoState, mediaStreamAudioDestinationRef, audioContextRef } = usePlayer();
    const { isRecording, setIsRecording,projectId,ffmpegRef,ffmpegLoaded } = useProjectInfo();
    const recorderRef = useRef();
    const chunksRef = useRef([]);
    const isPausedDueToTabSwitch = useRef(false); 



    const copyWebMStream = async (webmBlob) => {
      const ffmpeg = ffmpegRef.current;
      const maxRetries = 10;
      const retryInterval = 5000;
    
      let attempts = 0;
    
      const waitForFFmpeg = async () => {
        return new Promise((resolve, reject) => {
          const intervalId = setInterval(() => {
            if (ffmpeg && ffmpegLoaded) {
              clearInterval(intervalId);
              resolve(true);
            } else if (attempts >= maxRetries) {
              clearInterval(intervalId);
              reject(new Error("FFmpeg failed to load within the time limit."));
            } else {
              attempts++;
              console.log("opps");
            }
          }, retryInterval);
        });
      };
    
      try {
        await waitForFFmpeg();
    
        const arrayBuffer = await webmBlob.arrayBuffer();
        await ffmpeg.writeFile('input.webm', new Uint8Array(arrayBuffer));
    
        await ffmpeg.exec(['-i', 'input.webm', '-c', 'copy', 'output7.webm']);
    
        const data = await ffmpeg.readFile('output7.webm');
        const outputBlob = new Blob([data.buffer], { type: 'video/webm' });
    
        return outputBlob;
      } catch (error) {
        console.error(error.message);
      }
    };    

    const startRecording = () => {
        const videoStream = canvasRef.current.captureStream(60); 
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();

        mediaStreamAudioDestinationRef.current = audioContextRef.current.createMediaStreamDestination();

        const combinedStream = new MediaStream([
            ...videoStream.getTracks(),
            ...mediaStreamAudioDestinationRef.current.stream.getTracks(),
        ]);

        const mimeType = MediaRecorder.isTypeSupported("video/webm; codecs=vp9")
            ? "video/webm; codecs=vp9"
            : "video/webm";
        const recorder = new MediaRecorder(combinedStream, { mimeType });
        chunksRef.current = [];

        recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chunksRef.current.push(event.data);
            }
        };

        recorder.onstop = async () => {
            const blob = new Blob(chunksRef.current, { type: "video/webm" });
            setIsProcessed(true);
            const fixedblob = await copyWebMStream(blob);
            setVideoWebmBlob(fixedblob);
        };

        recorderRef.current = recorder;
        recorder.start();
        setVideoState("Playing");
    };

    const stopRecording = () => {
        if (recorderRef.current) {
            recorderRef.current.stop();
            recorderRef.current = null;
        }
    };

    const pauseRecording = () => {
        if (recorderRef.current && recorderRef.current.state === "recording") {
            recorderRef.current.pause();
        }
    };

    const resumeRecording = () => {
        if (recorderRef.current && recorderRef.current.state === "paused") {
            recorderRef.current.resume();
        }
    };

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (isRecording) {
                    isPausedDueToTabSwitch.current = true;
                    pauseRecording();
                    setVideoState("Paused")
                }
            } else {
                if (isPausedDueToTabSwitch.current) {
                    isPausedDueToTabSwitch.current = false;
                    setVideoState("Playing");
                    resumeRecording();
                }
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [isRecording]);

    useEffect(() => {
        if (isRecording) {
            startRecording();
        }
        else {
            stopRecording();
        }
    }, [isRecording]);

    // return(
    //     <>
    //   <IconButton variant="contained" onClick={() => {
    //     setVideoState("Paused")
    //     setIsRecording(false)
    //   }}><PauseIcon sx={{color:'white'}} /></IconButton>
    //     </>
    // )
};



const ExperienceRecorder = ({setVideoWebmBlob,setIsProcessed}) => {
  const cameraRef = useRef();
  const canvasRef = useRef();
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <>
    <ErrorBoundary>
    <Paper elevation={5}  style={{display:'grid',width:isMobile? '144px':'240px', height:isMobile? '150px':'300px' ,aspectRatio: '4/5',backgroundColor:'gray', borderRadius:'10px'}}>
    <Canvas dpr={isMobile?[5,5]:[3,3]} ref={canvasRef} style={{borderRadius:'10px'}} shadows>
    <PerspectiveCamera
        makeDefault
        position={[0, 0, 2]}
        fov={50}
        near={0.1}
        far={1000}
        ref={cameraRef}
      />
      <Podcast1/>
    </Canvas>
    </Paper>
    <Grid2>
      <RecordingController canvasRef={canvasRef} setVideoWebmBlob={setVideoWebmBlob} setIsProcessed={setIsProcessed}/>
    </Grid2>
    </ErrorBoundary>
    </>
  );
}

export default ExperienceRecorder;
